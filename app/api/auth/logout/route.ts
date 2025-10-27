// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    console.log("logout started...");
    const accessToken = req.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "No access token found" },
        { status: 400 }
      );
    }

    // Delete the session from the database
    const session = await prisma.session.findFirst({
      where: {sessionToken: accessToken },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      );
    }

    await prisma.session.delete({
      where: { id: session.id },
    });

    console.log(`Session deleted for user ID: ${session.userId}`);

    // Clear cookies
    const response = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );

    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
