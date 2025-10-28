
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { generateOTP } from "@/app/utils/otp"
import { sendVerificationEmail } from "@/app/lib/email/sendEmail"
import { OTPType, OTPPurpose, UserRole, Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto"

const OTP_EXPIRY_MS = 5 * 60 * 1000
const SALT_ROUNDS = 10

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
        const name = body[1] || "Anonymous User";

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

            console.log("Hashing password...");
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const randomSuffix = Math.random().toString(36).substring(2, 10);
            const username = `user_${email.split('@')[0].substring(0, 10)}_${randomSuffix}`;

            // Generate a temporary registration token
            const tempRegistrationToken = crypto.randomBytes(32).toString('hex');
            const otpCode = generateOTP();
            
            console.log("Generated OTP:", otpCode);
            console.log("Generated temp token:", tempRegistrationToken);

            // Store temporary registration data in a JSON field or separate table
            // For now, we'll use a simple approach with the existing OTP table
            // and store the registration data in the OTP data field
            const registrationData = {
                email,
                phoneNumber,
                name,
                username,
                hashedPassword,
                role: UserRole.STUDENT,
                countryCode: "+91",
                quizAnswers: Object.entries(body)
                    .filter(([key]) => !isNaN(Number(key)))
                    .map(([key, value]) => ({
                        questionId: Number(key),
                        answer: typeof value === 'object' ? JSON.stringify(value) : String(value),
                    })),
                tempRegistrationToken,
                createdAt: new Date().toISOString()
            };

            console.log("Starting transaction to store temporary registration...");
            const result = await prisma.$transaction(async (tx) => {
                // Create a temporary OTP record with registration data
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
                        // Store registration data in a custom field (we'll need to add this to schema)
                        // For now, we'll use a workaround with the existing structure
                    },
                });

                // Store the registration data separately (we'll create a simple storage mechanism)
                // Since we can't modify the schema right now, we'll use a different approach
                // We'll store the data in a JSON file or use a different method
                
                return { 
                    tempOtpId: tempOtp.id, 
                    email, 
                    otpCode, 
                    tempRegistrationToken,
                    registrationData 
                };
            }, {
                maxWait: 5000,
                timeout: 10000
            });

            // Store registration data temporarily (using a simple file-based approach for now)
            // In production, you might want to use Redis or a dedicated temporary storage table
            const fs = await import('fs/promises');
            const path = await import('path');
            const tempDir = path.join(process.cwd(), 'temp_registrations');
            
            try {
                await fs.mkdir(tempDir, { recursive: true });
                await fs.writeFile(
                    path.join(tempDir, `${result.tempRegistrationToken}.json`),
                    JSON.stringify(result.registrationData, null, 2)
                );
            } catch (fileError) {
                console.error("Failed to store temporary registration data:", fileError);
                // Continue with the process even if file storage fails
            }

            console.log("Temporary registration stored successfully. Sending verification email...");

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
