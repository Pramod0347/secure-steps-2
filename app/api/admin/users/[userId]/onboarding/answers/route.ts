import { NextRequest, NextResponse } from "next/server"
import { EducationLevel, OnboardingAnswerType, Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/app/lib/prisma"
import { getSessionUser } from "@/app/lib/auth-helper"
import { ONBOARDING_QUESTION_BANK } from "@/app/lib/profile/onboarding-question-bank"

const AnswerInputSchema = z.object({
  questionKey: z.string().min(1),
  answerType: z.nativeEnum(OnboardingAnswerType),
  answerText: z.string().optional().nullable(),
  answerNumber: z.number().optional().nullable(),
  answerBoolean: z.boolean().optional().nullable(),
  answerJson: z.any().optional().nullable(),
})

const SaveAnswersSchema = z.object({
  educationLevel: z.nativeEnum(EducationLevel),
  answers: z.array(AnswerInputSchema).min(1),
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
const prismaAny = prisma as any
const hasOnboardingAnswerDelegate =
  typeof prismaAny.onboardingAnswer?.findMany === "function"

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.ok) return auth.response

    const { userId } = await params
    const levelParamRaw = req.nextUrl.searchParams.get("educationLevel")
    const levelParam = (levelParamRaw || "").toUpperCase()
    const levelAliasMap: Record<string, EducationLevel> = {
      BACHELORS: "BACHELOR",
      BACHELOR: "BACHELOR",
      MASTERS: "MASTER",
      MASTER: "MASTER",
      DOCTORAL: "PHD",
      DOCTORATE: "PHD",
      PHD: "PHD",
      HIGH_SCHOOL: "HIGH_SCHOOL",
    }
    const normalizedLevel = levelAliasMap[levelParam]
    const educationLevel = normalizedLevel || null

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, userProfile: { select: { id: true } } },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!educationLevel) {
      return NextResponse.json({
        questionBank: ONBOARDING_QUESTION_BANK,
        answers: [],
      })
    }

    let answers: any[] = []
    if (user.userProfile) {
      try {
        if (hasOnboardingAnswerDelegate) {
          answers = await prismaAny.onboardingAnswer.findMany({
            where: {
              userProfileId: user.userProfile.id,
              educationLevel,
            },
            orderBy: { updatedAt: "asc" },
          })
        } else {
          answers = await prisma.$queryRaw<any[]>(
            Prisma.sql`
              SELECT
                "id",
                "questionKey",
                "answerType",
                "answerText",
                "answerNumber",
                "answerBoolean",
                "answerJson",
                "createdAt",
                "updatedAt"
              FROM "OnboardingAnswer"
              WHERE "userProfileId" = ${user.userProfile.id}
                AND "educationLevel" = CAST(${educationLevel} AS "EducationLevel")
              ORDER BY "updatedAt" ASC
            `
          )
        }
      } catch (err) {
        console.error("[ADMIN_USER_ONBOARDING_ANSWERS_GET_FETCH]", err)
        answers = []
      }
    }

    return NextResponse.json({
      educationLevel,
      questions: ONBOARDING_QUESTION_BANK[educationLevel],
      answers,
    })
  } catch (error) {
    console.error("[ADMIN_USER_ONBOARDING_ANSWERS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.ok) return auth.response

    const { userId } = await params
    const body = await req.json()
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }
    const parsed = SaveAnswersSchema.safeParse(body)
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
    const { educationLevel, answers } = parsed.data
    const questionDefs = ONBOARDING_QUESTION_BANK[educationLevel] || []
    const questionMap = new Map(questionDefs.map((q) => [q.key, q]))

    const missingRequired: string[] = []
    for (const q of questionDefs) {
      if (!q.required) continue
      const submitted = answers.find((a) => a.questionKey === q.key)
      if (!submitted) {
        missingRequired.push(q.key)
        continue
      }
      const hasText = typeof submitted.answerText === "string" && submitted.answerText.trim().length > 0
      const hasNumber = typeof submitted.answerNumber === "number"
      const hasBool = typeof submitted.answerBoolean === "boolean"
      const hasJsonArray = Array.isArray(submitted.answerJson) && submitted.answerJson.length > 0
      if (!(hasText || hasNumber || hasBool || hasJsonArray)) {
        missingRequired.push(q.key)
      }
    }
    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required answers",
          fields: missingRequired,
        },
        { status: 400 }
      )
    }

    const saved: any[] = []
    for (const answer of answers) {
      const qDef = questionMap.get(answer.questionKey)
      if (qDef?.key === "country_preferences" && Array.isArray(answer.answerJson)) {
        if (answer.answerJson.length > 2) {
          return NextResponse.json(
            { error: "Country preference supports maximum 2 countries" },
            { status: 400 }
          )
        }
      }
      if (hasOnboardingAnswerDelegate) {
        const upserted = await prismaAny.onboardingAnswer.upsert({
          where: {
            userProfileId_educationLevel_questionKey: {
              userProfileId: userProfile.id,
              educationLevel,
              questionKey: answer.questionKey,
            },
          },
          create: {
            userProfileId: userProfile.id,
            educationLevel,
            questionKey: answer.questionKey,
            answerType: answer.answerType,
            answerText: answer.answerText ?? null,
            answerNumber: answer.answerNumber ?? null,
            answerBoolean: answer.answerBoolean ?? null,
            answerJson: answer.answerJson ?? null,
          },
          update: {
            answerType: answer.answerType,
            answerText: answer.answerText ?? null,
            answerNumber: answer.answerNumber ?? null,
            answerBoolean: answer.answerBoolean ?? null,
            answerJson: answer.answerJson ?? null,
          },
        })
        saved.push(upserted)
      } else {
        const jsonText =
          answer.answerJson === undefined || answer.answerJson === null
            ? null
            : JSON.stringify(answer.answerJson)

        await prisma.$executeRaw(
          Prisma.sql`
            INSERT INTO "OnboardingAnswer"
            ("id","userProfileId","educationLevel","questionKey","answerType","answerText","answerNumber","answerBoolean","answerJson","createdAt","updatedAt")
            VALUES
            (${`tmp_${Math.random().toString(36).slice(2)}`}, ${userProfile.id}, ${educationLevel}, ${answer.questionKey}, ${answer.answerType}, ${answer.answerText ?? null}, ${answer.answerNumber ?? null}, ${answer.answerBoolean ?? null}, ${jsonText}, NOW(), NOW())
            ON CONFLICT ("userProfileId","educationLevel","questionKey")
            DO UPDATE SET
              "answerType" = EXCLUDED."answerType",
              "answerText" = EXCLUDED."answerText",
              "answerNumber" = EXCLUDED."answerNumber",
              "answerBoolean" = EXCLUDED."answerBoolean",
              "answerJson" = EXCLUDED."answerJson",
              "updatedAt" = NOW()
          `
        )
        saved.push({
          userProfileId: userProfile.id,
          educationLevel,
          questionKey: answer.questionKey,
        })
      }
    }

    return NextResponse.json({
      educationLevel,
      savedCount: saved.length,
      saved,
    })
  } catch (error) {
    console.error("[ADMIN_USER_ONBOARDING_ANSWERS_PUT]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
