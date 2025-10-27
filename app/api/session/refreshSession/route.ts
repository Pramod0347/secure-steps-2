import {  NextResponse } from 'next/server';
import { refreshSessionTokens } from '@/app/lib/session';
import { NextApiRequest } from 'next';

export async function POST(request: NextApiRequest) {
  try {
    console.log("refreshing the token is started...");

    // Extract refresh_token from cookies
    const { refresh_token } = request.body;

    if (!refresh_token) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 400 });
    }

    const refreshedTokens = await refreshSessionTokens(refresh_token);

    if (!refreshedTokens) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log("token refreshed successfully completed...");

    // Create response with new tokens
    const response = NextResponse.json({
      success: true,
      message: "Tokens refreshed successfully"
    });

    // Set new access token cookie
    response.cookies.set({
      name: 'access_token',
      value: refreshedTokens.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    // Set new refresh token cookie
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
      path: "/",
    });
    
    response.cookies.set("x-user-role", refreshedTokens.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      userId: refreshedTokens.userId,
      role: refreshedTokens.role,
    });

  } catch (error) {
    console.error('[TOKEN_REFRESH_ERROR]', error);
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
  }
}