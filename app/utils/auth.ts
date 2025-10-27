// lib/utils/auth.ts
import { compare } from "bcryptjs";
import crypto from "crypto";

// lib/utils/auth.ts

export async function generateToken(length: number): Promise<string> {
  // Use Web Crypto API
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);

  // Convert buffer to a hexadecimal string
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}


export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!password || !hashedPassword) {
    throw new Error("Password and hashed password are required");
  }
  return compare(password, hashedPassword);
};


export function generateOTP(length: number = 6): string {
  try {
    // Validate input
    if (length < 1 || length > 10) {
      throw new Error("OTP length must be between 1 and 10 digits");
    }

    // Use crypto for more secure random numbers
    const buffer = crypto.randomBytes(4);
    const num = buffer.readUInt32BE(0);
    
    // Calculate min and max values for the desired length
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    
    // Generate OTP within range and pad with zeros if necessary
    const otp = (min + (num % (max - min + 1))).toString();
    return otp.padStart(length, '0');
  } catch (error) {
    console.error('OTP generation error:', error);
    throw error;
  }
}
