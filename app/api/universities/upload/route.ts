import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { UniversitySchema } from "@/app/lib/types/universities"
import { z } from "zod"
import { generateUniversitySlug } from "@/app/utils/generateSlug"

// Define a schema for bulk upload
const BulkUniversityUploadSchema = z.array(UniversitySchema)

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()


    if (!Array.isArray(body) || body.length === 0) {
      throw new Error("Request body must be a non-empty array of universities")
    }

    // Validate all universities in the array
    const validatedData = BulkUniversityUploadSchema.parse(body)


    // Process universities in batches to avoid overwhelming the database
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      universities: [] as any[],
    }

    for (const universityData of validatedData) {
      try {
        const establishedDate = new Date(universityData.established)

        if (isNaN(establishedDate.getTime())) {
          throw new Error(`Invalid establishment date for university: ${universityData.name}`)
        }

        // Check for existing university
        const existing = await prisma.university.findFirst({
          where: {
            name: universityData.name,
            website: universityData.website,
          },
        })

        if (existing) {
          throw new Error(`University already exists: ${universityData.name}`)
        }

        // Generate slug based on university name and location
        const slug = generateUniversitySlug(universityData.name, universityData.location)

        // Check if slug already exists
        const existingSlug = await prisma.university.findFirst({
          where: {
            slug,
          },
        })

        // Append unique identifier if needed
        const finalSlug = existingSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug

        // Create university with courses
        const university = await prisma.university.create({
          data: {
            name: universityData.name,
            description: universityData.description,
            location: universityData.location,
            country: universityData.country,
            website: universityData.website,
            established: establishedDate,
            banner: universityData.banner,
            logoUrl: universityData.logoUrl,
            imageUrls: universityData.imageUrls,
            facilities: universityData.facilities,
            youtubeLink: universityData.youtubeLink, // Map youtubeLink to youTubeLink
            slug: finalSlug,
            courses: {
              create:
                universityData.courses?.map((course) => ({
                  name: course.name,
                  description: course.description || `${course.name} at ${universityData.name}`,
                  fees: course.fees,
                  duration: course.duration,
                  degreeType: course.degreeType,
                  ieltsScore: course.ieltsScore,
                  ranking: course.ranking,
                  intake: course.intake,
                  websiteLink: course.websiteLink,
                })) || [],
            },
          },
          include: {
            courses: true,
          },
        })

        results.universities.push(university)
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(error instanceof Error ? error.message : "Unknown error")
      }
    }


    return NextResponse.json(
      {
        message: `Successfully processed ${results.success} universities, ${results.failed} failed`,
        details: results,
      },
      { status: 207 },
    ) // Using 207 Multi-Status for partial success
  } catch (error) {
    console.error("[BULK_UPLOAD_UNIVERSITIES_ERROR]", error)

    let errorMessage = "An unknown error occurred"
    let errorDetails = null

    if (error instanceof z.ZodError) {
      errorMessage = "Validation failed"
      errorDetails = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }))
    } else if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    } else if (error !== null && typeof error === "object") {
      errorMessage = "An error object was thrown"
      errorDetails = JSON.stringify(error)
    }

    console.error("Error details:", errorMessage, errorDetails)

    return NextResponse.json(
      {
        error: "Failed to process bulk university upload",
        message: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}
