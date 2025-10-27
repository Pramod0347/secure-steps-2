import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }
    
    const favCourses = await prisma.favCourse.findMany({
      where: { userId }, // Use the provided userId
      include: {
        course: {
          select: {
            id: true,
            name: true,
            fees: true,
            duration: true,
            degreeType: true,
          },
        },
      },
    })
    
    return NextResponse.json(favCourses)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Add to favCourses
export async function POST(req: NextRequest) {
  try {
    const { userId, courseId, courseName, universityId, universityName } = await req.json()
    
    if (!userId || !courseId || !courseName || !universityId || !universityName) {
      return NextResponse.json({ error: "Missing userId or courseId or courseName or universityId or universityName" }, { status: 400 })
    }
    
    try {
      // First check if the favorite already exists
      const existing = await prisma.favCourse.findFirst({
        where: {
          userId,
          courseId,
        },
      })
      
      if (existing) {
        return NextResponse.json({ success: true, id: existing.id, message: "Already in favorites" })
      }

      const details = {
        userId,
        courseId,
        courseName,
        universityId,
        universityName
      }

      console.log("details :",details)
      
      // If not, create a new favorite
      const newFavorite = await prisma.favCourse.create({
        data: {
          userId,
          courseId,
          courseName,
          universityId,
          universityName
        },
      })
      
      return NextResponse.json({ success: true, id: newFavorite.id })
    } catch (error) {
      console.error("Error in favorite operation:", error)
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE: Remove from favCourses
export async function DELETE(req: NextRequest) {
  try {
    const { userId, courseId } = await req.json()
    
    if (!userId || !courseId) {
      return NextResponse.json({ error: "Missing userId or courseId" }, { status: 400 })
    }
    
    // Check if favCourse model exists
    if (!prisma.favCourse) {
      console.error("favCourse model not found in Prisma schema")
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
    }
    
    try {
      // Find the record first
      const record = await prisma.favCourse.findFirst({
        where: {
          userId,
          courseId,
        },
      })
      
      if (!record) {
        return NextResponse.json({ success: true, message: "Not in favorites" })
      }
      
      // Delete the record
      await prisma.favCourse.delete({
        where: {
          id: record.id,
        },
      })
      
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error in delete operation:", error)
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}