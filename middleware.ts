import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from './app/lib/middleware/rate-limit';

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/accommodations": ["ADMIN", "LANDLORD"],
  "/user": ["ADMIN", "LANDLORD", "STUDENT"],
  "/community/blog-management": ["ADMIN"],
  "/admin": ["ADMIN"],
  "/landlord": ["LANDLORD"],
};

// Routes that should be public despite having protected parent paths
const PUBLIC_CHILD_ROUTES: string[] = [
  "/select/explore",
  "/select/search",
  "/select/category",
];

// Routes that should always be protected regardless of their parent paths
const ALWAYS_PROTECTED_PATHS: Record<string, string[]> = {
  "/community/blog-management": ["ADMIN"],
  "/select/manage-universities": ["ADMIN"],
  "/select/drag-&-drop": ["ADMIN"],
};

// API routes that require admin access - FIXED: More specific patterns
const PROTECTED_API_ROUTES: Record<string, string[]> = {
  "/api/universities": ["ADMIN"], // Base university management
  "/api/universities/[id]": ["ADMIN"], // University CRUD operations
  "/api/universities/[id]/courses": ["ADMIN"], // Course management under universities
  "/api/universities/[id]/courses/[courseId]": ["ADMIN"], // Individual course operations
};

// Retry configuration
const SESSION_VALIDATION_RETRIES = 3;
const RETRY_DELAY_MS = 500;

// Define fully restricted paths that require authentication (but not specific roles)
const AUTHENTICATED_ONLY_PATHS = [
  "/profile",
  "/messages",
  "/bookings",
];

