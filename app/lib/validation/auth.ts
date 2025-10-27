import { z } from "zod";
import { UserRole } from "@prisma/client";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  profilePicture: z.string().optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum([UserRole.STUDENT, UserRole.LANDLORD]),
  countryCode: z.string().default("+1"),
  phoneNumber: z.string().optional(),
});

export const QuizRegistration = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phonenumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  quiz1: z.number().min(0).max(100),
  quiz2: z.number().min(0).max(100),
  quiz3: z.number().min(0).max(100),
  quiz4: z.number().min(0).max(100),
  quiz5: z.number().min(0).max(100),
  quiz6: z.number().min(0).max(100),
});


export const VerifyOTPSchema = z.object({
  userId: z.string(),
  otpCode: z.string(),
  purpose: z.enum(["SIGNUP_VERIFICATION", "LOGIN_VERIFICATION", "PASSWORD_RESET"]),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export const ResetPasswordSchema = z.object({
  userId: z.string().min(1, "User ID is required"), // Ensure userId is a valid non-empty string
  otpCode: z.string().min(1, "OTP code is required"), // Ensure otpCode is a valid non-empty string
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  purpose: z.string().min(1, "Purpose is required") // Validate that purpose is a non-empty string
});


export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});



export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(), 
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  header:z.string().max(250).optional(),
  bio: z.string().max(500).optional().optional(),
  avatar: z.string().url().optional().optional(),
  banner:z.string().url().optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  department: z.string().optional(),
  program: z.string().optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional()
});