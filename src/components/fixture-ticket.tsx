import Link from "next/link"
import type { Fixture } from "@/data/fixtures"
import { clubLabel, formatFixtureDate, venueLine } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function FixtureTicket({
  fixture,
  featured = false,
}: {
  fixture: Fixture
  featured?: boolean
}) {
  const glassboys = fixture.club === "stourbridge"
  return (
    <article
      className={cn(
        "border bg-card p-5 sm:p-6",
        glassboys ? "border-l-4 border-glassboys border-y-border border-r-border" : "border-border",
        featured && "border-t-4 border-t-primary",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{fixture.competition}</Badge>
        <Badge variant="secondary">{fixture.home ? "Home" : "Away"}</Badge>
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {clubLabel(fixture.club)}
        </span>
      </div>
      <h2
        className={cn(
          "mt-4 font-display leading-none tracking-tight",
          featured ? "text-5xl sm:text-6xl" : "text-3xl",
        )}
      >
        {fixture.opponent}
      </h2>
      <p className="mt-3 text-base text-foreground">{formatFixtureDate(fixture.date)}</p>
      <p className="text-sm text-muted-foreground">{venueLine(fixture)}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/join" className={buttonVariants({ size: "lg" })}>
          Join the club
        </Link>
        <Link
          href={`/albums/${fixture.id}`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Photos from this trip
        </Link>
      </div>
    </article>
  )
}
