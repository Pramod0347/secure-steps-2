import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * GET /api/profile/documents
 * Get all documents
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

    const documents = await prisma.userDocument.findMany({
      where: { userProfileId: userProfile.id },
      orderBy: { uploadedAt: "desc" },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/documents
 * Upload document (receives S3 data from client)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      originalName,
      fileType,
      fileSize,
      category,
      s3Key,
      s3Url,
    } = body

    if (!name || !category || !s3Url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
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

    const document = await prisma.userDocument.create({
      data: {
        userProfileId: userProfile.id,
        name,
        originalName: originalName || name,
        fileType: fileType || "pdf",
        fileSize: fileSize || 0,
        category,
        s3Key: s3Key || "",
        s3Url,
        status: "UPLOADED",
      },
    })

    await prisma.userProfile.update({
      where: { id: userProfile.id },
      data: { lastUpdatedSection: "documents" },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
