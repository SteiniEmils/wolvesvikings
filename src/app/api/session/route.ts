import { NextResponse } from "next/server"
import {
  codeMatches,
  isMember,
  SESSION_COOKIE,
  sessionCookieOptions,
  sessionToken,
} from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ member: await isMember() })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: string } | null
  const code = body?.code ?? ""
  if (!codeMatches(code)) {
    return NextResponse.json(
      { error: "That group word is not right." },
      { status: 401 },
    )
  }
  const response = NextResponse.json({ member: true })
  response.cookies.set(SESSION_COOKIE, sessionToken(), sessionCookieOptions)
  return response
}
