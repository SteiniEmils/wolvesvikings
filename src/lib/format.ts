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

function londonWallToUtc(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(utcGuess))
      .map((part) => [part.type, part.value]),
  )
  const asLondon = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  )
  return new Date(utcGuess - (asLondon - utcGuess))
}

function clock(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date)
}

export function kickoffLine(fixture: Fixture) {
  const utc = londonWallToUtc(fixture.date, fixture.time)
  return `${clock(utc, "Atlantic/Reykjavik")} Iceland · ${clock(utc, "Europe/London")} England`
}

export function venueLine(fixture: Fixture) {
  const place = fixture.home ? "Home" : "Away"
  return `${place} · ${kickoffLine(fixture)} · ${fixture.ground}`
}

export function clubLabel(club: Fixture["club"]) {
  return club === "wolves" ? "Wolves" : "Stourbridge"
}
