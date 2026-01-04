import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { Prisma, ApplicationStatus } from "@prisma/client";

// Define Zod schema for application validation
const ApplicationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  universityId: z.string().min(1, "University ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  loanRequired: z.boolean().default(false),
  documents: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "IN_REVIEW", "DEFERRED"]).default("PENDING"),
});

// Type for pagination parameters
export interface PaginationParams {
  skip: number;
  take: number;
}

// GET route handler to fetch applications
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
    const url = new URL(req.url.startsWith("http") ? req.url : `${NextUrl}${req.url}`);
    
    const searchParams = {
      id: url.searchParams.get("id") ?? undefined,
      userId: url.searchParams.get("userId") ?? undefined,
      universityId: url.searchParams.get("universityId") ?? undefined,
      courseId: url.searchParams.get("courseId") ?? undefined,
      status: url.searchParams.get("status") as ApplicationStatus | undefined,
    };

    // Handle specific filter searches
    if (Object.values(searchParams).some(Boolean)) {
      const whereClause: Prisma.UniversityApplicationsWhereInput = {
        ...(searchParams.id && { id: searchParams.id }),
        ...(searchParams.userId && { userId: searchParams.userId }),
        ...(searchParams.universityId && { universityId: searchParams.universityId }),
        ...(searchParams.courseId && { courseId: searchParams.courseId }),
        ...(searchParams.status && { status: searchParams.status }),
      };

      const applications = await prisma.universityApplications.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          university: true,
          course: true,
        },
      });

      if (applications.length === 0) {
        return NextResponse.json({ error: "No applications found" }, { status: 404 });
      }

      return NextResponse.json(searchParams.id ? applications[0] : { applications });
    }

    // Handle paginated queries
    const querySchema = z.object({
      query: z.string().optional().default(""),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
      status: z.enum(["PENDING", "APPROVED", "REJECTED", "IN_REVIEW", "DEFERRED"]).optional(),
    });

    const { query, page, limit, status } = querySchema.parse({
      query: url.searchParams.get("query") || "",
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
      status: url.searchParams.get("status"),
    });

    const skip = (page - 1) * limit;
    
    // Build where clause for search
    const whereClause: Prisma.UniversityApplicationsWhereInput = {
      ...(status && { status: status as ApplicationStatus }),
      ...(query && {
        OR: [
          {
            user: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ]
            }
          },
          {
            university: {
              name: { contains: query, mode: 'insensitive' }
            }
          },
          {
            course: {
              name: { contains: query, mode: 'insensitive' }
            }
          },
        ],
      }),
    };

    // Execute the query with pagination
    const [applications, total] = await Promise.all([
      prisma.universityApplications.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          university: {
            select: {
              id: true,
              name: true,
              location: true,
              country: true,
              logoUrl: true,
              slug: true,
            }
          },
          course: {
            select: {
              id: true,
              name: true,
              degreeType: true,
              duration: true,
              fees: true,
            }
          },
        },
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.universityApplications.count({ where: whereClause }),
    ]);

    const pages = Math.ceil(total / limit);

    if (page > pages && pages > 0) {
      return NextResponse.json(
        {
          error: "Page number exceeds total pages",
          pagination: { total, pages, page, limit },
        },
        { status: 400 }
      );
    }


    return NextResponse.json({
      applications,
      pagination: { total, pages, page, limit },
    });
  } catch (error) {
    console.error("[GET_APPLICATIONS_ERROR]", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch applications", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST route handler to create a new application
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Get userId from headers (set by middleware)
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required. Please ensure you are authenticated." },
        { status: 401 }
      );
    }

    // Get universityId from query parameter
    const url = new URL(req.url);
    const universityId = url.searchParams.get("id");
    if (!universityId) {
      return NextResponse.json(
        { error: "University ID is required in query parameters" },
        { status: 400 }
      );
    }

    // Check Content-Type to handle both FormData and JSON
    const contentType = req.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData
      const formData = await req.formData();
      
      const courseId = formData.get("courseId") as string;
      const loanRequired = formData.get("loanRequired") === "true";
      const additionalNotes = formData.get("additionalNotes") as string | null;
      
      // Get all documents and their names
      const documents = formData.getAll("documents") as File[];
      const documentNames = formData.getAll("documentNames") as string[];

      if (!courseId) {
        return NextResponse.json(
          { error: "Course ID is required" },
          { status: 400 }
        );
      }

      // Upload documents and get URLs
      const documentUrls: string[] = [];
      
      if (documents.length > 0) {
        // Upload each document
        for (let i = 0; i < documents.length; i++) {
          const file = documents[i];
          if (file && file.size > 0) {
            try {
              // Determine file type (pdf or image)
              // Check if it's a PDF
              const isPdf = file.type === "application/pdf" || 
                           file.name.toLowerCase().endsWith(".pdf");
              // Check if it's an image
              const isImage = file.type.startsWith("image/");
              
              const fileType = isPdf ? "pdf" : isImage ? "image" : "pdf"; // Default to pdf for documents
              
              // Create FormData for upload
              const uploadFormData = new FormData();
              uploadFormData.append("file", file);
              uploadFormData.append("type", fileType);

              // Upload to Cloudflare R2
              // Use relative URL for internal API call
              const baseUrl = process.env.NEXTAUTH_URL || url.origin;
              const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
                method: "POST",
                body: uploadFormData,
              });

              if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(`Failed to upload document: ${errorData.error || "Unknown error"}`);
              }

              const uploadResult = await uploadResponse.json();
              if (uploadResult.url) {
                documentUrls.push(uploadResult.url);
              }
            } catch (error) {
              console.error(`Error uploading document ${i + 1}:`, error);
            }
          }
        }
      }

      body = {
        userId,
        universityId,
        courseId,
        loanRequired,
        documents: documentUrls,
        additionalNotes: additionalNotes || undefined,
        status: "PENDING",
      };
    } else {
      // Handle JSON
      try {
        body = await req.json();
      } catch (jsonError) {
        // Handle JSON parsing errors
        if (jsonError instanceof SyntaxError || jsonError instanceof Error) {
          return NextResponse.json(
            {
              error: "Failed to create application",
              message: "Invalid JSON in request body",
              details: jsonError.message,
            },
            { status: 400 }
          );
        }
        throw jsonError;
      }
      
      // Override userId and universityId from headers/query if not provided in body
      if (!body.userId) body.userId = userId;
      if (!body.universityId) body.universityId = universityId;
    }


    if (!body || Object.keys(body).length === 0) {
      throw new Error("Request body is empty");
    }

    // Validate the input data
    const validatedData = ApplicationSchema.parse(body);

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if university exists
    const universityExists = await prisma.university.findUnique({
      where: { id: validatedData.universityId },
    });

    if (!universityExists) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Check if course exists and belongs to the university
    const courseExists = await prisma.course.findFirst({
      where: {
        id: validatedData.courseId,
        universityId: validatedData.universityId,
      },
    });

    if (!courseExists) {
      return NextResponse.json(
        { error: "Course not found or does not belong to the specified university" },
        { status: 404 }
      );
    }

    // Check if an application already exists
    const existingApplication = await prisma.universityApplications.findFirst({
      where: {
        userId: validatedData.userId,
        universityId: validatedData.universityId,
        courseId: validatedData.courseId,
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "An active application already exists for this course" },
        { status: 409 }
      );
    }

    // Create the application
    const application = await prisma.universityApplications.create({
      data: {
        userId: validatedData.userId,
        universityId: validatedData.universityId,
        courseId: validatedData.courseId,
        loanRequired: validatedData.loanRequired,
        documents: validatedData.documents,
        additionalNotes: validatedData.additionalNotes,
        status: validatedData.status as ApplicationStatus,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        university: {
          select: {
            name: true,
            country: true,
          }
        },
        course: {
          select: {
            name: true,
            degreeType: true,
          }
        },
      },
    });


    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("[POST_APPLICATION_ERROR]", error);

    let errorMessage = "An unknown error occurred";
    let errorDetails = null;

    if (error instanceof z.ZodError) {
      errorMessage = "Validation failed";
      errorDetails = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    } else if (error !== null && typeof error === 'object') {
      errorMessage = "An error object was thrown";
      errorDetails = JSON.stringify(error);
    }

    console.error("Error details:", errorMessage, errorDetails);

    return NextResponse.json(
      {
        error: "Failed to create application",
        message: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

// PATCH route handler to update an application
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }


    // Check if application exists
    const existingApplication = await prisma.universityApplications.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Define the update schema (partial - only fields that can be updated)
    const UpdateSchema = z.object({
      status: z.enum(["PENDING", "APPROVED", "REJECTED", "IN_REVIEW", "DEFERRED"]).optional(),
      loanRequired: z.boolean().optional(),
      documents: z.array(z.string()).optional(),
      additionalNotes: z.string().optional(),
    });

    const validatedData = UpdateSchema.parse(body);

    // Update the application
    const updatedApplication = await prisma.universityApplications.update({
      where: { id },
      data: {
        ...validatedData,
        status: validatedData.status as ApplicationStatus,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        university: {
          select: {
            name: true,
            country: true,
          }
        },
        course: {
          select: {
            name: true,
            degreeType: true,
          }
        },
      },
    });


    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("[PATCH_APPLICATION_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update application", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE route handler to delete an application
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }


    // Check if application exists
    const existingApplication = await prisma.universityApplications.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Delete the application
    await prisma.universityApplications.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_APPLICATION_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to delete application", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}