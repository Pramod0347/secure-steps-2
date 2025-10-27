import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(["USER", "LANDLORD" ,"ADMIN"]).default("USER"),
  university: z.string().optional(), // universityId
  department: z.string().optional(),
  program: z.string().optional(),
  graduationYear: z.number().optional(),
  isVerified: z.boolean().default(false),
  followersCount: z.number().default(0),
  followingCount: z.number().default(0),
});

export const FollowSchema = z.object({
  followerId: z.string(),
  followingId: z.string(),
});

export const MessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
  attachments: z.array(z.string()).optional(),
  timestamp: z.date(),
});
