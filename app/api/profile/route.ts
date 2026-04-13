import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * GET /api/profile
 * Fetch user's profile with completion stats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
      include: {
        onboardingInfo: true,
        universities: {
          include: { university: true },
          orderBy: { savedAt: "desc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
        applications: {
          include: {
            milestones: { orderBy: { order: "asc" } },
            university: true,
          },
        },
        portfolio: { orderBy: { order: "asc" } },
        journeyMilestones: { orderBy: { order: "asc" } },
        visaChecklists: {
          include: { items: { orderBy: { order: "asc" } } },
        },
        careerProfile: {
          include: {
            mentorshipRequests: true,
            connections: true,
            savedJobs: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILE_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile
 * Create user's profile
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      )
    }

    // Create profile
    const profile = await prisma.userProfile.create({
      data: {
        userId: session.userId,
        selectedPackage: body.selectedPackage,
        selectedCountry: body.selectedCountry,
        profileStatus: "IN_PROGRESS",
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("[PROFILE_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile
 * Update profile completion status
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const profile = await prisma.userProfile.update({
      where: { userId: session.userId },
      data: {
        completionPercentage: body.completionPercentage,
        lastUpdatedSection: body.lastUpdatedSection,
        profileStatus: body.profileStatus,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILE_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
