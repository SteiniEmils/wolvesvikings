import type { Fixture } from "@/data/fixtures"

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/London",
})

export function formatFixtureDate(date: string) {
  return dateFormat.format(new Date(`${date}T12:00:00Z`))
}

export function venueLine(fixture: Fixture) {
  const place = fixture.home ? "Home" : "Away"
  return `${place} · ${fixture.time} · ${fixture.ground}`
}

export function clubLabel(club: Fixture["club"]) {
  return club === "wolves" ? "Wolves" : "Stourbridge"
}
