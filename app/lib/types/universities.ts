import { z } from 'zod';

// Enum for University Type
export const UniversityTypeEnum = z.enum(['PUBLIC', 'PRIVATE']);

// Enum for Career Outcome Types
export const CareerOutcomeTypeEnum = z.enum(['SALARY_CHART', 'EMPLOYMENT_RATE_METER', 'COURSE_TIMELINE']);

// Schema for Salary Chart data
const SalaryChartDataSchema = z.object({
  sector: z.string(),
  min: z.number(),
  max: z.number(),
  color: z.string(),
  percentage: z.number()
});

// Schema for Employment Rate Meter data
const EmploymentRateMeterDataSchema = z.object({
  targetRate: z.number(),
  size: z.number()
});

// Schema for Course Timeline data
const CourseTimelineDataSchema = z.object({
  course: z.string()
});

// Updated CareerOutcome schema - removed title and description, all data types are now arrays
const CareerOutcomeSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().optional(),
    type: z.literal('SALARY_CHART'),
    data: z.array(SalaryChartDataSchema)
  }),
  z.object({
    id: z.string().optional(),
    type: z.literal('EMPLOYMENT_RATE_METER'),
    data: z.array(EmploymentRateMeterDataSchema) // Changed to array to match your form
  }),
  z.object({
    id: z.string().optional(),
    type: z.literal('COURSE_TIMELINE'),
    data: z.array(CourseTimelineDataSchema)
  })
]);

export const CourseSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  fees: z.string(),
  duration: z.string(),
  degreeType: z.string(),
  ieltsScore: z.string(),
  ranking: z.string(),
  intake: z.array(z.string()),
  websiteLink: z.string().url().optional(),
  universityId: z.string().optional(),
});

// Define the FAQ schema - id should be string to match Prisma
const FAQSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  answer: z.string(),
});

// Updated UniversitySchema
export const UniversitySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string(),
  location: z.string(),
  country: z.string(),
  website: z.string().url(),
  established: z.coerce.date(),
  banner: z.string(),
  logoUrl: z.string().optional(),
  imageUrls: z.array(z.string()),
  facilities: z.array(z.string()),
  youtubeLink: z.string().nullable().optional(),
  careerOutcomes: z.array(CareerOutcomeSchema).optional(),
  faqs: z.array(FAQSchema).optional(),
  courses: z.array(CourseSchema).optional(),
  applications: z.array(z.any()).optional(),
  loans: z.array(z.any()).optional(),
  users: z.array(z.any()).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Application schemas
export const DocumentSchema = z.object({
  name: z.string(),
  fileUrl: z.string()
});

export const UniversityApplicationSchema = z.object({
  departmentId: z.string(),
  courseId: z.string(),
  documents: z.array(DocumentSchema),
  additionalNotes: z.string().optional(),
  loanRequired: z.boolean().default(false)
});

export type UniversityApplication = z.infer<typeof UniversityApplicationSchema>;

export type DocumentItem = {
  name: string;
  fileUrl: string;
};

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const CreateCourseSchema = CourseSchema.extend({
  departmentId: z.string(),
});

// Query Parameters Schema
export const UniversityQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  includeInactive: z.boolean().optional().default(false),
  sortBy: z.enum(['name', 'established', 'ranking', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  type: UniversityTypeEnum.optional(),
  country: z.string().optional(),
  hasHostel: z.boolean().optional(),
});

// Update Schema (making all fields optional)
export const UniversityUpdateSchema = UniversitySchema.partial();

// Type exports
export type UniversityQuery = z.infer<typeof UniversityQuerySchema>;
export type UniversityUpdate = z.infer<typeof UniversityUpdateSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type CareerOutcome = z.infer<typeof CareerOutcomeSchema>;
export type SalaryChartData = z.infer<typeof SalaryChartDataSchema>;
export type EmploymentRateMeterData = z.infer<typeof EmploymentRateMeterDataSchema>;
export type CourseTimelineData = z.infer<typeof CourseTimelineDataSchema>;