export const OTP_CONSTANTS = {
  OTP_LENGTH: 6,
  MAX_OTP_ATTEMPTS: 3,
  OTP_BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  OTP_EXPIRY: 10 * 60 * 1000, // 10 minutes in milliseconds
};

export const SESSION_CONSTANTS = {
  ACCESS_TOKEN_DURATION: 24 * 60 * 60, // 1 day in seconds
  REFRESH_TOKEN_DURATION: 7 * 24 * 60 * 60, // 7 days in seconds
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/'
  }
};

export const SECURITY_CONSTANTS = {
  CSRF_TOKEN_LENGTH: 32,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
}; 