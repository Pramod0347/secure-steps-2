// src/lib/utils/otp.ts
import { OTP_CONSTANTS } from "@/app/lib/constants";
import { PrismaClient } from "@prisma/client";

export function generateOTP(length: number = OTP_CONSTANTS.OTP_LENGTH): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export async function validateOTPAttempts(
  prisma: PrismaClient,
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { otpRetryCount: true, otpBlockedUntil: true },
  });

  if (!user) throw new Error("USER_NOT_FOUND");

  if (user.otpBlockedUntil && user.otpBlockedUntil > new Date()) {
    throw new Error("OTP_BLOCKED");
  }

  if (user.otpRetryCount >= OTP_CONSTANTS.MAX_OTP_ATTEMPTS) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        otpBlockedUntil: new Date(Date.now() + OTP_CONSTANTS.OTP_BLOCK_DURATION),
        otpRetryCount: 0,
      },
    });
    throw new Error("MAX_ATTEMPTS_EXCEEDED");
  }

  return true;
}