import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import getHeaderOrCookie from "@/app/utils/getCookies";

// Input validation schema
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  date: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  image: z.string().url().optional(),
  location: z.string().min(1, "Location is required"),
  eventType: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  registrationType: z.enum(["FREE", "PAID", "INVITE_ONLY"]),
  totalSlots: z.number().int().positive(),
  waitlistSlots: z.number().int().optional(),
  ticketPrice: z.number().optional(),
  currency: z.string().optional(),
  address: z.string().optional(),
  virtualLink: z.string().url().optional(),
  groupId: z.string().min(1, "Group ID is required"),
});

// Define the type for validatedData
type EventData = z.infer<typeof eventSchema>;

// GET: Fetch events with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Build filter conditions
    const where: Prisma.EventWhereInput = {
      AND: [] as Prisma.EventWhereInput[],
    };

    // Ensure where.AND is always an array
    if (!Array.isArray(where.AND)) {
      where.AND = [];
    }

    // Add filters based on search parameters
    const creatorId = searchParams.get('creatorId');
    if (creatorId) {
      where.AND.push({ contactById: creatorId });
    }

    

    const location = searchParams.get('location');
    if (location) {
      where.AND.push({ 
        OR: [
          { location: { contains: location, mode: 'insensitive' } },
          { address: { contains: location, mode: 'insensitive' } }
        ]
      });
    }

    const startTime = searchParams.get('startTime');
    if (startTime) {
      where.AND.push({ startTime: { gte: new Date(startTime) } });
    }

    const slug = searchParams.get('slug');
    if (slug) {
      where.AND.push({ slug });
    }

    const title = searchParams.get('title');
    if (title) {
      where.AND.push({ title: { contains: title, mode: 'insensitive' } });
    }

    const groupId = searchParams.get('groupId');
    if (groupId) {
      where.AND.push({ groupId });
    }

    if (searchParams.has('endTime')) {
      where.AND.push({ endTime: { lte: new Date(searchParams.get('endTime')!) } });
    }

    if (searchParams.has('minPrice')) {
      where.AND.push({ ticketPrice: { gte: parseFloat(searchParams.get('minPrice')!) } });
    }

    if (searchParams.has('maxPrice')) {
      where.AND.push({ ticketPrice: { lte: parseFloat(searchParams.get('maxPrice')!) } });
    }

    // Pagination parameters
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.event.count({ where });

    // Fetch events with filters
    const events = await prisma.event.findMany({
      where,
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        contactBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        registrations: {
          select: {
            id: true,
            status: true,
            userId: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      events,
      pagination: {
        total: totalCount,
        page,
        pageSize: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST: Create new event with duplication check
export async function POST(req: NextRequest) {
  try {
    const userId = await getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const validatedData = eventSchema.parse(json);

    // Check if user has permission to create event in the group
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: validatedData.groupId,
        userId,
        role: {
          in: ["ADMIN", "MODERATOR", "OWNER"],
        },
      },
    });

    if (!groupMember) {
      return NextResponse.json(
        { error: "You don't have permission to create events in this group" },
        { status: 403 }
      );
    }

    // Check for duplicate events
    const existingEvent = await prisma.event.findFirst({
      where: {
        OR: [
          // Check for same title in same group
          {
            title: validatedData.title,
            groupId: validatedData.groupId,
          },
          // Check for same slug
          { slug: validatedData.slug },
          // Check for time conflict in same location
          {
            AND: [
              { location: validatedData.location },
              {
                OR: [
                  // New event starts during existing event
                  {
                    startTime: {
                      lte: new Date(validatedData.startTime),
                    },
                    endTime: {
                      gte: new Date(validatedData.startTime),
                    },
                  },
                  // New event ends during existing event
                  {
                    startTime: {
                      lte: new Date(validatedData.endTime),
                    },
                    endTime: {
                      gte: new Date(validatedData.endTime),
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    if (existingEvent) {
      return NextResponse.json(
        { 
          error: "Duplicate event detected",
          details: {
            title: existingEvent.title === validatedData.title ? "An event with this title already exists in the group" : null,
            slug: existingEvent.slug === validatedData.slug ? "This slug is already in use" : null,
            timeConflict: "There is a scheduling conflict at this location",
          }
        },
        { status: 409 }
      );
    }

    console.log("jsonData :",validatedData);

    // Create event
    const event = await prisma.event.create({
      data: {
        ...validatedData,
        contactById: userId,
        registeredSlots: 0,
        status: "UPCOMING",
      },
      include: {
        group: {
          select: {
            name: true,
            description: true,
          },
        },
        contactBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// PATCH: Update event with validation
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { id, ...updateData } = json;

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const validatedData: Partial<EventData> = eventSchema.partial().parse(updateData);

    // Check if event exists and user has permission
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            members: {
              where: {
                userId,
                role: {
                  in: ["ADMIN", "MODERATOR", "OWNER"],
                },
              },
            },
          },
        },
        registrations: {
          where: {
            status: "CONFIRMED",
          },
        },
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (existingEvent.contactById !== userId && existingEvent.group.members.length === 0) {
      return NextResponse.json(
        { error: "You don't have permission to update this event" },
        { status: 403 }
      );
    }

    // Check if the event has confirmed registrations and certain fields are being modified
    if (existingEvent.registrations.length > 0) {
      const sensitiveFields: (keyof EventData)[] = ['date', 'startTime', 'endTime', 'location', 'ticketPrice'];
      const hasChangedSensitiveFields = sensitiveFields.some(field => 
        validatedData[field] && validatedData[field] !== existingEvent[field]
      );

      if (hasChangedSensitiveFields) {
        return NextResponse.json(
          { error: "Cannot modify event details after registrations have been confirmed" },
          { status: 409 }
        );
      }
    }

    // Check for duplicate slug if it's being updated
    if (validatedData.slug && validatedData.slug !== existingEvent.slug) {
      const duplicateSlug = await prisma.event.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: "This slug is already in use" },
          { status: 409 }
        );
      }
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: validatedData,
      include: {
        group: {
          select: {
            name: true,
            description: true,
          },
        },
        contactBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE: Delete event with additional checks
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getHeaderOrCookie(req, "x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id");

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if event exists and user has permission
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        group: {
          include: {
            members: {
              where: {
                userId,
                role: {
                  in: ["ADMIN", "MODERATOR", "OWNER"],
                },
              },
            },
          },
        },
        registrations: {
          where: {
            status: "CONFIRMED",
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (event.contactById !== userId && event.group.members.length === 0) {
      return NextResponse.json(
        { error: "You don't have permission to delete this event" },
        { status: 403 }
      );
    }

    // Check if event has confirmed registrations
    if (event.registrations.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete event with confirmed registrations" },
        { status: 409 }
      );
    }

    // Check if event is ongoing or completed
    if (event.status === "ONGOING" || event.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot delete ongoing or completed events" },
        { status: 409 }
      );
    }

    // Delete event
    await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}