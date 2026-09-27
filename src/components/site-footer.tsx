import Link from "next/link"
import { Camera, Compass, Plane, Trophy } from "lucide-react"
import { group } from "@/data/group"

const pillars = [
  { label: "Football", icon: Trophy },
  { label: "Friends", icon: Compass },
  { label: "Travel", icon: Plane },
  { label: "Memories", icon: Camera },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {pillars.map((pillar) => (
            <li key={pillar.label} className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-primary/40 text-primary">
                <pillar.icon className="size-4" />
              </span>
              <span className="text-xs tracking-[0.18em] text-primary uppercase">{pillar.label}</span>
            </li>
          ))}
        </ul>
        <p className="font-script text-3xl text-white sm:text-right sm:text-4xl">
          More than a supporters group
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {group.name} is a supporters&apos; group in Iceland. This is not an official
            Wolverhampton Wanderers or Stourbridge F.C. site. Kick-offs move for television; the
            fixture list in this project is the one we keep. {group.meet}
          </p>
          <Link href="/join" className="shrink-0 text-primary hover:text-primary/80">
            Join the club
          </Link>
        </div>
      </div>
    </footer>
  )
}
