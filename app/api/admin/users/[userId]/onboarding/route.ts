import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"
import { EducationLevel } from "@prisma/client"
import { z } from "zod"

const OnboardingInputSchema = z.object({
  educationLevel: z.nativeEnum(EducationLevel),
})

async function requireAdmin(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session?.userId) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  if (session.role !== "ADMIN") {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }
  return { ok: true as const, session }
}

async function ensureUserProfile(userId: string) {
  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (existing) return existing

  return prisma.userProfile.create({
    data: {
      userId,
      profileStatus: "IN_PROGRESS",
    },
    select: { id: true },
  })
}

type Params = { params: Promise<{ userId: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.ok) return auth.response

    const { userId } = await params
    const body = await req.json()
    const parsed = OnboardingInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userProfile = await ensureUserProfile(user.id)
    const onboardingInfo = await prisma.onboardingInfo.upsert({
      where: { userProfileId: userProfile.id },
      create: {
        userProfileId: userProfile.id,
        educationLevel: parsed.data.educationLevel,
      },
      update: {
        educationLevel: parsed.data.educationLevel,
      },
      select: {
        id: true,
        educationLevel: true,
        userProfileId: true,
      },
    })

    return NextResponse.json({ onboardingInfo })
  } catch (error) {
    console.error("[ADMIN_USER_ONBOARDING_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
