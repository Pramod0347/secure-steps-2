// File: /app/api/lenders/loan/apply/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

// Comprehensive Loan Application Validation Schema
const LoanApplicationSchema = z.object({
  loanId: z.string().cuid("Invalid Loan ID"),
  userId: z.string().cuid("Invalid User ID"),
  documents: z.array(z.string().url("Invalid document URL")).optional(),
  academicInfo: z.object({
    gpa: z.number().min(0, "GPA must be non-negative").max(4, "GPA cannot exceed 4.0"),
    semester: z.number().int().positive("Semester must be a positive integer"),
    program: z.string().min(2, "Program name too short").max(100, "Program name too long"),
    graduationYear: z.number().int().min(new Date().getFullYear(), "Invalid graduation year")
  }).strict(),
  financialInfo: z.object({
    monthlyIncome: z.number().nonnegative("Monthly income cannot be negative").optional(),
    otherLoans: z.boolean(),
    collateral: z.string().optional(),
    annualIncome: z.number().nonnegative("Annual income cannot be negative").optional()
  }).strict(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "UNDER_REVIEW"]).optional()
});

// Query Validation Schema
const QuerySchema = z.object({
  id: z.string().cuid().optional(),
  loanId: z.string().cuid().optional(),
  userId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "UNDER_REVIEW"]).optional(),
  sortBy: z.enum(['createdAt', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Helper function for pagination
const getPaginationParams = (page: number, limit: number) => ({
  skip: Math.max(0, (page - 1) * limit),
  take: limit,
});

// Error handling utility
const handleError = (error: unknown, context: string) => {
  console.error(`[${context}]`, error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: "Validation failed", 
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { 
        error: "An unexpected error occurred", 
        details: error.message 
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { 
      error: "An unknown error occurred",
      details: String(error)
    },
    { status: 500 }
  );
};

// Middleware to validate and parse query parameters
const validateQueryParams = (url: URL) => {
  // Filter out null and undefined values
  const queryParams = {
    id: url.searchParams.get('id') || undefined,
    loanId: url.searchParams.get('loanId') || undefined,
    userId: url.searchParams.get('userId') || undefined,
    page: url.searchParams.get('page') || undefined,
    limit: url.searchParams.get('limit') || undefined,
    status: url.searchParams.get('status') || undefined,
    sortBy: url.searchParams.get('sortBy') || undefined,
    sortOrder: url.searchParams.get('sortOrder') || undefined
  };

  // Parse with optional parameters
  return QuerySchema.parse(queryParams);
};

// GET Loan Applications (Multiple or Single)
export async function GET(req: Request) {
  try {
    const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
    const url = req.url.startsWith('http') 
      ? new URL(req.url) 
      : new URL(`${NextUrl}${req.url}`);

    // Validate and parse query parameters
    const { 
      id, 
      loanId, 
      userId, 
      page, 
      limit, 
      status,
      sortBy,
      sortOrder 
    } = validateQueryParams(url);

    // Single Loan Application Fetch
    if (id) {
      const application = await prisma.loanApplication.findUnique({
        where: { id },
        include: {
          loan: true,
          user: {
            select: { 
              id: true, 
              name: true, 
              email: true 
            }
          }
        }
      });

      if (!application) {
        return NextResponse.json(
          { error: "Loan Application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(application);
    }

    // Construct where clause for filtering
    const whereClause = {
      ...(loanId ? { loanId } : {}),
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {})
    };

    // Pagination and sorting
    const { skip, take } = getPaginationParams(page, limit);
    const orderBy = { [sortBy]: sortOrder };

    // Fetch applications with pagination and total count
    const [applications, total] = await Promise.all([
      prisma.loanApplication.findMany({
        where: whereClause,
        include: {
          loan: true,
          user: {
            select: { 
              id: true, 
              name: true, 
              email: true 
            }
          }
        },
        skip,
        take,
        orderBy
      }),
      prisma.loanApplication.count({ where: whereClause })
    ]);

    // Calculate total pages
    const pages = Math.ceil(total / limit);

    // Validate page number
    if (page > pages && pages > 0) {
      return NextResponse.json(
        { 
          error: "Page number exceeds total pages", 
          pagination: { total, pages, page, limit } 
        }, 
        { status: 400 }
      );
    }

    // Return paginated results
    return NextResponse.json({
      applications,
      pagination: {
        total,
        pages,
        page,
        limit
      }
    });

  } catch (error) {
    return handleError(error, "GET_LOAN_APPLICATIONS_ERROR");
  }
}

// Enhanced Loan Application Creation Function
export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = LoanApplicationSchema.parse(body);

    // Additional security checks
    // 1. Validate User Existence
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { 
        id: true, 
        role: true, 
        isVerified: true,
        universityId: true 
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", field: "userId" },
        { status: 404 }
      );
    }

    // 2. Check User Eligibility
    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: "Only students can apply for loans", field: "userId" },
        { status: 403 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "User account must be verified", field: "userId" },
        { status: 403 }
      );
    }

    // 3. Validate Loan Availability and Eligibility
    const loan = await prisma.loan.findUnique({
      where: { id: validatedData.loanId },
      select: {
        id: true,
        isActive: true,
        maxApplications: true,
        universityId: true,
        deadline: true,
        eligibilityCriteria: true
      }
    });

    if (!loan) {
      return NextResponse.json(
        { error: "Loan not found", field: "loanId" },
        { status: 404 }
      );
    }

    // 4. Check Loan Active Status
    if (!loan.isActive) {
      return NextResponse.json(
        { error: "Loan is not currently available", field: "loanId" },
        { status: 400 }
      );
    }

    // 5. Check Loan Deadline
    if (loan.deadline && new Date(loan.deadline) < new Date()) {
      return NextResponse.json(
        { error: "Loan application deadline has passed", field: "loanId" },
        { status: 400 }
      );
    }

    // 6. Check University/College Eligibility
    const isUniversityEligible = (loan.universityId === user.universityId) ;
      

    if (!isUniversityEligible) {
      return NextResponse.json(
        { error: "User is not eligible for this loan", field: "loanId" },
        { status: 403 }
      );
    }

    // 7. Check for Existing Applications
    const existingApplications = await prisma.loanApplication.count({
      where: {
        AND: [
          { loanId: validatedData.loanId },
          { userId: validatedData.userId },
          { 
            status: {
              in: ['PENDING', 'UNDER_REVIEW', 'APPROVED']
            }
          }
        ]
      }
    });

    // 8. Check Maximum Applications Limit
    if (existingApplications > 0) {
      return NextResponse.json(
        { error: "You have already applied for this loan or have an active application", field: "loanId" },
        { status: 400 }
      );
    }

    // 9. Check Overall Loan Application Limit
    if (loan.maxApplications) {
      const totalApplications = await prisma.loanApplication.count({
        where: { 
          loanId: validatedData.loanId,
          status: {
            in: ['PENDING', 'UNDER_REVIEW', 'APPROVED']
          }
        }
      });

      if (totalApplications >= loan.maxApplications) {
        return NextResponse.json(
          { error: "Maximum number of applications for this loan has been reached", field: "loanId" },
          { status: 400 }
        );
      }
    }

    // 10. Additional Eligibility Checks (if any specific criteria)
    if (loan.eligibilityCriteria && loan.eligibilityCriteria.length > 0) {
      // Example: Simple GPA check - you'd implement more complex logic as needed
      const gpaRequirement = loan.eligibilityCriteria.find((criteria:any) => 
        criteria.toLowerCase().includes('gpa')
      );

      if (gpaRequirement) {
        const minGpa = parseFloat(gpaRequirement.split(':')[1] || '0');
        if (validatedData.academicInfo.gpa < minGpa) {
          return NextResponse.json(
            { 
              error: `Minimum GPA requirement not met. Required: ${minGpa}`, 
              field: "academicInfo.gpa" 
            },
            { status: 403 }
          );
        }
      }
    }

    // Create Loan Application
    const application = await prisma.loanApplication.create({
      data: {
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: validatedData.status || "PENDING"
      },
    });

    // Optional: Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: validatedData.userId,
        title: "Loan Application Submitted",
        message: `Your loan application has been submitted successfully.`,
        type: "LENDERS",
        data: JSON.stringify({ 
          loanId: application.loanId, 
          applicationId: application.id 
        })
      }
    });

    return NextResponse.json(application, { status: 201 });

  } catch (error) {
    console.error("[POST_LOAN_APPLICATION_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to create loan application", 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


// Improved PUT Update Loan Application
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Loan Application ID is required" },
        { status: 400 }
      );
    }

    // Check existing application
    const existingApplication = await prisma.loanApplication.findUnique({
      where: { id },
      select: { 
        userId: true, 
        loanId: true 
      }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Loan Application not found" },
        { status: 404 }
      );
    }

    // Validate partial update with existing data
    const validatedData = LoanApplicationSchema.partial().parse({
      ...existingApplication,
      ...body
    });

    const application = await prisma.loanApplication.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("[PUT_LOAN_APPLICATION_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update loan application",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE Loan Application (remains the same as in the original code)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Loan Application ID is required" },
        { status: 400 }
      );
    }

    await prisma.loanApplication.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Loan Application deleted successfully" });
  } catch (error) {
    console.error("[DELETE_LOAN_APPLICATION_ERROR]", error);

    return NextResponse.json(
      {
        error: "Failed to delete loan application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}