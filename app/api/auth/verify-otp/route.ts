import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { OTPPurpose, NotificationType, Prisma, UserRole } from "@prisma/client";
import { z } from "zod";
import { VerifyOTPSchema } from "@/app/lib/validation/auth";
import { createSession } from "@/app/lib/session";
import { OTP_CONSTANTS } from "@/app/lib/constants";
import crypto from "crypto";
import { sendWelcomeEmail } from "@/app/lib/email/sendEmail";
import fs from "fs/promises";
import path from "path";

// Add connection retry functionality
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError &&
      retries > 0
    ) {
      // Log retry attempt but not the full error
      console.warn(`Database connection failed, retrying... (${retries} attempts left)`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Minimal logging without sensitive data
    console.log("[VERIFY_OTP_REQUEST] Processing verification request");

    // Robust body parsing with enhanced error handling
    let body;
    try {
      body = await req.json();
      // Don't log the full body - might contain sensitive info
      console.log("[VERIFY_OTP_REQUEST] Request received");
    } catch {
      console.error("[VERIFY_OTP_PARSE_ERROR] Invalid JSON payload");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          error: "PARSE_ERROR",
        },
        { status: 400 }
      );
    }

    // Additional body validation
    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Empty request body",
          error: "EMPTY_BODY",
        },
        { status: 400 }
      );
    }

    // Validate input data
    let validatedData;
    try {
      validatedData = VerifyOTPSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("[VERIFY_OTP_VALIDATION_ERROR] Validation failed");
        return NextResponse.json(
          {
            success: false,
            message: "Invalid input data",
            errors: validationError.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Wrap the transaction in our retry function
    const result = await withRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        // Check if this is a temporary registration (userId starts with "temp_")
        const isTemporaryRegistration = validatedData.userId.startsWith("temp_");
        
        let user, latestOtp;
        
        if (isTemporaryRegistration) {
          // Handle temporary registration verification
          const tempToken = validatedData.userId.replace("temp_", "");
          
          // Find the temporary OTP record
          latestOtp = await tx.oTP.findFirst({
            where: {
              userId: validatedData.userId,
              purpose: validatedData.purpose as OTPPurpose,
              verified: false,
              invalidated: false,
              expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
          });

          if (!latestOtp) {
            console.error("[VERIFY_OTP_ERROR] No valid temporary OTP found");
            throw new Error("OTP_EXPIRED");
          }

          // Load registration data from temporary storage
          const tempDir = path.join(process.cwd(), 'temp_registrations');
          
          // try {
          //   const filePath = path.join(tempDir, `${tempToken}.json`);
          //   await fs.readFile(filePath, 'utf-8');
          // } catch (fileError) {
          //   console.error("[VERIFY_OTP_ERROR] Failed to load registration data:", fileError);
          //   throw new Error("REGISTRATION_DATA_NOT_FOUND");
          // }

          user = null; // No existing user for temporary registrations
        } else {
          // Handle existing user verification
          user = await tx.user.findUnique({
            where: { id: validatedData.userId },
            include: {
              otps: {
                where: {
                  AND: [
                    { purpose: validatedData.purpose as OTPPurpose },
                    { verified: false },
                    { invalidated: false },
                    { expiresAt: { gt: new Date() } },
                  ],
                },
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          });

          // Comprehensive error checking for existing users
          if (!user) {
            console.error(
              "[VERIFY_OTP_ERROR] User not found for ID:",
              validatedData.userId
            );
            throw new Error("USER_NOT_FOUND");
          }

          if (user.otpBlockedUntil && user.otpBlockedUntil > new Date()) {
            console.error(
              "[VERIFY_OTP_ERROR] User OTP blocked until:",
              user.otpBlockedUntil
            );
            throw new Error("OTP_BLOCKED");
          }

          latestOtp = user.otps[0];

          if (!latestOtp) {
            console.error("[VERIFY_OTP_ERROR] No valid OTP found for user");
            throw new Error("OTP_EXPIRED");
          }
        }

        // Enhanced OTP comparison with timing-safe equals
        let isValidOtp = false;
        try {
          // Convert both OTP codes to buffers, handling potential type issues
          const storedOtpBuffer = Buffer.from(String(latestOtp.otpCode));
          const providedOtpBuffer = Buffer.from(String(validatedData.otpCode));

          // Only log lengths for debugging, not the actual codes
          const storedLength = storedOtpBuffer.length;
          const providedLength = providedOtpBuffer.length;

          if (storedLength !== providedLength) {
            console.warn("[VERIFY_OTP_DEBUG] OTP length mismatch");
            isValidOtp = false;
          } else {
            // Timing-safe comparison
            isValidOtp = crypto.timingSafeEqual(storedOtpBuffer, providedOtpBuffer);
          }
        } catch {
          console.error("[VERIFY_OTP_COMPARISON_ERROR] Error comparing OTPs");
          throw new Error("OTP_COMPARISON_FAILED");
        }

        if (!isValidOtp) {
          // Track failed attempts with more robust error handling
          const updatedOtp = await tx.oTP.update({
            where: { id: latestOtp.id },
            data: {
              attempts: { increment: 1 },
            },
          });

          console.warn("[VERIFY_OTP_INVALID] Failed attempt", {
            userId: user?.id || "temporary registration",
            attempts: updatedOtp.attempts,
            maxAttempts: OTP_CONSTANTS.MAX_OTP_ATTEMPTS,
          });

          if (updatedOtp.attempts >= OTP_CONSTANTS.MAX_OTP_ATTEMPTS) {
            // Comprehensive blocking mechanism
            // Invalidate the OTP
            await tx.oTP.update({
              where: { id: latestOtp.id },
              data: {
                invalidated: true,
              },
            });

            // Only update user if it's not a temporary registration
            if (user) {
              await tx.user.update({
                where: { id: user.id },
                data: {
                  otpBlockedUntil: new Date(
                    Date.now() +
                      OTP_CONSTANTS.OTP_BLOCK_DURATION *
                        Math.pow(2, user.otpRetryCount || 0)
                  ),
                  otpRetryCount: { increment: 1 },
                },
              });
            }

            console.error(
              "[VERIFY_OTP_ERROR] Max attempts exceeded for user:",
              user?.id || "temporary registration"
            );
            throw new Error("MAX_ATTEMPTS_EXCEEDED");
          }

          console.error("[VERIFY_OTP_ERROR] Invalid OTP for user:", user?.id || "temporary registration");
          throw new Error("INVALID_OTP");
        }

        // Mark OTP as verified
        await tx.oTP.update({
          where: { id: latestOtp.id },
          data: {
            verified: true,
            verifiedAt: new Date(),
          },
        });

        let updatedUser: {
          id: string;
          email: string;
          username: string;
          role: string;
          isVerified: boolean;
          isEmailVerified: boolean;
          isPhoneVerified: boolean;
          universityId: string | null;
          department: string | null;
          program: string | null;
        };
        
        if (isTemporaryRegistration) {
          // Create new user from temporary registration data
          const tempToken = validatedData.userId.replace("temp_", "");
          const tempDir = path.join(process.cwd(), 'temp_registrations');
          const filePath = path.join(tempDir, `${tempToken}.json`);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const registrationData = JSON.parse(fileContent);

          console.log("Creating new user from registration data...");
          
          updatedUser = await tx.user.create({
            data: {
              email: registrationData.email,
              phoneNumber: registrationData.phoneNumber,
              name: registrationData.name,
              username: registrationData.username,
              password: registrationData.hashedPassword,
              role: registrationData.role,
              isVerified: true,
              isEmailVerified: true,
              isPhoneVerified: false,
              countryCode: registrationData.countryCode,
              notifications: {
                create: [
                  {
                    title: "Welcome!",
                    message: "Your account has been successfully created and verified.",
                    type: NotificationType.ACCOUNT_VERIFIED,
                    data: {
                      timestamp: new Date().toISOString(),
                    },
                  },
                  {
                    title: "Verification Success",
                    message: "Your email verification was successful.",
                    type: NotificationType.OTP_VERIFIED,
                    data: {
                      timestamp: new Date().toISOString(),
                    },
                  },
                ],
              },
            },
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
              isVerified: true,
              isEmailVerified: true,
              isPhoneVerified: true,
              universityId: true,
              department: true,
              program: true,
            },
          });

          // Create quiz answers for the new user
          if (registrationData.quizAnswers && registrationData.quizAnswers.length > 0) {
            const quizAnswers = registrationData.quizAnswers.map((answer: { questionId: number; answer: string }) => ({
              userId: updatedUser.id,
              questionId: answer.questionId,
              answer: answer.answer,
            }));

            await tx.quizAnswer.createMany({
              data: quizAnswers
            });
          }

          // Clean up temporary registration data
          try {
            await fs.unlink(filePath);
          } catch (cleanupError) {
            console.warn("Failed to clean up temporary registration file:", cleanupError);
          }

          // Update the OTP record to point to the new user
          await tx.oTP.update({
            where: { id: latestOtp.id },
            data: {
              userId: updatedUser.id,
              verified: true,
              verifiedAt: new Date(),
            },
          });

        } else {
          // Update existing user verification status
          const updateData: Prisma.UserUpdateInput = {
            notifications: {
              create: {
                title: "Verification Success",
                message: "Your verification was successful.",
                type: NotificationType.OTP_VERIFIED,
                data: {
                  timestamp: new Date().toISOString(),
                },
              },
            },
            otpRetryCount: 0,
            otpBlockedUntil: null,
          };

          // Conditional verification based on purpose
          switch (validatedData.purpose) {
            case OTPPurpose.SIGNUP_VERIFICATION:
              updateData.isVerified = true;
              updateData.isEmailVerified = true;
              break;
            // Add other cases as needed
          }

          if (user) {
            updatedUser = await tx.user.update({
              where: { id: user.id },
              data: updateData,
              select: {
                id: true,
                email: true,
                username: true,
                role: true,
                isVerified: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                universityId: true,
                department: true,
                program: true,
              },
            });
          } else {
            throw new Error("USER_NOT_FOUND");
          }
        }

        // Session creation with retry logic
        let accessToken, refreshToken, session;
        if (validatedData.purpose === OTPPurpose.SIGNUP_VERIFICATION) {
          try {
            const sessionData = await createSession(
              {
                userId: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role as UserRole,
                isEmailVerified: updatedUser.isVerified,
              },
              {
                userAgent: req.headers.get("user-agent") || undefined,
              },
              true
            );

            accessToken = sessionData.accessToken;
            refreshToken = sessionData.refreshToken;
            session = sessionData.session;
          } catch (sessionError) {
            console.error("[SESSION_CREATE_ERROR]", 
              sessionError instanceof Error ? sessionError.message : "Unknown error"
            );
            throw new Error("SESSION_CREATION_FAILED");
          }

          // Only create additional notification for existing users (new users already have notifications created)
          if (!isTemporaryRegistration) {
            await tx.notification.create({
              data: {
                userId: updatedUser.id,
                title: "Account Verified",
                message:
                  "Your account has been successfully verified and activated.",
                type: NotificationType.ACCOUNT_VERIFIED,
                data: {
                  timestamp: new Date().toISOString(),
                },
              },
            });
          }
        }

        return {
          user: updatedUser,
          accessToken,
          refreshToken,
          session,
        };
      }, {
        timeout: 30000, // 15 seconds transaction timeout
        maxWait: 10000,  // 5 seconds max wait
      });
    }, 3, 1000); // 3 retries with 1s initial delay

    // Send welcome email with error handling
    try {
      await sendWelcomeEmail(result.user.email, result.user.username);
    } catch (emailError) {
      console.error("[WELCOME_EMAIL_ERROR]", 
        emailError instanceof Error ? emailError.message : "Unknown error"
      );
      // Continue processing even if email fails
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Verification successful",
        data: {
          user: result.user,
        },
      },
      { status: 200 }
    );

    // Set cookies securely
    if (result.accessToken) {
      response.cookies.set("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
    }

    if (result.refreshToken) {
      response.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
    }

    response.cookies.set("x-user-id", result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    response.cookies.set("x-user-role", String(result.user.role), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    // Enhanced error logging without excessive details
    console.error("[VERIFY_OTP_ERROR]", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorName: error instanceof Error ? error.name : "Unknown error type",
    });

    // Handle database connection errors specifically
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection error. Please try again later.",
          error: "DB_CONNECTION_ERROR",
        },
        { status: 503 } // Service Unavailable
      );
    }

    // Comprehensive error handling
    const errorMessages: Record<string, { message: string; status: number }> = {
      USER_NOT_FOUND: { message: "User not found", status: 404 },
      INVALID_OTP: { message: "Invalid OTP code", status: 400 },
      OTP_EXPIRED: { message: "OTP has expired", status: 400 },
      OTP_BLOCKED: {
        message: "Too many failed attempts. Please try again later.",
        status: 429,
      },
      MAX_ATTEMPTS_EXCEEDED: {
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
        status: 429,
      },
      OTP_COMPARISON_FAILED: {
        message: "OTP verification process failed",
        status: 500,
      },
      SESSION_CREATION_FAILED: {
        message: "Account verified but session creation failed. Please log in.",
        status: 500,
      },
      REGISTRATION_DATA_NOT_FOUND: {
        message: "Registration data not found. Please try registering again.",
        status: 404,
      },
    };

    if (error instanceof Error && error.message in errorMessages) {
      const { message, status } = errorMessages[error.message];
      return NextResponse.json(
        {
          success: false,
          message,
          error: error.message,
        },
        { status }
      );
    }

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