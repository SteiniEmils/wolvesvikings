# Wolves Vikings

A matchday site for the lads in Iceland who follow Wolverhampton Wanderers, with a smaller corner for Stourbridge F.C. The list is who's watching here and who's flying over. Photos sit in an album per fixture and stay behind the group word.

A banner for each club shows the last result. On a matchday it switches to the live score and the minute, and before kickoff it shows the Iceland time. Scores come from TheSportsDB and refresh on the page.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:41731](http://127.0.0.1:41731).

The local group word is `molineux` unless you change `VIKINGS_CODE` in `.env.local`. It is not printed on the site. Enter it once to add or remove a name, and to open or upload photos. The browser keeps it in a cookie.

## Edit the list

Kick-offs move for television. There is no live football feed.

- `src/data/fixtures.ts` — opponent, home or away, competition, date, time, ground.
- `src/data/group.ts` — the short lines about the group, and the meet-up sentence.

Portsmouth’s Championship game was moved to 16 September 2026 and is not listed as still to come. The next Wolf in the seed data is Middlesbrough, away, Saturday 10 October 2026, 15:00, Riverside Stadium. Stourbridge start at Rushall Olympic, away, Saturday 26 September 2026.

## Photos

Albums live outside `public/`, in `data/uploads/`, with an index at `data/albums.json`. Names live in `data/matchdays.json`. Those files are not committed. A direct photo link returns nothing useful without the group word.

Accepted uploads are JPEG, PNG, and WebP, up to 8MB.
