// sendEmail.ts
import nodemailer from "nodemailer";
import { EmailContentType } from "./types";
import {EmailTemplates} from "./emailTemplate";
import { createTransporter } from "./emailTransporter";

export const sendEmail = async (
  transporter: nodemailer.Transporter,
  emailContent: EmailContentType
): Promise<boolean> => {
  const emailFrom = process.env.EMAIL_FROM;
  
  if (!emailFrom) {
    console.error("EMAIL_FROM environment variable is not set");
    return false;
  }

  try {
    const result = await transporter.sendMail({
      from: emailFrom,
      ...emailContent
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// OTP verfication
export const sendVerificationEmail = async (email: string, otp:string): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const emailContent = EmailTemplates.verificationOTP(email, otp);
    return await sendEmail(transporter, emailContent);
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    return false;
  }
};

// Welcome Email
export const sendWelcomeEmail = async (email: string, username: string): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const emailContent = EmailTemplates.welcomeEmail(email, username);
    return await sendEmail(transporter, emailContent);
  } catch (error) {
    console.error("Error in sendWelcomeEmail:", error);
    return false;
  }
};

// Password Reset Email
export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const emailContent = EmailTemplates.passwordReset(email, resetLink);
    return await sendEmail(transporter, emailContent);
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    return false;
  }
};

// Transaction Confirmation Email
export const sendTransactionConfirmationEmail = async (
  email: string, 
  details: {
    transactionId: string, 
    amount: number, 
    date: string
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const emailContent = EmailTemplates.transactionConfirmation(email, details);
    return await sendEmail(transporter, emailContent);
  } catch (error) {
    console.error("Error in sendTransactionConfirmationEmail:", error);
    return false;
  }
};

// General Message Email
export const sendGeneralMessageEmail = async (
  email: string, 
  messageDetails: {
    subject: string,
    heading: string,
    message: string,
    ctaText?: string,
    ctaLink?: string
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const emailContent = EmailTemplates.generalMessage(email, messageDetails);
    return await sendEmail(transporter, emailContent);
  } catch (error) {
    console.error("Error in sendGeneralMessageEmail:", error);
    return false;
  }
};