"use client"

import { useEffect, useState } from "react"
import type { ScoreBanner } from "@/lib/scores"

export function ScoreBanners({ initial }: { initial: ScoreBanner[] }) {
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
        // Keep the last banner on screen if the feed blips.
      }
    }
    const timer = window.setInterval(refresh, live ? 20000 : 60000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [live])

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-5xl gap-px bg-border sm:grid-cols-2">
        {banners.map((banner) => (
          <article
            key={banner.club}
            className={
              banner.club === "stourbridge"
                ? "border-l-4 border-glassboys bg-card px-4 py-3"
                : "border-l-4 border-primary bg-card px-4 py-3"
            }
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{banner.name}</p>
              <p
                className={
                  banner.state === "live"
                    ? "text-xs font-medium tracking-wide text-primary uppercase"
                    : "text-xs tracking-wide text-muted-foreground uppercase"
                }
              >
                {banner.state === "live"
                  ? `Live · ${banner.detail}`
                  : banner.state === "matchday"
                    ? "Matchday"
                    : banner.state === "result"
                      ? "Last game"
                      : "Scores"}
              </p>
            </div>
            {banner.state === "quiet" ? (
              <p className="mt-1 text-sm text-muted-foreground">{banner.detail}</p>
            ) : (
              <>
                <p className="mt-1 font-display text-2xl leading-none sm:text-3xl">
                  {banner.home}
                  <span className="mx-2 text-primary">
                    {banner.homeScore ?? "–"}–{banner.awayScore ?? "–"}
                  </span>
                  {banner.away}
                </p>
                {banner.state === "live" ? null : (
                  <p className="mt-1 text-sm text-muted-foreground">{banner.detail}</p>
                )}
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
