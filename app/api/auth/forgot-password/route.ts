// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ForgotPasswordSchema } from "@/app/lib/validation/auth";
import { generateOTP } from "@/app/utils/otp";
import { sendVerificationEmail } from "@/app/lib/email/sendEmail";
import { OTPType, OTPPurpose, NotificationType } from "@prisma/client";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedData = ForgotPasswordSchema.parse(body);

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found with this email" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expiry time (15 minutes)

    // Create OTP entry in the database
    await prisma.oTP.create({
      data: {
        userId: user.id,
        otpCode,
        type: OTPType.EMAIL,
        purpose: OTPPurpose.PASSWORD_RESET,
        expiresAt,
      },
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Password Reset Request",
        message: "We have sent you a password reset OTP. Please verify your identity.",
        type: NotificationType.OTP_SENT,
        data: {
          otpType: OTPType.EMAIL,
          purpose: OTPPurpose.PASSWORD_RESET,
        },
      },
    });
    
    console.log("otpCode :",otpCode)

    // Send the OTP to the user's email
    await sendVerificationEmail(user.email, otpCode);

    // Send success response
    return NextResponse.json({
      success: true,
      message: "Password reset instructions sent to your email",
      date:{
        userId: user.id,
      }
    });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    // Handle known errors
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
    }

    // Log and return internal server errors
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}
