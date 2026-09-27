import type { Fixture } from "@/data/fixtures"
import { fixturesFor } from "@/data/fixtures"
import { formHistory, type FormResult } from "@/data/form"

export type ScoreState = "live" | "matchday" | "result" | "quiet"

export type MatchSide = {
  name: string
  badge: string | null
  score: string | null
}

export type ClubCardData = {
  club: "wolves" | "stourbridge"
  title: string
  state: ScoreState
  liveDetail: string | null
  last: {
    home: MatchSide
    away: MatchSide
    detail: string
  } | null
  next: {
    home: MatchSide
    away: MatchSide
    date: string
    competition: string
    ground: string
    kickIceland: string
    kickEngland: string
  } | null
  form: FormResult[]
  fixturesHref: string
}

const teams = [
  {
    club: "wolves" as const,
    title: "Wolverhampton Wanderers",
    short: "Wolves",
    id: "133599",
    href: "/fixtures",
  },
  {
    club: "stourbridge" as const,
    title: "Stourbridge F.C.",
    short: "Stourbridge",
    id: "135962",
    href: "/fixtures#stourbridge",
  },
]

const liveStatuses = new Set(["1H", "2H", "HT", "ET", "BT", "P", "SUSP", "INT", "LIVE"])

type RawEvent = {
  idEvent?: string
  idHomeTeam?: string
  idAwayTeam?: string
  strHomeTeam?: string
  strAwayTeam?: string
  strHomeTeamBadge?: string | null
  strAwayTeamBadge?: string | null
  intHomeScore?: string | null
  intAwayScore?: string | null
  strStatus?: string | null
  strProgress?: string | null
  strTimestamp?: string | null
  dateEvent?: string | null
  strLeague?: string | null
  strVenue?: string | null
  strTime?: string | null
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 20 } })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

function shortName(name: string) {
  if (name.includes("Wolverhampton")) return "Wolves"
  return name
}

function httpsBadge(url: string | null | undefined) {
  if (!url) return null
  return url.replace(/^http:\/\//, "https://")
}

function clock(timestamp: string, timeZone: string) {
  const iso = timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso))
}

function dayLabel(timestamp: string) {
  const iso = timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Atlantic/Reykjavik",
    day: "numeric",
    month: "short",
  }).format(new Date(iso))
}

