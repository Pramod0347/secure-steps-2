/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { EventRegistration } from "@/app/lib/types/community";
import handleError from "@/app/utils/handleError";
import getHeaderOrCookie from "@/app/utils/getCookies";
import { Prisma } from "@prisma/client";

// Cached response objects
const AUTH_ERROR = NextResponse.json({ error: "Authentication required" }, { status: 401 });
const EVENT_NOT_FOUND = NextResponse.json({ error: "Event not found" }, { status: 404 });
const ALREADY_REGISTERED = NextResponse.json({ error: "You are already registered for this event" }, { status: 400 });
const EVENT_FULL = NextResponse.json({ error: "Event is fully booked" }, { status: 400 });
const NOT_REGISTERED = NextResponse.json({ error: "You are not registered for this event" }, { status: 400 });
const MISSING_EVENT_ID = NextResponse.json({ error: "Event ID is required" }, { status: 400 });

export async function POST(req: NextRequest) {
    try {
        const userId = await getHeaderOrCookie(req, "x-user-id");
        if (!userId) return AUTH_ERROR;
        
        // Read the request body once
        const body = await req.json();

        // Validate the body with Zod schema
        const validatedData = await EventRegistration.parseAsync(body);

        // Parallel database queries for initial checks
        const [event, existingRegistration] = await Promise.all([
            prisma.event.findUnique({
                where: { id: validatedData.eventId },
                select: {
                    id: true,
                    registeredSlots: true,
                    totalSlots: true,
                    waitlistSlots: true,
                },
            }),
            prisma.eventRegistration.findUnique({
                where: {
                    eventId_userId: {
                        eventId: validatedData.eventId,
                        userId,
                    },
                },
                select: { id: true },
            }),
        ]);


        if (!event) return EVENT_NOT_FOUND;
        if (existingRegistration) return ALREADY_REGISTERED;
        if (event.registeredSlots >= event.totalSlots && 
            (!event.waitlistSlots || event.registeredSlots >= (event.totalSlots + event.waitlistSlots))) {
            return EVENT_FULL;
        }

        // Single transaction with minimal operations
        const registration = await prisma.$transaction(async (tx) => {
            const registrationStatus = event.registeredSlots < event.totalSlots ? "CONFIRMED" : "WAITLISTED";
            
            const [newRegistration] = await Promise.all([
                tx.eventRegistration.create({
                    data: {
                        eventId: validatedData.eventId,
                        userId,
                        status: registrationStatus,
                        additionalInfo: body.additionalInfo || null
                    },
                    select: {
                        id: true,
                        status: true,
                        createdAt: true
                    }
                }),
                tx.event.update({
                    where: { id: validatedData.eventId },
                    data: { registeredSlots: { increment: 1 } },
                    select: { id: true }
                }),
                tx.auditLog.create({
                    data: {
                        userId,
                        action: "EVENT_REGISTRATION",
                        entityType: "EVENT_REGISTRATION",
                        entityId: validatedData.eventId,
                        details: JSON.stringify({
                            eventId: validatedData.eventId,
                            registrationStatus
                        })
                    }
                })
            ]);

            return newRegistration;
        });

        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const userId = await getHeaderOrCookie(req, "x-user-id");
        if (!userId) return AUTH_ERROR;

        const eventId = new URL(req.url).searchParams.get("id");
        if (!eventId) return MISSING_EVENT_ID;

        // Parallel database queries for initial checks
        const [event, registration] = await Promise.all([
            prisma.event.findUnique({
                where: { id: eventId },
                select: { id: true }
            }),
            prisma.eventRegistration.findUnique({
                where: {
                    eventId_userId: {
                        eventId,
                        userId
                    }
                },
                select: { id: true }
            })
        ]);

        if (!event) return EVENT_NOT_FOUND;
        if (!registration) return NOT_REGISTERED;

        // Optimized transaction with parallel operations
        await prisma.$transaction(async (tx:any) => {
            const [waitlistedRegistration] = await Promise.all([
                tx.eventRegistration.findFirst({
                    where: {
                        eventId,
                        status: "WAITLISTED"
                    },
                    orderBy: { createdAt: 'asc' },
                    select: { id: true }
                }),
                tx.eventRegistration.delete({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId
                        }
                    }
                }),
                tx.event.update({
                    where: { id: eventId },
                    data: { registeredSlots: { decrement: 1 } }
                }),
                tx.auditLog.create({
                    data: {
                        userId,
                        action: "EVENT_UNREGISTRATION",
                        entityType: "EVENT_REGISTRATION",
                        entityId: registration.id,
                        details: JSON.stringify({ eventId })
                    }
                })
            ]);

            if (waitlistedRegistration) {
                await tx.eventRegistration.update({
                    where: { id: waitlistedRegistration.id },
                    data: { status: "CONFIRMED" }
                });
            }
        });

        return NextResponse.json({
            message: "Successfully unregistered from the event"
        });
    } catch (error) {
        return handleError(error);
    }
}