
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { generateOTP } from "@/app/utils/otp"
import { sendVerificationEmail } from "@/app/lib/email/sendEmail"
import { OTPType, OTPPurpose, Prisma } from "@prisma/client"
import { z } from "zod"
import crypto from "crypto"

const OTP_EXPIRY_MS = 5 * 60 * 1000

const EmailPhoneSchema = z.object({
    email: z.string().email("Invalid email format"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export async function POST(req: NextRequest) {
    try {
        console.log("Received registration request");

        const body = await req.json();
        console.log("Parsed body:", body);

        const emailPhoneAnswer = body[7];
        console.log("Extracted emailPhoneAnswer:", emailPhoneAnswer);

        if (!emailPhoneAnswer || typeof emailPhoneAnswer !== 'object') {
            console.warn("Invalid registration data format");
            return NextResponse.json({
                success: false,
                message: "Invalid registration data"
            }, { status: 400 });
        }

        const validationResult = EmailPhoneSchema.safeParse(emailPhoneAnswer);
        if (!validationResult.success) {
            console.warn("Validation failed:", validationResult.error.errors);
            return NextResponse.json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            }, { status: 400 });
        }

        const { email, phoneNumber, password } = emailPhoneAnswer;
        // Note: name is extracted from body[0] (question id 0 = "What's your name?")
        // The name will be sent in registrationData during OTP verification

        try {
            console.log("Checking for existing user with email:", email);
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        // { phoneNumber }
                    ]
                },
                select: {
                    email: true,
                    // phoneNumber: true
                }
            });

            if (existingUser) {
                console.warn("User already exists:", existingUser);
                return NextResponse.json({
                    success: false,
                    message: "Account with this email or phone number already exists"
                }, { status: 409 });
            }

            const randomSuffix = Math.random().toString(36).substring(2, 10);
            const username = `user_${email.split('@')[0].substring(0, 10)}_${randomSuffix}`;

            // Generate a temporary registration token
            const tempRegistrationToken = crypto.randomBytes(32).toString('hex');
            const otpCode = generateOTP();
            
            console.log("Generated OTP:", otpCode);
            console.log("Generated temp token:", tempRegistrationToken);

            console.log("Starting transaction to create temporary OTP...");
            const result = await prisma.$transaction(async (tx) => {
                // Create a temporary OTP record (password will be hashed only after OTP verification)
                const tempOtp = await tx.oTP.create({
                    data: {
                        userId: "temp_" + tempRegistrationToken, // Temporary user ID
                        otpCode,
                        type: OTPType.EMAIL,
                        purpose: OTPPurpose.SIGNUP_VERIFICATION,
                        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
                        verified: false,
                        attempts: 0,
                        invalidated: false,
                    },
                });
                
                return { 
                    tempOtpId: tempOtp.id, 
                    email, 
                    otpCode, 
                    tempRegistrationToken,
                };
            }, {
                maxWait: 5000,
                timeout: 10000
            });

            console.log("Temporary OTP created successfully. Sending verification email...");

            try {
                await sendVerificationEmail(result.email, result.otpCode);
                console.log("Verification email sent successfully");
            } catch (emailError) {
                console.error("Failed to send verification email:", emailError);
                return NextResponse.json({
                    success: false,
                    message: "Failed to send verification email. Please try again.",
                    errorCode: "EMAIL_SEND_FAILED"
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: "Registration data received. Please verify your email to complete registration.",
                tempRegistrationToken: result.tempRegistrationToken,
                email: result.email,
            }, { status: 201 });

        } catch (dbError) {
            if (dbError instanceof Prisma.PrismaClientInitializationError) {
                console.error("Database connection error:", dbError.message);
                return NextResponse.json({
                    success: false,
                    message: "Unable to connect to database. Please try again later.",
                    errorCode: "DB_CONNECTION_ERROR"
                }, { status: 503 });
            }

            if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
                console.error("Database request error:", dbError.code, dbError.meta);
                return NextResponse.json({
                    success: false,
                    message: "Database operation failed. Please try again later.",
                    errorCode: "DB_REQUEST_ERROR"
                }, { status: 500 });
            }

            throw dbError;
        }

    } catch (error) {
        console.error("[QUIZ_REGISTER_ERROR]", {
            message: error instanceof Error ? error.message : "Unknown error",
            name: error instanceof Error ? error.name : "UnknownError",
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            success: false,
            message: "Registration failed. Please try again later.",
            errorCode: "INTERNAL_SERVER_ERROR"
        }, { status: 500 });
    }
}
