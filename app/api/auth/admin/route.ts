import { prisma } from "@/app/lib/prisma";
// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { username, email } = body;

    if (!email && !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Email or username is required",
        },
        { status: 400 }
      );
    }

    // Find the user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      },
      select: {
        id: true,
        role: true,
        isVerified: true
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const userId = existingUser.id;
    const userRole = existingUser.role;

    console.log("userId : ", userId);
    console.log("userRole : ", userRole);

    if (!userId || !userRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Delete all user data in the correct order to maintain referential integrity
    await prisma.$transaction([
      // First delete all dependent records
      prisma.notification.deleteMany({
        where: { userId: userId },
      }),
      prisma.oTP.deleteMany({
        where: { userId: userId },
      }),
      prisma.token.deleteMany({
        where: { userId: userId },
      }),
      prisma.session.deleteMany({
        where: { userId: userId },
      }),
      prisma.follow.deleteMany({
        where: {
          OR: [
            { followerId: userId },
            { followingId: userId }
          ]
        },
      }),
      prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
      }),
      prisma.accommodationReview.deleteMany({
        where: { userId: userId },
      }),
      prisma.loanApplication.deleteMany({
        where: { userId: userId },
      }),
      prisma.groupMember.deleteMany({
        where: { userId: userId },
      }),
      prisma.article.deleteMany({
        where: { creatorId: userId },
      }),
      prisma.forumReplyReaction.deleteMany({
        where: { userId: userId },
      }),
      prisma.forumPostReaction.deleteMany({
        where: { userId: userId },
      }),
      prisma.forumReply.deleteMany({
        where: { userId: userId },
      }),
      prisma.forumPost.deleteMany({
        where: { creatorId: userId },
      }),
      prisma.forumTopic.deleteMany({
        where: { creatorId: userId },
      }),
      prisma.forum.deleteMany({
        where: { creatorId: userId },
      }),
      // If user is a landlord, delete their accommodations
      ...(userRole === 'LANDLORD' ? [
        prisma.accommodation.deleteMany({
          where: { landlordId: userId },
        })
      ] : []),
      // Finally delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    // Clear session cookie
    // const cookieStore = cookies();

    // cookieStore.delete("access_token");
    // cookieStore.delete("refresh_token");

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE_USER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete account",
       
      },
      { status: 500 }
    );
  }
}