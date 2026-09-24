import { JoinClub } from "@/components/join-club"
import { isMember } from "@/lib/auth"
import { listApplications } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Join · Wolves Vikings",
}

export default async function JoinPage() {
  const [rows, member] = await Promise.all([listApplications(), isMember()])
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <header>
        <h1 className="font-display text-5xl">Join the club</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Wolves Vikings is a small group in Iceland. Apply with your name. You are not in until
          someone already in the club approves you.
        </p>
      </header>
      <JoinClub
        approved={rows
          .filter((row) => row.status === "approved")
          .map((row) => ({ ...row, note: "" }))}
        pending={member ? rows.filter((row) => row.status === "pending") : []}
        member={member}
      />
    </div>
  )
}
