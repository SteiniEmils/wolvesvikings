"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type Application, type ShirtSize, shirtSizes } from "@/data/membership"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const selectClass =
  "h-8 w-full border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function JoinClub({
  approved,
  pending,
  member,
}: {
  approved: Application[]
  pending: Application[]
  member: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [place, setPlace] = useState("")
  const [shirtSize, setShirtSize] = useState<ShirtSize | "">("")
  const [note, setNote] = useState("")
  const [code, setCode] = useState("")
  const [unlocked, setUnlocked] = useState(member)
  const [waiting, setWaiting] = useState(pending)
  const [members, setMembers] = useState(approved)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [reviewError, setReviewError] = useState("")
  const [pendingSave, setPendingSave] = useState(false)

  async function unlock(event: React.FormEvent) {
    event.preventDefault()
    setReviewError("")
    setPendingSave(true)
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setReviewError(payload?.error ?? "That group word is not right.")
        return
      }
      setUnlocked(true)
      router.refresh()
    } catch {
      setReviewError("The review list didn't open. Try again.")
    } finally {
      setPendingSave(false)
    }
  }

  async function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setPendingSave(true)
    const form = event.currentTarget
    const data = new FormData(form)
    const body = {
      name: String(data.get("name") ?? ""),
      nickname: String(data.get("nickname") ?? ""),
      place: String(data.get("place") ?? ""),
      shirtSize: String(data.get("shirtSize") ?? ""),
      note: String(data.get("note") ?? ""),
    }
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setError(payload?.error ?? "The application didn't send. Try again.")
        return
      }
      setSent(true)
      setName("")
      setNickname("")
      setPlace("")
      setShirtSize("")
      setNote("")
      if (unlocked) {
        const list = await fetch("/api/applications")
        const next = (await list.json().catch(() => null)) as { pending?: Application[] } | null
        if (next?.pending) setWaiting(next.pending)
      }
    } catch {
      setError("The application didn't send. Try again.")
    } finally {
      setPendingSave(false)
    }
  }

  async function review(id: string, decision: "approved" | "declined") {
    setReviewError("")
    setPendingSave(true)
    try {
      const response = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, decision }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setReviewError(payload?.error ?? "That decision didn't save.")
        return
      }
      const chosen = waiting.find((item) => item.id === id)
      setWaiting((current) => current.filter((item) => item.id !== id))
      if (decision === "approved" && chosen) {
        setMembers((current) => [...current, { ...chosen, status: "approved" }])
      }
      router.refresh()
    } catch {
      setReviewError("That decision didn't save.")
    } finally {
      setPendingSave(false)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="border border-border bg-card p-5">
        <h2 className="font-display text-3xl">Apply</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Send your name. Someone already in the club has to approve it before you show up on the list.
        </p>
        {sent ? (
          <p className="mt-6 border border-dashed border-border p-4 text-sm">
            Application sent. It stays private until the club approves it.
          </p>
        ) : (
          <form onSubmit={apply} className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="name">First name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                name="nickname"
                value={nickname}
                maxLength={24}
                placeholder="Optional"
                onChange={(event) => setNickname(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="place">Where in Iceland</Label>
              <Input
                id="place"
                name="place"
                value={place}
                maxLength={40}
                onChange={(event) => setPlace(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shirtSize">Shirt size</Label>
              <select
                id="shirtSize"
                name="shirtSize"
                value={shirtSize}
                onChange={(event) => setShirtSize(event.target.value as ShirtSize | "")}
                className={selectClass}
                required
              >
                <option value="" disabled>
                  Pick a size
                </option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Who you are</Label>
              <Input
                id="note"
                name="note"
                value={note}
                maxLength={200}
                placeholder="How you know the group"
                onChange={(event) => setNote(event.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-glassboys" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" disabled={pendingSave}>
              {pendingSave ? "Sending" : "Send application"}
            </Button>
          </form>
        )}
      </section>

      <section>
        <h2 className="font-display text-3xl">In the club</h2>
        {members.length === 0 ? (
          <p className="mt-4 border border-dashed border-border p-6 text-sm text-muted-foreground">
            No one has been approved through the site yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border border border-border">
            {members.map((person) => (
              <li key={person.id} className="px-4 py-3">
                <p className="font-medium">
                  {person.name}
                  {person.nickname ? (
                    <span className="font-normal text-muted-foreground"> “{person.nickname}”</span>
                  ) : null}
                </p>
                {person.place ? <p className="text-sm text-muted-foreground">{person.place}</p> : null}
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-10 font-display text-3xl">Applications</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Only the club can see who is waiting, and only the club can let them in.
        </p>
        {unlocked ? (
          waiting.length === 0 ? (
            <p className="mt-4 border border-dashed border-border p-6 text-sm text-muted-foreground">
              No applications waiting.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border border border-border">
              {waiting.map((person) => (
                <li key={person.id} className="px-4 py-3">
                  <p className="font-medium">
                    {person.name}
                    {person.nickname ? (
                      <span className="font-normal text-muted-foreground"> “{person.nickname}”</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[person.place, person.shirtSize ? `Shirt ${person.shirtSize}` : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="mt-1 text-sm">{person.note}</p>
                  <div className="mt-3 flex gap-2">
                    <Button type="button" size="sm" disabled={pendingSave} onClick={() => review(person.id, "approved")}>
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={pendingSave}
                      onClick={() => review(person.id, "declined")}
                    >
                      Decline
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          <form onSubmit={unlock} className="mt-4 grid max-w-sm gap-3">
            <Label htmlFor="code">Group word</Label>
            <Input
              id="code"
              type="password"
              value={code}
              autoComplete="current-password"
              onChange={(event) => setCode(event.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">The word the club shares. It is not shown on this page.</p>
            {reviewError ? (
              <p className="text-sm text-glassboys" role="alert">
                {reviewError}
              </p>
            ) : null}
            <Button type="submit" size="lg" disabled={pendingSave}>
              {pendingSave ? "Checking" : "Review applications"}
            </Button>
          </form>
        )}
        {unlocked && reviewError ? (
          <p className="mt-3 text-sm text-glassboys" role="alert">
            {reviewError}
          </p>
        ) : null}
      </section>
    </div>
  )
}
