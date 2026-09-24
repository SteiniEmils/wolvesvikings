import type { Metadata } from "next"
import { Barlow_Condensed, Geist } from "next/font/google"
import { ScoreBanners } from "@/components/score-banners"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { loadBanners } from "@/lib/scores"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const display = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Wolves Vikings",
  description:
    "The lads who follow Wolverhampton Wanderers, and Stourbridge when the Glassboys are playing.",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const banners = await loadBanners()
  return (
    <html lang="en" className={`${geist.variable} ${display.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader />
        <ScoreBanners initial={banners} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
