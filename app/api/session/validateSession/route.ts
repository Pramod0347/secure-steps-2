import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@prisma/client";
import { createAccessToken, createRefreshToken } from '@/app/lib/session';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || '');

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  tokenType: 'ACCESS' | 'REFRESH';
  exp?: number;
}

async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error("[JWT_VERIFY_ERROR]", error);
    throw new Error('Invalid token');
  }
}

async function refreshTokens(refreshToken: string) {
  try {
    console.log("Validating refresh token...");
    
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
      userId: session.user.id,
      role: session.user.role
    };

  } catch (error) {
    console.error("[REFRESH_SESSION_ERROR]", error);
    return null;
  }
}

function clearAllAuthCookies(response: NextResponse) {
  const cookiesToClear = ['access_token', 'refresh_token', 'x-user-id', 'x-user-role'];
  cookiesToClear.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
  });
}

// Route Handler
export async function POST(request: NextRequest) {
  try {
    // Extract tokens from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!accessToken) {
      console.log("there is no access token");
      if (!refreshToken) {
        return NextResponse.json(
          { error: "No authentication tokens found" },
          { status: 401 }
        );
      }

      // Try to refresh tokens
      const refreshedTokens = await refreshTokens(refreshToken);
      
      if (!refreshedTokens) {
        const response = NextResponse.json(
          { error: "Session expired, please login again" },
          { status: 401 }
        );
        clearAllAuthCookies(response);
        return response;
      }

      // Create response with new tokens
      const response = NextResponse.json({
        userId: refreshedTokens.userId,
        role: refreshedTokens.role,
        message: "Tokens refreshed successfully"
      });

      // Set new cookies
      response.cookies.set({
        name: 'access_token',
        value: refreshedTokens.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      response.cookies.set({
        name: 'refresh_token',
        value: refreshedTokens.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      response.cookies.set("x-user-id", refreshedTokens.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/"
      });

      response.cookies.set("x-user-role", refreshedTokens.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/"
      });

      return response;
    }

    // Verify access token
    try {
      const tokenPayload = await verifyToken(accessToken);

      if (tokenPayload.tokenType !== "ACCESS") {
        return NextResponse.json(
          { error: "Invalid token type" },
          { status: 401 }
        );
      }

      // Verify session in database
      const session = await prisma.session.findUnique({
        where: { sessionToken: accessToken },
        select: {
          expires: true,
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

      if (!session?.user) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 401 }
        );
      }

      const { user } = session;

      if (!user.isEmailVerified || user.isLocked) {
        return NextResponse.json(
          { error: "Account is locked or unverified" },
          { status: 401 }
        );
      }

      // Return session data
      return NextResponse.json({
        userId: user.id,
        role: user.role,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      });

    } catch (error) {
        console.log("[ACCESS_TOKEN_VERIFY_ERROR]", error);
      // Access token is invalid or expired, try refresh flow
      if (!refreshToken) {
        const response = NextResponse.json(
          { error: "Session expired, please login again" },
          { status: 401 }
        );
        clearAllAuthCookies(response);
        return response;
      }

      const refreshedTokens = await refreshTokens(refreshToken);
      
      if (!refreshedTokens) {
        const response = NextResponse.json(
          { error: "Session expired, please login again" },
          { status: 401 }
        );
        clearAllAuthCookies(response);
        return response;
      }

      const response = NextResponse.json({
        userId: refreshedTokens.userId,
        role: refreshedTokens.role,
        message: "Tokens refreshed successfully"
      });

      response.cookies.set({
        name: 'access_token',
        value: refreshedTokens.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/'
      });

      response.cookies.set({
        name: 'refresh_token',
        value: refreshedTokens.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });

      response.cookies.set("x-user-id", refreshedTokens.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/"
      });

      response.cookies.set("x-user-role", refreshedTokens.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/"
      });

      return response;
    }

  } catch (error) {
    console.error("[VALIDATE_SESSION_ERROR]", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    clearAllAuthCookies(response);
    return response;
  }
}