import { NextResponse } from "next/server"
import { isMember } from "@/lib/auth"
import { applyToClub, listApplications, reviewApplication } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const rows = await listApplications()
  const member = await isMember()
  const approved = rows
    .filter((row) => row.status === "approved")
    .map(({ note: _note, ...row }) => row)
  return NextResponse.json({
    approved,
    pending: member ? rows.filter((row) => row.status === "pending") : [],
  })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string
    place?: string
    note?: string
  } | null
  if (!body) {
    return NextResponse.json({ error: "The application didn't arrive." }, { status: 400 })
  }
  const result = await applyToClub({
    name: body.name ?? "",
    place: body.place ?? "",
    note: body.note ?? "",
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  if (!(await isMember())) {
    return NextResponse.json({ error: "That group word is not right." }, { status: 401 })
  }
  const body = (await request.json().catch(() => null)) as {
    id?: string
    decision?: "approved" | "declined"
  } | null
  if (!body?.id || (body.decision !== "approved" && body.decision !== "declined")) {
    return NextResponse.json({ error: "Choose approve or decline." }, { status: 400 })
  }
  const result = await reviewApplication(body.id, body.decision)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
