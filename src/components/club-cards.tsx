"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { FormResult } from "@/data/form"
import type { ClubCardData, MatchSide } from "@/lib/scores"

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  }).format(new Date(`${date}T12:00:00Z`))
}

function Badge({ side, size = 40 }: { side: MatchSide; size?: number }) {
  if (side.badge) {
    return (
      <Image
        src={side.badge}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        unoptimized
      />
    )
  }
  return (
    <span
      className="grid place-items-center rounded-full bg-white/10 text-xs font-medium"
      style={{ width: size, height: size }}
    >
      {side.name.slice(0, 1)}
    </span>
  )
}

function FormDots({ form, red }: { form: FormResult[]; red: boolean }) {
  const tone: Record<FormResult, string> = {
    W: "bg-emerald-500 text-black",
    D: "bg-amber-400 text-black",
    L: red ? "bg-[#9b2335] text-white" : "bg-red-600 text-white",
  }
  return (
    <div className="flex items-center gap-1.5">
      {form.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={`grid size-6 place-items-center text-[11px] font-bold ${tone[letter]}`}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

export function ClubCards({ initial }: { initial: ClubCardData[] }) {
  const [cards, setCards] = useState(initial)
  const live = cards.some((card) => card.state === "live" || card.state === "matchday")

  useEffect(() => {
    let cancelled = false
    async function refresh() {
      try {
        const response = await fetch("/api/scores")
        if (!response.ok) return
        const payload = (await response.json()) as { cards?: ClubCardData[] }
        if (!cancelled && payload.cards?.length) setCards(payload.cards)
      } catch {
        // Keep the last cards on screen.
      }
    }
    const timer = window.setInterval(refresh, live ? 20000 : 60000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [live])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {cards.map((card) => (
        <ClubCard key={card.club} card={card} />
      ))}
    </div>
  )
}

function ClubCard({ card }: { card: ClubCardData }) {
  const red = card.club === "stourbridge"
  const border = red ? "border-[#9b2335]/40" : "border-[#c5a046]/40"
  const accent = red ? "text-[#f0b4be]" : "text-[#e6c56a]"
  const panel = red
    ? "bg-gradient-to-br from-[#2a1016] via-[#14080b] to-black"
    : "bg-gradient-to-br from-[#241c0c] via-[#12100a] to-black"
  const mark = card.club === "wolves" ? "W" : "S"

  return (
    <article
      className={`overflow-hidden rounded-xl border ${border} ${panel} shadow-[0_20px_50px_rgba(0,0,0,0.45)]`}
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <span
          className={`grid size-10 shrink-0 place-items-center font-display text-lg ${
            red ? "bg-[#9b2335] text-white" : "bg-[#c5a046] text-[#14120c]"
          }`}
          style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}
        >
          {mark}
        </span>
        <h3 className="font-display text-2xl leading-none tracking-wide sm:text-3xl">{card.title}</h3>
      </div>

      <div className="grid gap-3 p-3 sm:grid-cols-[1.15fr_0.95fr] sm:p-4">
        <div className="rounded-lg border border-white/10 bg-black/35 p-3">
          <p className={`text-[11px] tracking-[0.22em] ${accent}`}>
            {card.state === "live" ? `LIVE · ${card.liveDetail}` : "LAST MATCH"}
          </p>
          {card.last ? (
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
                <Badge side={card.last.home} />
                <p className="w-full truncate text-xs text-muted-foreground">{card.last.home.name}</p>
              </div>
              <p className="font-display text-3xl leading-none sm:text-4xl">
                {card.last.home.score}
                <span className={`mx-1 ${accent}`}>-</span>
                {card.last.away.score}
              </p>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
                <Badge side={card.last.away} />
                <p className="w-full truncate text-xs text-muted-foreground">{card.last.away.name}</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No finished result yet.</p>
          )}
          {card.last && card.state !== "live" ? (
            <p className="mt-3 text-center text-xs text-muted-foreground">{card.last.detail}</p>
          ) : null}
        </div>

        <div
          className={`rounded-lg border p-3 ${
            red ? "border-[#9b2335]/50 bg-[#9b2335]/10" : "border-[#c5a046]/50 bg-[#c5a046]/10"
          }`}
        >
          <p className={`text-[11px] tracking-[0.22em] ${accent}`}>NEXT MATCH</p>
          {card.next ? (
            <>
              <p className="mt-2 text-sm font-medium">
                {shortDate(card.next.date)} · {card.next.kickIceland} Iceland
              </p>
              <p className="text-xs text-muted-foreground">
                {card.next.kickEngland} England · {card.next.competition}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
                  <Badge side={card.next.home} size={36} />
                  <p className="w-full truncate text-xs">{card.next.home.name}</p>
                </div>
                <span className={`font-display text-xl ${accent}`}>vs</span>
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
                  <Badge side={card.next.away} size={36} />
                  <p className="w-full truncate text-xs">{card.next.away.name}</p>
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">{card.next.ground}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No next fixture listed.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
        <div>
          <p className={`mb-1 text-[11px] tracking-[0.22em] ${accent}`}>LAST 5 GAMES</p>
          <FormDots form={card.form} red={red} />
        </div>
        <Link
          href={card.fixturesHref}
          className={`border px-4 py-2 text-center text-xs tracking-[0.16em] ${
            red ? "border-[#9b2335] text-[#f0b4be]" : "border-[#c5a046] text-[#e6c56a]"
          }`}
        >
          VIEW FIXTURES
        </Link>
      </div>
    </article>
  )
}
