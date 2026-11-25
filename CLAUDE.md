# Working on this repo

Fan wiki for **Dot Abyss** (ドットアビス), a pixel-art abyss-delving idle RPG by
EXNOA LLC / Studio KUMASAN Inc. Static Next.js site, no backend, no database.
The owner adds new game data by asking in chat, so most sessions here are data
updates rather than feature work.

Read this before touching anything. The procedures below are the baseline.

## Ground rules

1. **Never invent game data.** Every value must come from a source that was
   actually read this session. If a field cannot be verified, leave it out or
   use `null` — never a plausible guess. A wrong stat is worse than a missing
   one.
2. **Miraheze is the text source** (CC BY-SA 4.0, attribution and share-alike).
   **wikiru** supplies the stat, weapon and armor tables and is credited per
   record in `statsSource`. **GameWith's wording is never reused** — its terms
   forbid it. Bare facts taken from GameWith (which units make up a published
   team, a tier label) are recorded with a credit and a link, and every word of
   explanation around them is written here. If you need to describe why a team
   works, derive it from the mechanics in this repo rather than restating what
   the source said.
3. **Keep game vocabulary verbatim** in the data: `Front`, `Back`, `Assist`,
   `Passion`, `Impact`, `SSR`, element names. Translation belongs in
   `messages/*.json`, never in `src/data`.
4. **Stamp provenance.** Every record carries `source` and `lastVerified`
   (ISO `YYYY-MM-DD`). Update `lastVerified` whenever you re-check a record.
5. **No R18 imagery.** Facility ("Brothel") skill text is in scope because it
   affects play; bedroom scenes and their artwork are not.
6. `npm run verify` must pass before any commit.

## Sources

| Source | Use | Licence |
| --- | --- | --- |
| <https://dotabyss.miraheze.org/> | primary, English | CC BY-SA 4.0 |
| <https://dotabyss.wikiru.jp/> | Japanese, most complete taxonomy | check before reuse |
| <https://gamewith.jp/dotabyss/> | fact-checking only | reuse prohibited |

## Task: add or update a character

1. Read the character page on Miraheze. Record the exact field values.
2. If the unit is not yet in [`src/data/roster.json`](src/data/roster.json), add
   a row. `slug` is lowercase kebab-case; `characterId` is the slug of the base
   unit, so `swimsuit-nina` has `characterId: "nina"`. Alt versions can differ
   from their base in element and stance — copy what the source says, do not
   assume.
3. Create `src/data/details/<slug>.json` matching `characterDetailSchema` in
   [`src/lib/schema.ts`](src/lib/schema.ts).
4. Register the file in `DETAIL_SOURCES` in
   [`src/lib/characters.ts`](src/lib/characters.ts). Imports are explicit on
   purpose, so an orphaned file fails the build instead of vanishing.
5. Raise `dataStatus` in `roster.json`: `stub` (roster row only), `partial`
   (some skills or passives), `complete` (everything the source shows).
6. `npm run verify`.

The loader refuses to build on a duplicate slug, a detail file with no roster
entry, or a crest that contradicts its element (Fire/Water/Earth → Passion,
Light/Dark/Neutral → Impact).

## Task: add artwork

Images are files, not data. Drop them in and they appear:

- `public/characters/icons/<slug>.webp` — square, around 128px, used on cards,
  tables and page headers.
- `public/characters/portraits/<slug>.webp` — tall 3:4 key art, used on the
  character page.

`npm run images` (which `dev` and `build` run first) rescans those folders and
rewrites `src/data/image-manifest.json`. A character with no file falls back to
a monogram tile, so partial coverage is fine.

Artwork belongs to the game developer and is used here as a fan wiki. Keep it at
display resolution, never redistribute source assets, and never hotlink another
wiki's files.

## Task: add a new content type

Enemies and events follow the same shape as characters and equipment: a Zod
schema in `src/lib/schema.ts`, a JSON file in `src/data`, a loader that parses
it at module scope, then pages.

Equipment is already built. `src/data/equipment.json` holds 48 weapons and gear
pieces, `src/data/mana-crystals.json` holds the 11 crystals, and
[`src/lib/equipment.ts`](src/lib/equipment.ts) parses both. Two conventions
there are worth keeping:

- The "(Effect activates only for 1 per party)" clause is lifted out of the
  effect text into the `partyUnique` flag, so the UI shows it as a badge
  instead of repeating it in prose.
- "(Event)" is stripped from the name and recorded as `eventOnly`.

## Verification

```bash
npm run verify   # lint + typecheck + vitest + production build
npm run dev      # http://localhost:3000, Thai at /th and English at /en
```

A production build currently prerenders every page; if a route turns dynamic,
something imported a server-only API by accident.

## Known gaps

- Four character pages exist on Miraheze but are absent from its roster table:
  `Henri`, `Jenma`, `Raven`, `Sheryl`. They are deliberately not in
  `roster.json` because their attributes were never verified. `Jenma` and
  `Sheryl` may be alternate romanisations of `Gemma` and `Cheryl`.
- Skill and passive text is English only. The UI is translated; the game data
  is not.
- Character base stats are recorded (Lv30, 5 limit breaks, before ability and
  facility bonuses) from wikiru. Two pairs share an identical stat triple and
  may be a wiki copy-paste: Hatsune and Henrietta (3364/1168/1432), and Liella
  and Faris (3020/1848/940). Verify in game before relying on them.
- The Weapons page has no rarity or stat columns, so equipment records carry
  neither.
- `Kururu` (base SR) has no weapon class: the Dot Abyss Wiki calls her
  Dark/Back/Impact while wikiru calls her Earth/Front/Passion with Fists. Her
  `dataConflict` field explains it and the page shows it. Do not resolve this
  from a wiki; it needs an in-game check.
- Equipment effect text is condensed from the source: every number, bracket
  value, duration and mechanic name is preserved verbatim, but connective
  wording is shortened. Re-read the source before quoting an effect exactly.
- 26 of the 48 equipment rows carry the party-unique clause. An earlier
  reading of the source counted 29; the row-level data here is what was
  actually read, so re-check the source if the count matters.
- Not built yet: enemies, events, guides, tier list.
- The team builder checks only what the data supports: stance balance against
  the Front 4 / Back 3 baseline, Assist coverage, crest majority, healer
  presence (weapon class Grimoire) and same-element healing overlap. It cannot
  compute the Assist bonus, which the game derives from a player's own Assist
  stats. Do not add a check that pretends otherwise.
- `src/data/recommended-teams.json` stores published party rosters as member
  slugs plus a credit and a link, nothing else. Their labels and the analysis
  shown beside them live in `messages/*.json` under `team.presets` and
  `team.presetNotes` and are written here from the mechanics, never copied.
