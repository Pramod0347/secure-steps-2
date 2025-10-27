/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createSession } from '@/app/lib/session';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!
);

interface UserPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}


export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('Invalid token');

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      include: { accounts: true }
    });
    const user = existingUser
      ? await handleExistingUser(existingUser, payload as UserPayload, credential)
      : await createNewUser(payload as UserPayload, credential);

    if (!user) throw new Error('Failed to create/update user');

    const { accessToken, refreshToken } = await createSession(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      {
        userAgent: req.headers.get('user-agent') || undefined,
        ipAddress: req.headers.get('x-forwarded-for') || undefined
      }
    );

    return createAuthResponse(user, accessToken, refreshToken);
  } catch (error) {
    console.error('[GOOGLE_AUTH_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

async function handleExistingUser(user: any, payload: UserPayload, credential: string) {
  if (!user.accounts.some((acc: any) => acc.provider === 'google')) {
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: payload.sub!,
        access_token: credential,
        expires_at: Math.floor(Date.now() / 1000 + 3600)
      }
    });
  }
  return user;
}

async function createNewUser(payload: UserPayload, credential: string) {
  return prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name!,
      username: `user_${Date.now()}`,
      password: '',
      isEmailVerified: true,
      googleId: payload.sub,
      avatarUrl: payload.picture,
      accounts: {
        create: {
          type: 'oauth',
          provider: 'google',
          providerAccountId: payload.sub!,
          access_token: credential,
          expires_at: Math.floor(Date.now() / 1000 + 3600)
        }
      }
    }
  });
}

function createAuthResponse(user: any, accessToken: string, refreshToken: string) {
  const response = NextResponse.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });

  response.cookies.set({
    name: 'access_token',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/'
  });

  response.cookies.set({
    name: 'refresh_token',
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });

  return response;
}
