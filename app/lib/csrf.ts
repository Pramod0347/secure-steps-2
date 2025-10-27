import { NextRequest, NextResponse } from 'next/server';

export class CSRF {
  private static CSRF_COOKIE = 'csrf_token';
  private static CSRF_HEADER = 'x-csrf-token';

  static async generate(): Promise<string> {
    // Generate a random token using Web Crypto API
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    return Array.from(buffer)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  static async setToken(res: NextResponse): Promise<string> {
    const token = await this.generate();
    
    // Set CSRF token as HTTP-only cookie
    res.cookies.set(this.CSRF_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return token;
  }

  static async verify(req: NextRequest): Promise<boolean> {
    try {
      // Get token from cookie and header
      const cookieToken = req.cookies.get(this.CSRF_COOKIE)?.value;
      const headerToken = req.headers.get(this.CSRF_HEADER);

      // Both must exist and match
      if (!cookieToken || !headerToken) {
        return false;
      }

      return cookieToken === headerToken;
    } catch (error) {
      console.error('CSRF verification error:', error);
      return false;
    }
  }
} 