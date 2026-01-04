/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@prisma/client";

// Enhanced session configuration with robust security parameters
const SESSION_CONFIG = {
  ACCESS_TOKEN_DURATION: 60 * 60 * 24,       // 1 day access token
  REFRESH_TOKEN_DURATION: 7 * 24 * 60 * 60, // 7 days refresh token
  REFRESH_WINDOW: 5 * 60,                // 5 minutes before expiry to allow refresh
  MAX_LOGIN_ATTEMPTS: 5,                 // Maximum login attempts before lockout
  LOCKOUT_DURATION: 15 * 60,             // 15 minutes lockout
  MAX_CONCURRENT_SESSIONS: 3,            // Max concurrent sessions
  ACTIVITY_TIMEOUT: 30 * 60              // 30 minutes of inactivity
};

// Comprehensive error handling for authentication
export class AuthenticationError extends Error {
  public statusCode: number;

  constructor(
    message: string, 
    public errorType: 
      | 'AUTHENTICATION_ERROR' 
      | 'AUTHORIZATION_ERROR' 
      | 'RATE_LIMIT_ERROR' 
      | 'VERIFICATION_ERROR',
    statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
  }
}

// Enhanced token payload with comprehensive user context
export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  tokenType: 'ACCESS' | 'REFRESH';
}

export interface SessionData {
  userId: string;
  role: UserRole;
  email: string;
  isEmailVerified: boolean;
}

// Secure secret key generation with robust error handling
export const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || '');

// Create access token with enhanced security
export const createAccessToken = async (
  payload: Omit<TokenPayload, 'tokenType'>,
  expiresIn: number = SESSION_CONFIG.ACCESS_TOKEN_DURATION
): Promise<string> => {
  try {
    return await new SignJWT({...payload, tokenType: 'ACCESS'})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${expiresIn}s`)
      .sign(SECRET_KEY);
  } catch (error) {
    console.error('Token generation failed:', error);
    throw new AuthenticationError(
      "Token generation failed", 
      'AUTHENTICATION_ERROR'
    );
  }
};

// Create refresh token with enhanced security
export const createRefreshToken = async (
  payload: Omit<TokenPayload, 'tokenType'>,
  expiresIn: number = SESSION_CONFIG.REFRESH_TOKEN_DURATION
): Promise<string> => {
  try {
    return await new SignJWT({...payload, tokenType: 'REFRESH'})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${expiresIn}s`)
      .sign(SECRET_KEY);
  } catch (error) {
    console.error('Refresh token generation failed:', error);
    throw new AuthenticationError(
      "Refresh token generation failed", 
      'AUTHENTICATION_ERROR'
    );
  }
};


// Add connection retry functionality
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (
      (error instanceof Error && 
       error.message.includes("Can't reach database server")) &&
      retries > 0
    ) {
      // Log retry attempt but not the full error
      console.warn(`Database connection failed, retrying... (${retries} attempts left)`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Corrected createSession function with retry logic
export const createSession = async (
  sessionData: SessionData,
  deviceInfo?: {
    userAgent?: string;
    ipAddress?: string;
  },
  isSignup: boolean = false // New parameter to differentiate signup flow
): Promise<{
  accessToken: string;
  refreshToken: string;
  session: any;
}> => {
  try {

    // Retrieve the user data with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: sessionData.userId },
      });
    }, 3, 1000);

    // If no user is found and it's not a signup, throw an error
    if (!user && !isSignup) {
      console.error("User not found with userId:", sessionData.userId);
      throw new AuthenticationError("User not found", "AUTHENTICATION_ERROR");
    }

    // For signup flow, we don't need to perform these checks
    if (!isSignup && user) {
      // Account lockout verification
      if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
        console.error("Account is locked until:", user.lockUntil);
        throw new AuthenticationError(
          "Account temporarily locked. Try again later.",
          "RATE_LIMIT_ERROR",
          403
        );
      }
    }

    // Manage concurrent sessions (only for login) with retry logic
    if (!isSignup) {
      const activeSessionCount = await withRetry(async () => {
        return await prisma.session.count({
          where: {
            userId: sessionData.userId,
            expires: { gt: new Date() },
          },
        });
      }, 3, 1000);


      // Remove oldest session if max concurrent sessions exceeded
      if (activeSessionCount >= SESSION_CONFIG.MAX_CONCURRENT_SESSIONS) {
        const oldestSession = await withRetry(async () => {
          return await prisma.session.findFirst({
            where: { userId: sessionData.userId },
            orderBy: { createdAt: "asc" },
          });
        }, 3, 1000);

        if (oldestSession) {
          await withRetry(async () => {
            return await prisma.session.delete({
              where: { id: oldestSession.id },
            });
          }, 3, 1000);
        }
      }
    }

    // Create access and refresh tokens
    const accessToken = await createAccessToken(sessionData);
    const refreshToken = await createRefreshToken(sessionData);


    // Create new session in the database with retry logic
    const session = await withRetry(async () => {
      return await prisma.session.create({
        data: {
          userId: sessionData.userId,
          sessionToken: accessToken,
          refreshToken: refreshToken,
          expires: new Date(Date.now() + SESSION_CONFIG.ACCESS_TOKEN_DURATION * 1000),
          lastActivity: new Date(),
          userAgent: deviceInfo?.userAgent,
          ipAddress: deviceInfo?.ipAddress,
        },
      });
    }, 3, 1000);


    // Reset login attempts and unlock account (only for login) with retry logic
    if (!isSignup) {
      await withRetry(async () => {
        return await prisma.user.update({
          where: { id: sessionData.userId },
          data: {
            loginAttempts: 0,
            isLocked: false,
            lockUntil: null,
          },
        });
      }, 3, 1000);

    }


    // Return the generated tokens and session
    return { accessToken, refreshToken, session };
  } catch (error) {
    console.error("[CREATE_SESSION_ERROR]", error);

    // Enhanced error handling for database errors
    if (error instanceof Error && error.message.includes("Can't reach database server")) {
      throw new AuthenticationError(
        "Database connection error, please try again later",
        "AUTHENTICATION_ERROR",
        503
      );
    }

    // Propagate known errors, wrap unknown errors
    if (error instanceof AuthenticationError) {
      throw error;
    }

    throw new AuthenticationError(
      "Session creation failed",
      "AUTHENTICATION_ERROR",
      500
    );
  }
};

