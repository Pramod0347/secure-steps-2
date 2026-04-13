import { NextRequest } from "next/server"
import { validateSession, SessionData } from "@/app/lib/session"

export async function getSessionUser(req: NextRequest): Promise<SessionData | null> {
  const token = req.cookies.get('access_token')?.value
  if (!token) return null
  
  const session = await validateSession(token)
  if (session && 'userId' in session) {
    return session as SessionData
  }
  return null
}
