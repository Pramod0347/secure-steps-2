import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * PUT /api/profile/visa-checklist/[id]/items/[itemId]
 * Update checklist item
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
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
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Verify ownership
    const checklist = await prisma.visaChecklist.findUnique({
      where: { id: params.id },
    })

    if (!checklist || checklist.userProfileId !== userProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const item = await prisma.visaChecklistItem.update({
      where: { id: params.itemId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("[VISA_CHECKLIST_ITEM_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
