import { fixtures, fixtureById, nextWolf } from "@/data/fixtures"
import { MatchdayBoard } from "@/components/matchday-board"
import { isMember } from "@/lib/auth"
import { listRsvps } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Who's in · Wolves Vikings",
}

export default async function MatchdayPage({
  searchParams,
}: {
  searchParams: Promise<{ fixture?: string }>
}) {
  const query = await searchParams
  const selected = query.fixture && fixtureById(query.fixture) ? query.fixture : nextWolf.id
  const [entries, member] = await Promise.all([listRsvps(), isMember()])

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-5xl">Who&apos;s in</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          The group is in Iceland. Mark yourself as watching here, flying over, or maybe.
          Kickoffs are in Iceland time first, then England. Adding or taking a name off
          needs the group word.
        </p>
      </header>
      <MatchdayBoard
        fixtures={fixtures}
        initialFixtureId={selected}
        initialEntries={entries}
        member={member}
      />
    </div>
  )
}
