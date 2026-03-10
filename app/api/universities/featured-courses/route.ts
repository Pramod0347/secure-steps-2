import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Step 1: Get all university IDs that have at least one course
    const universities = await prisma.university.findMany({
      where: { courses: { some: {} } },
      select: { id: true },
    })

    // Step 2: Shuffle and pick up to 6 unique universities
    const shuffled = universities.sort(() => Math.random() - 0.5).slice(0, 6)
    const universityIds = shuffled.map((u) => u.id)

    // Step 3: Fetch one course per university
    const courses = await Promise.all(
      universityIds.map(async (uniId) => {
        const uniCourses = await prisma.course.findMany({
          where: { universityId: uniId },
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
                slug: true,
                logoUrl: true,
              },
            },
          },
        })
        // Pick a random course from this university
        return uniCourses[Math.floor(Math.random() * uniCourses.length)]
      })
    )

    // Filter out any undefined entries
    const validCourses = courses.filter(Boolean)

    return NextResponse.json(validCourses)
  } catch (error) {
    console.error("Failed to fetch featured courses:", error)
    return NextResponse.json({ 
      error: "Failed to fetch courses", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
