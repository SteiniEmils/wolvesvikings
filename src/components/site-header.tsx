import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

const links = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Wolves" },
  { href: "/fixtures#stourbridge", label: "Stourbridge FC" },
  { href: "/#trips", label: "Trips" },
  { href: "/#news", label: "News" },
  { href: "/albums", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/join", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-primary/30 bg-black/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/brand/wolves-vikings-logo.png"
            alt="Wolves Vikings"
            width={64}
            height={64}
            priority
            className="size-12 object-contain"
          />
          <span className="min-w-0">
            <span className="block font-display text-xl leading-none tracking-wide text-primary sm:text-2xl">
              WOLVES VIKINGS
            </span>
            <span className="mt-1 hidden text-[10px] tracking-[0.18em] text-muted-foreground sm:block">
              FOOTBALL · FRIENDS · TRAVEL · MEMORIES
            </span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-4 text-xs font-medium tracking-wide text-foreground/80 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>
        <Link href="/join" className={`${buttonVariants({ size: "lg" })} ml-auto shrink-0 rounded-full lg:ml-2`}>
          Join us
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-3 text-xs tracking-wide text-muted-foreground lg:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 hover:text-primary">
            {link.label.toUpperCase()}
          </Link>
        ))}
      </nav>
    </header>
  )
}
