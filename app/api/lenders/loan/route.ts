/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { LoanSchema } from "@/app/lib/types/lender";
import { stringToDate } from "@/app/utils/date";
import { Prisma } from "@prisma/client";

// Input validation schemas
const SingleLoanQuerySchema = z.object({
  id: z.string().trim().min(1, "Loan ID is required")
});

const ListLoansQuerySchema = z.object({
  query: z.string().optional().default(''),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'amount', 'deadline']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Pagination helper with additional safety
const paginate = (page: number, limit: number) => ({
  skip: Math.max(0, (page - 1) * limit),
  take: Math.min(limit, 100) // Enforce maximum limit
});

// GET Loans (Multiple or Single)
export async function GET(req: Request) {
  try {
    const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
    const url = req.url.startsWith('http') 
      ? new URL(req.url) 
      : new URL(`${NextUrl}${req.url}`);

    const id = url.searchParams.get("id");

    // Single Loan Fetch
    if (id) {
      // Validate ID format
      const validatedId = SingleLoanQuerySchema.parse({ id });

      const loan = await prisma.loan.findUnique({
        where: { id: validatedId.id },
        include: {
          university: {
            select: { 
              id: true, 
              name: true 
            }
          },
          applications: {
            select: { 
              id: true, 
              status: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!loan) {
        return NextResponse.json(
          { error: "Loan not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(loan);
    }

    // List Loans with Enhanced Pagination and Filtering
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const { 
      query, 
      page, 
      limit, 
      isActive, 
      sortBy, 
      sortOrder 
    } = ListLoansQuerySchema.parse(queryParams);

    const { skip, take } = paginate(page, limit);

    const whereClause: Prisma.LoanWhereInput = {
      AND: [
          query ? {
              OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } }
              ]
          } : {},
          isActive !== undefined ? { isActive: { equals: isActive } } : {}
      ]
  };

    // Use transactions for better performance and consistency
    const [loans, total] = await prisma.$transaction([
      prisma.loan.findMany({
        
        where: whereClause,
        include: {
          university: {
            select: { 
              id: true, 
              name: true 
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        skip,
        take,
        orderBy: { 
          [sortBy]: sortOrder 
        }
      }),
      prisma.loan.count({ where: whereClause })
    ]);

    const pages = Math.ceil(total / limit);

    // Additional pagination validation
    if (page > pages && pages > 0) {
      return NextResponse.json(
        { 
          error: "Page number exceeds total pages", 
          pagination: { total, pages, page, limit } 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json({
      loans: loans.map((loan: any) => ({
        ...loan,
        applicationsCount: loan._count.applications
      })),
      pagination: {
        total,
        pages,
        page,
        limit,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error("[GET_LOANS_ERROR]", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid query parameters", 
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
        error: "Failed to fetch loans", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// post
export async function POST(req: Request) {
  try {
    // Robust body parsing with detailed error handling
    const contentType = req.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { 
          error: "Invalid content type", 
          details: "Expected application/json" 
        }, 
        { status: 415 } // Unsupported Media Type
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: "Invalid request body", 
          details: parseError instanceof Error ? parseError.message : "Unable to parse JSON payload" 
        }, 
        { status: 400 }
      );
    }

    // Check if body is null or undefined
    if (body === null || body === undefined) {
      return NextResponse.json(
        { 
          error: "Empty request body", 
          details: "Request body cannot be null or undefined" 
        }, 
        { status: 400 }
      );
    }

    // Validate input data
    let validatedData;
    try {
      validatedData = LoanSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: "Validation failed", 
            details: validationError.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const deadline = stringToDate(validatedData.deadline);

    // Perform transaction to create loan
    const result = await prisma.$transaction(async (prisma:any) => {
      // Check for existing duplicate loan based on multiple criteria
      const existingLoan = await prisma.loan.findFirst({
        where: {
          // More flexible matching
          title: { 
            contains: validatedData.title, 
            mode: 'insensitive' 
          },
          amount: {
            // Allow some tolerance for amount
            gte: validatedData.amount * 0.95,
            lte: validatedData.amount * 1.05
          },
          // Optional: Check deadline with some flexibility
          ...(validatedData.deadline && {
            deadline: {
              gte: new Date(deadline.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before
              lte: new Date(deadline.getTime() + 7 * 24 * 60 * 60 * 1000)  // 7 days after
            }
          })
        }
      });

      // If a duplicate loan exists, throw an error
      if (existingLoan) {
        throw new Error('A similar loan already exists');
      }

      // Create the loan
      const newLoan = await prisma.loan.create({
        data: {
          ...validatedData,
          // Explicitly convert deadline to Date if provided
          deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        },
      });

      // Create an audit log for loan creation
      await prisma.auditLog.create({
        data: {
          action: 'LOAN_CREATION',
          entityType: 'LOAN',
          entityId: newLoan.id,
          userId: 'system', // Replace with actual user ID if available
          details: JSON.stringify({
            loanTitle: newLoan.title,
            amount: newLoan.amount,
            createdAt: new Date()
          })
        }
      });

      return newLoan;
    });

    // Serialize the result to ensure JSON compatibility
    const serializedResult = {
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
      deadline: result.deadline ? result.deadline.toISOString() : null
    };

    return NextResponse.json(serializedResult, { status: 201 });

  } catch (error) {
    // Comprehensive error handling
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

    // Specific database-related errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return NextResponse.json(
          { 
            error: "Duplicate entry", 
            details: "A loan with similar unique constraints already exists" 
          },
          { status: 409 }
        );
      }
    }

    // Check for duplicate loan error
    if (error instanceof Error && error.message === 'A similar loan already exists') {
      return NextResponse.json(
        { 
          error: "Duplicate loan", 
          details: "A loan with similar details already exists" 
        },
        { status: 409 }
      );
    }

    // Specific error cases
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to create loan", 
          details: error.message 
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: "Failed to create loan", 
        details: 'Unknown error'
      },
      { status: 500 }
    );
  }
}
// PUT Update Loan
export async function PUT(req: Request) {
  try {
    // Robust body parsing
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: "Invalid request body", 
          details: parseError instanceof Error ? parseError.message : "Unable to parse JSON payload" 
        }, 
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Loan ID is required" },
        { status: 400 }
      );
    }

    // Validate request body with partial schema
    let validatedData;
    try {
      validatedData = LoanSchema.partial().parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validationError.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Check if loan exists before updating
    const existingLoan = await prisma.loan.findUnique({
      where: { id }
    });

    if (!existingLoan) {
      return NextResponse.json(
        { error: "Loan not found" },
        { status: 404 }
      );
    }

    // Perform update with additional metadata tracking
    const updatedLoan = await prisma.loan.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    // Optional: Create an audit log for the update
    await prisma.auditLog.create({
      data: {
        action: 'LOAN_UPDATE',
        entityType: 'LOAN',
        entityId: id,
        userId: 'system', // Replace with actual user ID if available
        details: JSON.stringify({
          changes: Object.keys(validatedData),
          updatedAt: new Date()
        })
      }
    });

    return NextResponse.json(updatedLoan);
  } catch (error) {
    console.error("[PUT_LOAN_ERROR]", error);

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
        error: "Failed to update loan",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE Loan
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Loan ID is required" },
        { status: 400 }
      );
    }

    // Check if loan exists before deleting
    const existingLoan = await prisma.loan.findUnique({
      where: { id }
    });

    if (!existingLoan) {
      return NextResponse.json(
        { error: "Loan not found" },
        { status: 404 }
      );
    }

    // Soft delete or hard delete based on your requirements
    // Soft delete example:
    // const deletedLoan = await prisma.loan.update({
    //   where: { id },
    //   data: { 
    //     isActive: false,
    //     deletedAt: new Date() 
    //   }
    // });

    // Hard delete
    await prisma.loan.delete({
      where: { id },
    });

    // Create audit log for deletion
    await prisma.auditLog.create({
      data: {
        action: 'LOAN_DELETION',
        entityType: 'LOAN',
        entityId: id,
        userId: 'system', // Replace with actual user ID if available
        details: JSON.stringify({
          deletedAt: new Date()
        })
      }
    });

    return NextResponse.json({ 
      message: "Loan deleted successfully",
      deletedId: id 
    });
  } catch (error) {
    console.error("[DELETE_LOAN_ERROR]", error);

    return NextResponse.json(
      {
        error: "Failed to delete loan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}