// import { NextRequest, NextResponse } from "next/server";
// import { refreshSessionTokens, validateSession } from "../session";

// // Define protected routes and their required roles
// const PROTECTED_ROUTES: Record<string, string[]> = {
//   "/accommodations": ["ADMIN", "LANDLORD"],
//   "/user": ["ADMIN", "LANDLORD", "STUDENT"],
//   "/lenders": ["ADMIN"],
//   "/connect": ["ADMIN"],
//   "/community": ["ADMIN", "LANDLORD", "STUDENT"],
//   "/admin": ["ADMIN"],
// };

// // validating the user session
// export async function validateAuth(req: NextRequest) {
//   const accessToken = req.cookies.get("access_token")?.value;
//   const refreshToken = req.cookies.get("refresh_token")?.value;

//   if (!accessToken && !refreshToken) {
//     return { valid: false };
//   }

//   try {
//     if (!accessToken) return { valid: false, error: "ACCESS_TOKEN_NOT_FOUND" };

//     // testing the access token
//     if (accessToken) console.log("from validateAuth accessToken :", accessToken);

//     const session = await validateSession(accessToken);

//     // Check if session is null
//     if (session === null) {
//       return { valid: false, error: "SESSION_NOT_FOUND" }; // Handle the null case
//     }

//     // Check if session is an error object
//     if ('error' in session) {
//       if (session.error === "Access token expired") {
//         return { valid: false, error: "ACCESS_TOKEN_EXPIRED" };
//       }
//       // Handle other error cases if necessary
//       return { valid: false, error: session.error }; // General error handling
//     }

//     // Check for sensitive routes
//     if (isSensitiveRoute(req.nextUrl.pathname) && !session.isEmailVerified) {
//       return { valid: false, error: "EMAIL_NOT_VERIFIED" };
//     }

//     return {
//       valid: true,
//       user: {
//         userId: session.userId,
//         role: session.role,
//         isEmailVerified: session.isEmailVerified,
//       },
//     };
//   } catch (error) {
//     console.error("[AUTH_MIDDLEWARE_ERROR] ", error);
//     return { valid: false };
//   }
// }

// export async function refreshAuth(req: NextRequest) {
//   console.log("from refreshAuth is starting....");
//   const refreshToken = req.cookies.get("refresh_token")?.value;
//   if (!refreshToken) return { valid: false, error: "REFRESH_TOKEN_NOT_FOUND" };

//   console.log("refreshtoken is found....", refreshToken);


//   try {

//     // Retrieve CSRF token from cookies or headers
//     const csrfToken = req.cookies.get("csrf_token")?.value;

//     const response = await fetch(`http://localhost:3000/api/session/refreshSession`, {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json',
//         'X-CSRF-TOKEN':  csrfToken || '',  // Send CSRF token in headers
//       },
//       body: JSON.stringify({ refreshToken }), 
//       credentials: 'include',  
//     });

//     const refreshedTokens = await response.json();
//     console.log("response from refreshAuth :", refreshedTokens);
    
//     if (response.ok) {
//       if (!refreshedTokens) {
//         return { valid: false, error: "REFRESH_TOKEN_INVALID" };
//       }
//       return {
//         valid: true,
//         refreshedTokens,
//       };
//     } else {
//       return { valid: false, error: "REFRESH_TOKEN_FAILED" };
//     }

//     // const refreshedTokens = await refreshSessionTokens(refreshToken);
//     // console.log('Refreshed Tokens:', refreshedTokens);


//     // if (!refreshedTokens) {
//     //   return { valid: false, error: "REFRESH_TOKEN_GENERATION_FAILED" };
//     // }

//     // console.log("token refreshed successfully completed...");

//     // return { valid: true, refreshedTokens };

//   } catch (error) {
//     console.error("[REFRESH_AUTH_ERROR]", error);
//     return { valid: false, error: "REFRESH_TOKEN_FAILED" };
//   }
// }


// // checking the user role access
// export function checkRoleAccess(pathname: string, userRole?: string): boolean {
//   const matchingRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
//     pathname.startsWith(route)
//   );

//   if (matchingRoute) {
//     const allowedRoles = PROTECTED_ROUTES[matchingRoute];
//     return allowedRoles.includes(userRole || "");
//   }

//   return true;
// }

// function isSensitiveRoute(pathname: string): boolean {
//   const sensitiveRoutes = [
//     "/lenders",
//     "/admin",
//     "/accommodations/create",
//     "/user/settings",
//   ];
//   return sensitiveRoutes.some((route) => pathname.startsWith(route));
// }
