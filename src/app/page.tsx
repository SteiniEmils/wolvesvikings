import Image from "next/image"
import Link from "next/link"
import { fixtures } from "@/data/fixtures"
import { group } from "@/data/group"
import { ClubCards } from "@/components/club-cards"
import { HomeColumns } from "@/components/home-columns"
import { buttonVariants } from "@/components/ui/button"
import { loadClubCards } from "@/lib/scores"

export const dynamic = "force-dynamic"

const news = [
  {
    title: "Wolves take the Black Country derby",
    body: "A 1–0 win over West Bromwich Albion at Molineux on 20 September. Fer López scored it.",
    image: "/photos/hero-stadium.png",
    date: "2026-09-20",
  },
  {
    title: "Glassboys beaten at home by Real Bedford",
    body: "Stourbridge 1–4 Real Bedford at the War Memorial Athletic Ground on 22 September.",
    image: "/photos/fans-sunset.png",
    date: "2026-09-22",
  },
  {
    title: "Next from Iceland",
    body: "Rushall Olympic away in the FA Trophy, then Middlesbrough away when the Championship restarts.",
    image: "/photos/away-coach.png",
    date: "2026-09-24",
  },
]

export default async function HomePage() {
  const cards = await loadClubCards()
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
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-4 pt-10 pb-8 sm:gap-8 sm:pt-14 sm:pb-12 lg:min-h-[640px] lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pb-44">
          <div>
            <h1 className="font-display text-[2.75rem] leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
              FOOTBALL
              <br />
              <span className="text-primary">FRIENDS</span>
              <br />
              TRAVEL MEMORIES
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:mt-5 sm:text-base">
              {group.line} We are in Iceland. Molineux is the main event. Stourbridge is the other ground.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <Link
                href="/join"
                className={`${buttonVariants({ size: "lg" })} w-full rounded-md px-5 font-semibold tracking-wide sm:w-auto`}
              >
                Join our group
              </Link>
              <Link
                href="#trips"
                className={`${buttonVariants({ variant: "outline", size: "lg" })} w-full rounded-md border-primary/70 bg-black/20 px-5 text-white hover:bg-black/40 sm:w-auto`}
              >
                Upcoming trips
              </Link>
            </div>
          </div>
          <p className="max-w-sm pt-2 text-left font-script text-3xl leading-tight text-primary sm:text-5xl lg:justify-self-end lg:pt-0 lg:text-right lg:text-6xl">
            Different Stadiums,
            <br />
            Same Passion.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto mt-4 max-w-6xl px-4 sm:mt-8 lg:-mt-24">
        <ClubCards initial={cards} />
      </div>

      <HomeColumns
        news={news}
        matches={matches}
        trips={trips}
        badges={{
          wolves: cards.find((card) => card.club === "wolves")?.badge ?? null,
          stourbridge: cards.find((card) => card.club === "stourbridge")?.badge ?? null,
        }}
      />

      <section id="about" className="relative overflow-hidden">
        <Image src="/photos/fans-sunset.png" alt="Supporters watching a stadium at sunset" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto flex min-h-[320px] max-w-6xl flex-col justify-end gap-6 px-4 py-12 sm:min-h-[380px] sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-script text-4xl text-primary sm:text-6xl">More than a supporters group</p>
            <p className="mt-3 text-sm leading-6 text-white/85">
              {group.beats.map((beat) => beat.body).join(" ")} {group.meet}
            </p>
          </div>
          <Link
            href="/join"
            className={`${buttonVariants({ size: "lg" })} w-full rounded-full sm:w-auto`}
          >
            Join Wolves Vikings
          </Link>
        </div>
      </section>
    </div>
  )
}
