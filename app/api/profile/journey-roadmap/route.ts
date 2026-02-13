import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * GET /api/profile/journey-roadmap
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const milestones = await prisma.journeyMilestone.findMany({
      where: { userProfileId: userProfile.id },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(milestones)
  } catch (error) {
    console.error("[JOURNEY_ROADMAP_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/journey-roadmap
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, targetDate, order } = body

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const milestone = await prisma.journeyMilestone.create({
      data: {
        userProfileId: userProfile.id,
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        order,
        status: "PENDING",
      },
    })

    await prisma.userProfile.update({
      where: { id: userProfile.id },
      data: { lastUpdatedSection: "journey" },
    })

    return NextResponse.json(milestone, { status: 201 })
  } catch (error) {
    console.error("[JOURNEY_ROADMAP_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
