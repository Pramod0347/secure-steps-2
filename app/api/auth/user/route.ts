// src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { UpdateUserSchema } from "@/app/lib/validation/auth";
import { NotificationType } from "@prisma/client";


export async function GET(req: NextRequest) {
  try {
    console.log("GET started... the user route");
    const email = req.nextUrl.searchParams.get("email");
    const userId = req.nextUrl.searchParams.get("id");

    console.log("userId :",userId);


    console.log("Routeuseid :",userId)

    if (!email && !userId) {
      return NextResponse.json(
        {
          available: false,
          message: "Either email or ID is required",
        },
        { status: 400 }
      );
    }

    if (email) {
      // Validate email format using a regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          {
            available: false,
            message: "Invalid email format",
          },
          { status: 400 }
        );
      }

      // Normalize email for case-insensitive check
      const normalizedEmail = email.toLowerCase();

      // Quick DB check with minimal fields
      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: normalizedEmail,
            mode: "insensitive",
          },
        },
        select: { id: true },
      });

      console.log("userexist :",existingUser);

      return NextResponse.json(
        {
          available: !existingUser,
          message: existingUser ? "Email is already taken" : "Email is available"
        },
        { status: existingUser ? 409 : 200 } // Use 409 for conflict if email exists
      );
    }

    if (userId) {
      // Fetch user details by ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          {
            available: false,
            message: "User ID not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          available: true,
          user,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[CHECK_AVAILABILITY_ERROR]", error);
    return NextResponse.json(
      {
        available: false,
        message: "Error checking availability",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    console.log("userId :",userId);
    console.log("userRole :",userRole);
    
    const targetUserId = req.nextUrl.searchParams.get("id"); // Get the target user ID from query params

    if (!userId || !userRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Determine which user ID to update
    const userIdToUpdate = targetUserId || userId;

    // Authorization check:
    // 1. Admin can edit any user
    // 2. Regular users can only edit their own data
    if (userRole !== "ADMIN" && userId !== userIdToUpdate) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to update this user's data",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("RequestData :",body);
    const validatedData = UpdateUserSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validatedData.error.errors,
        },
        { status: 400 }
      );
    }

    // Check if phone number is being updated
    const currentUser = await prisma.user.findUnique({
      where: { id: userIdToUpdate },
      select: { phoneNumber: true },
    });

    const updateData: Prisma.UserUpdateInput = {
      ...validatedData.data,
      notifications: {
        create: {
          title: "Profile Updated",
          message: "Your profile has been successfully updated",
          type: NotificationType.PROFILE_UPDATED,
        },
      },
    };

    // Reset phone verification if phone number is changed
    if (
      validatedData.data.phoneNumber &&
      currentUser?.phoneNumber !== validatedData.data.phoneNumber
    ) {
      updateData.isPhoneVerified = false;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        banner:true,
        phoneNumber: true,
        isPhoneVerified: true,
        department: true,
        program: true,
        graduationYear: true,
        role: true,
        isVerified: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("[UPDATE_USER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {

    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    console.log("userId : ",userId);
    console.log("userRole : ",userRole);

    if (!userId || !userRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await prisma.$transaction([
      // Delete all related records first
      prisma.notification.deleteMany({
        where: { userId: userId },
      }),
      prisma.oTP.deleteMany({
        where: { userId: userId },
      }),
      prisma.session.deleteMany({
        where: { userId: userId },
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });

    // Use NextResponse to delete the cookie
    response.cookies.delete("session_token");

  } catch (error) {
    console.error("[DELETE_USER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete account",
      },
      { status: 500 }
    );
  }
}
