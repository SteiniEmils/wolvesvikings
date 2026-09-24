"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Photo } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AlbumGrid({
  fixtureId,
  photos,
}: {
  fixtureId: string
  photos: Pick<Photo, "id" | "uploader" | "caption">[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(photos)
  const [name, setName] = useState("")
  const [caption, setCaption] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setPending(true)
    const form = event.currentTarget
    const data = new FormData(form)
    data.set("fixtureId", fixtureId)
    try {
      const response = await fetch("/api/albums", { method: "POST", body: data })
      const payload = (await response.json().catch(() => null)) as {
        error?: string
        photo?: { id: string; uploader: string; caption: string }
      } | null
      if (!response.ok || !payload?.photo) {
        setError(payload?.error ?? "The photo didn't save. The album is unchanged.")
        return
      }
      setItems((current) => [...current, payload.photo as Photo])
      setName("")
      setCaption("")
      form.reset()
      router.refresh()
    } catch {
      setError("The photo didn't save. The album is unchanged.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-8">
      {items.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">
          No photos from this one yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((photo) => (
            <li key={photo.id} className="border border-border bg-card">
              {/* Cookie-gated route. next/image would not send the session the same way through the optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/photos/${photo.id}`}
                alt={photo.caption || `Photo from ${photo.uploader}`}
                className="aspect-4/3 w-full object-cover"
              />
              <p className="px-3 py-2 text-sm">
                <span className="font-medium">{photo.uploader}</span>
                {photo.caption ? <span className="text-muted-foreground"> · {photo.caption}</span> : null}
              </p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit} className="border border-border bg-card p-5">
        <h2 className="font-display text-3xl">Add a photo</h2>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="uploader">First name</Label>
            <Input id="uploader" name="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Input id="caption" name="caption" value={caption} maxLength={80} onChange={(event) => setCaption(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">Photo</Label>
            <Input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp" required />
          </div>
          {error ? (
            <p className="text-sm text-glassboys" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Uploading" : "Upload"}
          </Button>
          <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. 8MB at most.</p>
        </div>
      </form>
    </div>
  )
}