function todayInLondon() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function progressLabel(status: string | null | undefined, progress: string | null | undefined) {
  if (status === "HT") return "Half time"
  if (status === "P") return "Penalties"
  if (progress && /^\d+$/.test(progress)) return `${progress}'`
  if (status === "1H" || status === "2H" || status === "ET" || status === "LIVE") return "Live"
  return "Live"
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

function kickClocks(date: string, time: string) {
  const utc = londonWallToUtc(date, time)
  return {
    kickIceland: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Atlantic/Reykjavik",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(utc),
    kickEngland: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(utc),
  }
}

function resultLetter(teamId: string, event: RawEvent): FormResult | null {
  const home = Number(event.intHomeScore)
  const away = Number(event.intAwayScore)
  if (Number.isNaN(home) || Number.isNaN(away)) return null
  const usHome = event.idHomeTeam === teamId
  const us = usHome ? home : away
  const them = usHome ? away : home
  if (us > them) return "W"
  if (us < them) return "L"
  return "D"
}

function mergeForm(teamId: string, club: "wolves" | "stourbridge", last: RawEvent | undefined) {
  const seeded = [...formHistory[club]]
  if (!last || last.intHomeScore == null || last.intAwayScore == null) return seeded.slice(0, 5)
  const letter = resultLetter(teamId, last)
  if (!letter) return seeded.slice(0, 5)
  if (seeded[0] === letter) return seeded.slice(0, 5)
  return [letter, ...seeded].slice(0, 5)
}

function side(name: string, badge: string | null | undefined, score: string | null = null): MatchSide {
  return { name: shortName(name), badge: httpsBadge(badge), score }
}

function nextFromFixture(
  fixture: Fixture,
  clubBadge: string | null,
  ourName: string,
): ClubCardData["next"] {
  const clocks = kickClocks(fixture.date, fixture.time)
  const us = side(ourName, clubBadge)
  const them = side(fixture.opponent, null)
  return {
    home: fixture.home ? us : them,
    away: fixture.home ? them : us,
    date: fixture.date,
    competition: fixture.competition,
    ground: fixture.ground,
    ...clocks,
  }
}

function nextFromEvent(event: RawEvent, fallback: Fixture, ourName: string, clubBadge: string | null) {
  if (!event.dateEvent) return nextFromFixture(fallback, clubBadge, ourName)
  const time = event.strTime?.slice(0, 5) || fallback.time
  const clocks = event.strTimestamp
    ? {
        kickIceland: clock(event.strTimestamp, "Atlantic/Reykjavik"),
        kickEngland: clock(event.strTimestamp, "Europe/London"),
      }
    : kickClocks(event.dateEvent, time)
  return {
    home: side(event.strHomeTeam ?? "", event.strHomeTeamBadge),
    away: side(event.strAwayTeam ?? "", event.strAwayTeamBadge),
    date: event.dateEvent,
    competition: event.strLeague ?? fallback.competition,
    ground: event.strVenue || fallback.ground,
    ...clocks,
  }
}

export async function loadClubCards(): Promise<ClubCardData[]> {
  const [lives, ...rest] = await Promise.all([
    getJson<{ livescore?: RawEvent[] }>("https://www.thesportsdb.com/api/v1/json/3/livescore.php?s=Soccer"),
    ...teams.flatMap((team) => [
      getJson<{ results?: RawEvent[] }>(
        `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.id}`,
      ),
      getJson<{ events?: RawEvent[] }>(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${team.id}`,
      ),
      getJson<{ teams?: { strBadge?: string }[] }>(
        `https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${team.id}`,
      ),
    ]),
  ])

  const liveEvents = lives?.livescore ?? []
  const today = todayInLondon()

  return teams.map((team, index) => {
    const lastPayload = rest[index * 3] as { results?: RawEvent[] } | null
    const nextPayload = rest[index * 3 + 1] as { events?: RawEvent[] } | null
    const teamPayload = rest[index * 3 + 2] as { teams?: { strBadge?: string }[] } | null
    const last = lastPayload?.results?.[0]
    const nextEvent = nextPayload?.events?.[0]
    const clubBadge = httpsBadge(teamPayload?.teams?.[0]?.strBadge)
    const fallback = fixturesFor(team.club)[0]
    const live = liveEvents.find(
      (event) => event.idHomeTeam === team.id || event.idAwayTeam === team.id,
    )

    let state: ScoreState = "quiet"
    let liveDetail: string | null = null
    if (live && liveStatuses.has(live.strStatus ?? "")) {
      state = "live"
      liveDetail = progressLabel(live.strStatus, live.strProgress)
    } else if (nextEvent?.dateEvent === today || fallback?.date === today) {
      state = "matchday"
    } else if (last) {
      state = "result"
    }

    const source =
      state === "live" && live
        ? live
        : last && last.intHomeScore != null && last.intAwayScore != null
          ? last
          : null

    const lastBlock = source
      ? {
          home: side(source.strHomeTeam ?? "", source.strHomeTeamBadge, source.intHomeScore ?? "0"),
          away: side(source.strAwayTeam ?? "", source.strAwayTeamBadge, source.intAwayScore ?? "0"),
          detail:
            state === "live"
              ? `Live · ${liveDetail}`
              : `Full time · ${source.strTimestamp ? dayLabel(source.strTimestamp) : source.dateEvent ?? ""}`,
        }
      : null

    const nextBlock = nextEvent
      ? nextFromEvent(nextEvent, fallback, team.short, clubBadge)
      : fallback
        ? nextFromFixture(fallback, clubBadge, team.short)
        : null

    return {
      club: team.club,
      title: team.title,
      state,
      liveDetail,
      last: lastBlock,
      next: nextBlock,
      form: mergeForm(team.id, team.club, last),
      fixturesHref: team.href,
    }
  })
}
