/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

import {
  ForumPostSchema,
  ForumSchema,
  ForumSearchSchema,
  ForumTopicSchema,
  UpdateForumSchema,
  UpdatePostSchema,
  UpdateTopicSchema,
} from "@/app/lib/types/community";
import handleError from "@/app/utils/handleError";
import getHeaderOrCookie from "@/app/utils/getCookies";
// import { Prisma } from "@prisma/client";

// Pagination helper with improved type safety and limits
const paginate = (page: number = 1, limit: number = 10) => ({
  skip: Math.max(0, (page - 1) * limit),
  take: Math.min(Math.max(1, limit), 100), // Ensure reasonable pagination limits
});


// Main Route Handler
export async function POST(req: NextRequest) {
  try {

    console.log("start creating forums....");

    const userid = getHeaderOrCookie(req, "userId");
    const user = {userId:userid as string};

    console.log("middleware data form forums :",req.headers.get("x-user-id"))

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json();

    console.log("forums data :",body);

    switch (action) {
      case "createForum":
        return createForum(body, user);
      case "createTopic":
        return createForumTopic(body, user);
      case "createPost":
        return createForumPost(body, user);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    // const userId = getHeaderOrCookie(req, "userId");
    // const user = { userId: userId as string };  

    switch (action) {
      case "listForums":
        return listForums(searchParams);
      case "listTopics":
        return listForumTopics(searchParams);
      case "listPosts":
        return listForumPosts(searchParams);
      case "getForumDetails":
        return getForumDetails(searchParams.get("forumId"));
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

// Forum Creation with Enhanced Permissions
async function createForum(body: any, user: { userId: string }) {
  const validatedData = ForumSchema.parse(body);

  // Check group membership and permissions
  const group = await prisma.group.findUnique({
    where: { id: validatedData.groupId },
    include: {
      members: {
        where: {
          userId: user.userId,
          OR: [{ role: "ADMIN" }, { role: "OWNER" }, { role: "MODERATOR" }],
        },
      },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  if(group){
    console.log("group is present in the DB.");
  }

  if (group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  console.log("validate data before creating forum :",validatedData);

//   problem is here
  const newForum = await prisma.forum.create({
    data: {
      ...validatedData,
      creatorId: user.userId,
      viewCount: 0,
      topicCount: 0,
      replyCount: 0,
    },
  });

  return NextResponse.json(newForum, { status: 201 });
}

// Forum Topic Creation with Membership Check
async function createForumTopic(body: any, user: { userId: string }) {
  const validatedData = ForumTopicSchema.parse(body);

  // Validate forum and user permissions
  const forum = await prisma.forum.findUnique({
    where: { id: validatedData.forumId },
    include: {
      group: {
        include: {
          members: {
            where: { userId: user.userId },
          },
        },
      },
    },
  });

  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }

  if (forum.group.members.length === 0) {
    return NextResponse.json({ error: "Not a group member" }, { status: 403 });
  }

  const newTopic = await prisma.$transaction(async (tx: any) => {
    const topic = await tx.forumTopic.create({
      data: {
        ...validatedData,
        creatorId: user.userId,
        viewCount: 0,
        replyCount: 0,
        lastReplyAt: new Date(),
      },
    });

    // Increment topic count for forum
    await tx.forum.update({
      where: { id: validatedData.forumId },
      data: {
        topicCount: { increment: 1 },
        lastReplyAt: new Date(),
      },
    });

    return topic;
  });

  return NextResponse.json(newTopic, { status: 201 });
}

// Forum Post Creation with Comprehensive Checks
async function createForumPost(body: any, user: { userId: string }) {
  const validatedData = ForumPostSchema.parse(body);

  // Validate topic and user permissions
  const topic = await prisma.forumTopic.findUnique({
    where: { id: validatedData.topicId },
    include: {
      forum: {
        include: {
          group: {
            include: {
              members: {
                where: { userId: user.userId },
              },
            },
          },
        },
      },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  if (topic.forum.group.members.length === 0) {
    return NextResponse.json({ error: "Not a group member" }, { status: 403 });
  }

  // Check if topic is closed
  if (topic.isClosed) {
    return NextResponse.json({ error: "Topic is closed" }, { status: 403 });
  }

  const newPost = await prisma.$transaction(async (tx:any) => {
    const post = await tx.forumPost.create({
      data: {
        ...validatedData,
        creatorId: user.userId,
        likes: 0,
      },
    });

    // Increment reply count for topic and forum
    await tx.forumTopic.update({
      where: { id: validatedData.topicId },
      data: {
        replyCount: { increment: 1 },
        lastReplyAt: new Date(),
      },
    });

    await tx.forum.update({
      where: { id: topic.forumId },
      data: {
        lastReplyAt: new Date(),
      },
    });

    return post;
  });

  return NextResponse.json(newPost, { status: 201 });
}

// List Forums with Filtering and Pagination
async function listForums(
  searchParams: URLSearchParams,
  
) {
  const { groupId, type, privacy, page = "1", limit = "10", query } = // Set default values for page and limit
    ForumSearchSchema.parse(Object.fromEntries(searchParams));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const whereCondition: any = {
    ...(groupId && { groupId }),
    ...(type && { type }),
    ...(privacy && { privacy }),
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  // List forums with basic metrics and basic group information
  const forums = await prisma.forum.findMany({
    where: whereCondition,
    ...paginate(pageNum, limitNum),
    include: {
      group: { select: { name: true, logo: true } },
      _count: {
        select: { topics: true, forumReplies: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(forums);
}

// List Forum Topics with Pagination and Filtering
async function listForumTopics(
  searchParams: URLSearchParams,

) {
  const { page, limit, query } = ForumSearchSchema.parse(
    Object.fromEntries(searchParams)
  );

  const forumId = searchParams.get("forumId");
  if (!forumId) {
    return NextResponse.json(
      { error: "Forum ID is required" },
      { status: 400 }
    );
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const whereCondition: any = {
    forumId,
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  const topics = await prisma.forumTopic.findMany({
    where: whereCondition,
    ...paginate(pageNum, limitNum),
    include: {
      creator: { select: { name: true, avatarUrl: true } },
      _count: {
        select: { posts: true, replies: true },
      },
    },
    orderBy: [{ isPinned: "desc" }, { lastReplyAt: "desc" }],
  });

  return NextResponse.json(topics);
}

// List Forum Posts with Threaded Structure
async function listForumPosts(
  searchParams: URLSearchParams,

) {
  const { page, limit, query } = ForumSearchSchema.parse(
    Object.fromEntries(searchParams)
  );

  const topicId = searchParams.get("topicId");
  if (!topicId) {
    return NextResponse.json(
      { error: "Topic ID is required" },
      { status: 400 }
    );
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const whereCondition: any = {
    topicId,
    parentPostId: null,
    ...(query && {
      content: { contains: query, mode: "insensitive" },
    }),
  };

  const posts = await prisma.forumPost.findMany({
    where: whereCondition,
    ...paginate(pageNum, limitNum),
    include: {
      creator: { select: { name: true, avatarUrl: true } },
      replies: {
        include: {
          creator: { select: { name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { replies: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(posts);
}

// Get Specific Forum Details
async function getForumDetails(
  forumId: string | null,
) {
  if (!forumId) {
    return NextResponse.json(
      { error: "Forum ID is required" },
      { status: 400 }
    );
  }

  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      group: true,
      creator: { select: { name: true, avatarUrl: true } },
      _count: {
        select: { topics: true, forumReplies: true },
      },
    },
  });

  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }

  return NextResponse.json(forum);
}


// Put
export async function PUT(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "userId");
    const user = { userId: userId as string };
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json();

    switch (action) {
      case "updateForum":
        return updateForum(body, user, searchParams.get("forumId"));
      case "updateTopic":
        return updateForumTopic(body, user, searchParams.get("topicId"));
      case "updatePost":
        return updateForumPost(body, user, searchParams.get("postId"));
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

// Delete
export async function DELETE(req: NextRequest) {
  try {
    const userId = getHeaderOrCookie(req, "userId");
    const user = { userId: userId as string };
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "deleteForum":
        return deleteForum(user, searchParams.get("forumId"));
      case "deleteTopic":
        return deleteForumTopic(user, searchParams.get("topicId"));
      case "deletePost":
        return deleteForumPost(user, searchParams.get("postId"));
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

async function updateForum(
  body: any,
  user: { userId: string },
  forumId: string | null
) {
  if (!forumId) {
    return NextResponse.json(
      { error: "Forum ID is required" },
      { status: 400 }
    );
  }

  const validatedData = UpdateForumSchema.parse(body);

  // Check forum ownership and permissions
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      group: {
        include: {
          members: {
            where: {
              userId: user.userId,
              OR: [{ role: "ADMIN" }, { role: "OWNER" }, { role: "MODERATOR" }],
            },
          },
        },
      },
    },
  });

  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }

  if (forum.group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  const updatedForum = await prisma.forum.update({
    where: { id: forumId },
    data: validatedData,
  });

  return NextResponse.json(updatedForum);
}

async function updateForumTopic(
  body: any,
  user: { userId: string },
  topicId: string | null
) {
  if (!topicId) {
    return NextResponse.json(
      { error: "Topic ID is required" },
      { status: 400 }
    );
  }

  const validatedData = UpdateTopicSchema.parse(body);

  // Validate topic and user permissions
  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    include: {
      forum: {
        include: {
          group: {
            include: {
              members: {
                where: {
                  userId: user.userId,
                  OR: [
                    { role: "ADMIN" },
                    { role: "OWNER" },
                    { role: "MODERATOR" },
                    { userId: user.userId }, // Changed from topic.creatorId to user.userId
                  ],
                },
              },
            },
          },
        },
      },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  if (topic.forum.group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  const updatedTopic = await prisma.forumTopic.update({
    where: { id: topicId },
    data: validatedData,
  });

  return NextResponse.json(updatedTopic);
}

async function updateForumPost(
  body: any,
  user: { userId: string },
  postId: string | null
) {
  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const validatedData = UpdatePostSchema.parse(body);

  // Validate post and user permissions
  const post:any = await prisma.forumPost.findUnique({
    where: { id: postId },
    include: {
      topic: {
        include: {
          forum: {
            include: {
              group: {
                include: {
                  members: {
                    where: {
                      userId: user.userId,
                      OR: [
                        { role: "ADMIN" },
                        { role: "MODERATOR" },
                        { userId: user.userId },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.topic.forum.group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  const updatedPost = await prisma.forumPost.update({
    where: { id: postId },
    data: validatedData,
  });

  return NextResponse.json(updatedPost);
}

async function deleteForum(user: { userId: string }, forumId: string | null) {
  if (!forumId) {
    return NextResponse.json(
      { error: "Forum ID is required" },
      { status: 400 }
    );
  }

  // Check forum ownership and permissions
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      group: {
        include: {
          members: {
            where: {
              userId: user.userId,
              OR: [{ role: "ADMIN" }, { role: "OWNER" }, { role: "MODERATOR" }],
            },
          },
        },
      },
    },
  });

  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }

  if (forum.group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  await prisma.forum.delete({
    where: { id: forumId },
  });

  return NextResponse.json({ message: "Forum deleted successfully" });
}

async function deleteForumTopic(
  user: { userId: string },
  topicId: string | null
) {
  if (!topicId) {
    return NextResponse.json(
      { error: "Topic ID is required" },
      { status: 400 }
    );
  }

  // Validate topic and user permissions
  const topic:any = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    include: {
      forum: {
        include: {
          group: {
            include: {
              members: {
                where: {
                  userId: user.userId,
                  OR: [
                    { role: "ADMIN" },
                    { role: "OWNER" },
                    { role: "MODERATOR" },
                    { userId: user.userId },
                  ],
                },
              },
            },
          },
        },
      },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  if (topic.forum.group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  await prisma.forumTopic.delete({
    where: { id: topicId },
  });

  return NextResponse.json({ message: "Topic deleted successfully" });
}

async function deleteForumPost(
  user: { userId: string },
  postId: string | null
) {
  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  // Validate post and user permissions
  const post:any = await prisma.forumPost.findUnique({
    where: { id: postId },
    include: {
      topic: {
        include: {
          forum: {
            include: {
              group: {
                include: {
                  members: {
                    where: {
                      userId: user.userId,
                      OR: [
                        { role: "ADMIN" },
                        { role: "OWNER" },
                        { role: "MODERATOR" },
                        { userId: user.userId },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.topic.forum.group.members.length === 0) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  await prisma.forumPost.delete({
    where: { id: postId },
  });

  return NextResponse.json({ message: "Post deleted successfully" });
}
