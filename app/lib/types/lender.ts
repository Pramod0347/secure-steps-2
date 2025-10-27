import { z } from "zod";

// Loan Validation Schema
export const LoanSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.number().positive("Amount must be a positive number"),
  interestRate: z.number().min(0, "Interest rate must be non-negative"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  eligibilityCriteria: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  deadline: z.string(),
  isActive: z.boolean().optional(),
});

export const LoanApplicationSchema = z.object({
  loanId: z.string(),
  userId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "UNDER_REVIEW"]),
  documents: z.array(z.string()),
  academicInfo: z.object({
    gpa: z.number().min(0).max(4),
    semester: z.number().positive(),
    program: z.string(),
  }),
  financialInfo: z.object({
    monthlyIncome: z.number().optional(),
    otherLoans: z.boolean(),
    collateral: z.string().optional(),
  }),
  notes: z.string().optional(),
});


export const ArticleSchema = z.object({
    title: z.string().min(5).max(255),
    description: z.string().optional(),
    content: z.string().min(10),
    bannerImg: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    type: z.enum(['COMMUNITY', 'LENDERS']),
    status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
    creatorId: z.string().cuid(),
    communityId: z.string().cuid().optional()
});

export const ArticleUpdateSchema = ArticleSchema.partial();

export const ArticleFilterSchema = z.object({
    query: z.string().optional(),
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
    type: z.enum(['COMMUNITY', 'LENDERS']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    sortBy: z.enum(['createdAt', 'upVotes', 'views']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});