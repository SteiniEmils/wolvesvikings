"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Fixture } from "@/data/fixtures"
import { kickoffLine } from "@/lib/format"
import type { ScoreBanner } from "@/lib/scores"

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(`${date}T12:00:00Z`))
}

export function ClubCards({
  initial,
  nextWolf,
  nextGlassboy,
}: {
  initial: ScoreBanner[]
  nextWolf: Fixture
  nextGlassboy: Fixture
}) {
  const [banners, setBanners] = useState(initial)
  const live = banners.some((banner) => banner.state === "live" || banner.state === "matchday")

  useEffect(() => {
    let cancelled = false
    async function refresh() {
      try {
        const response = await fetch("/api/scores")
        if (!response.ok) return
        const payload = (await response.json()) as { banners?: ScoreBanner[] }
        if (!cancelled && payload.banners?.length) setBanners(payload.banners)
      } catch {
        // Keep the last scores on screen.
      }
    }
    const timer = window.setInterval(refresh, live ? 20000 : 60000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [live])

  const wolves = banners.find((banner) => banner.club === "wolves")
  const glassboys = banners.find((banner) => banner.club === "stourbridge")

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ClubCard
        banner={wolves}
        fixture={nextWolf}
        title="Wolverhampton Wanderers"
        href="/fixtures"
        tone="gold"
      />
      <ClubCard
        banner={glassboys}
        fixture={nextGlassboy}
        title="Stourbridge F.C."
        href="/fixtures#stourbridge"
        tone="red"
      />
    </div>
  )
}

function ClubCard({
  banner,
  fixture,
  title,
  href,
  tone,
}: {
  banner?: ScoreBanner
  fixture: Fixture
  title: string
  href: string
  tone: "gold" | "red"
}) {
  const red = tone === "red"
  return (
    <article
      className={
        red
          ? "border border-glassboys/70 bg-gradient-to-br from-[#3a1018] to-[#14080b] p-4 sm:p-5"
          : "border border-primary/70 bg-gradient-to-br from-[#2a220c] to-[#100e09] p-4 sm:p-5"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs tracking-[0.2em] ${red ? "text-red-200" : "text-primary"}`}>
            {banner?.state === "live" ? `LIVE ${banner.detail}` : "NEXT MATCH"}
          </p>
          <h3 className="font-display text-2xl leading-none sm:text-3xl">{title}</h3>
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {fixture.competition}
          <br />
          {shortDate(fixture.date)}
        </p>
      </div>
      <p className="mt-4 font-display text-4xl leading-none sm:text-5xl">
        {fixture.home ? "Home" : "Away"}
        <span className={red ? "text-red-300" : "text-primary"}> · </span>
        {fixture.opponent}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {kickoffLine(fixture)} · {fixture.ground}
      </p>
      {banner && banner.state !== "quiet" ? (
        <p className="mt-4 text-sm">
          <span className={red ? "text-red-200" : "text-primary"}>
            {banner.state === "live" ? "Live" : banner.state === "matchday" ? "Today" : "Last game"}
          </span>
          {" · "}
          {banner.home} {banner.homeScore ?? "–"}–{banner.awayScore ?? "–"} {banner.away}
          {banner.state !== "live" ? ` · ${banner.detail}` : ""}
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Score feed is quiet right now.</p>
      )}
      <Link href={href} className={`mt-4 inline-block text-sm ${red ? "text-red-200" : "text-primary"}`}>
        View fixtures
      </Link>
    </article>
  )
}
