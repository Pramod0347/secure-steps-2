/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { RegisterSchema } from "@/app/lib/validation/auth";
import { generateOTP } from "@/app/utils/otp";
import { sendVerificationEmail } from "@/app/lib/email/sendEmail";
import { OTPType, OTPPurpose, NotificationType } from "@prisma/client";
import {z} from "zod";


const OTP_EXPIRY_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {

    // convert into json()
    const body = await req.json();

    // validate the data
    const validatedData = RegisterSchema.parse(body);

    if(!validatedData){
      return "Data is not validate.";
    }

    const result = await prisma.$transaction(async (tx:any) => {
      // Check existing user
      const existingUser = await tx.user.findFirst({
        where: {
          OR: [
            { email: validatedData.email },
            { username: validatedData.username },
          ],
        },
      });

      console.log("CountryCode :",validatedData.countryCode);

      if (existingUser) {
        console.log("user already exists...");
        throw new Error("USER_EXISTS"); 
      }

      const hashedPassword = await hash(validatedData.password, 12);
      const otpCode = generateOTP();

      console.log("CountryCode :",validatedData.countryCode);

      // Create user with optional profilePicture
      const userData = {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        name: validatedData.name,
        countryCode: validatedData.countryCode || "+91",
        phoneNumber: validatedData.phoneNumber,
        role: validatedData.role,
        isVerified: false,
        isEmailVerified: false,
        otps: {
          create: {
            otpCode,
            type: OTPType.EMAIL,
            purpose: OTPPurpose.SIGNUP_VERIFICATION,
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
          },
        },
        notifications: {
          create: {
            title: "Welcome!",
            message: "Please verify your email to complete registration.",
            type: NotificationType.OTP_SENT,
            data: {
              otpType: OTPType.EMAIL,
              purpose: OTPPurpose.SIGNUP_VERIFICATION,
            },
          },
        },
      };

      

      const user = await tx.user.create({
        data: userData,
        select: {
          id: true,
          email: true,
          otps: {
            where: { purpose: OTPPurpose.SIGNUP_VERIFICATION },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      
      return { userId: user.id, email: user.email, otpCode: otpCode };
    });

    await sendVerificationEmail(result.email, result.otpCode);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: result,
    }, { status: 201 });

  } catch (error) {
    // Type the error as any or use a type guard
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Log the full error details
    console.error("[REGISTER_ERROR]", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    // Handle different error types
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: error.errors[0].message,
      }, { status: 400 });
    }

    if (errorMessage === "USER_EXISTS") {
      return NextResponse.json({
        success: false,
        message: "Email or username already exists",
      }, { status: 400 });
    }

    // Generic error response
    return NextResponse.json({
      success: false,
      message: "Registration failed",
      error: errorMessage,
    }, { status: 500 });
  }
}