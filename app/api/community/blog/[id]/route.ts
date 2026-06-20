import { NextRequest, NextResponse } from "next/server"
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_END_POINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  },
})

function getR2Key(fileUrl: string) {
  const publicUrl = process.env.CLOUDFLARE_PUBLIC_URL!
  if (!fileUrl.startsWith(publicUrl)) {
    return null
  }

  return fileUrl.replace(publicUrl + "/", "")
}

/**
 * PUT /api/community/blog/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSessionUser(req)
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, fileName, summary, coverImage, published, fileUrl } = body

    const existing = await prisma.blog.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(fileName !== undefined ? { fileName } : {}),
        ...(summary !== undefined ? { summary } : {}),
        ...(coverImage !== undefined ? { coverImage } : {}),
        ...(published !== undefined ? { published } : {}),
        ...(fileUrl !== undefined ? { fileUrl } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[BLOG_PUT]", error)
    return NextResponse.json(
      { error: "Failed to update blog entry" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/community/blog/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSessionUser(req)
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.blog.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    if (existing.fileUrl) {
      const key = getR2Key(existing.fileUrl)
      if (key) {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME || "secure-steps-db",
            Key: key,
          })
        )
      }
    }

    await prisma.blog.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Blog deleted" }, { status: 200 })
  } catch (error) {
    console.error("[BLOG_DELETE]", error)
    return NextResponse.json(
      { error: "Failed to delete blog entry" },
      { status: 500 }
    )
  }
}
