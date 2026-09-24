"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AlbumLock() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setError(payload?.error ?? "That group word is not right.")
        return
      }
      router.refresh()
    } catch {
      setError("The albums didn't open. Try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="mx-auto max-w-md border border-border bg-card px-6 py-10 text-center">
      <Image
        src="/brand/wolves-vikings-logo.jpg"
        alt="Wolves Vikings"
        width={220}
        height={220}
        className="mx-auto size-40 object-contain"
      />
      <h1 className="mt-4 font-display text-4xl">Match photos, members</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pictures from each trip stay with the group. Enter the group word to look and to upload.
      </p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 text-left">
        <Label htmlFor="album-code">Group word</Label>
        <Input
          id="album-code"
          type="password"
          value={code}
          autoComplete="current-password"
          onChange={(event) => setCode(event.target.value)}
          required
        />
        {error ? (
          <p className="text-sm text-glassboys" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Checking" : "Open the albums"}
        </Button>
      </form>
    </section>
  )
}
