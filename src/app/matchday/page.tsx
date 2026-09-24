import { fixtures, fixtureById, nextWolf } from "@/data/fixtures"
import { MatchdayBoard } from "@/components/matchday-board"
import { isMember } from "@/lib/auth"
import { listRsvps } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Matchday · Wolves Vikings",
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
        <h1 className="font-display text-5xl">Matchday</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Put your name on a trip. Going, maybe, or you need a lift. The list is shared.
          Adding or taking a name off needs the group word.
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
