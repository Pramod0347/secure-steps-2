import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

// Fisher-Yates shuffle for unbiased randomization
function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export async function GET() {
  try {
    // Single query: fetch all courses that belong to a university with a slug
    const allCourses = await prisma.course.findMany({
      where: { university: { courses: { some: {} } } },
      select: {
        id: true,
        name: true,
        description: true,
        fees: true,
        duration: true,
        degreeType: true,
        ieltsScore: true,
        websiteLink: true,
        universityId: true,
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

    // Group courses by university
    const byUniversity = new Map<string, typeof allCourses>()
    for (const course of allCourses) {
      const existing = byUniversity.get(course.universityId)
      if (existing) {
        existing.push(course)
      } else {
        byUniversity.set(course.universityId, [course])
      }
    }

    // Pick one random course per university, then shuffle and take 6
    const oneCoursePerUni = Array.from(byUniversity.values()).map((courses) => {
      return courses[Math.floor(Math.random() * courses.length)]
    })

    const selected = fisherYatesShuffle(oneCoursePerUni).slice(0, 6)

    return NextResponse.json(selected)
  } catch (error) {
    console.error("Failed to fetch featured courses:", error)
    return NextResponse.json({ 
      error: "Failed to fetch courses", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
