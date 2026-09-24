import { NextResponse } from "next/server"
import { fixtureById } from "@/data/fixtures"
import { isMember } from "@/lib/auth"
import { addPhoto, listPhotos, sniffImage } from "@/lib/store"

export const dynamic = "force-dynamic"

const maxBytes = 8 * 1024 * 1024

export async function GET(request: Request) {
  if (!(await isMember())) {
    return NextResponse.json({ error: "Members only." }, { status: 401 })
  }
  const fixtureId = new URL(request.url).searchParams.get("fixtureId") ?? undefined
  if (fixtureId && !fixtureById(fixtureId)) {
    return NextResponse.json({ error: "That trip is not on the list." }, { status: 404 })
  }
  const photos = await listPhotos(fixtureId)
  return NextResponse.json({
    photos: photos.map((photo) => ({
      id: photo.id,
      fixtureId: photo.fixtureId,
      uploader: photo.uploader,
      caption: photo.caption,
      createdAt: photo.createdAt,
    })),
  })
}

export async function POST(request: Request) {
  if (!(await isMember())) {
    return NextResponse.json({ error: "Members only." }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  if (!form) {
    return NextResponse.json({ error: "The upload did not arrive." }, { status: 400 })
  }

  const fixtureId = String(form.get("fixtureId") ?? "")
  if (!fixtureById(fixtureId)) {
    return NextResponse.json({ error: "Pick a trip first." }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photo." }, { status: 400 })
  }
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Photos need to be 8MB or smaller." }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const kind = sniffImage(bytes)
  if (!kind) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, or WebP." },
      { status: 400 },
    )
  }

  const result = await addPhoto({
    fixtureId,
    uploader: String(form.get("name") ?? ""),
    caption: String(form.get("caption") ?? ""),
    originalName: file.name,
    bytes,
    kind,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ photo: result.photo })
}
