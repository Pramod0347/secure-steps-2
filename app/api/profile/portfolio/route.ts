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

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const portfolio = await prisma.portfolioItem.findMany({
      where: { userProfileId: userProfile.id },
      orderBy: { order: "asc" },
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
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, imageUrl, attachmentUrl, order } =
      body

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const item = await prisma.portfolioItem.create({
      data: {
        userProfileId: userProfile.id,
        title,
        description,
        category,
        imageUrl,
        attachmentUrl,
        order: order || 0,
      },
    })

    await prisma.userProfile.update({
      where: { id: userProfile.id },
      data: { lastUpdatedSection: "portfolio" },
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
