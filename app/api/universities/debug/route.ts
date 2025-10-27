import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // Fetch the first 3 universities as a test
    const universities = await prisma.university.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    return NextResponse.json({
      status: "ok",
      count: universities.length,
      data: universities
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch test universities", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}