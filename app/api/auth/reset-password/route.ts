import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ResetPasswordSchema } from "@/app/lib/validation/auth";
import { OTPPurpose } from "@prisma/client";
import { hash } from "bcryptjs";


export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedData = ResetPasswordSchema.parse(body);

    // Find the OTP record for the user
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        otpCode: validatedData.otpCode,
        userId: validatedData.userId,
        purpose: validatedData.purpose as OTPPurpose,
        expiresAt: { gt: new Date() }, // OTP should not be expired
      },
      include: { user: true }
    });

    // Check if OTP is found and valid
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP or OTP expired" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(validatedData.password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        password: hashedPassword, // Set the new password
        otpRetryCount: 0, // Reset OTP retry count
        otpBlockedUntil: null, // Reset OTP blocked duration
      },
    });

    // Mark the OTP as verified
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    // Return a success response
    return NextResponse.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    // Error handling
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
