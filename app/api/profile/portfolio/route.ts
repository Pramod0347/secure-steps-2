import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * GET /api/profile/portfolio
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolio = await prisma.portfolioItem.findMany({
      where: { isPublic: true },
      orderBy: [{ section: "asc" }, { order: "asc" }],
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("[PORTFOLIO_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/portfolio
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, section, imageUrl, attachmentUrl, order } =
      body

    const item = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        category,
        section: section || category || "PORTFOLIO",
        imageUrl,
        attachmentUrl,
        order: order || 0,
        isPublic: true,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("[PORTFOLIO_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
