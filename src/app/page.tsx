import Image from "next/image"
import Link from "next/link"
import { fixturesFor, nextGlassboy, nextWolf } from "@/data/fixtures"
import { group } from "@/data/group"
import { FixtureTicket } from "@/components/fixture-ticket"
import { formatFixtureDate } from "@/lib/format"
import { countForFixture, listRsvps } from "@/lib/store"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const rows = await listRsvps()
  const wolves = fixturesFor("wolves").slice(0, 4)

  return (
    <div className="grid gap-12">
      <section className="text-center">
        <Image
          src="/brand/wolves-vikings-logo.jpg"
          alt="Wolves Vikings"
          width={640}
          height={640}
          priority
          className="mx-auto w-full max-w-sm object-contain"
        />
        <p className="mx-auto mt-2 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          {group.line}
        </p>
      </section>

      <section className="grid gap-4">
        <p className="text-sm tracking-wide text-primary uppercase">Next Wolf</p>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          The Championship is on an international break. Next Wolf is {nextWolf.opponent},{" "}
          {nextWolf.home ? "at home" : "away"}, {formatFixtureDate(nextWolf.date)}.
        </p>
        <FixtureTicket fixture={nextWolf} names={countForFixture(nextWolf.id, rows)} featured />
      </section>

      <section className="border-l-4 border-glassboys bg-card px-5 py-5">
        <p className="text-sm tracking-wide text-glassboys uppercase">The Glassboys</p>
        <h2 className="mt-2 font-display text-4xl">{nextGlassboy.opponent}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Until Molineux kicks off again, Stourbridge are out. {nextGlassboy.opponent},{" "}
          {nextGlassboy.home ? "at home" : "away"}, {formatFixtureDate(nextGlassboy.date)},{" "}
          {nextGlassboy.time}, {nextGlassboy.competition}. Alvechurch follow on Tuesday 29
          September, 19:45.
        </p>
        <Link href="/fixtures#stourbridge" className="mt-3 inline-block text-sm text-primary">
          Stourbridge fixtures
        </Link>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {group.beats.map((beat) => (
          <div key={beat.title}>
            <h2 className="font-display text-2xl">{beat.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{beat.body}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-4xl">Coming up</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {wolves.map((fixture) => (
            <li key={fixture.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
              <Link href={`/matchday?fixture=${fixture.id}`} className="font-display text-2xl hover:text-primary">
                {fixture.home ? "Wolves" : fixture.opponent}
                <span className="text-muted-foreground"> {fixture.home ? "v" : "v"} </span>
                {fixture.home ? fixture.opponent : "Wolves"}
              </Link>
              <span className="text-sm text-muted-foreground">
                {formatFixtureDate(fixture.date)} · {fixture.time}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
