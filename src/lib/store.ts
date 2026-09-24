import { randomUUID } from "crypto"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

export type RsvpStatus = "going" | "maybe" | "lift"

export type Rsvp = {
  id: string
  fixtureId: string
  name: string
  status: RsvpStatus
  note: string
  createdAt: string
}

export type Photo = {
  id: string
  fixtureId: string
  storedName: string
  originalName: string
  uploader: string
  caption: string
  createdAt: string
}

const dataDir = path.join(process.cwd(), "data")
const uploadsDir = path.join(dataDir, "uploads")
const matchdaysPath = path.join(dataDir, "matchdays.json")
const albumsPath = path.join(dataDir, "albums.json")

let chain: Promise<unknown> = Promise.resolve()

function withLock<T>(fn: () => Promise<T>) {
  const run = chain.then(fn, fn)
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJson(file: string, value: unknown) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(file, JSON.stringify(value, null, 2))
}

export function listRsvps() {
  return withLock(() => readJson<Rsvp[]>(matchdaysPath, []))
}

export function countForFixture(fixtureId: string, rows: Rsvp[]) {
  return rows.filter((row) => row.fixtureId === fixtureId).length
}

const namePattern = /^[A-Za-z][A-Za-z .'-]{0,22}[A-Za-z]$|^[A-Za-z]{2}$/

export function cleanName(value: string) {
  const name = value.trim().replace(/\s+/g, " ")
  if (!namePattern.test(name) || name.length < 2 || name.length > 24) {
    return null
  }
  return name
}

export function addRsvp(input: {
  fixtureId: string
  name: string
  status: RsvpStatus
  note: string
}) {
  return withLock(async () => {
    const rows = await readJson<Rsvp[]>(matchdaysPath, [])
    const name = cleanName(input.name)
    if (!name) {
      return { ok: false as const, error: "Use a first name, 2 to 24 letters." }
    }
    const taken = rows.some(
      (row) =>
        row.fixtureId === input.fixtureId &&
        row.name.toLowerCase() === name.toLowerCase(),
    )
    if (taken) {
      return { ok: false as const, error: `${name} is already on this list.` }
    }
    const note = input.note.trim().slice(0, 80)
    const entry: Rsvp = {
      id: randomUUID(),
      fixtureId: input.fixtureId,
      name,
      status: input.status,
      note,
      createdAt: new Date().toISOString(),
    }
    rows.push(entry)
    await writeJson(matchdaysPath, rows)
    return { ok: true as const, entry }
  })
}

export function removeRsvp(id: string) {
  return withLock(async () => {
    const rows = await readJson<Rsvp[]>(matchdaysPath, [])
    const next = rows.filter((row) => row.id !== id)
    if (next.length === rows.length) {
      return { ok: false as const, error: "That name is already off the list." }
    }
    await writeJson(matchdaysPath, next)
    return { ok: true as const }
  })
}

export function listPhotos(fixtureId?: string) {
  return withLock(async () => {
    const photos = await readJson<Photo[]>(albumsPath, [])
    if (!fixtureId) return photos
    return photos.filter((photo) => photo.fixtureId === fixtureId)
  })
}

const types: Record<string, { ext: string; mime: string }> = {
  jpeg: { ext: "jpg", mime: "image/jpeg" },
  png: { ext: "png", mime: "image/png" },
  webp: { ext: "webp", mime: "image/webp" },
}

export function sniffImage(bytes: Buffer) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return types.jpeg
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return types.png
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return types.webp
  }
  return null
}

export function photoPath(photo: Photo) {
  return path.join(uploadsDir, photo.fixtureId, photo.storedName)
}

export function addPhoto(input: {
  fixtureId: string
  uploader: string
  caption: string
  originalName: string
  bytes: Buffer
  kind: { ext: string; mime: string }
}) {
  return withLock(async () => {
    const name = cleanName(input.uploader)
    if (!name) {
      return { ok: false as const, error: "Use a first name, 2 to 24 letters." }
    }
    const id = randomUUID()
    const storedName = `${id}.${input.kind.ext}`
    const dir = path.join(uploadsDir, input.fixtureId)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, storedName), input.bytes)
    const photos = await readJson<Photo[]>(albumsPath, [])
    const photo: Photo = {
      id,
      fixtureId: input.fixtureId,
      storedName,
      originalName: input.originalName.slice(0, 120),
      uploader: name,
      caption: input.caption.trim().slice(0, 80),
      createdAt: new Date().toISOString(),
    }
    photos.push(photo)
    await writeJson(albumsPath, photos)
    return { ok: true as const, photo }
  })
}

export async function readPhotoFile(id: string) {
  const photos = await listPhotos()
  const photo = photos.find((item) => item.id === id)
  if (!photo) return null
  try {
    const bytes = await readFile(photoPath(photo))
    const kind = sniffImage(bytes)
    return { photo, bytes, mime: kind?.mime ?? "application/octet-stream" }
  } catch {
    return null
  }
}
