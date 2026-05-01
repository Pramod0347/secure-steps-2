// types.ts
import { z } from "zod";

export const EmailContent = z.object({
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "HTML content is required")
});

export type EmailContentType = z.infer<typeof EmailContent>;
