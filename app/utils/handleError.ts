import { NextResponse } from "next/server";
import { z } from "zod";

export default function handleError(error: unknown) {
  console.error("[FORUM_API_ERROR]", error);

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
      case "Forum not found":
        return NextResponse.json({ error: "Forum not found" }, { status: 404 });
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