import { NextResponse } from "next/server"
import { loadClubCards } from "@/lib/scores"

export const dynamic = "force-dynamic"

export async function GET() {
  const cards = await loadClubCards()
  return NextResponse.json({ cards })
}
