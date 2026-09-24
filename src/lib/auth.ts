import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

export const SESSION_COOKIE = "vikings_session"

export function groupCode() {
  return process.env.VIKINGS_CODE ?? "molineux"
}

export function sessionToken() {
  return createHmac("sha256", groupCode()).update("vikings-member").digest("hex")
}

export function codeMatches(code: string) {
  const given = Buffer.from(code)
  const expected = Buffer.from(groupCode())
  if (given.length !== expected.length) return false
  return timingSafeEqual(given, expected)
}

export function tokenMatches(token: string | undefined) {
  if (!token) return false
  const given = Buffer.from(token)
  const expected = Buffer.from(sessionToken())
  if (given.length !== expected.length) return false
  return timingSafeEqual(given, expected)
}

export async function isMember() {
  const jar = await cookies()
  return tokenMatches(jar.get(SESSION_COOKIE)?.value)
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 60,
  secure: process.env.NODE_ENV === "production",
}
