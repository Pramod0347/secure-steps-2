import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Await params before using its properties
  const { id: universityId } = await params
  const courseData = await request.json()

  try {
    // Verify that the university exists before creating the course
    const university = await prisma.university.findUnique({
      where: { id: universityId }
    })

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    // Remove the id field from courseData if it exists (since it's auto-generated)
    const { id, ...courseDataWithoutId } = courseData

    const course = await prisma.course.create({
      data: {
        ...courseDataWithoutId,
        university: { connect: { id: universityId } },
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Failed to create course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Await params before using its properties
  const { id: universityId } = await params
  const courseData = await request.json()

  try {
    // Ensure we have a course ID to update
    if (!courseData.id) {
      return NextResponse.json({ error: "Course ID is required for update" }, { status: 400 })
    }

    const course = await prisma.course.update({
      where: { id: courseData.id },
      data: courseData,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Failed to update course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}