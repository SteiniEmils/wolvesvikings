import Link from "next/link"
import { fixturesFor } from "@/data/fixtures"
import { formatFixtureDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Fixtures · Wolves Vikings",
}

function Table({
  club,
}: {
  club: "wolves" | "stourbridge"
}) {
  const rows = fixturesFor(club)
  return (
    <ul className="divide-y divide-border border border-border">
      {rows.map((fixture) => (
        <li key={fixture.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-center">
          <div>
            <p className="text-sm">{formatFixtureDate(fixture.date).replace(/^\w+,\s/, "")}</p>
            <p className="text-xs text-muted-foreground">{fixture.time}</p>
          </div>
          <div>
            <p className="font-display text-2xl leading-none">
              {fixture.home ? "Home" : "Away"} · {fixture.opponent}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {fixture.competition} · {fixture.ground}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={fixture.home ? "default" : "outline"}>
              {fixture.home ? "Home" : "Away"}
            </Badge>
            <Link href={`/matchday?fixture=${fixture.id}`} className="text-sm text-primary">
              Names
            </Link>
            <Link href={`/albums/${fixture.id}`} className="text-sm text-primary">
              Album
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function FixturesPage() {
  return (
    <div className="grid gap-10">
      <header>
        <h1 className="font-display text-5xl">Fixtures</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Wolves through the autumn, then Stourbridge from Rushall to the end of October.
          Portsmouth already moved to 16 September and is not listed as still to come.
        </p>
      </header>
      <section>
        <h2 className="mb-3 font-display text-4xl">Wolves</h2>
        <Table club="wolves" />
      </section>
      <section id="stourbridge">
        <h2 className="mb-1 font-display text-4xl text-glassboys">Stourbridge</h2>
        <p className="mb-3 text-sm text-muted-foreground">The Glassboys. Smaller on purpose.</p>
        <Table club="stourbridge" />
      </section>
    </div>
  )
}
