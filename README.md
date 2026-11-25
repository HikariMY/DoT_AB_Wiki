# Dot Abyss Wiki

A fan-made wiki for **Dot Abyss** (ドットアビス) — a pixel-art, abyss-delving idle
hack-and-slash RPG by EXNOA LLC / Studio KUMASAN Inc. The site collects character
data, skills, the Crest system and team-building guidance, in Thai and English.

> This is an unofficial fan project with no affiliation to the game developer or
> publisher.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, static generation) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4, theme tokens in `src/app/globals.css` |
| i18n | next-intl, locales `th` (default) and `en` |
| Data | JSON files in `src/data`, validated with Zod at build time |
| Search | fuse.js, client side |
| Tests | Vitest |
| Hosting | Vercel |

There is no database and no runtime API: every page is prerendered from the JSON
in `src/data`.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

Useful scripts:

```bash
npm run verify        # lint + typecheck + tests + production build
npm run test          # Vitest once
npm run test:coverage # Vitest with coverage thresholds
```

## Data model

Character data is split in two, so that a character can appear on the site with
roster-level data only and gain detail later.

- `src/data/roster.json` — one entry per playable unit. Every unit has
  `slug`, `name`, `characterId`, `rarity`, `element`, `stance`, `crest`,
  `affiliation`, `weaponClass`, `dataStatus`, `source` and `lastVerified`.
- `src/data/details/<slug>.json` — profile, description, skills, passives, bond
  passive and facility skill for one character.
- `src/data/equipment.json` — 48 weapons and gear pieces.
- `src/data/mana-crystals.json` — the 11 mana crystals.

Both shapes are defined in [`src/lib/schema.ts`](src/lib/schema.ts) with Zod and
parsed in [`src/lib/characters.ts`](src/lib/characters.ts). The loader fails the
build when it finds a duplicate slug, a detail file with no matching roster
entry, or a crest that contradicts the element.

Game vocabulary is kept verbatim in the data (`Front`, `Back`, `Assist`,
`Passion`, `Impact`, `SSR`) so a contributor can copy a value straight from a
source wiki without translating it. Translation happens in the UI layer only,
through `messages/th.json` and `messages/en.json`.

### Adding a character detail file

1. Create `src/data/details/<slug>.json`, matching `characterDetailSchema`.
2. Import it in `src/lib/characters.ts` and add it to `DETAIL_SOURCES`.
   Imports are explicit on purpose: a malformed or orphaned file should fail the
   build rather than disappear silently.
3. Raise that character's `dataStatus` in `roster.json` to `partial` or
   `complete`, and refresh its `lastVerified` date.
4. Run `npm run verify`.

### Adding character artwork

Artwork is resolved by slug from two folders, so adding a picture means adding
a file:

- `public/characters/icons/<slug>.webp` — square icon, around 128px.
- `public/characters/portraits/<slug>.webp` — tall 3:4 key art.

`npm run images` rescans both folders and rewrites `src/data/image-manifest.json`;
`npm run dev` and `npm run build` run it first. A character without a file falls
back to a monogram tile, so the gallery can be filled in gradually.

## Project layout

```
messages/              translation catalogs (th, en)
public/characters/     character icons and key art
src/app/[locale]/      pages: home, characters, characters/[slug]
src/components/        UI components
src/data/              game data (JSON)
src/i18n/              next-intl routing, request config, navigation
src/lib/               schemas, data loading, game constants
scripts/               build-time helpers (image manifest)
src/proxy.ts           locale routing proxy (formerly middleware)
```

## Licensing

Two licences apply, and they are deliberately separate:

- **Code** — MIT, see [`LICENSE`](LICENSE).
- **Game data and wiki text** — adapted from the
  [Dot Abyss Wiki](https://dotabyss.miraheze.org/) on Miraheze, which is
  licensed **CC BY-SA 4.0**. Attribution and share-alike therefore apply to the
  content of this site.

GameWith is used only as a cross-check for facts, never as a text source: its
terms prohibit reuse of its text. Character art and other game assets belong to
EXNOA LLC and Studio KUMASAN Inc. and are not redistributed here.

## Sources

- [Dot Abyss Wiki (Miraheze, English)](https://dotabyss.miraheze.org/)
- [ドットアビスX攻略 Wiki (wikiru)](https://dotabyss.wikiru.jp/)
- [GameWith ドットアビス](https://gamewith.jp/dotabyss/) — fact-checking only
