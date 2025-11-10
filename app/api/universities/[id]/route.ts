import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { UniversitySchema } from "@/app/lib/types/universities"
import { z } from "zod"
import { generateUniversitySlug } from "@/app/utils/generateSlug"

export async function GET(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    // Access id correctly by awaiting params
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "University ID is required" }, { status: 400 })
    }

    const university = await prisma.university.findUnique({
      where: { id: String(id) },
      include: {
        courses: true,
        applications: true,
        loans: true,
        users: true,
        faqs: true,
        careerOutcomes: {
          include: {
            salaryChartData: true,
            employmentRateMeter: true,
            courseTimelineData: true,
          },
        },
      },
    });


    if (!university) {
      return NextResponse.json({ error: `University with ID ${id} not found` }, { status: 404 })
    }

    console.log("✅ University found before return:", university.name)

    return NextResponse.json(university)
  } catch (error) {
    console.error("[GET_UNIVERSITY_BY_ID_ERROR]", error)

    return NextResponse.json(
      { error: "Failed to fetch university", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// Fixed PUT method for handling single CareerOutcome with multiple data types
export async function PUT(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) {
      console.error("No ID provided in params");
      return NextResponse.json({ error: "University ID is required" }, { status: 400 });
    }

    const body = await req.json();
    console.log(`Updating university with ID: ${id}`);
    console.log('Request body:', JSON.stringify(body, null, 2));

    // First check if the university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id },
      include: {
        courses: true,
        careerOutcomes: {
          include: {
            salaryChartData: true,
            employmentRateMeter: true,
            courseTimelineData: true,
          }
        },
        faqs: true
      },
    });

    if (!existingUniversity) {
      console.error(`University with ID ${id} not found`);
      return NextResponse.json({ error: `University with ID ${id} not found` }, { status: 404 });
    }

    console.log("Existing university found:", existingUniversity.name);

    // Validate the request body
    const processedBody = { ...body };

    // Handle null image fields in courses
    if (processedBody.courses && Array.isArray(processedBody.courses)) {
      processedBody.courses = processedBody.courses.map((course: any) => ({
        ...course,
        image: course.image || "",
      }));
    }

    let validatedData;
    try {
      validatedData = UniversitySchema.partial().parse(processedBody);
      console.log("Validation successful");
    } catch (validationError) {
      console.error("Validation error:", validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validationError.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Process established date if provided
    let establishedDate: Date | undefined = undefined;
    if (validatedData.established !== undefined) {
      try {
        const establishedValue = validatedData.established;

        if (typeof establishedValue === "string") {
          const trimmed = establishedValue;

          if (trimmed === "") {
            establishedDate = undefined;
          } else if (/^\d{4}$/.test(trimmed)) {
            const year = parseInt(trimmed, 10);
            if (year < 1000 || year > new Date().getFullYear() + 10) {
              throw new Error("Invalid year range");
            }
            establishedDate = new Date(year, 0, 1);
          } else {
            establishedDate = new Date(trimmed);
            if (isNaN(establishedDate.getTime())) {
              throw new Error("Invalid date format");
            }
          }
        } else if (typeof establishedValue === "number") {
          if (establishedValue < 1000 || establishedValue > new Date().getFullYear() + 10) {
            throw new Error("Invalid year range");
          }
          establishedDate = new Date(establishedValue, 0, 1);
        } else if (establishedValue instanceof Date) {
          establishedDate = establishedValue;
        } else {
          throw new Error("Invalid date type");
        }

        console.log("Processed establishment date:", establishedDate);
      } catch (dateError) {
        console.error("Date processing error:", dateError);
        const errorMessage = dateError instanceof Error ? dateError.message : "Invalid date format";
        return NextResponse.json({
          error: `Invalid establishment date: ${errorMessage}`
        }, { status: 400 });
      }
    }

    // Slug handling (keeping existing logic)
    let slug = existingUniversity.slug || "";
    if (
      (validatedData.name && validatedData.name !== existingUniversity.name) ||
      (validatedData.location && validatedData.location !== existingUniversity.location)
    ) {
      const nameForSlug = validatedData.name || existingUniversity.name;
      const locationForSlug = validatedData.location || existingUniversity.location;

      slug = generateUniversitySlug(nameForSlug, locationForSlug);
      console.log(`Generated new slug: ${slug}`);

      const existingSlug = await prisma.university.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
        console.log(`Slug conflict resolved, new slug: ${slug}`);
      }
    }

    // Build update data object only with DIRECT university fields
    const updateData: Record<string, any> = {};

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.country !== undefined) updateData.country = validatedData.country;
    if (validatedData.website !== undefined) updateData.website = validatedData.website;
    if (establishedDate !== undefined) updateData.established = establishedDate;
    if (validatedData.banner !== undefined) updateData.banner = validatedData.banner;
    if (validatedData.logoUrl !== undefined) updateData.logoUrl = validatedData.logoUrl;
    if (validatedData.imageUrls !== undefined) updateData.imageUrls = validatedData.imageUrls;
    if (validatedData.facilities !== undefined) updateData.facilities = validatedData.facilities;
    if (validatedData.youtubeLink !== undefined) updateData.youtubeLink = validatedData.youtubeLink;

    if (slug !== existingUniversity.slug) {
      updateData.slug = slug;
    }

    console.log("Final update data:", JSON.stringify(updateData, null, 2));

    // Handle database operations in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Handle course deletion first if specified
      if (body._deleteCourses && Array.isArray(body._deleteCourses) && body._deleteCourses.length > 0) {
        console.log(`Deleting courses:`, body._deleteCourses);
        const deleteResult = await tx.course.deleteMany({
          where: {
            id: { in: body._deleteCourses },
            universityId: id,
          },
        });
        console.log(`Deleted ${deleteResult.count} courses`);
      }

      // Handle Career Outcomes - CORRECTED VERSION
if (body.careerOutcomeData !== undefined) {
  console.log("Processing career outcome data:", body.careerOutcomeData);

  // Delete existing career outcome and all related data
  const existingCareerOutcome = await tx.careerOutcome.findFirst({
    where: { universityId: id },
    include: {
      salaryChartData: true,
      employmentRateMeter: true, // Note: this should match your schema
      courseTimelineData: true,
    }
  });

  if (existingCareerOutcome) {
    console.log("Found existing career outcome, deleting related data...");
    
    // Delete related data in correct order
    if (existingCareerOutcome.courseTimelineData?.length > 0) {
      await tx.courseTimelineData.deleteMany({
        where: { careerOutcomeId: existingCareerOutcome.id }
      });
      console.log("Deleted course timeline data");
    }
    
    if (existingCareerOutcome.salaryChartData?.length > 0) {
      await tx.salaryChartData.deleteMany({
        where: { careerOutcomeId: existingCareerOutcome.id }
      });
      console.log("Deleted salary chart data");
    }
    
    // Delete employment rate meter data (1:1 relationship, use delete not deleteMany)
    if (existingCareerOutcome.employmentRateMeter) {
      await tx.employmentRateMeterData.delete({
        where: { careerOutcomeId: existingCareerOutcome.id }
      });
      console.log("Deleted employment rate meter data");
    }
    
    // Delete the career outcome itself
    await tx.careerOutcome.delete({
      where: { id: existingCareerOutcome.id }
    });
    console.log("Deleted career outcome");
  }

  // Create new career outcome if data is provided
  if (body.careerOutcomeData && 
      (body.careerOutcomeData.salaryChartData?.length > 0 ||
       body.careerOutcomeData.employmentRateMeterData ||
       body.careerOutcomeData.courseTimelineData?.length > 0)) {
    
    console.log("Creating new career outcome...");
    
    // Create the main CareerOutcome record
    const careerOutcome = await tx.careerOutcome.create({
      data: {
        universityId: id,
        type: 'SALARY_CHART', // Use a valid enum value from CareerOutcomeType
      }
    });

    console.log(`Created career outcome with ID: ${careerOutcome.id}`);

    // Create salary chart data if provided
    if (body.careerOutcomeData.salaryChartData && Array.isArray(body.careerOutcomeData.salaryChartData)) {
      const validSalaryData = body.careerOutcomeData.salaryChartData.filter((item:any) => {
        const isValid = item && 
               typeof item.sector === 'string' && item.sector.trim() !== '' &&
               typeof item.min === 'number' && !isNaN(item.min) &&
               typeof item.max === 'number' && !isNaN(item.max) &&
               typeof item.color === 'string' && item.color.trim() !== '' &&
               typeof item.percentage === 'number' && !isNaN(item.percentage);
        
        if (!isValid) {
          console.warn("Invalid salary data item:", item);
        }
        return isValid;
      });

      if (validSalaryData.length > 0) {
        const salaryDataResult = await tx.salaryChartData.createMany({
          data: validSalaryData.map((item:any) => ({
            sector: item.sector.trim(),
            min: item.min,
            max: item.max,
            color: item.color.trim(),
            percentage: item.percentage,
            careerOutcomeId: careerOutcome.id
          }))
        });
        console.log(`Created ${salaryDataResult.count} salary chart data records`);
      } else {
        console.log("No valid salary chart data to create");
      }
    }

    // Create employment rate meter data if provided
    if (body.careerOutcomeData.employmentRateMeterData) {
      const empData = body.careerOutcomeData.employmentRateMeterData;
      
      if (typeof empData.targetRate === 'number' && !isNaN(empData.targetRate) &&
          typeof empData.size === 'number' && !isNaN(empData.size)) {
        
        const employmentResult = await tx.employmentRateMeterData.create({
          data: {
            targetRate: empData.targetRate,
            size: empData.size,
            careerOutcomeId: careerOutcome.id
          }
        });
        console.log("Created employment rate meter data with ID:", employmentResult.id);
      } else {
        console.warn("Invalid employment rate meter data:", empData);
      }
    }

    // Create course timeline data if provided
    if (body.careerOutcomeData.courseTimelineData && Array.isArray(body.careerOutcomeData.courseTimelineData)) {
      const validTimelineData = body.careerOutcomeData.courseTimelineData.filter((item:any) => {
        const isValid = item && typeof item.course === 'string' && item.course.trim() !== '';
        if (!isValid) {
          console.warn("Invalid timeline data item:", item);
        }
        return isValid;
      });

      if (validTimelineData.length > 0) {
        const timelineResult = await tx.courseTimelineData.createMany({
          data: validTimelineData.map((item:any) => ({
            course: item.course.trim(),
            careerOutcomeId: careerOutcome.id
          }))
        });
        console.log(`Created ${timelineResult.count} course timeline data records`);
      } else {
        console.log("No valid course timeline data to create");
      }
    }
    
    console.log("Career outcome data processing completed");
  } else {
    console.log("No valid career outcome data provided or all data arrays are empty");
  }
}

      // Handle FAQs updates
      if (validatedData.faqs !== undefined) {
        console.log("Updating FAQs");

        await tx.faq.deleteMany({
          where: { universityId: id },
        });

        if (validatedData.faqs.length > 0) {
          const validFaqs = validatedData.faqs.filter((faq: any) => 
            faq && faq.question && faq.answer
          );

          if (validFaqs.length > 0) {
            await tx.faq.createMany({
              data: validFaqs.map((faq: any) => ({
                universityId: id,
                question: faq.question,
                answer: faq.answer,
              }))
            });
          }
        }

        console.log(`Updated ${validatedData.faqs?.length || 0} FAQs`);
      }

      // Handle course updates/creates (keeping existing logic)
      if (validatedData.courses && Array.isArray(validatedData.courses)) {
        console.log(`Processing ${validatedData.courses.length} courses`);

        for (const courseData of validatedData.courses) {
          try {
            if (courseData.id) {
              // Update existing course
              const courseUpdateData: Record<string, any> = {};

              if (courseData.name !== undefined) courseUpdateData.name = courseData.name;
              if (courseData.description !== undefined) courseUpdateData.description = courseData.description;
              if (courseData.fees !== undefined) courseUpdateData.fees = courseData.fees;
              if (courseData.duration !== undefined) courseUpdateData.duration = courseData.duration;
              if (courseData.degreeType !== undefined) courseUpdateData.degreeType = courseData.degreeType;
              if (courseData.ieltsScore !== undefined) courseUpdateData.ieltsScore = courseData.ieltsScore;
              if (courseData.ranking !== undefined) courseUpdateData.ranking = courseData.ranking;
              if (courseData.websiteLink !== undefined) courseUpdateData.websiteLink = courseData.websiteLink;
              if (courseData.image !== undefined) courseUpdateData.image = courseData.image;

              if (courseData.intake !== undefined) {
                courseUpdateData.intake = Array.isArray(courseData.intake)
                  ? courseData.intake
                  : [courseData.intake];
              }

              if (Object.keys(courseUpdateData).length > 0) {
                console.log(`Updating course ${courseData.id}`);

                const existingCourse = await tx.course.findFirst({
                  where: {
                    id: courseData.id,
                    universityId: id
                  }
                });

                if (existingCourse) {
                  await tx.course.update({
                    where: { id: courseData.id },
                    data: courseUpdateData,
                  });
                  console.log(`Course ${courseData.id} updated successfully`);
                } else {
                  console.warn(`Course ${courseData.id} not found or doesn't belong to university ${id}`);
                }
              }
            } else {
              // Create new course
              if (!courseData.name) {
                console.error("Cannot create course: name is required");
                continue;
              }

              console.log("Creating new course:", courseData.name);

              const intakeArray = courseData.intake
                ? (Array.isArray(courseData.intake) ? courseData.intake : [courseData.intake])
                : [];

              const newCourse = await tx.course.create({
                data: {
                  name: courseData.name,
                  description: courseData.description || "",
                  fees: courseData.fees || "",
                  duration: courseData.duration || "",
                  degreeType: courseData.degreeType || "",
                  ieltsScore: courseData.ieltsScore || "",
                  ranking: courseData.ranking || "",
                  intake: intakeArray,
                  websiteLink: courseData.websiteLink || "",
                  image: courseData.image || "",
                  universityId: id,
                },
              });
              console.log(`New course created with ID: ${newCourse.id}`);
            }
          } catch (courseError) {
            console.error(`Error processing course:`, courseError);
          }
        }
      }

      // Perform the university update only if there are actual changes
      let updatedUniversity;
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        console.log("Updating university with data:", updateData);

        updatedUniversity = await tx.university.update({
          where: { id },
          data: updateData,
          include: {
            courses: true,
            applications: true,
            loans: true,
            users: true,
            careerOutcomes: {
              include: {
                salaryChartData: true,
                employmentRateMeter: true,
                courseTimelineData: true,
              }
            },
            faqs: true,
          },
        });
        console.log("University updated successfully");
      } else {
        updatedUniversity = await tx.university.findUnique({
          where: { id },
          include: {
            courses: true,
            applications: true,
            loans: true,
            users: true,
            careerOutcomes: {
              include: {
                salaryChartData: true,
                employmentRateMeter: true,
                courseTimelineData: true,
              }
            },
            faqs: true,
          },
        });
        console.log("No university fields to update, returning current data");
      }

      return updatedUniversity;
    });

    console.log("Transaction completed successfully");
    return NextResponse.json(result);

  } catch (error) {
    console.error("[PUT_UNIVERSITY_ERROR]", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    if (error instanceof z.ZodError) {
      console.error("Zod validation errors:", error.errors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    if (error && typeof error === 'object' && 'code' in error) {
      console.error("Database error code:", error.code);

      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            { error: "A record with this data already exists" },
            { status: 409 }
          );
        case 'P2025':
          return NextResponse.json(
            { error: "Record not found" },
            { status: 404 }
          );
        case 'P2014':
          return NextResponse.json(
            { error: "Cannot delete record due to related data constraints" },
            { status: 400 }
          );
        default:
          break;
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update university",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    // Access id correctly by directly accessing params.id
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "University ID is required" }, { status: 400 })
    }

    // Check if university exists first
    const existingUniversity = await prisma.university.findUnique({
      where: { id },
    })

    if (!existingUniversity) {
      return NextResponse.json({ error: `University with ID ${id} not found` }, { status: 404 })
    }

    // Delete all related data in the correct order
    // First, get all career outcome IDs to optimize deletions (outside transaction for speed)
    const careerOutcomes = await prisma.careerOutcome.findMany({
      where: { universityId: id },
      select: { id: true },
    })
    const careerOutcomeIds = careerOutcomes.map(co => co.id)

    // Use transaction with extended timeout
    // Note: Prisma transaction timeout is in milliseconds
    const transactionOptions = {
      maxWait: 30000, // 30 seconds
      timeout: 30000, // 30 seconds
    }

    await prisma.$transaction(async (tx) => {
      // Delete CourseTimelineData first (optimized with direct IDs)
      if (careerOutcomeIds.length > 0) {
        await tx.courseTimelineData.deleteMany({
          where: {
            careerOutcomeId: {
              in: careerOutcomeIds
            }
          }
        });

        // Delete SalaryChartData (optimized with direct IDs)
        await tx.salaryChartData.deleteMany({
          where: {
            careerOutcomeId: {
              in: careerOutcomeIds
            }
          }
        });

        // Delete EmploymentRateMeterData (optimized with direct IDs)
        await tx.employmentRateMeterData.deleteMany({
          where: {
            careerOutcomeId: {
              in: careerOutcomeIds
            }
          }
        });
      }

      // Delete CareerOutcome records
      await tx.careerOutcome.deleteMany({
        where: { universityId: id },
      });

      // Delete FAQs
      await tx.faq.deleteMany({
        where: { universityId: id },
      });

      // Delete courses
      await tx.course.deleteMany({
        where: { universityId: id },
      });

      // Finally delete the university
      await tx.university.delete({
        where: { id },
      });
    }, transactionOptions);

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