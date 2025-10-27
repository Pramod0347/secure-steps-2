// app/lib/types/auth.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["STUDENT", "LANDLORD", "ADMIN"]), 
  phoneNumber: z.string().optional(),
});

// Schema for validating Google user data
export const GoogleUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  verified_email: z.boolean(),
  name: z.string(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url(),
  locale: z.string().optional(),
});

export const VerifyOTPSchema = z.object({
  userId: z.string(),
  otpCode: z.string(),
  purpose: z.enum(["SIGNUP_VERIFICATION", "LOGIN_VERIFICATION", "PASSWORD_RESET"]),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
  rememberMe: z.boolean().optional()
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  department: z.string().optional(),
  program: z.string().optional(),
  graduationYear: z.number().optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


// Define SessionData schema
export const SessionDataSchema = z.object({
  userId: z.string(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  otpVerified: z.boolean().optional(),
});

// Type inferred from schema
export type SessionData = z.infer<typeof SessionDataSchema>;

// Define TokenPayload schema
export const TokenPayloadSchema = z.object({
  userId: z.string(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  exp: z.number().optional(), // Timestamp for expiration
  iat: z.number().optional(), // Timestamp for issued-at
});

// Type inferred from schema
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

// Define AuthError schema
export const AuthErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
});

// Type inferred from schema
export type AuthError = z.infer<typeof AuthErrorSchema>;
// export type GoogleUser = z.infer<typeof GoogleUserSchema>;
