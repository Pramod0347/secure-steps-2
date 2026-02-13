import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"

/**
 * GET /api/profile/visa-checklist
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

    const checklists = await prisma.visaChecklist.findMany({
      where: { userProfileId: userProfile.id },
      include: { items: { orderBy: { order: "asc" } } },
    })

    return NextResponse.json(checklists)
  } catch (error) {
    console.error("[VISA_CHECKLIST_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/visa-checklist
 * Create visa checklist for a country
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { country, estimatedCost, currency, items = [] } = body

    if (!country) {
      return NextResponse.json(
        { error: "Country required" },
        { status: 400 }
      )
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const checklist = await prisma.visaChecklist.create({
      data: {
        userProfileId: userProfile.id,
        country,
        estimatedCost,
        currency,
        items: {
          create: items.map((item: any, idx: number) => ({
            title: item.title,
            description: item.description,
            order: idx,
          })),
        },
      },
      include: { items: { orderBy: { order: "asc" } } },
    })

    await prisma.userProfile.update({
      where: { id: userProfile.id },
      data: { lastUpdatedSection: "visa" },
    })

    return NextResponse.json(checklist, { status: 201 })
  } catch (error) {
    console.error("[VISA_CHECKLIST_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
