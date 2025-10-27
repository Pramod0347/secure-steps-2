/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import getHeaderOrCookie from "@/app/utils/getCookies";

export async function POST(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const url = new URL(req.url);
    const accommodationId = url.searchParams.get("id");
    if (!accommodationId) {
      return NextResponse.json({ error: "Accommodation ID required" }, { status: 400 });
    }

    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId }
    });
    if (!accommodation) {
      return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
    }

    const liked = await prisma.likedAccommodations.create({
      data: {
        userId,
        accommodationId
      }
    });

    return NextResponse.json(liked, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/accommodations/like:", error);
    if (error instanceof Error && (error as Error)) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to like accommodation" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const url = new URL(req.url);
    const accommodationId = url.searchParams.get("id");
    if (!accommodationId) {
      return NextResponse.json({ error: "Accommodation ID required" }, { status: 400 });
    }

    await prisma.likedAccommodations.delete({
      where: {
        userId_accommodationId: {
          userId,
          accommodationId
        }
      }
    });

    return NextResponse.json({ message: "Like removed successfully" });
  } catch (error: unknown) {
    if (error instanceof Error && (error as Error)) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to remove like" }, { status: 500 });
  }
}
