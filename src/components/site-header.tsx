import Image from "next/image"
import Link from "next/link"

const links = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/join", label: "Join" },
  { href: "/albums", label: "Albums" },
]

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/wolves-vikings-logo.jpg"
            alt="Wolves Vikings"
            width={96}
            height={96}
            priority
            className="size-16 object-contain sm:size-20"
          />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm tracking-wide text-muted-foreground uppercase">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
