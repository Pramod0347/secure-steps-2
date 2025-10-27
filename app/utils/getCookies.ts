import { NextRequest } from "next/server";

// Helper to get cookies or headers safely
export default function getHeaderOrCookie(req: NextRequest, key: string): string | null {
  return req.cookies.get(key)?.value || req.headers.get(key);
}