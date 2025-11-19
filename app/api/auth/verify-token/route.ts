import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/app/lib/prisma";
import { refreshSessionTokens } from "@/app/lib/session";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || '');

export interface TokenPayload {
  userId: string;
  role: string;
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

export async function POST(request: NextRequest) {
  try {
    // Extract tokens from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No access token found" },
        { status: 401 }
      );
    }

    // Verify access token
    try {
      const tokenPayload = await verifyToken(accessToken);

      if (tokenPayload.tokenType !== "ACCESS") {
        return NextResponse.json(
          { success: false, error: "Invalid token type" },
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
              username: true,
              role: true,
              isEmailVerified: true,
              isVerified: true,
              isPhoneVerified: true,
              isLocked: true,
              name: true,
              bio: true,
              avatarUrl: true,
              banner: true,
              followersCount: true,
              followingCount: true,
              countryCode: true,
              phoneNumber: true,
            }
          }
        }
      });

      if (!session?.user) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 401 }
        );
      }

      const { user } = session;

      if (!user.isEmailVerified || user.isLocked) {
        return NextResponse.json(
          { success: false, error: "Account is locked or unverified" },
          { status: 401 }
        );
      }

      // Format user data to match AuthContext User interface
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        banner: user.banner,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
      };

      return NextResponse.json({
        success: true,
        user: userData
      });

    } catch (error) {
      console.log("[ACCESS_TOKEN_VERIFY_ERROR]", error);
      
      // Access token is invalid or expired, try refresh flow
      if (!refreshToken) {
        const response = NextResponse.json(
          { success: false, error: "Session expired, please login again" },
          { status: 401 }
        );
        clearAllAuthCookies(response);
        return response;
      }

      const refreshedTokens = await refreshSessionTokens(refreshToken);
      
      if (!refreshedTokens) {
        const response = NextResponse.json(
          { success: false, error: "Session expired, please login again" },
          { status: 401 }
        );
        clearAllAuthCookies(response);
        return response;
      }

      // Fetch user data after refresh
      const user = await prisma.user.findUnique({
        where: { id: refreshedTokens.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isEmailVerified: true,
          isVerified: true,
          isPhoneVerified: true,
          name: true,
          bio: true,
          avatarUrl: true,
          banner: true,
          followersCount: true,
          followingCount: true,
          countryCode: true,
          phoneNumber: true,
        }
      });

      if (!user || !user.isEmailVerified) {
        const response = NextResponse.json(
          { success: false, error: "User not found or unverified" },
          { status: 401 }
        );
        clearAllAuthCookies(response);
        return response;
      }

      // Format user data
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        banner: user.banner,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
      };

      const response = NextResponse.json({
        success: true,
        user: userData
      });

      // Set new cookies
      const isProduction = process.env.NODE_ENV === 'production';
      
      response.cookies.set({
        name: 'access_token',
        value: refreshedTokens.accessToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      response.cookies.set({
        name: 'refresh_token',
        value: refreshedTokens.refreshToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      response.cookies.set("x-user-id", refreshedTokens.userId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/"
      });

      response.cookies.set("x-user-role", refreshedTokens.role, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/"
      });

      return response;
    }

  } catch (error) {
    console.error("[VERIFY_TOKEN_ERROR]", error);
    const response = NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
    clearAllAuthCookies(response);
    return response;
  }
}

