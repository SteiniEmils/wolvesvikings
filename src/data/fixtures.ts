export type Club = "wolves" | "stourbridge"

export type Fixture = {
  id: string
  club: Club
  opponent: string
  home: boolean
  competition: string
  date: string
  time: string
  ground: string
}

export const fixtures: Fixture[] = [
  {
    id: "wolves-middlesbrough-2026-10-10",
    club: "wolves",
    opponent: "Middlesbrough",
    home: false,
    competition: "Championship",
    date: "2026-10-10",
    time: "15:00",
    ground: "Riverside Stadium",
  },
  {
    id: "wolves-bolton-2026-10-13",
    club: "wolves",
    opponent: "Bolton Wanderers",
    home: true,
    competition: "Championship",
    date: "2026-10-13",
    time: "19:45",
    ground: "Molineux",
  },
  {
    id: "wolves-burnley-2026-10-16",
    club: "wolves",
    opponent: "Burnley",
    home: false,
    competition: "Championship",
    date: "2026-10-16",
    time: "20:00",
    ground: "Turf Moor",
  },
  {
    id: "wolves-watford-2026-10-24",
    club: "wolves",
    opponent: "Watford",
    home: true,
    competition: "Championship",
    date: "2026-10-24",
    time: "15:00",
    ground: "Molineux",
  },
  {
    id: "wolves-cardiff-2026-10-31",
    club: "wolves",
    opponent: "Cardiff City",
    home: true,
    competition: "Championship",
    date: "2026-10-31",
    time: "15:00",
    ground: "Molineux",
  },
  {
    id: "wolves-bristol-2026-11-04",
    club: "wolves",
    opponent: "Bristol City",
    home: false,
    competition: "Championship",
    date: "2026-11-04",
    time: "20:00",
    ground: "Ashton Gate",
  },
  {
    id: "wolves-wrexham-2026-11-07",
    club: "wolves",
    opponent: "Wrexham",
    home: false,
    competition: "Championship",
    date: "2026-11-07",
    time: "12:00",
    ground: "Racecourse Ground",
  },
  {
    id: "wolves-charlton-2026-11-21",
    club: "wolves",
    opponent: "Charlton Athletic",
    home: true,
    competition: "Championship",
    date: "2026-11-21",
    time: "15:00",
    ground: "Molineux",
  },
  {
    id: "stourbridge-rushall-2026-09-26",
    club: "stourbridge",
    opponent: "Rushall Olympic",
    home: false,
    competition: "FA Trophy",
    date: "2026-09-26",
    time: "15:00",
    ground: "Dales Lane",
  },
  {
    id: "stourbridge-alvechurch-2026-09-29",
    club: "stourbridge",
    opponent: "Alvechurch",
    home: false,
    competition: "Southern League Premier Central",
    date: "2026-09-29",
    time: "19:45",
    ground: "Lye Meadow",
  },
  {
    id: "stourbridge-warwick-2026-10-03",
    club: "stourbridge",
    opponent: "Racing Club Warwick",
    home: true,
    competition: "Southern League Premier Central",
    date: "2026-10-03",
    time: "15:00",
    ground: "War Memorial Athletic Ground",
  },
  {
    id: "stourbridge-leighton-2026-10-10",
    club: "stourbridge",
    opponent: "Leighton Town",
    home: true,
    competition: "Southern League Premier Central",
    date: "2026-10-10",
    time: "15:00",
    ground: "War Memorial Athletic Ground",
  },
  {
    id: "stourbridge-worcester-2026-10-13",
    club: "stourbridge",
    opponent: "Worcester",
    home: false,
    competition: "Southern League Premier Central",
    date: "2026-10-13",
    time: "19:45",
    ground: "Away",
  },
  {
    id: "stourbridge-bury-2026-10-17",
    club: "stourbridge",
    opponent: "Bury Town",
    home: false,
    competition: "Southern League Premier Central",
    date: "2026-10-17",
    time: "15:00",
    ground: "Away",
  },
  {
    id: "stourbridge-anstey-2026-10-20",
    club: "stourbridge",
    opponent: "Anstey Nomads",
    home: true,
    competition: "Southern League Premier Central",
    date: "2026-10-20",
    time: "19:45",
    ground: "War Memorial Athletic Ground",
  },
  {
    id: "stourbridge-bedford-2026-10-27",
    club: "stourbridge",
    opponent: "Real Bedford",
    home: false,
    competition: "Southern League Premier Central",
    date: "2026-10-27",
    time: "19:45",
    ground: "Away",
  },
  {
    id: "stourbridge-kettering-2026-10-31",
    club: "stourbridge",
    opponent: "Kettering",
    home: true,
    competition: "Southern League Premier Central",
    date: "2026-10-31",
    time: "15:00",
    ground: "War Memorial Athletic Ground",
  },
]

export function fixturesFor(club: Club) {
  return fixtures
    .filter((fixture) => fixture.club === club)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
}

export function fixtureById(id: string) {
  return fixtures.find((fixture) => fixture.id === id)
}

export const nextWolf = fixturesFor("wolves")[0]
export const nextGlassboy = fixturesFor("stourbridge")[0]
