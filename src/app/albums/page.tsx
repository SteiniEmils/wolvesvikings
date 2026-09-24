import Link from "next/link"
import { fixtures } from "@/data/fixtures"
import { AlbumLock } from "@/components/album-lock"
import { isMember } from "@/lib/auth"
import { formatFixtureDate } from "@/lib/format"
import { listPhotos } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Albums · Wolves Vikings",
}

export default async function AlbumsPage() {
  const member = await isMember()
  if (!member) return <AlbumLock />

  const photos = await listPhotos()
  const wolves = fixtures.filter((fixture) => fixture.club === "wolves")
  const glassboys = fixtures.filter((fixture) => fixture.club === "stourbridge")

  return (
    <div className="grid gap-8">
      <header>
        <h1 className="font-display text-5xl">Match photos</h1>
        <p className="mt-2 text-sm text-muted-foreground">One album for every trip.</p>
      </header>
      {[
        ["Wolves", wolves],
        ["Stourbridge", glassboys],
      ].map(([title, rows]) => (
        <section key={String(title)}>
          <h2 className="mb-3 font-display text-3xl">{title as string}</h2>
          <ul className="divide-y divide-border border border-border">
            {(rows as typeof fixtures).map((fixture) => {
              const count = photos.filter((photo) => photo.fixtureId === fixture.id).length
              return (
                <li key={fixture.id}>
                  <Link href={`/albums/${fixture.id}`} className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-muted">
                    <span className="font-display text-2xl">
                      {fixture.home ? "vs" : "at"} {fixture.opponent}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatFixtureDate(fixture.date)} · {count === 0 ? "Empty" : `${count} photo${count === 1 ? "" : "s"}`}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
