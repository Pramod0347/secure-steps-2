import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function buildUniqueSlug(base: string) {
  const stamp = Date.now().toString(36)
  const slug = slugify(base || "blog")
  return `${slug || "blog"}-${stamp}`
}

/**
 * GET /api/community/blog
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    const isAdmin = session?.userId && session.role === "ADMIN"

    const blogs = await prisma.blog.findMany({
      where: {
        ...(isAdmin ? {} : { published: true }),
        fileUrl: { not: null },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        url: blog.fileUrl ? encodeURI(blog.fileUrl) : "",
        fileName: blog.fileName || blog.title,
        uploadDate: blog.createdAt.toISOString(),
        coverImage: blog.coverImage,
        published: blog.published,
      }))
    )
  } catch (error) {
    console.error("[BLOG_GET]", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/blog
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      fileName,
      fileUrl,
      summary = "",
      coverImage = null,
      published = true,
    } = body

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: "Title and fileUrl are required" },
        { status: 400 }
      )
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug: buildUniqueSlug(fileName || title),
        summary,
        coverImage,
        fileName: fileName || title,
        fileUrl,
        published,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("[BLOG_POST]", error)
    return NextResponse.json(
      { error: "Failed to create blog entry" },
      { status: 500 }
    )
  }
}
