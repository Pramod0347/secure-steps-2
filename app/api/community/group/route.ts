/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { GroupSchema, GroupSearchSchema } from "@/app/lib/types/community";
import getHeaderOrCookie from "@/app/utils/getCookies";
import { Prisma } from "@prisma/client";
// import { Prisma } from "@prisma/client";

// Pagination helper with improved logic
const paginate = (page: number = 1, limit: number = 10) => ({
  skip: Math.max(0, (page - 1) * limit),
  take: Math.min(Math.max(1, limit), 100),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await req.formData();
    const body = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      privacy: formData.get('privacy') as string,
      slug: formData.get('slug') as string,
      isPinned: formData.get('isPinned') === 'true',
      banner: formData.get('banner') as File | null,
      logo: formData.get('logo') as File | null
    };

    const validatedData = await GroupSchema.parse({
      ...body,
      banner: body.banner ? await saveFile(body.banner, 'banner') : undefined,
      logo: body.logo ? await saveFile(body.logo, 'logo') : undefined
    });

    const existingGroup = await prisma.group.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
      },
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: "A group with this name or slug already exists" },
        { status: 409 }
      );
    }

    const newGroup = await prisma.$transaction(async (tx:any) => {
      const group = await tx.group.create({
        data: {
          ...validatedData,
          createdById: userId,
          members: {
            create: [
              {
                userId: userId,
                role: "ADMIN",
              },
            ],
          },
        },
        include: {
          members: {
            select: {
              userId: true,
              role: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: userId,
          action: "GROUP_CREATION",
          entityType: "GROUP",
          entityId: group.id,
          details: JSON.stringify({
            groupName: group.name,
            privacy: group.privacy,
          }),
        },
      });

      return group;
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("[GROUP_API_ERROR]", error);
    return handleError(error);
  }
}

async function saveFile(file: File, type: 'banner' | 'logo'): Promise<string> {
  try {
    const width = type === 'banner' ? 1200 : 300;
    const height = type === 'banner' ? 400 : 300;
    return `https://placehold.co/${width}x${height}`;
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    if (queryParams.id) {
      return await getGroupById(queryParams.id);
    }

    const {
      query,
      page = "1",
      limit = "10",
      privacy,
      sortBy = "createdAt",
      sortOrder = "desc",
      createdById,
      minMembers,
      maxMembers,
    } = GroupSearchSchema.parse(queryParams);

    const { skip, take } = paginate(Number(page), Number(limit));

    const whereClause: Prisma.GroupWhereInput = {
      ...(privacy && { privacy }),
      ...(createdById && { createdById }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }),
      ...(minMembers || maxMembers ? {
        members: {
          some: {
            ...(minMembers && { 
              group: {
                members: {
                  some: {}
                }
              }
            }),
            ...(maxMembers && { 
              group: {
                members: {
                  some: {}
                }
              }
            })
          }
        }
      } : {})
    };

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        where: whereClause,
        include: {
          _count: { select: { members: true } },
          createdBy: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.group.count({ where: whereClause }),
    ]);

    const pages = Math.ceil(total / Number(limit));

    return NextResponse.json({
      groups: groups.map((group:any) => ({
        ...group,
        membersCount: group._count.members,
        creatorUsername: group.createdBy?.username,
      })),
      pagination: { total, pages, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return handleError(error);
  }
}

async function getGroupById(groupId: string) {
  try {
    const validatedId = groupId;

    const group = await prisma.group.findUnique({
      where: { id: validatedId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                role: true
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { 
            members: true,
            events: true,
            articles: true,
            forums: true
          },
        },
        events: {
          where: {
            date: {
              gte: new Date() // Only fetch upcoming events
            }
          },
          include: {
            contactBy: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              }
            },
            _count: {
              select: {
                registrations: true
              }
            }
          },
          orderBy: {
            date: 'asc'
          },
          take: 5 // Limit to 5 upcoming events
        },
        forums: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              }
            },
            topics: {
              include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                  }
                },
                _count: {
                  select: {
                    posts: true,
                    replies: true
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 5 // Limit to 5 recent topics per forum
            },
            _count: {
              select: {
                topics: true,
                forumReplies: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        articles: {
          where: {
            status: 'PUBLISHED'
          },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              }
            },
            _count: {
              select: {
                votes: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // Limit to 10 recent articles
        }
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Transform the data for response
    const response = {
      ...group,
      membersCount: group._count.members,
      eventsCount: group._count.events,
      articlesCount: group._count.articles,
      forumsCount: group._count.forums,
      members: group.members.map((member:any) => ({
        userId: member.user.id,
        username: member.user.username,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
      })),
      creatorUsername: group.createdBy?.username,
      creatorAvatar: group.createdBy?.avatarUrl,
      // Transform events data
      events: group.events.map((event:any) => ({
        ...event,
        hostUsername: event.contactBy.username,
        hostAvatar: event.contactBy.avatarUrl,
        registrationsCount: event._count.registrations
      })),
      // Transform forums data
      forums: group.forums.map((forum:any) => ({
        ...forum,
        creatorUsername: forum.creator.username,
        creatorAvatar: forum.creator.avatarUrl,
        topicsCount: forum._count.topics,
        repliesCount: forum._count.forumReplies,
        recentTopics: forum.topics.map((topic:any) => ({
          ...topic,
          creatorUsername: topic.creator.username,
          creatorAvatar: topic.creator.avatarUrl,
          postsCount: topic._count.posts,
          repliesCount: topic._count.replies
        }))
      })),
      // Transform articles data
      articles: group.articles.map((article:any) => ({
        ...article,
        creatorUsername: article.creator.username,
        creatorAvatar: article.creator.avatarUrl,
        votesCount: article._count.votes
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("id");

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    const validatedData = GroupSchema.partial().parse(body);

    const existingGroup = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!existingGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const userMembership = existingGroup.members.find(
      (m:any) => m.userId === userId
    );
    const canUpdate =
      userMembership &&
      ["OWNER", "ADMIN", "MODERATOR"].includes(userMembership.role);

    if (!canUpdate) {
      return NextResponse.json(
        { error: "Insufficient permissions to update group" },
        { status: 403 }
      );
    }

    const updatedGroup = await prisma.$transaction(async (tx:any) => {
      const group = await tx.group.update({
        where: { id: groupId },
        data: validatedData,
      });

      await tx.auditLog.create({
        data: {
          userId: userId,
          action: "GROUP_UPDATE",
          entityType: "GROUP",
          entityId: groupId,
          details: JSON.stringify({
            changes: Object.keys(validatedData),
          }),
        },
      });

      return group;
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("id");

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const isOwner = group.members.some(
      (m:any) => m.userId === userId && m.role === "OWNER"
    );

    if (!isOwner) {
      return NextResponse.json(
        { error: "Only group owner can delete the group" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx:any) => {
      await tx.groupMember.deleteMany({ where: { groupId } });
      await tx.group.delete({ where: { id: groupId } });

      await tx.auditLog.create({
        data: {
          userId: userId,
          action: "GROUP_DELETION",
          entityType: "GROUP",
          entityId: groupId,
          details: JSON.stringify({
            groupName: group.name,
          }),
        },
      });
    });

    return NextResponse.json({
      message: "Group deleted successfully",
      deletedId: groupId,
    });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  console.error("[GROUP_API_ERROR]", error);

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
      case "Group not found":
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
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