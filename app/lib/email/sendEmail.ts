import { Resend } from "resend";
import { EmailContentType } from "./types";
import { EmailTemplates } from "./emailTemplate";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

const getResendClient = (): Resend => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(resendApiKey);
};

export const sendEmail = async (emailContent: EmailContentType): Promise<boolean> => {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailContent.to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (result?.error) {
      console.error("Resend returned error:", result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    return false;
  }
};

export const sendVerificationEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const emailContent = EmailTemplates.verificationOTP(email, otp);
    return await sendEmail(emailContent);
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, username: string): Promise<boolean> => {
  try {
    const emailContent = EmailTemplates.welcomeEmail(email, username);
    return await sendEmail(emailContent);
  } catch (error) {
    console.error("Error in sendWelcomeEmail:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<boolean> => {
  try {
    const emailContent = EmailTemplates.passwordReset(email, resetLink);
    return await sendEmail(emailContent);
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    return false;
  }
};

export const sendTransactionConfirmationEmail = async (
  email: string,
  details: {
    transactionId: string,
    amount: number,
    date: string
  }
): Promise<boolean> => {
  try {
    const emailContent = EmailTemplates.transactionConfirmation(email, details);
    return await sendEmail(emailContent);
  } catch (error) {
    console.error("Error in sendTransactionConfirmationEmail:", error);
    return false;
  }
};

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
    const emailContent = EmailTemplates.generalMessage(email, messageDetails);
    return await sendEmail(emailContent);
  } catch (error) {
    console.error("Error in sendGeneralMessageEmail:", error);
    return false;
  }
};
