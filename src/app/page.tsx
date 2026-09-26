import Image from "next/image"
import Link from "next/link"
import { fixtures, nextGlassboy, nextWolf } from "@/data/fixtures"
import { group } from "@/data/group"
import { ClubCards } from "@/components/club-cards"
import { buttonVariants } from "@/components/ui/button"
import { formatFixtureDate, kickoffLine } from "@/lib/format"
import { loadBanners } from "@/lib/scores"

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
  const banners = await loadBanners()
  const trips = [...fixtures].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const matches = [...fixtures].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden">
        <Image
          src="/photos/hero-stadium.png"
          alt="Supporters in gold and black in the stands"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pt-8 pb-10 sm:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pb-28">
          <div>
            <p className="font-display text-5xl leading-[0.9] text-white sm:text-7xl">
              FOOTBALL
              <br />
              FRIENDS
              <br />
              <span className="text-primary">TRAVEL MEMORIES</span>
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              {group.line} We are in Iceland. Molineux is the main event. Stourbridge is the other ground.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#about" className={buttonVariants({ size: "lg" })}>
                Our story
              </Link>
              <Link href="#trips" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Upcoming trips
              </Link>
            </div>
          </div>
          <p className="text-left font-script text-4xl text-primary sm:text-right sm:text-5xl">
            Different stadiums,
            <br />
            same passion
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto mt-6 max-w-6xl px-4 lg:-mt-16">
        <ClubCards initial={banners} nextWolf={nextWolf} nextGlassboy={nextGlassboy} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-3">
        <section id="news">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-3xl">Latest news</h2>
          </div>
          <ul className="grid gap-3">
            {news.map((item) => (
              <li key={item.title} className="border border-border bg-card p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
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
