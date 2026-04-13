import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * PUT /api/profile/applications/[id]/milestones/[milestoneId]
 * Update milestone completion
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { completed } = body

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Verify ownership
    const application = await prisma.applicationTracking.findUnique({
      where: { id: params.id },
    })

    if (!application || application.userProfileId !== userProfile.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    const milestone = await prisma.applicationMilestone.update({
      where: { id: params.milestoneId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    // Calculate progress based on completed milestones
    const milestones = await prisma.applicationMilestone.findMany({
      where: { applicationTrackingId: params.id },
    })

    const completedCount = milestones.filter((m) => m.completed).length
    const progressPercentage = Math.round(
      (completedCount / milestones.length) * 100
    )

    // Update application progress
    await prisma.applicationTracking.update({
      where: { id: params.id },
      data: { progressPercentage },
    })

    return NextResponse.json(milestone)
  } catch (error) {
    console.error("[MILESTONE_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
