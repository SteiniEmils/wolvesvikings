import Image from "next/image"
import Link from "next/link"
import { fixtures } from "@/data/fixtures"
import { group } from "@/data/group"
import { ClubCards } from "@/components/club-cards"
import { buttonVariants } from "@/components/ui/button"
import { formatFixtureDate, kickoffLine } from "@/lib/format"
import { loadClubCards } from "@/lib/scores"

export const dynamic = "force-dynamic"

const news = [
  {
    title: "Wolves take the Black Country derby",
    body: "A 1–0 win over West Bromwich Albion at Molineux on 20 September. Fer López scored it.",
    image: "/photos/hero-stadium.png",
  },
  {
    title: "Glassboys beaten at home by Real Bedford",
    body: "Stourbridge 1–4 Real Bedford at the War Memorial Athletic Ground on 22 September.",
    image: "/photos/fans-sunset.png",
  },
  {
    title: "Next from Iceland",
    body: "Rushall Olympic away in the FA Trophy, then Middlesbrough away when the Championship restarts.",
    image: "/photos/away-coach.png",
  },
]

export default async function HomePage() {
  const cards = await loadClubCards()
  const trips = [...fixtures].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const matches = [...fixtures].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)

  return (
    <div>
      <section className="relative min-h-[560px] overflow-hidden sm:min-h-[640px]">
        <Image
          src="/photos/hero-stadium.png"
          alt="Supporters in gold and black in the stands"
          fill
          priority
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="relative mx-auto grid min-h-[560px] max-w-6xl content-center gap-8 px-4 py-12 sm:min-h-[640px] sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pb-40">
          <div>
            <h1 className="font-display text-5xl leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-8xl">
              FOOTBALL
              <br />
              <span className="text-primary">FRIENDS</span>
              <br />
              TRAVEL MEMORIES
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              {group.line} We are in Iceland. Molineux is the main event. Stourbridge is the other ground.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/join"
                className={`${buttonVariants({ size: "lg" })} rounded-md px-5 font-semibold tracking-wide`}
              >
                Join our group
              </Link>
              <Link
                href="#trips"
                className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-md border-primary/70 bg-black/20 px-5 text-white hover:bg-black/40`}
              >
                Upcoming trips
              </Link>
            </div>
          </div>
          <p className="max-w-sm justify-self-start text-left font-script text-4xl leading-tight text-primary sm:text-5xl lg:justify-self-end lg:text-right lg:text-6xl">
            Different Stadiums,
            <br />
            Same Passion.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-4 max-w-6xl px-4 sm:mt-6 lg:-mt-24">
        <ClubCards initial={cards} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-3">
        <section id="news">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-3xl">Latest news</h2>
          </div>
          <ul className="grid gap-3">
            {news.map((item) => (
              <li key={item.title} className="grid grid-cols-[88px_1fr] overflow-hidden border border-border bg-card">
                <Image src={item.image} alt="" width={176} height={120} className="h-full w-[88px] object-cover" />
                <div className="p-3">
                  <h3 className="font-medium leading-snug">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-3xl">Upcoming matches</h2>
            <Link href="/fixtures" className="text-xs tracking-wide text-primary">
              VIEW ALL
            </Link>
          </div>
          <ul className="divide-y divide-border border border-border bg-card">
            {matches.map((fixture) => (
              <li key={fixture.id} className="px-4 py-3">
                <p className="font-medium">
                  {fixture.club === "wolves" ? "Wolves" : "Stourbridge"} {fixture.home ? "vs" : "at"}{" "}
                  {fixture.opponent}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFixtureDate(fixture.date)} · {kickoffLine(fixture)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="trips">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-3xl">Upcoming trips</h2>
            <Link href="/join" className="text-xs tracking-wide text-primary">
              JOIN US
            </Link>
          </div>
          <ul className="grid gap-3">
            {trips.map((fixture, index) => (
              <li key={fixture.id} className="grid grid-cols-[96px_1fr] overflow-hidden border border-border bg-card">
                <Image
                  src={index === 1 ? "/photos/away-coach.png" : "/photos/hero-stadium.png"}
                  alt=""
                  width={192}
                  height={128}
                  className="h-full w-24 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs text-primary">{formatFixtureDate(fixture.date)}</p>
                  <p className="font-medium">
                    {fixture.club === "wolves" ? "Wolves" : "Stourbridge"} {fixture.home ? "vs" : "at"}{" "}
                    {fixture.opponent}
                  </p>
                  <p className="text-xs text-muted-foreground">{fixture.ground}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section id="about" className="relative min-h-[360px] overflow-hidden">
        <Image src="/photos/fans-sunset.png" alt="Supporters watching a stadium at sunset" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[360px] max-w-6xl flex-col justify-end gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-script text-4xl text-primary sm:text-6xl">More than a supporters group</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
              {group.beats.map((beat) => beat.body).join(" ")} {group.meet}
            </p>
          </div>
          <Link href="/join" className={`${buttonVariants({ size: "lg" })} rounded-full`}>
            Join Wolves Vikings
          </Link>
        </div>
      </section>
    </div>
  )
}
