import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch courses from NEOMA, Warwick, and Purdue universities
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { university: { name: { contains: "NEOMA" } } },
          { university: { name: { contains: "Warwick" } } },
          { university: { name: { contains: "Purdue" } } },
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        fees: true,
        duration: true,
        degreeType: true,
        ieltsScore: true,
        websiteLink: true,
        university: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        }
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Failed to fetch featured courses:", error)
    return NextResponse.json({ 
      error: "Failed to fetch courses", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
