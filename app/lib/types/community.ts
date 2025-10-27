import { z } from "zod";
// import { GroupPrivacy, GroupMemberRole } from "@prisma/client";

// post types
export const PostSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content cannot be empty"),
  type: z.enum(["ARTICLE", "QUESTION", "DISCUSSION", "EVENT", "RESOURCE"]),
  images: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  communityId: z.string(),
  tags: z.array(z.string()).optional(),
});

// community types
export const CommunitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["public", "private"]),
  avatar: z.string().optional(),
  banner: z.string().optional(),
});

// Group Creation/Update Schema
export const GroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Group name must be at least 3 characters")
    .max(100, "Group name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric with hyphens"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  banner: z.string().url().optional(),
  logo: z.string().url().optional(),
  privacy: z.enum(["PUBLIC", "PRIVATE", "RESTRICTED"]).default("PUBLIC"),
  isPinned: z.boolean().optional().default(false),
});

// Group Member Management Schema
export const GroupMemberActionSchema = z.object({
  groupId: z.string().trim().min(1, "Group ID is required"),
  userId: z.string().trim().min(1, "User ID is required"),
  action: z.enum(["ADD", "REMOVE", "BLOCK", "UNBLOCK", "CHANGE_ROLE"]),
  role: z.enum(["MEMBER", "MODERATOR", "ADMIN", "OWNER"]).optional(),
});

// Group Search and Filtering Schema
export const GroupSearchSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  privacy: z.enum(["PUBLIC", "PRIVATE", "RESTRICTED"]).optional(),
  sortBy: z
    .enum(["createdAt", "name", "followersCount"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  createdById: z.string().trim().min(1, "creator ID is required").optional(),
  minMembers: z.number().default(1),
  maxMembers: z.number().default(10),
});

// Event Schema Validation
export const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  slug: z.string().min(3,"Slug must be at least 3 characters"),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  image: z.string().url().optional(),
  location: z.string().min(3, "Location must be specified"),
  eventType: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).default("ONLINE"),
  registrationType: z.enum(["FREE", "PAID", "INVITE_ONLY"]).default("FREE"),
  totalSlots: z.number().int().min(1, "Total slots must be at least 1"),
  waitlistSlots: z.number().int().optional(),
  ticketPrice: z.number().optional(),
  currency: z.string().optional(),
  address: z.string().optional(),
  virtualLink: z.string().url().optional(),
  groupId: z.string(),
});

// Event Search Schema
export const EventSearchSchema = z.object({
  query: z.string().optional(),
  slug:z.string().min(1,"Slug must not be empty").optional(),
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("10"),
  startDate:z.date().optional(),
  endDate:z.date().optional(),
  groupId: z.string().optional(),
  eventType: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  sortBy: z.enum(["date", "title", "registeredSlots"]).optional().default("date"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

export const EventRegistration = z.object({
  eventId: z.string().trim().min(1, "Event ID is required"),
});


// Update Schemas for Forum-related entities
export const UpdateForumSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
  type: z.enum(["DISCUSSION", "Q_AND_A", "SUPPORT"]).optional(),
  privacy: z.enum(["GROUP", "MEMBERS_ONLY", "PRIVATE", "PUBLIC"]).optional(),
});

export const UpdateTopicSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").optional(),
  type: z.enum(["DISCUSSION", "ANNOUNCEMENT", "POLL"]).optional(),
  isPinned: z.boolean().optional(),
  isClosed: z.boolean().optional(),
});

export const UpdatePostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty").optional(),
  attachments: z.array(z.string()).optional(),
});

// Comprehensive Schema Validations
export const ForumSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  groupId: z.string().cuid(),
  type: z.enum(["DISCUSSION", "Q_AND_A", "SUPPORT"]).optional().default("DISCUSSION"),
  privacy: z.enum(["GROUP", "MEMBERS_ONLY", "PRIVATE", "PUBLIC"]).optional().default("GROUP"),
});

export const ForumTopicSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  forumId: z.string().cuid(),
  type: z.enum(["DISCUSSION", "ANNOUNCEMENT", "POLL"]).optional().default("DISCUSSION"),
  isPinned: z.boolean().optional().default(false),
});

export const ForumPostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty"),
  topicId: z.string().cuid(),
  parentPostId: z.string().cuid().optional(),
  attachments: z.array(z.string()).optional(),
});

export const ForumSearchSchema = z.object({
  groupId: z.string().cuid().optional(),
  type: z.enum(["DISCUSSION", "Q_AND_A", "SUPPORT"]).optional(),
  privacy: z.enum(["GROUP", "MEMBERS_ONLY", "PRIVATE", "PUBLIC"]).optional(),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  query: z.string().optional(),
});

export interface DocumentItem {
  name: string;
  file: File;
}

export interface FormProps {
  isOpen: boolean;
  onClose: () => void;
}
