"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Users } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href.startsWith("/#")) return false
  if (href.includes("#")) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string
  label: string
  pathname: string
}) {
  const active = isActive(pathname, href)
  return (
    <Link
      href={href}
      className={cn("relative py-1 hover:text-primary", active ? "text-white" : "text-white/70")}
    >
      {label.toUpperCase()}
      {active ? <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary" /> : null}
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/brand/wolves-vikings-logo.png"
            alt="Wolves Vikings"
            width={72}
            height={72}
            priority
            className="size-12 object-contain sm:size-14"
          />
          <span className="min-w-0">
            <span className="block font-display text-xl leading-none tracking-wide sm:text-2xl">
              <span className="text-white">WOLVES</span>{" "}
              <span className="text-primary">VIKINGS</span>
            </span>
            <span className="mt-1 hidden text-[10px] tracking-[0.18em] text-white/55 sm:block">
              FOOTBALL · FRIENDS · TRAVEL · MEMORIES
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 text-[11px] font-medium tracking-[0.14em] xl:flex">
          {links.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <Link
            href="/fixtures"
            aria-label="Search fixtures"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Search className="size-4 text-white/80" />
          </Link>
          <Link
            href="/join"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-4 font-semibold")}
          >
            <Users data-icon="inline-start" className="size-4" />
            Join us
          </Link>
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t border-white/5 px-4 py-2.5 text-[11px] tracking-[0.14em] xl:hidden">
        {links.map((link) => (
          <span key={link.href} className="shrink-0">
            <NavLink {...link} pathname={pathname} />
          </span>
        ))}
      </nav>
    </header>
  )
}
