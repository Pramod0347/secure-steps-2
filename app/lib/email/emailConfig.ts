// emailConfig.ts
import { z } from "zod";
import { EmailConfig } from "./types";

export const config = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as const;

// Validate config at startup
try {
  EmailConfig.parse(config);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Invalid email configuration:", error.errors);
  }
  throw new Error("Email configuration validation failed");
}