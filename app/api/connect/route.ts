/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import getHeaderOrCookie from "@/app/utils/getCookies";
import { Prisma, UserRole } from "@prisma/client";

 // Update the QuerySchema to use the correct UserRole enum
 const QuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default("20"),
  cursor: z.string().optional(),
  university: z.string().optional(),
  countryCode: z.string().optional(),
  role: z.enum(['STUDENT', 'LANDLORD', 'ADMIN']).optional(), // Specify exact roles
  excludeFollowing: z.string().transform(val => val === "true").default("false")
});

// type UserResponse = {
//   id: string;
//   username: string;
//   name: string;
//   avatarUrl: string | null;
//   bio: string | null;
//   role: string;
//   universityId: string | null;
//   department: string | null;
//   countryCode: string;
//   followersCount: number;
//   followingCount: number;
//   score?: number;
// };

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication using header/cookie
    const userId = getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // 2. Parse and validate query parameters
    const url = new URL(req.url);
    const queryResult = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
    
    if (!queryResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryResult.error.issues },
        { status: 400 }
      );
    }

    const { limit, cursor, university, countryCode, role, excludeFollowing } = queryResult.data;

    // 3. Get user's following list if needed
    let excludeIds = [userId];
    if (excludeFollowing) {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });
      excludeIds = [...excludeIds, ...following.map((f:any) => f.followingId)];
    }

    // 4. Get user's profile for matching
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        universityId: true,
        department: true,
        countryCode: true
      }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

  

// In the where clause
const whereClause: Prisma.UserWhereInput = {
  id: { notIn: excludeIds },
  isVerified: true,
  ...(university && { universityId: university }),
  ...(countryCode && { countryCode }),
  ...(role && { role: role as UserRole }) // Type assertion to UserRole
};

    // 6. Fetch users with pagination
    const users = await prisma.user.findMany({
      where: whereClause,
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: [
        { followersCount: 'desc' }, // Prioritize popular users
        { createdAt: 'desc' }       // Then newer users
      ],
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        banner:true,
        bio: true,
        role: true,
        universityId: true,
        department: true,
        countryCode: true,
        followersCount: true,
        followingCount: true,
      }
    });

    // 7. Calculate relevance scores and sort
    const scoredUsers = users.map((user:any) => {
      let score = 0;
      
      // Match university (highest weight)
      if (user.universityId === userProfile.universityId) {
        score += 3;
      }
      
      // Match department
      if (user.department === userProfile.department) {
        score += 2;
      }
      
      // Match country
      if (user.countryCode === userProfile.countryCode) {
        score += 1;
      }

      return {
        ...user,
        score
      };
    }).sort((a:any, b:any) => b.score - a.score);

    // 8. Get next cursor
    const nextCursor = users.length === limit ? users[users.length - 1].id : undefined;

    // 9. Return response with cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 's-maxage=1, stale-while-revalidate');

    return NextResponse.json({
      users: scoredUsers,
      nextCursor,
      total: await prisma.user.count({ where: whereClause })
    }, {
      headers
    });

  } catch (error) {
    console.error("Error in suggestions route:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}