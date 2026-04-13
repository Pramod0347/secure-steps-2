import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * GET /api/profile/applications
 * Get all applications
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
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const applications = await prisma.applicationTracking.findMany({
      where: { userProfileId: userProfile.id },
      include: {
        milestones: { orderBy: { order: "asc" } },
        university: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/applications
 * Create new application tracking
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { universityId, notes, applicationDeadline, milestones = [] } = body

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const application = await prisma.applicationTracking.create({
      data: {
        userProfileId: userProfile.id,
        universityId,
        status: "NOT_STARTED",
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
        notes,
        milestones: {
          create: milestones.map((m: any, idx: number) => ({
            title: m.title,
            description: m.description,
            order: idx,
          })),
        },
      },
      include: {
        milestones: { orderBy: { order: "asc" } },
        university: true,
      },
    })

    await prisma.userProfile.update({
      where: { id: userProfile.id },
      data: { lastUpdatedSection: "applications" },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("[APPLICATIONS_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
