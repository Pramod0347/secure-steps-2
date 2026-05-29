import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"
import { EducationLevel } from "@prisma/client"
import { z } from "zod"

const OnboardingInputSchema = z.object({
  educationLevel: z.nativeEnum(EducationLevel),
})

async function ensureUserProfile(userId: string) {
  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (existing) {
    return existing
  }

  return prisma.userProfile.create({
    data: {
      userId,
      profileStatus: "IN_PROGRESS",
    },
    select: { id: true },
  })
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.userId },
      include: { onboardingInfo: true },
    })

    return NextResponse.json({
      onboardingInfo: profile?.onboardingInfo ?? null,
    })
  } catch (error) {
    console.error("[PROFILE_ONBOARDING_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = OnboardingInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const userProfile = await ensureUserProfile(session.userId)

    const onboardingInfo = await prisma.onboardingInfo.upsert({
      where: { userProfileId: userProfile.id },
      create: {
        userProfileId: userProfile.id,
        educationLevel: parsed.data.educationLevel,
      },
      update: {
        educationLevel: parsed.data.educationLevel,
      },
    })

    return NextResponse.json({ onboardingInfo }, { status: 201 })
  } catch (error) {
    console.error("[PROFILE_ONBOARDING_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = OnboardingInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const userProfile = await ensureUserProfile(session.userId)

    const onboardingInfo = await prisma.onboardingInfo.upsert({
      where: { userProfileId: userProfile.id },
      create: {
        userProfileId: userProfile.id,
        educationLevel: parsed.data.educationLevel,
      },
      update: {
        educationLevel: parsed.data.educationLevel,
      },
    })

    return NextResponse.json({ onboardingInfo })
  } catch (error) {
    console.error("[PROFILE_ONBOARDING_PUT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
