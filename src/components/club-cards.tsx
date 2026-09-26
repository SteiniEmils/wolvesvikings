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
  })
    .format(new Date(`${date}T12:00:00Z`))
    .toUpperCase()
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
      <ClubCard banner={wolves} fixture={nextWolf} title="Wolverhampton Wanderers" mark="W" href="/fixtures" tone="gold" />
      <ClubCard
        banner={glassboys}
        fixture={nextGlassboy}
        title="Stourbridge F.C."
        mark="S"
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
  mark,
  href,
  tone,
}: {
  banner?: ScoreBanner
  fixture: Fixture
  title: string
  mark: string
  href: string
  tone: "gold" | "red"
}) {
  const red = tone === "red"
  const live = banner?.state === "live"
  const border = red ? "border-[#9b2335]" : "border-[#c5a046]"
  const accent = red ? "text-[#f0b4be]" : "text-[#e6c56a]"
  const panel = red ? "bg-[#1a0c10]" : "bg-[#14110c]"

  return (
    <article className={`overflow-hidden border ${border} ${panel}`}>
      <div className={`flex items-center gap-3 border-b ${border} px-4 py-3`}>
        <span
          className={`grid size-11 shrink-0 place-items-center font-display text-xl ${
            red ? "bg-[#9b2335] text-white" : "bg-[#c5a046] text-[#14120c]"
          }`}
          style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}
        >
          {mark}
        </span>
        <h3 className="font-display text-2xl leading-none tracking-wide sm:text-3xl">{title}</h3>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1.3fr_0.9fr] sm:items-center">
        <div>
          <p className={`text-[11px] tracking-[0.22em] ${accent}`}>{live ? `LIVE · ${banner?.detail}` : "NEXT MATCH"}</p>
          <p className="mt-2 font-display text-3xl leading-none sm:text-4xl">
            {fixture.club === "wolves" ? "Wolves" : "Stourbridge"}
            <span className={`mx-2 ${accent}`}>{live ? `${banner?.homeScore ?? 0}-${banner?.awayScore ?? 0}` : "vs"}</span>
            {fixture.opponent}
          </p>
          <p className="mt-3 text-xs tracking-wide text-muted-foreground">
            {shortDate(fixture.date)} · {fixture.competition.toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            {kickoffLine(fixture)} · {fixture.ground}
          </p>
        </div>
        <div className={`border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4 ${border}`}>
          <p className={`text-[11px] tracking-[0.22em] ${accent}`}>LAST GAME</p>
          {banner && banner.state !== "quiet" ? (
            <p className="mt-2 font-display text-2xl leading-none">
              {banner.home} {banner.homeScore ?? "–"}–{banner.awayScore ?? "–"} {banner.away}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Score feed is quiet right now.</p>
          )}
          {banner && banner.state !== "quiet" && !live ? (
            <p className="mt-2 text-xs text-muted-foreground">{banner.detail}</p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end px-4 pb-4">
        <Link
          href={href}
          className={`border px-4 py-2 text-xs tracking-[0.16em] ${border} ${accent}`}
        >
          VIEW FIXTURES
        </Link>
      </div>
    </article>
  )
}
