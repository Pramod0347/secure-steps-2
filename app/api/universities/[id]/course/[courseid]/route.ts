// File: app/api/universities/[id]/course/[courseId]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
    courseid: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Await params before destructuring (Next.js 15 requirement)
    const resolvedParams = await params;
    const { id: universityId, courseid: courseId } = resolvedParams;

    // Validate input parameters
    if (!universityId || !courseId) {
      return NextResponse.json(
        { error: "University ID and Course ID are required" },
        { status: 400 }
      );
    }

    // Validate that the parameters are not empty strings
    if (universityId.trim() === '' || courseId.trim() === '') {
      return NextResponse.json(
        { error: "University ID and Course ID cannot be empty" },
        { status: 400 }
      );
    }

    // Check if the university exists first
    const university = await prisma.university.findUnique({
      where: { id: universityId },
      select: { id: true, name: true }
    });

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Check if the course exists and belongs to the university
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        universityId: universityId,
      },
      select: {
        id: true,
        name: true,
        universityId: true
      }
    });

    if (!course) {
      // Additional debug: Check if course exists at all
      const courseExists = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, universityId: true }
      });

      if (courseExists) {
        return NextResponse.json(
          { error: "Course doesn't belong to this university" },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }
    }

    // Perform the deletion within a transaction for safety
    const deletedCourse = await prisma.$transaction(async (tx) => {
      // First, let's check if there are any dependencies that might prevent deletion
      // (Add any additional checks here if you have related tables)
      
      // Delete the course
      const deleted = await tx.course.delete({
        where: {
          id: courseId,
          // Double-check that it belongs to the right university
          universityId: universityId
        },
        select: {
          id: true,
          name: true,
          universityId: true
        }
      });

      return deleted;
    });

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
      deletedCourse: {
        id: deletedCourse.id,
        name: deletedCourse.name,
        universityId: deletedCourse.universityId
      }
    }, { status: 200 });

  } catch (error: any) {
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      // Record not found or cannot be deleted
      return NextResponse.json(
        { error: "Course not found or already deleted" },
        { status: 404 }
      );
    }

    if (error.code === 'P2003') {
      // Foreign key constraint violation
      return NextResponse.json(
        { error: "Cannot delete course due to existing dependencies" },
        { status: 409 }
      );
    }

    if (error.code === 'P2002') {
      // Unique constraint violation (shouldn't happen in delete, but just in case)
      return NextResponse.json(
        { error: "Constraint violation during deletion" },
        { status: 409 }
      );
    }

    // Generic database error
    return NextResponse.json(
      {
        error: "Failed to delete course",
        details: process.env.NODE_ENV === 'development' 
          ? `${error.message} (Code: ${error.code})` 
          : 'Internal server error'
      },
      { status: 500 }
    );
  }
}