// Define public path patterns (using regex patterns for flexibility)
const PUBLIC_PATH_PATTERNS = [
  /^\/$/, // Home page
  /^\/auth\/.*$/, // All auth routes
  /^\/select\/(?!manage-universities|drag-&-drop).*$/, // Select routes EXCEPT protected ones
  /^\/stay.*$/,
  /^\/connect.*$/,
  /^\/community\/?$|^\/community\/[^/]+$/,
  /^\/lenders.*$/,
  /^\/quizform$/,
  /^\/api\/auth\/.*$/,
  /^\/api\/upload$/,
  /^\/api\/session\/validateSession$/,
  /^\/_next\/.*$/, // Next.js resources
  /^\/favicon\.ico$/,
];

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`[MIDDLEWARE] ${req.method} ${pathname}`);

  // Check for API routes that need admin protection
  if (isProtectedApiRoute(pathname)) {
    console.log(`[MIDDLEWARE] Protected API route detected: ${pathname}`);
    
    // For university and course API routes, check if it's a write operation
    const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
    
    if (isWriteOperation) {
      console.log(`[MIDDLEWARE] Write operation detected for ${pathname}`);
      // These operations require admin access
      try {
        const sessionData = await validateSession(req);
        
        if (!sessionData || !sessionData.role || sessionData.role !== 'ADMIN') {
          console.log(`[MIDDLEWARE] Admin access denied for ${pathname}`, { 
            hasSession: !!sessionData, 
            role: sessionData?.role 
          });
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        
        console.log(`[MIDDLEWARE] Admin access granted for ${pathname}`);
      } catch (error) {
        console.error(`[MIDDLEWARE] Session validation failed for ${pathname}:`, error);
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    } else {
      console.log(`[MIDDLEWARE] Read operation allowed for ${pathname}`);
    }
    // GET requests to university API can proceed (for public viewing)
  }
  // First check if this is a protected path that must always be protected
  else if (isAlwaysProtectedPath(pathname)) {
    console.log(`[MIDDLEWARE] Always protected path: ${pathname}`);
    // Continue with authentication and authorization checks
  }
  // Then check for public routes
  else if (isPublicRoute(pathname) || isPublicChildRoute(pathname)) {
    console.log(`[MIDDLEWARE] Public route: ${pathname}`);
    return NextResponse.next();
  }

  // Extract client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate Limiting for API routes
  if (pathname.startsWith('/api/')) {
    const isAllowed = await checkRateLimit(req);
    if (!isAllowed) {
      console.warn(`[RATE_LIMIT_EXCEEDED] ${clientIp} tried to access ${pathname}`);
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  try {
    // Try to validate the session with retries
    const sessionData = await validateSession(req);

    // Check if the route requires authentication (but not specific roles)
    const requiresAuth = AUTHENTICATED_ONLY_PATHS.some(route => pathname.startsWith(route));

    // Check if the route requires specific roles
    const requiresRoles = isProtectedRoute(pathname) || isAlwaysProtectedPath(pathname);

    // If any authentication is needed and we don't have valid session data
    if ((requiresAuth || requiresRoles) && !sessionData) {
      console.log(`[MIDDLEWARE] Authentication required but no session for ${pathname}`);
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Authorization check (Role-based access control) for role-protected routes
    if (requiresRoles && !checkRoleAccess(pathname, sessionData?.role)) {
      console.log(`[MIDDLEWARE] Role access denied for ${pathname}`, { 
        requiredRoles: getRequiredRoles(pathname), 
        userRole: sessionData?.role 
      });
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const response = NextResponse.next();

    // If we have session data, add user context to headers
    if (sessionData) {
      response.headers.set('x-user-id', sessionData.userId);
      response.headers.set('x-user-role', sessionData.role);
    }

    console.log(`[MIDDLEWARE] Request allowed for ${pathname}`);
    return response;
  } catch (error) {
    console.error('[MIDDLEWARE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to validate session
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

      // If clearly auth-related (401), don't retry
      if (validateSessionResponse.status === 401) {
        return null;
      }
    } catch (error) {
      // Network errors - continue to retry
    }

    retryCount++;
    if (retryCount < SESSION_VALIDATION_RETRIES) {
      await wait(RETRY_DELAY_MS);
    }
  }
  
  return null;
}

// IMPROVED: Check if this is a protected API route with better pattern matching
function isProtectedApiRoute(pathname: string): boolean {
  // University API route patterns - more comprehensive matching
  const universityApiPatterns = [
    /^\/api\/universities$/, // Base universities endpoint
    /^\/api\/universities\/[^/]+$/, // Single university endpoint
    /^\/api\/universities\/[^/]+\/courses$/, // University courses endpoint
    /^\/api\/universities\/[^/]+\/courses\/[^/]+$/, // Individual course endpoint
  ];
  
  const isUniversityApi = universityApiPatterns.some(pattern => {
    const matches = pattern.test(pathname);
    if (matches) {
      console.log(`[MIDDLEWARE] API route pattern matched: ${pattern} for ${pathname}`);
    }
    return matches;
  });
  
  return isUniversityApi;
}

// Check if path is in the list of always protected paths
function isAlwaysProtectedPath(pathname: string): boolean {
  return Object.keys(ALWAYS_PROTECTED_PATHS).some(route => pathname.startsWith(route));
}

// Improved public route check using regex patterns
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATH_PATTERNS.some(pattern => pattern.test(pathname));
}

// Check if this is a public child route that should be accessible
function isPublicChildRoute(pathname: string): boolean {
  return PUBLIC_CHILD_ROUTES.some(route => pathname.startsWith(route));
}

// Check if this is a protected route requiring specific roles
function isProtectedRoute(pathname: string): boolean {
  return Object.keys(PROTECTED_ROUTES).some(route => pathname.startsWith(route));
}

// Helper function to get required roles for debugging
function getRequiredRoles(pathname: string): string[] {
  // First check always protected specific paths
  for (const route of Object.keys(ALWAYS_PROTECTED_PATHS)) {
    if (pathname.startsWith(route)) {
      return ALWAYS_PROTECTED_PATHS[route];
    }
  }

  // Then check main protected routes
  const matchingRoute = Object.keys(PROTECTED_ROUTES).find(route =>
    pathname.startsWith(route)
  );

  return matchingRoute ? PROTECTED_ROUTES[matchingRoute] : [];
}

// Role-based access control function
function checkRoleAccess(pathname: string, userRole?: string): boolean {
  // First check always protected specific paths
  for (const route of Object.keys(ALWAYS_PROTECTED_PATHS)) {
    if (pathname.startsWith(route)) {
      const allowedRoles = ALWAYS_PROTECTED_PATHS[route];
      return allowedRoles.includes(userRole || "");
    }
  }

  // Then check main protected routes
  const matchingRoute = Object.keys(PROTECTED_ROUTES).find(route =>
    pathname.startsWith(route)
  );

  if (matchingRoute) {
    const allowedRoles = PROTECTED_ROUTES[matchingRoute];
    return allowedRoles.includes(userRole || "");
  }

  // If not explicitly protected, allow access
  return true;
}

// Simplified config - catch all routes and let the middleware logic handle exceptions
export const config = {
  matcher: [
    '/(.*)',
  ],
};