// types.ts
import { z } from "zod";

export const EmailConfig = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.number().int().positive(),
  secure: z.boolean(),
  auth: z.object({
    user: z.string().min(1, "Email user is required"),
    pass: z.string().min(1, "Email password is required")
  })
});

export const EmailContent = z.object({
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "HTML content is required")
});

export type EmailConfigType = z.infer<typeof EmailConfig>;
export type EmailContentType = z.infer<typeof EmailContent>;