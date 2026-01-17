import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { withTransaction } from "@/app/lib/prisma-transaction"
import { UniversitySchema } from "@/app/lib/types/universities"
import { z } from "zod"
import type { Prisma } from "@prisma/client"
import { generateUniversitySlug } from "@/app/utils/generateSlug"

// Define types for pagination
export interface PaginationParams {
  skip: number
  take: number
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const NextUrl = process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const url = new URL(req.url.startsWith("http") ? req.url : `${NextUrl}${req.url}`);

    const searchParams = {
      id: url.searchParams.get("id") ?? undefined,
      name: url.searchParams.get("name") ?? undefined,
      location: url.searchParams.get("location") ?? undefined,
      slug: url.searchParams.get("slug") ?? undefined,
    };
    
    // Country filter for pagination (not for single lookup)
    const countryFilter = url.searchParams.get("country") ?? undefined;

    // Check if lightweight mode is requested (for listing pages - faster response)
    const isLightweight = url.searchParams.get("lightweight") === "true";

    // FULL INCLUDE - for single university detail pages
    const fullIncludeClause = {
      courses: true,
      applications: true,
      loans: true,
      users: true,
      careerOutcomes: {
        include: {
          salaryChartData: true,
          employmentRateMeter: true,
          courseTimelineData: true,
        },
      },
      faqs: true,
    };

    // LIGHTWEIGHT SELECT - for listing pages (only fields needed for cards)
    // This dramatically reduces data transfer and DB query time
    const lightweightSelectClause = {
      id: true,
      name: true,
      slug: true,
      banner: true,
      location: true,
      country: true,
      createdAt: true,
      courses: {
        select: {
          id: true,
          name: true,
          fees: true,
        },
      },
    };

    // Handle specific search parameters (single university lookup - always full data)
    if (Object.values(searchParams).some(Boolean)) {
      const whereClause: Prisma.UniversityWhereInput = {
        ...(searchParams.id && { id: searchParams.id }),
        ...(searchParams.name && { name: { contains: searchParams.name, mode: "insensitive" } }),
        ...(searchParams.location && { location: { contains: searchParams.location, mode: "insensitive" } }),
        ...(searchParams.slug && { slug: searchParams.slug }),
      };


      const universities = await prisma.university.findMany({
        where: whereClause,
        include: fullIncludeClause, // Always use full include for single lookups
      });


      if (universities.length === 0) {
        return NextResponse.json({ error: "No universities found" }, { status: 404 });
      }

      // When querying by ID or slug, return the single university object directly
      if (searchParams.id || searchParams.slug) {
        return NextResponse.json(universities[0]);
      } else {
        // For other filter params, return the array of universities
        return NextResponse.json({ universities });
      }
    }

    // Handle pagination queries
    const querySchema = z.object({
      query: z.string().optional().default(""),
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    });

    try {
      const { query, page, limit } = querySchema.parse({
        query: url.searchParams.get("query") || "",
        page: url.searchParams.get("page") || "1",
        limit: url.searchParams.get("limit") || "10",
      });


      const skip = (page - 1) * limit;
      
      // Build where clause with query search and country filter
      let whereClause: Prisma.UniversityWhereInput = {};
      
      // Add text search if query provided
      if (query) {
        whereClause.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ];
      }
      
      // Add country filter if provided
      if (countryFilter) {
        whereClause.country = { contains: countryFilter, mode: "insensitive" };
      }


      const [universities, total] = await Promise.all([
        isLightweight 
          ? prisma.university.findMany({
              where: whereClause,
              select: lightweightSelectClause, // Use select for lightweight (faster)
              skip,
              take: limit,
              orderBy: { createdAt: "desc" },
            })
          : prisma.university.findMany({
              where: whereClause,
              include: fullIncludeClause, // Use include for full data
              skip,
              take: limit,
              orderBy: { createdAt: "desc" },
            }),
        prisma.university.count({ where: whereClause }),
      ]);

