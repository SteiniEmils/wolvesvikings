"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Fixture } from "@/data/fixtures"
import { formatFixtureDate, kickoffLine } from "@/lib/format"
import type { Rsvp, RsvpStatus } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const statusLabel: Record<RsvpStatus, string> = {
  here: "Watching here",
  flying: "Flying over",
  maybe: "Maybe",
}

export function MatchdayBoard({
  fixtures,
  initialFixtureId,
  initialEntries,
  member,
}: {
  fixtures: Fixture[]
  initialFixtureId: string
  initialEntries: Rsvp[]
  member: boolean
}) {
  const router = useRouter()
  const [fixtureId, setFixtureId] = useState(initialFixtureId)
  const [entries, setEntries] = useState(initialEntries)
  const [name, setName] = useState("")
  const [status, setStatus] = useState<RsvpStatus>("here")
  const [note, setNote] = useState("")
  const [code, setCode] = useState("")
  const [unlocked, setUnlocked] = useState(member)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const rows = useMemo(
    () => entries.filter((entry) => entry.fixtureId === fixtureId),
    [entries, fixtureId],
  )
  const fixture = fixtures.find((item) => item.id === fixtureId) ?? fixtures[0]

  async function unlockIfNeeded() {
    if (unlocked) return true
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    })
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      setError(payload?.error ?? "That group word is not right.")
      return false
    }
    setUnlocked(true)
    return true
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setPending(true)
    try {
      const open = await unlockIfNeeded()
      if (!open) return
      const response = await fetch("/api/matchdays", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fixtureId,
          name,
          status,
          note,
          code: unlocked ? undefined : code,
        }),
      })
      const payload = (await response.json().catch(() => null)) as {
        error?: string
        entry?: Rsvp
      } | null
      if (!response.ok || !payload?.entry) {
        setError(payload?.error ?? "The name didn't save. Try again.")
        return
      }
      setEntries((current) => [...current, payload.entry as Rsvp])
      setName("")
      setNote("")
      router.refresh()
    } catch {
      setError("The name didn't save. Try again.")
    } finally {
      setPending(false)
    }
  }

  async function remove(id: string) {
    setError("")
    setPending(true)
    try {
      const open = await unlockIfNeeded()
      if (!open) return
      const response = await fetch("/api/matchdays", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, code: unlocked ? undefined : code }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setError(payload?.error ?? "That name stayed on the list. Try again.")
        return
      }
      setEntries((current) => current.filter((entry) => entry.id !== id))
      router.refresh()
    } catch {
      setError("That name stayed on the list. Try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <Label htmlFor="fixture">Fixture</Label>
        <select
          id="fixture"
          value={fixtureId}
          onChange={(event) => {
            setFixtureId(event.target.value)
            const url = new URL(window.location.href)
            url.searchParams.set("fixture", event.target.value)
            window.history.replaceState(null, "", url.pathname + url.search)
          }}
          className="mt-2 h-10 w-full border border-input bg-card px-3 text-sm"
        >
          <optgroup label="Wolves">
            {fixtures
              .filter((item) => item.club === "wolves")
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.date} {item.home ? "vs" : "at"} {item.opponent}
                </option>
              ))}
          </optgroup>
          <optgroup label="Stourbridge">
            {fixtures
              .filter((item) => item.club === "stourbridge")
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.date} {item.home ? "vs" : "at"} {item.opponent}
                </option>
              ))}
          </optgroup>
        </select>
        <p className="mt-3 text-sm text-muted-foreground">
          {formatFixtureDate(fixture.date)} · {kickoffLine(fixture)} · {fixture.ground}
        </p>
        {rows.length === 0 ? (
          <p className="mt-8 border border-dashed border-border p-6 text-sm text-muted-foreground">
            Nobody from Iceland is down for this one yet.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border border border-border">
            {rows.map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {statusLabel[row.status]}
                    {row.note ? ` · ${row.note}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => remove(row.id)}
                >
                  Take me off
                </Button>
              </li>
            ))}
          </ul>
        )}
        {error ? (
          <p className="mt-4 text-sm text-glassboys" role="alert">
            {error}
          </p>
        ) : null}
      </section>
      <form onSubmit={onSubmit} className="border border-border bg-card p-5">
        <h2 className="font-display text-3xl">I&apos;m in</h2>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">First name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as RsvpStatus)}
              className="h-8 w-full border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="here">Watching here</option>
              <option value="flying">Flying over</option>
              <option value="maybe">Maybe</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              value={note}
              maxLength={80}
              placeholder="Reykjavík, or landing Friday"
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
          {unlocked ? (
            <p className="text-sm text-muted-foreground">
              You&apos;re in. This browser already has the group word.
            </p>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="code">Group word</Label>
              <Input
                id="code"
                type="password"
                value={code}
                autoComplete="current-password"
                onChange={(event) => setCode(event.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The word the group shares. It is not shown on this page.
              </p>
            </div>
          )}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Saving" : "Add my name"}
          </Button>
        </div>
        <Badge variant="outline" className="mt-4">
          {rows.length} from Iceland
        </Badge>
      </form>
    </div>
  )
}
