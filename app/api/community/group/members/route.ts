/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { sendGeneralMessageEmail } from "@/app/lib/email/sendEmail";
import getHeaderOrCookie from "@/app/utils/getCookies";

// Validation Schema for Member Operations
const MemberOperationSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

// Add Member to Group
export async function POST(req: NextRequest) {
  try {
    const userid = getHeaderOrCookie(req, "userId");
    const user = { userId: userid as string };
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { groupId, userId } = await MemberOperationSchema.parseAsync(body);


    // Check if the current user has permission to add members
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if the current user is an admin or moderator of the group
    const currentUserMembership = group.members.find(
      (m:any) =>
        m.userId === user.userId &&
        ["OWNER", "ADMIN", "MODERATOR"].includes(m.role)
    );

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: "Insufficient permissions to add members" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already a member of this group" },
        { status: 400 }
      );
    }

    // Add member in a transaction
    const newMember = await prisma.$transaction(async (tx:any) => {
      const member = await tx.groupMember.create({
        data: {
          groupId,
          userId,
          role: "MEMBER", // Default role
        },
      });

      // Update group followers count
      await tx.group.update({
        where: { id: groupId },
        data: { followersCount: { increment: 1 } },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          action: "GROUP_MEMBER_ADDED",
          entityType: "GROUP_MEMBER",
          entityId: member.id,
          details: JSON.stringify({
            groupId,
            addedUserId: userId,
          }),
        },
      });

      return member;
    });

    // Add this just before sending the email
    const userToAdd = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, username: true },
    });

    if (!userToAdd) {
      console.error(`User with ID ${userId} not found`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sendGeneralMessageEmail(userToAdd.email, {
      subject: "Group Membership Notification",
      heading: "Added to Group",
      message: `You have been added to the group "${group.name}" by Admin.`,
      ctaText: "View Group",
      ctaLink: `https://example.com/groups/${groupId}`,
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// Remove Member from Group or Remove Moderator Status
export async function DELETE(req: NextRequest) {
  try {
    const userid = getHeaderOrCookie(req, "userId");
    const user = { userId: userid as string };
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const userId = searchParams.get("userId");
    const action = searchParams.get("action"); // 'remove' or 'demote'

    if (!groupId || !userId) {
      return NextResponse.json(
        { error: "Group ID and User ID are required" },
        { status: 400 }
      );
    }

    // Find the group and check permissions
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if current user has permission
    const currentUserMembership = group.members.find(
      (m:any) => m.userId === user.userId && ["OWNER", "ADMIN"].includes(m.role)
    );

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Check if the user to be removed is actually a member
    const memberToRemove = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!memberToRemove) {
      return NextResponse.json(
        { error: "User is not a member of this group" },
        { status: 404 }
      );
    }

    // Perform the action in a transaction
    const result = await prisma.$transaction(async (tx:any) => {
      if (action === "demote") {
        // Demote from moderator to member
        const updatedMember = await tx.groupMember.update({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
          data: { role: "MEMBER" },
        });

        // Remove from group moderators
        await tx.group.update({
          where: { id: groupId },
          data: {
            moderators: {
              disconnect: { id: userId },
            },
          },
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            userId: user.userId,
            action: "GROUP_MODERATOR_DEMOTED",
            entityType: "GROUP_MEMBER",
            entityId: updatedMember.id,
            details: JSON.stringify({
              groupId,
              demotedUserId: userId,
            }),
          },
        });

        return updatedMember;
      } else {
        // Remove member completely
        const deletedMember = await tx.groupMember.delete({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
        });

        // Update group followers count
        await tx.group.update({
          where: { id: groupId },
          data: {
            followersCount: { decrement: 1 },
            moderators: {
              disconnect: { id: userId },
            },
          },
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            userId: user.userId,
            action: "GROUP_MEMBER_REMOVED",
            entityType: "GROUP_MEMBER",
            entityId: deletedMember.id,
            details: JSON.stringify({
              groupId,
              removedUserId: userId,
            }),
          },
        });

        return deletedMember;
      }
    });

    // Add this just before sending the email
    const userToAdd = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, username: true },
    });

    if (!userToAdd) {
      console.error(`User with ID ${userId} not found`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sendGeneralMessageEmail(userToAdd.email, {
      subject: "Group Membership Notification",
      heading: "Removed from the Group",
      message: `You have been removed from the group "${group.name}" by Admin.`,
      ctaText: "View Group",
      ctaLink: `https://example.com/groups/${groupId}`,
    });

    return NextResponse.json({
      success: true,
      message: "User removed from the Group",
      data: result,
    });

    
  } catch (error) {
    return handleError(error);
  }
}

// Promote to Moderator
export async function PUT(req: NextRequest) {
  try {
    const userid = getHeaderOrCookie(req, "userId");
    const user = { userId: userid as string };
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { groupId, userId } = await MemberOperationSchema.parseAsync(body);

    // Find the group and check permissions
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if current user has permission to promote
    const currentUserMembership = group.members.find(
      (m:any) => m.userId === user.userId && ["OWNER", "ADMIN"].includes(m.role)
    );

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: "Insufficient permissions to promote members" },
        { status: 403 }
      );
    }

    // Check if the user is a member of the group
    const memberToPromote = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!memberToPromote) {
      return NextResponse.json(
        { error: "User is not a member of this group" },
        { status: 400 }
      );
    }

    // Promote member in a transaction
    const promotedMember = await prisma.$transaction(async (tx:any) => {
      // Update member role
      const updatedMember = await tx.groupMember.update({
        where: {
          groupId_userId: {
            groupId,
            userId,
          },
        },
        data: { role: "MODERATOR" },
      });

      // Add to group moderators
      await tx.group.update({
        where: { id: groupId },
        data: {
          moderators: {
            connect: { id: userId },
          },
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          action: "GROUP_MODERATOR_PROMOTED",
          entityType: "GROUP_MEMBER",
          entityId: updatedMember.id,
          details: JSON.stringify({
            groupId,
            promotedUserId: userId,
          }),
        },
      });

      return updatedMember;
    });

    return NextResponse.json(promotedMember);
  } catch (error) {
    return handleError(error);
  }
}

// Error Handling Utility
function handleError(error: unknown) {
  console.error("[GROUP_MEMBER_API_ERROR]", error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "Unauthorized":
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      default:
        return NextResponse.json(
          {
            error: "Internal server error",
            details: error.message,
          },
          { status: 500 }
        );
    }
  }

  return NextResponse.json(
    { error: "Unknown error occurred" },
    { status: 500 }
  );
}
