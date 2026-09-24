import { NextResponse } from "next/server"
import { fixtureById } from "@/data/fixtures"
import { codeMatches, isMember } from "@/lib/auth"
import { addRsvp, listRsvps, removeRsvp, type RsvpStatus } from "@/lib/store"

export const dynamic = "force-dynamic"

const statuses: RsvpStatus[] = ["going", "maybe", "lift"]

async function allowed(code: string | undefined) {
  if (await isMember()) return true
  return Boolean(code && codeMatches(code))
}

export async function GET() {
  const rows = await listRsvps()
  return NextResponse.json({ entries: rows })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    fixtureId?: string
    name?: string
    status?: RsvpStatus
    note?: string
    code?: string
  } | null

  if (!body || !(await allowed(body.code))) {
    return NextResponse.json(
      { error: "That group word is not right." },
      { status: 401 },
    )
  }
  if (!body.fixtureId || !fixtureById(body.fixtureId)) {
    return NextResponse.json({ error: "Pick a fixture first." }, { status: 400 })
  }
  if (!body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "Pick Going, Maybe, or Need a lift." }, { status: 400 })
  }

  const result = await addRsvp({
    fixtureId: body.fixtureId,
    name: body.name ?? "",
    status: body.status,
    note: body.note ?? "",
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 })
  }
  return NextResponse.json({ entry: result.entry })
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    id?: string
    code?: string
  } | null
  if (!body?.id || !(await allowed(body.code))) {
    return NextResponse.json(
      { error: "That group word is not right." },
      { status: 401 },
    )
  }
  const result = await removeRsvp(body.id)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