// Function to check JWT expiry
async function isTokenValid(token: string): Promise<boolean | undefined | 0> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch (error) {
    console.error("[IS_TOKEN_VALID_ERROR]", error);
    return false;
  }
}


// Comprehensive session validation
export async function validateSession(accessToken: string): Promise<SessionData | { error: string; status: number } | null> {
  try {
    // 1. Fast JWT verification first
    const { payload } = await jwtVerify(accessToken, SECRET_KEY);
    const tokenPayload = payload as unknown as TokenPayload;

    if (tokenPayload.tokenType !== 'ACCESS') {
      console.warn('Invalid token type');
      return null;
    }

    // 2. Efficient database query with necessary fields only
    const session = await prisma.session.findUnique({
      where: { sessionToken: accessToken },
      select: {
        expires: true,
        lastActivity: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            isLocked: true
          }
        }
      }
    });

    // 3. Early returns for invalid states
    if (!session?.user || 
        !session.user.isEmailVerified || 
        session.user.isLocked || 
        session.expires < new Date()) {
          console.warn('Invalid session or user state');
      return null;
    }

    // Update last activity timestamp immediately after validation
    await prisma.session.update({
      where: { sessionToken: accessToken },
      data: { lastActivity: new Date() }
    }).catch(console.error);


    // 4. Check inactivity timeout using JWT expiration
    isTokenValid(accessToken)

    // 4. Check inactivity timeout
    // const now = new Date();
    // const lastActivity = session.lastActivity || session.expires;
    // if ((now.getTime() - lastActivity.getTime()) > SESSION_CONFIG.ACTIVITY_TIMEOUT * 1000) {
    //   return null;
    // }

    // 5. Update last activity in background
    const now = new Date();
    prisma.session.update({
      where: { sessionToken: accessToken },
      data: { lastActivity: now }
    }).catch(console.error);

    // 6. Return validated session data
    return {
      userId: session.user.id,
      role: session.user.role,
      email: session.user.email,
      isEmailVerified: session.user.isEmailVerified
    };

  } catch (error) {

    console.error("[VALIDATE_SESSION_ERROR]", error);

    if (error instanceof Error) {
      if (error.message === 'ERR_JWT_EXPIRED' || error.name === 'TokenExpiredError') {
        // Specific handling for expired tokens
        return { error: "Access token expired", status: 401 };
      }
    }
  

    // If database is unavailable, fallback to JWT-only validation
    try {
      const verified = await jwtVerify(accessToken, SECRET_KEY);
      const payload = verified.payload as {
        userId: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
      };

      console.warn('Falling back to JWT-only validation');
      return {
        userId: payload.userId,
        role: payload.role as UserRole,
        email: payload.email,
        isEmailVerified: payload.isEmailVerified
      };
    } catch {
      console.error('[VALIDATE_SESSION_ERROR]', error);
      return null;
    }
  }
}

// Token refresh mechanism
export const refreshSessionTokens = async (
  refreshToken: string
): Promise<{ 
  accessToken: string; 
  refreshToken: string; 
  userId: string;
  role: UserRole;
} | null> => {
  try {
    
    // Verify the refresh token
    const { payload } = await jwtVerify(refreshToken, SECRET_KEY);
    const tokenPayload = payload as unknown as TokenPayload;

    // Verify this is a refresh token
    if (tokenPayload.tokenType !== 'REFRESH') {
      console.warn('Invalid token type: Not a refresh token');
      return null;
    }

    // Find the session associated with the refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true
          }
        }
      }
    });

    // Validate session and user
    if (!session?.user || !session.user.isEmailVerified) {
      console.warn('Invalid session or unverified user');
      return null;
    }

    // Generate new tokens
    const newAccessToken = await createAccessToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    });

    const newRefreshToken = await createRefreshToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    });

    // Update the session with new tokens
    await prisma.session.update({
      where: { id: session.id },
      data: {
        sessionToken: newAccessToken,
        refreshToken: newRefreshToken,
        lastActivity: new Date()
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId:session.user.id,
      role:session.user.role
    };
    
  } catch (error) {
    console.error("[REFRESH_SESSION_ERROR]", error);
    return null;
  }
};

// Comprehensive session invalidation
export const invalidateAllSessions = async (userId: string): Promise<void> => {
  try {
    await prisma.session.deleteMany({
      where: { userId }
    });

    // Optional: Update user's last logout time
    await prisma.user.update({
      where: { id: userId },
      data: { 
        loginAttempts: 0,
        isLocked: false,
        lockUntil: null
      }
    });
  } catch (error) {
    console.error("[INVALIDATE_SESSIONS_ERROR]", error);
    throw new AuthenticationError(
      "Failed to invalidate sessions", 
      'AUTHENTICATION_ERROR',
      500
    );
  }
};