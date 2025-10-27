
import { prisma } from "@/app/lib/prisma";
import { AccommodationApplicationSchema } from "@/app/lib/types/accommodations";
import getHeaderOrCookie from "@/app/utils/getCookies";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Apply for an Accommodation (Additional Route)
export async function POST(req: NextRequest) {

    try {
      const userId = getHeaderOrCookie(req, "userId");
      if (!userId) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
  
      const body = await req.json();
      const validatedData = AccommodationApplicationSchema.parse(body);
  
      // Verify accommodation exists and is available
      const accommodation = await prisma.accommodation.findUnique({
        where: { 
          id: validatedData.accommodationId,
          isAvailable: true 
        }
      });
  
      if (!accommodation) {
        return NextResponse.json(
          { error: "Accommodation not available" },
          { status: 404 }
        );
      }
  
      // Check for existing applications to prevent duplicates
      const existingApplication = await prisma.accommodationApplication.findFirst({
        where: {
          userId: userId,
          accommodationId: validatedData.accommodationId
        }
      });
  
      if (existingApplication) {
        return NextResponse.json(
          { error: "Application already exists" },
          { status: 400 }
        );
      }
  
      // Create accommodation application
      const application = await prisma.accommodationApplication.create({
        data: {
          userId: userId,
          accommodationId: validatedData.accommodationId,
          interestedFrom: validatedData.interestedFrom,
          interestedTill: validatedData.interestedTill,
          numberOfOccupants: validatedData.numberOfOccupants,
          additionalNotes: validatedData.additionalNotes,
          status: 'PENDING'
        }
      });
  
      return NextResponse.json(application, { status: 201 });
    } catch (error) {
      console.error("[ACCOMMODATION_APPLICATION_ERROR]", error);
  
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
  
      return NextResponse.json(
        {
          error: "Failed to submit accommodation application",
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }