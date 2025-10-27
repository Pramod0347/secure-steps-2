import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

// Reserved usernames that shouldn't be allowed (in-memory for faster checks)
const RESERVED_USERNAMES = new Set([
  'admin', 'instagram', 'settings', 'explore', 'about', 'terms', 'privacy',
  'support', 'contact', 'help', 'root', 'system'
]);

// Fast initial username validation without DB query
const quickValidateUsername = (username: string): { isValid: boolean; message?: string } => {
  // Basic length check
  if (!username || username.length < 1 || username.length > 30) {
    return { isValid: false, message: "Username must be between 1 and 30 characters" };
  }

  // Check reserved usernames (fast in-memory check)
  if (RESERVED_USERNAMES.has(username.toLowerCase())) {
    return { isValid: false, message: "This username is not available" };
  }

  // Fast regex check for valid characters
  const validUsernameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  if (!validUsernameRegex.test(username)) {
    return { 
      isValid: false, 
      message: "Username can only contain letters, numbers, periods, and underscores. Cannot start/end with period or have consecutive periods." 
    };
  }

  return { isValid: true };
};

// API endpoint to quickly check username availability during signup
export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username");
    
    if (!username) {
      return NextResponse.json({
        available: false,
        message: "Username is required"
      }, { status: 400 });
    }

    // Fast initial validation without DB query
    const validation = quickValidateUsername(username);
    if (!validation.isValid) {
      return NextResponse.json({
        available: false,
        message: validation.message
      }, { status: 400 });
    }

    // Normalized username for case-insensitive check
    const normalizedUsername = username.toLowerCase();

    // Quick DB check with minimal fields
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: normalizedUsername,
          mode: 'insensitive'
        }
      },
      select: { id: true } // Select only ID for faster query
    });

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? "Username is already taken" : "Username is available"
    });

  } catch (error) {
    console.error("[CHECK_USERNAME_ERROR]", error);
    return NextResponse.json({
      available: false,
      message: "Error checking username availability"
    }, { status: 500 });
  }
}

// API endpoint to update existing username
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    const { newUsername } = await req.json();

    // Validate new username
    const validation = quickValidateUsername(newUsername);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: validation.message
      }, { status: 400 });
    }

    const normalizedUsername = newUsername.toLowerCase();

    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          username: {
            equals: normalizedUsername,
            mode: 'insensitive'
          },
          NOT: {
            id: userId
          }
        },
        select: { id: true }
      });
    
      if (existingUser) {
        throw new Error("Username is already taken");
      }
    
      return await tx.user.update({
        where: { id: userId },
        data: {
          username: normalizedUsername,
          notifications: {
            create: {
              title: "Username Updated",
              message: `Your username has been changed to @${normalizedUsername}`,
              type: "PROFILE_UPDATED"
            }
          }
        },
        select: {
          id: true,
          username: true,
          updatedAt: true
        }
      });
    });
    

    return NextResponse.json({
      success: true,
      message: "Username updated successfully",
      data: result
    });

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 409 });
    }

    console.error("[UPDATE_USERNAME_ERROR]", error);
    return NextResponse.json({
      success: false,
      message: "Error updating username"
    }, { status: 500 });
  }
}