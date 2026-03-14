import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from './app/lib/middleware/rate-limit';

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/accommodations": ["ADMIN", "LANDLORD"],
  "/user": ["ADMIN", "LANDLORD", "STUDENT"],
  "/community/blog-management": ["ADMIN"],
  "/admin": ["ADMIN"],
  "/landlord": ["LANDLORD"],
};

const PUBLIC_CHILD_ROUTES: string[] = [
  "/select/explore",
  "/select/search",
  "/select/category",
];

const ALWAYS_PROTECTED_PATHS: Record<string, string[]> = {
  "/community/blog-management": ["ADMIN"],
  "/select/manage-universities": ["ADMIN"],
  "/select/drag-&-drop": ["ADMIN"],
};

const SESSION_VALIDATION_RETRIES = 3;
const RETRY_DELAY_MS = 500;

const AUTHENTICATED_ONLY_PATHS = [
  "/profile",
  "/messages",
  "/bookings",
];

const PUBLIC_PATH_PATTERNS = [
  /^\/$/,
  /^\/auth\/.*$/,
  /^\/select\/(?!manage-universities|drag-&-drop).*$/,
  /^\/stay.*$/,
  /^\/connect.*$/,
  /^\/community\/?$|^\/community\/[^/]+$/,
  /^\/lenders.*$/,
  /^\/privacy.*$/,
  /^\/quizform$/,
  /^\/api\/auth\/.*$/,
  /^\/api\/upload$/,
  /^\/api\/session\/validateSession$/,
  /^\/_next\/.*$/,
  /^\/favicon\.ico$/,
];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isProtectedApiRoute(pathname)) {
    const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);

    if (isWriteOperation) {
      try {
        const sessionData = await validateSession(req);

        if (!sessionData || !sessionData.role || sessionData.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

      } catch {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }
  }
  else if (isAlwaysProtectedPath(pathname)) {
  }
  else if (isPublicRoute(pathname) || isPublicChildRoute(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    const isAllowed = await checkRateLimit(req);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  try {
    const sessionData = await validateSession(req);

    const requiresAuth = AUTHENTICATED_ONLY_PATHS.some(route => pathname.startsWith(route));

    const requiresRoles = isProtectedRoute(pathname) || isAlwaysProtectedPath(pathname);

    if ((requiresAuth || requiresRoles) && !sessionData) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (requiresRoles && !checkRoleAccess(pathname, sessionData?.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const response = NextResponse.next();

    if (sessionData) {
      response.headers.set('x-user-id', sessionData.userId);
      response.headers.set('x-user-role', sessionData.role);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function validateSession(req: NextRequest) {
  let retryCount = 0;

  while (retryCount < SESSION_VALIDATION_RETRIES) {
    try {
      const validateSessionResponse = await fetch(new URL('/api/session/validateSession', req.url), {
        method: 'POST',
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        }
      });

      if (validateSessionResponse.ok) {
        return await validateSessionResponse.json();
      }

      if (validateSessionResponse.status === 401) {
        return null;
      }
    } catch {
    }

    retryCount++;
    if (retryCount < SESSION_VALIDATION_RETRIES) {
      await wait(RETRY_DELAY_MS);
    }
  }

  return null;
}

function isProtectedApiRoute(pathname: string): boolean {
  const publicEndpoints = [
    '/api/universities/apply',
    '/api/universities/upload',
  ];

  if (publicEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
    return false;
  }

  const universityApiPatterns = [
    /^\/api\/universities$/,
    /^\/api\/universities\/[^/]+$/,
    /^\/api\/universities\/[^/]+\/courses$/,
    /^\/api\/universities\/[^/]+\/courses\/[^/]+$/,
  ];

  const isUniversityApi = universityApiPatterns.some(pattern => {
    const matches = pattern.test(pathname);
    return matches;
  });

  return isUniversityApi;
}

function isAlwaysProtectedPath(pathname: string): boolean {
  return Object.keys(ALWAYS_PROTECTED_PATHS).some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATH_PATTERNS.some(pattern => pattern.test(pathname));
}

function isPublicChildRoute(pathname: string): boolean {
  return PUBLIC_CHILD_ROUTES.some(route => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return Object.keys(PROTECTED_ROUTES).some(route => pathname.startsWith(route));
}

function checkRoleAccess(pathname: string, userRole?: string): boolean {
  for (const route of Object.keys(ALWAYS_PROTECTED_PATHS)) {
    if (pathname.startsWith(route)) {
      const allowedRoles = ALWAYS_PROTECTED_PATHS[route];
      return allowedRoles.includes(userRole || "");
    }
  }

  const matchingRoute = Object.keys(PROTECTED_ROUTES).find(route =>
    pathname.startsWith(route)
  );

  if (matchingRoute) {
    const allowedRoles = PROTECTED_ROUTES[matchingRoute];
    return allowedRoles.includes(userRole || "");
  }

  return true;
}

export const config = {
  matcher: [
    '/(.*)',
  ],
};
