import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * PUT /api/profile/journey-roadmap/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status, completedDate } = body

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const milestone = await prisma.journeyMilestone.findUnique({
      where: { id: params.id },
    })

    if (!milestone || milestone.userProfileId !== userProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const updated = await prisma.journeyMilestone.update({
      where: { id: params.id },
      data: {
        status,
        completedDate: completedDate ? new Date(completedDate) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[JOURNEY_ROADMAP_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/profile/journey-roadmap/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const milestone = await prisma.journeyMilestone.findUnique({
      where: { id: params.id },
    })

    if (!milestone || milestone.userProfileId !== userProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await prisma.journeyMilestone.delete({ where: { id: params.id } })

    return NextResponse.json({ message: "Milestone deleted" }, { status: 200 })
  } catch (error) {
    console.error("[JOURNEY_ROADMAP_DELETE]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
