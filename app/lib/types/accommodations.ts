import { z } from "zod";

// Update enums to match Prisma model
export const AccommodationTypeEnum = z.enum([
  'PRIVATE_ROOM',
  'SHARED_ROOM',
  'STUDIO',
  'APARTMENT',
  'HOUSE'
]);

export const FurnishingTypeEnum = z.enum([
  'FURNISHED',
  'UNFURNISHED',
  'PARTIAL'
]);

export const PricingPlanTypeEnum = z.enum([
  'BASIC',
  'PREMIUM',
  'ENTERPRISE'
]);

const PricingPlanSchema = z.object({
  type: z.string(),
  price: z.number().positive()
});

export const AccommodationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: AccommodationTypeEnum,
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  banner: z.string().url(),
  landlordId: z.string().optional(),
  includeBills: z.boolean().optional(),
  deposit: z.number().positive().optional(),
  furnishing: FurnishingTypeEnum.optional(),
  bathrooms: z.number().int().positive(),
  bedrooms: z.number().int().positive(),
  size: z.number().positive().optional(),
  amenities: z.array(z.string()),
  rules: z.array(z.string()),
  images: z.array(z.string().url()),
  availableFrom: z.string(),
  minTerm: z.number().int().positive(),
  maxTerm: z.number().int().positive().optional(),
  isAvailable: z.boolean().default(true),
  pricingPlans: z.array(PricingPlanSchema).min(1)
});

export const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10)
});

export const AccommodationApplicationSchema = z.object({
  accommodationId: z.string(),
  interestedFrom: z.coerce.date(),
  interestedTill: z.coerce.date(),
  numberOfOccupants: z.number().int().positive(),
  additionalNotes: z.string().optional(),
});

export const querySchema = z.object({
  query: z.string().optional().default(''),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  type: AccommodationTypeEnum.optional(),
  minBedrooms: z.coerce.number().optional(),
  includeBills: z.boolean().optional(),
  furnishing: FurnishingTypeEnum.optional(),
});

export type AccommodationType = z.infer<typeof AccommodationTypeEnum>;
export type FurnishingType = z.infer<typeof FurnishingTypeEnum>;
export type PricingPlanType = z.infer<typeof PricingPlanTypeEnum>;
export type Accommodation = z.infer<typeof AccommodationSchema>;