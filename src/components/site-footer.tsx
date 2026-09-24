import { group } from "@/data/group"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <p className="mx-auto max-w-5xl px-4 py-8 text-sm leading-6 text-muted-foreground">
        {group.name} is a supporters&apos; group. This is not an official
        Wolverhampton Wanderers or Stourbridge F.C. site. Kick-offs move for
        television; the fixture list in this project is the one we keep.{" "}
        {group.meet}
      </p>
    </footer>
  )
}
