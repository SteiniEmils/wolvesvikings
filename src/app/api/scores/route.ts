import { NextResponse } from "next/server"
import { loadBanners } from "@/lib/scores"

export const dynamic = "force-dynamic"

export async function GET() {
  const banners = await loadBanners()
  return NextResponse.json({ banners })
}
