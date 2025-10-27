import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { AccommodationSchema } from "@/app/lib/types/accommodations";
import { stringToDate } from "@/app/utils/date";
import getHeaderOrCookie from "@/app/utils/getCookies";


// Enhanced query schema with more filter options
const enhancedQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  type: z.enum(['PRIVATE_ROOM', 'SHARED_ROOM', 'STUDIO', 'APARTMENT', 'HOUSE']).optional(),
  minBedrooms: z.coerce.number().optional(),
  maxBedrooms: z.coerce.number().optional(),
  minBathrooms: z.coerce.number().optional(),
  maxBathrooms: z.coerce.number().optional(),
  includeBills: z.coerce.boolean().optional(),
  furnishing: z.enum(['FURNISHED', 'UNFURNISHED', 'PARTIAL']).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  landlordId: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(['price', 'createdAt', 'bedrooms', 'bathrooms']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isAvailable: z.coerce.boolean().optional(),
});

// Pagination helper
const paginate = (page: number, limit: number) => ({
  skip: Math.max(0, (page - 1) * limit),
  take: limit,
});

// GET handler with enhanced filtering
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    // Single Accommodation Fetch with detailed information
    if (id) {
      const accommodation = await prisma.accommodation.findUnique({
        where: { id },
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              email: true,
              phoneNumber: true,
              isLandlordVerified: true,
            }
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          pricingPlans: true,
        }
      });

      if (!accommodation) {
        return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
      }

      return NextResponse.json(accommodation);
    }

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const {
      query, page, limit, minPrice, maxPrice, type,
      minBedrooms, maxBedrooms, minBathrooms, maxBathrooms,
      includeBills, furnishing, city, country, landlordId,
      amenities, sortBy, sortOrder, isAvailable
    } = enhancedQuerySchema.parse({
      ...queryParams,
      amenities: queryParams.amenities ? JSON.parse(queryParams.amenities) : undefined,
    });

    // Build where clause dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      AND: [
        // Text search across multiple fields
        query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { country: { contains: query, mode: 'insensitive' } },
            { 
              landlord: {
                OR: [
                  { name: { contains: query, mode: 'insensitive' } },
                  { username: { contains: query, mode: 'insensitive' } },
                ]
              }
            }
          ]
        } : {},
        // Price range
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
        // Property type
        type ? { type } : {},
        // Rooms
        minBedrooms !== undefined ? { bedrooms: { gte: minBedrooms } } : {},
        maxBedrooms !== undefined ? { bedrooms: { lte: maxBedrooms } } : {},
        minBathrooms !== undefined ? { bathrooms: { gte: minBathrooms } } : {},
        maxBathrooms !== undefined ? { bathrooms: { lte: maxBathrooms } } : {},
        // Additional filters
        includeBills !== undefined ? { includeBills } : {},
        furnishing ? { furnishing } : {},
        city ? { city: { contains: city, mode: 'insensitive' } } : {},
        country ? { country: { contains: country, mode: 'insensitive' } } : {},
        landlordId ? { landlordId } : {},
        amenities?.length ? { amenities: { hasEvery: amenities } } : {},
        isAvailable !== undefined ? { isAvailable } : {},
      ]
    };

    // Execute query with pagination and sorting
    const [accommodations, total] = await Promise.all([
      prisma.accommodation.findMany({
        where: whereClause,
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              isLandlordVerified: true,
            }
          },
          pricingPlans: true,
          _count: {
            select: {
              reviews: true,
            }
          }
        },
        ...paginate(page, limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.accommodation.count({ where: whereClause })
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      accommodations,
      pagination: {
        total,
        pages,
        page,
        limit,
      }
    });

  } catch (error) {
    console.error("[GET_ACCOMMODATIONS_ERROR]", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch accommodations" },
      { status: 500 }
    );
  }
}

// POST handler with simplified auth
export async function POST(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "x-user-id");

    console.log("userId :",userId);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify user is a landlord
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    console.log("user :",user);

    if (!user ) {
      return NextResponse.json(
        { error: "Only landlords can create accommodations" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = AccommodationSchema.parse(body);

    const accommodation = await prisma.accommodation.create({
      data: {
        ...validatedData,
        availableFrom: stringToDate(validatedData.availableFrom),
        pricingPlans: {
          create: validatedData.pricingPlans.map(plan => ({
            type: plan.type,
            price: plan.price,
          })),
        },
        landlordId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
    

    return NextResponse.json(accommodation, { status: 201 });
  } catch (error) {
    console.error("[POST_ACCOMMODATION_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create accommodation" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Accommodation ID is required" },
        { status: 400 }
      );
    }

    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      select: { landlordId: true }
    });

    if (!accommodation || accommodation.landlordId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this accommodation" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = AccommodationSchema.partial().parse(body);

    // Separate out pricing plans if they exist
    const { pricingPlans, ...updateData } = validatedData;

    const updated = await prisma.accommodation.update({
      where: { id },
      data: {
        ...updateData,
        availableFrom: updateData.availableFrom ? stringToDate(updateData.availableFrom) : undefined,
        updatedAt: new Date(),
        // Handle pricing plans update
        ...(pricingPlans && {
          pricingPlans: {
            deleteMany: {}, // Delete existing pricing plans
            create: pricingPlans.map(plan => ({
              type: plan.type,
              price: plan.price,
            })),
          }
        }),
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          }
        },
        pricingPlans: true,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT_ACCOMMODATION_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update accommodation" },
      { status: 500 }
    );
  }
}

// DELETE handler with cascade delete
export async function DELETE(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Accommodation ID is required" },
        { status: 400 }
      );
    }

    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      select: { landlordId: true }
    });

    if (!accommodation || accommodation.landlordId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this accommodation" },
        { status: 403 }
      );
    }

    // Delete accommodation and all related records (reviews, applications, etc.)
    await prisma.$transaction([
      prisma.accommodationReview.deleteMany({ where: { accommodationId: id } }),
      prisma.accommodationApplication.deleteMany({ where: { accommodationId: id } }),
      prisma.accommodation.delete({ where: { id } })
    ]);

    return NextResponse.json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    console.error("[DELETE_ACCOMMODATION_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to delete accommodation" },
      { status: 500 }
    );
  }
}