import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Newspaper } from "lucide-react"
import type { Fixture } from "@/data/fixtures"
import { kickoffLine } from "@/lib/format"

export type NewsItem = {
  title: string
  body: string
  image: string
  date: string
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(`${date}T12:00:00Z`))
}

function tripDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  }).format(new Date(`${date}T12:00:00Z`))
}

function ClubMark({
  club,
  badge,
}: {
  club: Fixture["club"]
  badge: string | null
}) {
  if (badge) {
    return (
      <Image src={badge} alt="" width={36} height={36} className="size-9 object-contain" unoptimized />
    )
  }
  return (
    <span
      className={`grid size-9 place-items-center text-xs font-bold ${
        club === "stourbridge" ? "bg-[#9b2335] text-white" : "bg-primary text-primary-foreground"
      }`}
    >
      {club === "wolves" ? "W" : "S"}
    </span>
  )
}

function SectionHead({
  title,
  href,
  linkLabel,
  icon,
}: {
  title: string
  href: string
  linkLabel: string
  icon?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-display text-3xl tracking-wide">
        {icon}
        {title}
      </h2>
      <Link href={href} className="text-[11px] tracking-[0.16em] text-primary hover:text-primary/80">
        {linkLabel} →
      </Link>
    </div>
  )
}

export function HomeColumns({
  news,
  matches,
  trips,
  badges,
}: {
  news: NewsItem[]
  matches: Fixture[]
  trips: Fixture[]
  badges: { wolves: string | null; stourbridge: string | null }
}) {
  const tripPhotos = ["/photos/hero-stadium.png", "/photos/away-coach.png", "/photos/fans-sunset.png"]

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-3">
      <section id="news">
        <SectionHead
          title="Latest news"
          href="/#about"
          linkLabel="VIEW ALL"
          icon={<Newspaper className="size-5 text-primary" />}
        />
        <ul className="grid gap-3">
          {news.map((item) => (
            <li
              key={item.title}
              className="grid grid-cols-[92px_1fr] overflow-hidden rounded-lg border border-white/10 bg-card/80"
            >
              <Image
                src={item.image}
                alt=""
                width={184}
                height={128}
                className="h-full min-h-[96px] w-[92px] object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold leading-snug text-white">{item.title}</h3>
                <p className="mt-1 text-[11px] tracking-wide text-primary">{shortDate(item.date)}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHead title="Upcoming matches" href="/fixtures" linkLabel="VIEW ALL" />
        <ul className="overflow-hidden rounded-lg border border-white/10 bg-card/80">
          {matches.map((fixture, index) => (
            <li key={fixture.id} className={index > 0 ? "border-t border-white/10" : undefined}>
              <Link
                href="/fixtures"
                className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-white/5"
              >
                <ClubMark club={fixture.club} badge={badges[fixture.club]} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {fixture.club === "wolves" ? "Wolves" : "Stourbridge"}{" "}
                    {fixture.home ? "vs" : "at"} {fixture.opponent}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {fixture.competition}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xs text-white/80">{shortDate(fixture.date)}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {kickoffLine(fixture).split(" · ")[0]}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="trips">
        <SectionHead title="Upcoming trips" href="/join" linkLabel="JOIN US" />
        <ul className="grid gap-3">
          {trips.map((fixture, index) => (
            <li key={fixture.id}>
              <Link
                href={`/albums/${fixture.id}`}
                className="grid grid-cols-[104px_1fr_auto] overflow-hidden rounded-lg border border-white/10 bg-card/80 transition-colors hover:bg-white/5"
              >
                <Image
                  src={tripPhotos[index % tripPhotos.length]}
                  alt=""
                  width={208}
                  height={128}
                  className="h-full min-h-[88px] w-[104px] object-cover"
                />
                <span className="p-3">
                  <span className="block text-[11px] tracking-wide text-primary">
                    {tripDate(fixture.date)}
                  </span>
                  <span className="mt-1 block text-sm font-semibold leading-snug text-white">
                    {fixture.club === "wolves" ? "Wolves" : "Stourbridge"}{" "}
                    {fixture.home ? "vs" : "at"} {fixture.opponent}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{fixture.ground}</span>
                </span>
                <span className="flex items-center pr-3">
                  <ChevronRight className="size-4 text-primary" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