      const pages = Math.ceil(total / limit) || 1; // At least 1 page even if empty

      // Validate page number
      if (page > pages && total > 0) {
        return NextResponse.json(
          {
            error: "Page number exceeds total pages",
            message: `Requested page ${page} but only ${pages} page(s) available`,
            pagination: { total, pages, page, limit },
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        universities,
        pagination: { 
          total, 
          pages, 
          page, 
          limit,
          hasNextPage: page < pages,
          hasPreviousPage: page > 1,
        },
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        // Provide more helpful error messages
        const limitError = validationError.errors.find(e => e.path.includes('limit'))
        if (limitError) {
          return NextResponse.json(
            { 
              error: "Invalid limit parameter",
              message: `Limit must be between 1 and 100. Default is 10. You provided: ${url.searchParams.get("limit")}`,
              details: validationError.errors 
            }, 
            { status: 400 }
          );
        }
        return NextResponse.json(
          { 
            error: "Invalid query parameters", 
            message: "Please check your query parameters. Page must be a positive integer, limit must be between 1 and 100.",
            details: validationError.errors 
          }, 
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("[GET_UNIVERSITIES_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query parameters", details: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to fetch universities", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()


    if (!body || Object.keys(body).length === 0) {
      throw new Error("Request body is empty")
    }

    const careerOutcomeData = (body as any).careerOutcomeData

    // Make sure UniversitySchema includes youtubeLink validation
    const validatedData = UniversitySchema.parse(body)


    const establishedDate = new Date(validatedData.established)

    if (isNaN(establishedDate.getTime())) {
      throw new Error("Invalid establishment date")
    }

    const existing = await prisma.university.findFirst({
      where: {
        name: validatedData.name,
        website: validatedData.website,
      },
    })

    if (existing) {
      throw new Error("University already exists.")
    }

    // Generate slug based on university name and location
    const slug = generateUniversitySlug(validatedData.name, validatedData.location)

    // Check if slug already exists to prevent duplicates
    const existingSlug = await prisma.university.findFirst({
      where: {
        slug,
      },
    })

    // If slug exists, append a unique identifier
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug

    // Use transaction to create university with courses and career outcomes
    // Use withTransaction wrapper for consistent timeout handling in production
    const university = await withTransaction(async (tx) => {
      // Create the university first
      const createdUniversity = await tx.university.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          location: validatedData.location,
          country: validatedData.country,
          website: validatedData.website,
          established: establishedDate,
          banner: validatedData.banner,
          logoUrl: validatedData.logoUrl,
          imageUrls: validatedData.imageUrls,
          facilities: validatedData.facilities,
          youtubeLink: validatedData.youtubeLink,
          slug: finalSlug,
          courses: {
            create: validatedData.courses?.map((course) => ({
              name: course.name,
              description: course.description,
              fees: course.fees,
              duration: course.duration,
              degreeType: course.degreeType,
              ieltsScore: course.ieltsScore,
              ranking: course.ranking,
              intake: course.intake,
              websiteLink: course.websiteLink,
            })) || [],
          },
        },
        include: {
          courses: true,
        },
      })

      // Create career outcomes if provided
      if (careerOutcomeData && 
          (careerOutcomeData.salaryChartData?.length > 0 ||
           careerOutcomeData.employmentRateMeterData ||
           careerOutcomeData.courseTimelineData?.length > 0)) {
        
        
        // Determine the type based on what data is provided
        // Priority: SALARY_CHART > EMPLOYMENT_RATE_METER > COURSE_TIMELINE
        // This is because a single CareerOutcome can have all three types of data
        let outcomeType: 'SALARY_CHART' | 'EMPLOYMENT_RATE_METER' | 'COURSE_TIMELINE' = 'SALARY_CHART'
        
        const hasValidSalaryData = careerOutcomeData.salaryChartData?.length > 0 && 
          careerOutcomeData.salaryChartData.some((item: any) => 
            item && item.sector && item.sector.trim() !== ''
          )
        const hasEmploymentData = careerOutcomeData.employmentRateMeterData && 
          typeof careerOutcomeData.employmentRateMeterData.targetRate === 'number'
        const hasTimelineData = careerOutcomeData.courseTimelineData?.length > 0 &&
          careerOutcomeData.courseTimelineData.some((item: any) => 
            item && item.course && item.course.trim() !== ''
          )
        
        if (hasValidSalaryData) {
          outcomeType = 'SALARY_CHART'
        } else if (hasEmploymentData) {
          outcomeType = 'EMPLOYMENT_RATE_METER'
        } else if (hasTimelineData) {
          outcomeType = 'COURSE_TIMELINE'
        }

        // Create the main CareerOutcome record
        const careerOutcome = await tx.careerOutcome.create({
          data: {
            universityId: createdUniversity.id,
            type: outcomeType,
          },
        })


        // Create salary chart data if provided
        if (careerOutcomeData.salaryChartData && Array.isArray(careerOutcomeData.salaryChartData)) {
          const validSalaryData = careerOutcomeData.salaryChartData.filter((item: any) => {
            const isValid = item && 
                   typeof item.sector === 'string' && item.sector.trim() !== '' &&
                   typeof item.min === 'number' && !isNaN(item.min) &&
                   typeof item.max === 'number' && !isNaN(item.max) &&
                   typeof item.color === 'string' && item.color.trim() !== '' &&
                   typeof item.percentage === 'number' && !isNaN(item.percentage)
            return isValid
          })

          if (validSalaryData.length > 0) {
            await tx.salaryChartData.createMany({
              data: validSalaryData.map((item: any) => ({
                sector: item.sector.trim(),
                min: item.min,
                max: item.max,
                color: item.color.trim(),
                percentage: item.percentage,
                careerOutcomeId: careerOutcome.id
              }))
            })
          }
        }

        // Create employment rate meter data if provided
        if (careerOutcomeData.employmentRateMeterData) {
          const empData = careerOutcomeData.employmentRateMeterData
          
          if (typeof empData.targetRate === 'number' && !isNaN(empData.targetRate) &&
              typeof empData.size === 'number' && !isNaN(empData.size)) {
            
            await tx.employmentRateMeterData.create({
              data: {
                targetRate: empData.targetRate,
                size: empData.size,
                careerOutcomeId: careerOutcome.id
              }
            })
          }
        }

        // Create course timeline data if provided
        if (careerOutcomeData.courseTimelineData && Array.isArray(careerOutcomeData.courseTimelineData)) {
          const validTimelineData = careerOutcomeData.courseTimelineData.filter((item: any) => {
            return item && typeof item.course === 'string' && item.course.trim() !== ''
          })

          if (validTimelineData.length > 0) {
            await tx.courseTimelineData.createMany({
              data: validTimelineData.map((item: any) => ({
                course: item.course.trim(),
                careerOutcomeId: careerOutcome.id
              }))
            })
          }
        }
        
      } else {
      }

      // Return university with all relations
      return await tx.university.findUnique({
        where: { id: createdUniversity.id },
        include: {
          courses: true,
          careerOutcomes: {
            include: {
              salaryChartData: true,
              employmentRateMeter: true,
              courseTimelineData: true,
            },
          },
        },
      })
    })


    return NextResponse.json(university, { status: 201 })
  } catch (error) {
    console.error("[POST_UNIVERSITY_ERROR]", error)

    let errorMessage = "An unknown error occurred"
    let errorDetails = null

    if (error instanceof z.ZodError) {
      errorMessage = "Validation failed"
      errorDetails = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }))
    } else if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    } else if (error !== null && typeof error === "object") {
      errorMessage = "An error object was thrown"
      errorDetails = JSON.stringify(error)
    }

    console.error("Error details:", errorMessage, errorDetails)

    return NextResponse.json(
      {
        error: "Failed to create university",
        message: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Log the entire request body for debugging

    // More robust URL parsing
    let id: string | null = null;
    try {
      const NextUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const url = new URL(req.url.startsWith("http") ? req.url : `${NextUrl}${req.url}`);
      id = url.searchParams.get("id");
    } catch (urlError) {
      console.error("URL parsing error:", urlError);
      return NextResponse.json({ error: "Failed to parse URL", details: String(urlError) }, { status: 400 });
    }

    if (!id) {
      console.error("Missing university ID in request");
      return NextResponse.json({ error: "University ID is required" }, { status: 400 });
    }

    // Log the university lookup attempt

    // First check if the university exists with detailed logging
    try {
      const existingUniversity = await prisma.university.findUnique({
        where: { id },
      });


      if (!existingUniversity) {
        return NextResponse.json({ error: `University with ID ${id} not found` }, { status: 404 });
      }


      // IMPORTANT: Check for youtubeLink in the request body BEFORE validation
      const hasYoutubeLinkField = 'youtubeLink' in body;

      // Validate the request body
      const validatedData = UniversitySchema.partial().parse(body);

      // Process established date if provided
      let establishedDate = undefined;
      if (validatedData.established) {
        try {
          // Handle the date based on its type
          if (typeof validatedData.established === "string") {
            // If it's already an ISO string, parse it directly
            establishedDate = new Date(validatedData.established);
          } else if (validatedData.established instanceof Date) {
            // If it's already a Date object
            establishedDate = validatedData.established;
          } else {
            throw new Error(`Unexpected date format type: ${typeof validatedData.established}`);
          }
        } catch (dateError) {
          return NextResponse.json(
            {
              error: "Invalid establishment date format",
              dateValue: validatedData.established,
              details: String(dateError),
            },
            { status: 400 }
          );
        }
      }

      // Slug handling
      let slug = existingUniversity.slug;
      if (
        (validatedData.name && validatedData.name !== existingUniversity.name) ||
        (validatedData.location && validatedData.location !== existingUniversity.location)
      ) {
        const nameForSlug = validatedData.name || existingUniversity.name;
        const locationForSlug = validatedData.location || existingUniversity.location;
        slug = generateUniversitySlug(nameForSlug, locationForSlug);

        const existingSlug = await prisma.university.findFirst({
          where: {
            slug,
            NOT: { id },
          },
        });

        if (existingSlug) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
      }


      // Build update data object - with special handling for youtubeLink
      const updateData = {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.location !== undefined && { location: validatedData.location }),
        ...(validatedData.country !== undefined && { country: validatedData.country }),
        ...(validatedData.website !== undefined && { website: validatedData.website }),
        ...(establishedDate !== undefined && { established: establishedDate }),
        ...(validatedData.banner !== undefined && { banner: validatedData.banner }),
        ...(validatedData.logoUrl !== undefined && { logoUrl: validatedData.logoUrl }),
        ...(validatedData.imageUrls !== undefined && { imageUrls: validatedData.imageUrls }),
        ...(validatedData.facilities !== undefined && { facilities: validatedData.facilities }),
        
        // CRITICAL FIX: Force include youtubeLink if it exists in the original request body
        ...(hasYoutubeLinkField && { youtubeLink: body.youtubeLink }),
        
        ...(slug !== existingUniversity.slug && { slug }),
        updatedAt: new Date(),
      };

      // Added to verify youtubeLink is included in update data

      // Handle courses separately
      if (validatedData.courses && Array.isArray(validatedData.courses)) {
        // Get existing courses for this university
        const existingCourses = await prisma.course.findMany({
          where: { universityId: id },
        });

        const existingCourseIds = existingCourses.map((course) => course.id);

        // Process courses individually for better error handling
        for (const course of validatedData.courses) {
          if (course.id && existingCourseIds.includes(course.id)) {
            // Update existing course
            await prisma.course.update({
              where: { id: course.id },
              data: {
                name: course.name,
                description: course.description,
                fees: course.fees,
                duration: course.duration,
                degreeType: course.degreeType,
                ieltsScore: course.ieltsScore,
                ranking: course.ranking,
                intake: course.intake,
                websiteLink: course.websiteLink,
              },
            });
          } else {
            // Create new course
            await prisma.course.create({
              data: {
                name: course.name,
                description: course.description,
                fees: course.fees,
                duration: course.duration,
                degreeType: course.degreeType,
                ieltsScore: course.ieltsScore,
                ranking: course.ranking,
                intake: course.intake,
                websiteLink: course.websiteLink,
                universityId: id,
              },
            });
          }
        }

        // Handle course deletion for courses not in the update list
        if (validatedData.courses.length > 0) {
          const updatedCourseIds = validatedData.courses.filter((course) => course.id).map((course) => course.id);

          const courseIdsToDelete = existingCourseIds.filter((existingId) => !updatedCourseIds.includes(existingId));

          if (courseIdsToDelete.length > 0) {
            await prisma.course.deleteMany({
              where: {
                id: {
                  in: courseIdsToDelete,
                },
              },
            });
          }
        }
      }

      // Perform the university update
      const updatedUniversity = await prisma.university.update({
        where: { id },
        data: updateData,
        include: {
          courses: true,
        },
      });

      return NextResponse.json(updatedUniversity);
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return NextResponse.json(
        {
          error: "Database operation failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
          stack: dbError instanceof Error ? dbError.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[PUT_UNIVERSITY_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update university",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url, `http://${req.headers.get("host")}`)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "University ID is required" }, { status: 400 })
    }

    // Check if university exists first
    const university = await prisma.university.findUnique({
      where: { id },
    })

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    // Use transaction to delete all related records in correct order
    await prisma.$transaction(
      async (tx) => {
        // 1. Get career outcomes and delete nested data first
        const careerOutcomes = await tx.careerOutcome.findMany({
          where: { universityId: id },
          select: { id: true },
        })
        
        const careerOutcomeIds = careerOutcomes.map((co) => co.id)
        
        if (careerOutcomeIds.length > 0) {
          // Delete salary chart data
          await tx.salaryChartData.deleteMany({
            where: { careerOutcomeId: { in: careerOutcomeIds } },
          })

          // Delete employment rate meter data
          await tx.employmentRateMeterData.deleteMany({
            where: { careerOutcomeId: { in: careerOutcomeIds } },
          })

          // Delete course timeline data
          await tx.courseTimelineData.deleteMany({
            where: { careerOutcomeId: { in: careerOutcomeIds } },
          })

          // Delete career outcomes
          await tx.careerOutcome.deleteMany({
            where: { universityId: id },
          })
        }

        // 2. Delete university applications
        await tx.universityApplications.deleteMany({
          where: { universityId: id },
        })

        // 3. Delete or update loans (set universityId to null)
        await tx.loan.updateMany({
          where: { universityId: id },
          data: { universityId: null },
        })

        // 4. Update users (set universityId to null)
        await tx.user.updateMany({
          where: { universityId: id },
          data: { universityId: null },
        })

        // 5. Delete courses (will cascade, but explicit for clarity)
        await tx.course.deleteMany({
          where: { universityId: id },
        })

        // 6. FAQs will cascade automatically, but delete explicitly for clarity
        await tx.faq.deleteMany({
          where: { universityId: id },
        })

        // 7. Finally delete the university
        await tx.university.delete({
          where: { id },
        })
      },
      {
        maxWait: 30000,
        timeout: 30000,
      }
    )

    return NextResponse.json({ message: "University deleted successfully" })
  } catch (error) {
    console.error("[DELETE_UNIVERSITY_ERROR]", error)

    return NextResponse.json(
      {
        error: "Failed to delete university",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}