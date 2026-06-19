import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * DELETE /api/profile/portfolio/[id]
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

    const item = await prisma.portfolioItem.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    await prisma.portfolioItem.delete({ where: { id } })

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSessionUser(req)
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const item = await prisma.portfolioItem.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    const updated = await prisma.portfolioItem.update({
      where: { id },
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
