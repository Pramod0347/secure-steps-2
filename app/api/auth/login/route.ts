// 2. UPDATED LOGIN API ROUTE (/api/auth/login/route.ts)
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { LoginSchema } from "@/app/lib/validation/auth"
import { verifyPassword } from "@/app/utils/auth"
import { createSession } from "@/app/lib/session"

export async function POST(req: NextRequest) {
  try {
    console.log("Login started...")
    const body = await req.json()
    
    const validatedData = LoginSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: validatedData.error.errors
      }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: validatedData.data.email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        isVerified: true,
        role: true,
        otpBlockedUntil: true,
        otpRetryCount: true,
        name: true,
        bio: true,
        avatarUrl: true,
        banner: true,
        isPhoneVerified: true,
        isEmailVerified: true,
        followersCount: true,
        followingCount: true,
        countryCode: true,
        phoneNumber: true,
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials"
      }, { status: 401 })
    }

    // Check if user is blocked
    if (user.otpBlockedUntil && user.otpBlockedUntil > new Date()) {
      return NextResponse.json({
        success: false,
        message: "Account temporarily blocked"
      }, { status: 403 })
    }

    const isPasswordValid = await verifyPassword(
      validatedData.data.password as string,
      user.password as string
    )

    if (!isPasswordValid) {
      // Increment failed attempts
      const retryCount = (user.otpRetryCount || 0) + 1
      const updateData: any = { otpRetryCount: retryCount }
      
      // Block user after 5 failed attempts
      if (retryCount >= 5) {
        updateData.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })

      return NextResponse.json({
        success: false,
        message: retryCount >= 5 
          ? "Account blocked due to too many failed attempts" 
          : "Invalid credentials"
      }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "Account not verified"
      }, { status: 403 })
    }

    // Reset retry count on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        otpRetryCount: 0,
        otpBlockedUntil: null
      }
    })

    const userAgent = req.headers.get("user-agent") || "unknown"
    const ipAddress = req.headers.get("x-forwarded-for") || 
                     req.headers.get("x-real-ip") || "unknown"

    const { accessToken, refreshToken, session } = await createSession(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isVerified
      },
      {
        userAgent,
        ipAddress,
      }
    )

    // Create notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "New Login",
          message: `New login detected from ${userAgent}`,
          type: "LOGIN_ALERT",
          data: {
            timestamp: new Date(),
            userAgent,
            ip: ipAddress,
            sessionId: session.id,
          },
        },
      })
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError)
      // Don't fail login if notification creation fails
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isEmailVerified: user.isEmailVerified || false,
      isPhoneVerified: user.isPhoneVerified,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      banner: user.banner,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: userData
      }
    }, { status: 200 })

    // Set secure cookies
    const isProduction = process.env.NODE_ENV === 'production'
    
    response.cookies.set({
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    })

    response.cookies.set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    response.cookies.set({
      name: 'x-user-id',
      value: user.id,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/'
    })
    
    response.cookies.set({
      name: 'x-user-role',
      value: user.role,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    return response

  } catch (error) {
    console.error("[LOGIN_ERROR]", error)
    
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 })
  }
}