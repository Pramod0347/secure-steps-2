import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * PUT /api/profile/applications/[id]
 * Update application status and progress
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
    const { status, progressPercentage, notes } = body

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

    const updated = await prisma.applicationTracking.update({
      where: { id: params.id },
      data: {
        status,
        progressPercentage: progressPercentage || application.progressPercentage,
        notes: notes || application.notes,
      },
      include: {
        milestones: { orderBy: { order: "asc" } },
        university: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[APPLICATIONS_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/profile/applications/[id]
 * Delete application
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

    await prisma.applicationTracking.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: "Application deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[APPLICATIONS_DELETE]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
