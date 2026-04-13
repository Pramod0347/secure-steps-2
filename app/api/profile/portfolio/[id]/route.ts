import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * DELETE /api/profile/portfolio/[id]
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

    const item = await prisma.portfolioItem.findUnique({
      where: { id: params.id },
    })

    if (!item || item.userProfileId !== userProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await prisma.portfolioItem.delete({ where: { id: params.id } })

    return NextResponse.json({ message: "Item deleted" }, { status: 200 })
  } catch (error) {
    console.error("[PORTFOLIO_DELETE]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile/portfolio/[id]
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

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const item = await prisma.portfolioItem.findUnique({
      where: { id: params.id },
    })

    if (!item || item.userProfileId !== userProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const updated = await prisma.portfolioItem.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PORTFOLIO_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
