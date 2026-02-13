import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * DELETE /api/profile/documents/[id]
 * Delete document
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
    const document = await prisma.userDocument.findUnique({
      where: { id: params.id },
    })

    if (!document || document.userProfileId !== userProfile.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    await prisma.userDocument.delete({
      where: { id: params.id },
    })

    // TODO: Delete from S3 bucket

    return NextResponse.json(
      { message: "Document deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[DOCUMENTS_DELETE]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile/documents/[id]
 * Update document (status, notes)
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
    const { status, notes, name } = body

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
    const document = await prisma.userDocument.findUnique({
      where: { id: params.id },
    })

    if (!document || document.userProfileId !== userProfile.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    const updated = await prisma.userDocument.update({
      where: { id: params.id },
      data: {
        status: status || document.status,
        notes: notes || document.notes,
        name: name || document.name,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[DOCUMENTS_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
