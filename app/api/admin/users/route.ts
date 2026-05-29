import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"
import { UserRole } from "@prisma/client"
import { hash } from "bcryptjs"
import { z } from "zod"

const ManualUserSchema = z.object({
  username: z.string().trim().min(3),
  email: z.string().trim().email(),
  name: z.string().trim().min(1),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.STUDENT),
  countryCode: z.string().trim().optional().default("+91"),
  phoneNumber: z.string().trim().optional(),
  isVerified: z.boolean().optional().default(true),
  isEmailVerified: z.boolean().optional().default(true),
})

const BulkManualUserSchema = z.object({
  users: z.array(ManualUserSchema).min(1),
})

async function requireAdmin(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session?.userId) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  if (session.role !== "ADMIN") {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }
  return { ok: true as const, session }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.ok) {
      return auth.response
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        createdAt: true,
        userProfile: {
          select: {
            id: true,
            completionPercentage: true,
            profileStatus: true,
            selectedPackage: true,
            selectedCountry: true,
            onboardingInfo: {
              select: {
                educationLevel: true,
                targetIntake: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.ok) {
      return auth.response
    }

    const body = await req.json()
    const isBulk = Array.isArray(body?.users)

    if (isBulk) {
      const parsed = BulkManualUserSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation failed", details: parsed.error.flatten() },
          { status: 400 }
        )
      }

      const created: Array<{ id: string; email: string; username: string }> = []
      const failed: Array<{ email?: string; username?: string; reason: string }> = []

      for (const item of parsed.data.users) {
        try {
          const existing = await prisma.user.findFirst({
            where: {
              OR: [{ email: item.email.toLowerCase() }, { username: item.username }],
            },
            select: { id: true },
          })

          if (existing) {
            failed.push({
              email: item.email,
              username: item.username,
              reason: "Email or username already exists",
            })
            continue
          }

          const hashedPassword = item.password ? await hash(item.password, 12) : null

          const user = await prisma.user.create({
            data: {
              username: item.username,
              email: item.email.toLowerCase(),
              name: item.name,
              password: hashedPassword,
              role: item.role,
              countryCode: item.countryCode,
              phoneNumber: item.phoneNumber || null,
              isVerified: item.isVerified,
              isEmailVerified: item.isEmailVerified,
            },
            select: { id: true, email: true, username: true },
          })

          created.push(user)
        } catch (err) {
          failed.push({
            email: item.email,
            username: item.username,
            reason: err instanceof Error ? err.message : "Unknown error",
          })
        }
      }

      return NextResponse.json(
        {
          message: "Bulk import processed",
          createdCount: created.length,
          failedCount: failed.length,
          created,
          failed,
        },
        { status: 200 }
      )
    }

    const parsed = ManualUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const input = parsed.data
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email.toLowerCase() }, { username: input.username }],
      },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = input.password ? await hash(input.password, 12) : null

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email.toLowerCase(),
        name: input.name,
        password: hashedPassword,
        role: input.role,
        countryCode: input.countryCode,
        phoneNumber: input.phoneNumber || null,
        isVerified: input.isVerified,
        isEmailVerified: input.isEmailVerified,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("[ADMIN_USERS_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
