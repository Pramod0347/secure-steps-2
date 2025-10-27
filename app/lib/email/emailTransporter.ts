// email transporter
import nodemailer from "nodemailer";
import { config } from "./emailConfig";
import { EmailConfig } from "./types";

export const createTransporter = (): nodemailer.Transporter => {
  try {
    const validatedConfig = EmailConfig.parse(config);
    return nodemailer.createTransport(validatedConfig);
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw new Error("Failed to create email transporter");
  }
};