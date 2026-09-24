import Link from "next/link"
import { notFound } from "next/navigation"
import { fixtureById } from "@/data/fixtures"
import { AlbumGrid } from "@/components/album-grid"
import { AlbumLock } from "@/components/album-lock"
import { isMember } from "@/lib/auth"
import { formatFixtureDate, venueLine } from "@/lib/format"
import { listPhotos } from "@/lib/store"

export const dynamic = "force-dynamic"

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ fixtureId: string }>
}) {
  const { fixtureId } = await params
  const fixture = fixtureById(fixtureId)
  if (!fixture) notFound()
  if (!(await isMember())) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AlbumLock />
      </div>
    )
  }

  const photos = await listPhotos(fixtureId)

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <header>
        <p className="text-sm tracking-wide text-primary uppercase">
          {fixture.club === "wolves" ? "Wolves" : "Stourbridge"}
        </p>
        <h1 className="font-display text-5xl">{fixture.opponent}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatFixtureDate(fixture.date)} · {venueLine(fixture)}
        </p>
        <Link href="/albums" className="mt-2 inline-block text-sm text-primary">
          All albums
        </Link>
      </header>
      <AlbumGrid
        fixtureId={fixture.id}
        photos={photos.map((photo) => ({
          id: photo.id,
          uploader: photo.uploader,
          caption: photo.caption,
        }))}
      />
    </div>
  )
}
