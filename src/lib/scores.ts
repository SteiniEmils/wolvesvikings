export type ScoreState = "live" | "matchday" | "result" | "quiet"

export type ScoreBanner = {
  club: "wolves" | "stourbridge"
  name: string
  state: ScoreState
  home: string
  away: string
  homeScore: string | null
  awayScore: string | null
  detail: string
}

const teams = [
  { club: "wolves" as const, name: "Wolves", id: "133599" },
  { club: "stourbridge" as const, name: "Stourbridge", id: "135962" },
]

const liveStatuses = new Set(["1H", "2H", "HT", "ET", "BT", "P", "SUSP", "INT", "LIVE"])

type RawEvent = {
  idEvent?: string
  idHomeTeam?: string
  idAwayTeam?: string
  strHomeTeam?: string
  strAwayTeam?: string
  intHomeScore?: string | null
  intAwayScore?: string | null
  strStatus?: string | null
  strProgress?: string | null
  strTimestamp?: string | null
  dateEvent?: string | null
  strLeague?: string | null
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

function fromEvent(event: RawEvent, state: ScoreState, detail: string, club: ScoreBanner["club"], name: string): ScoreBanner {
  return {
    club,
    name,
    state,
    home: shortName(event.strHomeTeam ?? ""),
    away: shortName(event.strAwayTeam ?? ""),
    homeScore: event.intHomeScore ?? null,
    awayScore: event.intAwayScore ?? null,
    detail,
  }
}

function quiet(club: ScoreBanner["club"], name: string): ScoreBanner {
  return {
    club,
    name,
    state: "quiet",
    home: "",
    away: "",
    homeScore: null,
    awayScore: null,
    detail: "Score feed is quiet right now.",
  }
}

export async function loadBanners(): Promise<ScoreBanner[]> {
  const [lives, ...rest] = await Promise.all([
    getJson<{ livescore?: RawEvent[] }>("https://www.thesportsdb.com/api/v1/json/3/livescore.php?s=Soccer"),
    ...teams.flatMap((team) => [
      getJson<{ results?: RawEvent[] }>(
        `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.id}`,
      ),
      getJson<{ events?: RawEvent[] }>(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${team.id}`,
      ),
    ]),
  ])

  const liveEvents = lives?.livescore ?? []
  const today = todayInLondon()

  return teams.map((team, index) => {
    const lastPayload = rest[index * 2] as { results?: RawEvent[] } | null
    const nextPayload = rest[index * 2 + 1] as { events?: RawEvent[] } | null
    const last = lastPayload?.results?.[0]
    const next = nextPayload?.events?.[0]
    const live = liveEvents.find(
      (event) => event.idHomeTeam === team.id || event.idAwayTeam === team.id,
    )

    if (live && liveStatuses.has(live.strStatus ?? "")) {
      return fromEvent(
        live,
        "live",
        progressLabel(live.strStatus, live.strProgress),
        team.club,
        team.name,
      )
    }

    if (next?.dateEvent === today) {
      const kick = next.strTimestamp
        ? `${clock(next.strTimestamp, "Atlantic/Reykjavik")} Iceland`
        : "Matchday"
      return fromEvent(next, "matchday", `Not kicked off · ${kick}`, team.club, team.name)
    }

    if (last && last.intHomeScore != null && last.intAwayScore != null) {
      const when = last.strTimestamp ? dayLabel(last.strTimestamp) : last.dateEvent ?? ""
      return fromEvent(last, "result", `Full time · ${when}`, team.club, team.name)
    }

    return quiet(team.club, team.name)
  })
}
