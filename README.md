# Wolves Vikings

A site for the Wolves Vikings, a small supporters' group in Iceland, with a smaller corner for Stourbridge F.C. People apply to join, and someone already in the club has to approve them. Photos sit in an album per fixture and stay behind the group word.

Each club has a match card with the last result, the next kick-off, team badges, and a last-five form. On a matchday the card switches to the live score and the minute. Kick-offs are shown in Iceland time first. Scores and badges come from TheSportsDB. The rest of the five-game form is kept in `src/data/form.ts` because the free feed only returns one past match.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:41731](http://127.0.0.1:41731).

The local group word is `molineux` unless you change `VIKINGS_CODE` in `.env.local`. It is not printed on the site. Enter it to review join applications, and to open or upload photos. The browser keeps it in a cookie. Applications stay private until they are approved.

## Edit the list

Kick-offs move for television. There is no live football feed.

- `src/data/fixtures.ts` — opponent, home or away, competition, date, time, ground.
- `src/data/group.ts` — the short lines about the group, and the meet-up sentence.

Portsmouth’s Championship game was moved to 16 September 2026 and is not listed as still to come. The next Wolf in the seed data is Middlesbrough, away, Saturday 10 October 2026, 15:00, Riverside Stadium. Stourbridge start at Rushall Olympic, away, Saturday 26 September 2026.

## Photos

Albums live outside `public/`, in `data/uploads/`, with an index at `data/albums.json`. Join applications live in `data/applications.json`. Those files are not committed. A direct photo link returns nothing useful without the group word.

Accepted uploads are JPEG, PNG, and WebP, up to 8MB.
