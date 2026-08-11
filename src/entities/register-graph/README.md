# Register Graph — what we built (Sprint 1.3)

This doc explains **what part of the app exists now**, what a **seed** is, and how Learn uses it.

---

## Big picture (where we are)

Varkmind’s core product loop is:

> Show a bland **B2** phrase in context → user types the sharper **C1** rewrite → instant check → SM-2 grade → later prove it in real life (Active Chunks).

Sprint **1.3** built the **local brain** for that loop: a SQLite database filled with B2→C1 pairs, plus APIs so the Learn screen can load a card and validate typing **without the network**.

| Layer | Status after 1.3 |
|--------|------------------|
| App shell (tabs: Home / Learn / Library / Profile) | Done earlier |
| Design system + drill UI components | Done earlier |
| **Local SQLite + schema** | **Done (1.3)** |
| **Seeded Register Graph (~110 cards)** | **Done (1.3)** |
| **Learn reads cards from DB + validates input** | **Done (1.3)** |
| Auth (Supabase) | Not yet (1.4) |
| Full onboarding diagnostic | Not yet (0.4 / 1.5) |
| Autocomplete / hint chips / polished SM-2 scheduling | Not yet (Sprint 2+) |
| Full ~500 curated cards | Content track (expand seed versions) |

So: you can open **Learn**, get a real card from the local graph, type the C1 answer, hit pitfalls when relevant, and see the SM-2 bar. Home/Library/Profile are still mostly chrome around that.

---

## What is a “seed”?

A **seed** is the **starter dataset** we ship inside the app and load into SQLite on first launch (and when the seed version increases).

Think of it as:

```
graph.seed.json  →  (runSeed)  →  SQLite tables  →  Learn drill
```

- It is **not** user progress.
- It is **not** synced from Supabase (yet).
- It **is** the Proprietary Register Graph content for MVP: curated B2 chunks → C1 replacements.

File: [`seed/graph.seed.json`](./seed/graph.seed.json)

Loader: [`seed/runSeed.ts`](./seed/runSeed.ts)

Versioning: `app_meta.seed_version` in SQLite. If the JSON `version` is newer than the DB, rows are upserted again. Bump `version` when you add/edit cards.

Current seed: **version 1**, about **110** nodes (IT / business / academic). Target later is ~500; plumbing already supports growing the JSON.

---

## One seed node (anatomy)

Example (simplified):

```json
{
  "id": "very-important",
  "b2Text": "very important",
  "highlightChunk": "very important",
  "primaryC1": "of paramount importance",
  "register": "academic",
  "outcomeTags": ["tech", "academic"],
  "b2Context": "This is very important for the team.",
  "context": "Addressing latency is of paramount importance for this release.",
  "pitfall": {
    "badText": "very paramount",
    "explanation": "Paramount doesn't take 'very'."
  }
}
```

| Field | Meaning in the app |
|--------|---------------------|
| `id` | Stable key (also used as `b2_chunks.id`) |
| `b2Text` | The bland chunk we want to upgrade |
| `highlightChunk` | Substring highlighted inside the B2 sentence |
| `b2Context` | Full **B2 sentence** shown on the Learn card |
| `primaryC1` | Correct answer the user must type |
| `register` | Style bucket: `it` / `business` / `academic` / `general` |
| `outcomeTags` | Future deck filters (Tech Lead, Academic, C-Level) |
| `context` | Extra C1-style example (stored for later Library / post-success) |
| `pitfall` | Optional wrong pattern → toast explanation |

---

## How seed lands in SQLite

On app boot (`src/app/_layout.tsx`):

1. `initRegisterGraph()`
2. Run migrations (`shared/lib/sqlite`) → create tables
3. `runSeed()` → insert/update graph rows if seed version is new

Tables:

| Table | Holds |
|--------|--------|
| `b2_chunks` | B2 phrase + outcome tags |
| `c1_replacements` | C1 answers (`is_primary = 1` for the main target) |
| `contexts` | Sentences (`:ctx` = B2 drill sentence, `:ctx-c1` = example) |
| `common_pitfalls` | Bad inputs + explanations |
| `srs_progress` | Per-card review state (load/save ready; full SM-2 logic later) |
| `app_meta` | e.g. `seed_version` |
| `schema_migrations` | DB migration history |

---

## How Learn uses it (runtime)

[`widgets/c1-card-widget`](../../widgets/c1-card-widget/ui.tsx):

1. `getDueDrillCard()` — pick a card due for review (or first available)
2. Show `DrillField` with B2 sentence + C1 input
3. On each keystroke:
   - `validateC1Input` → sync SQLite match (`findReplacementMatch`)
   - `findPitfall` → sync pitfall match
4. On success → SM-2 bar (grading persistence / next-interval logic still thin)
5. After grade → load next due card

Important: validation is **local and sync** so typing stays fast (the “0 ms path”). No GPT mid-drill.

---

## Folder map

```
src/shared/lib/sqlite/          # open DB, migrations
src/entities/register-graph/
  db/                           # queries + initRegisterGraph
  seed/graph.seed.json          # content
  seed/runSeed.ts               # content → DB
  model/types.ts                # DrillCard, graph types
src/entities/srs/db/            # srs_progress read/write
src/features/upgrade-register/  # validateC1Input wrapper
src/widgets/c1-card-widget/     # Learn UI wired to DB
```

---

## What you should feel in the app

- **Home** — branding, Active Chunks chrome, queue widget (mostly UI).
- **Learn** — **this is where 1.3 shows up**: real cards from seed, typed C1 check, pitfalls, SM-2 bar.
- **Library / Profile** — placeholders / share demo; not graph browsers yet.

If Learn shows “No cards ready”, the native SQLite module likely didn’t init (need `pnpm android` / `pnpm ios` rebuild after installing op-sqlite), or seed/migration failed.

### “Base module not found”

op-sqlite is a **native** module. After install you must rebuild the binary (not Expo Go / not JS-only reload):

```bash
rm -rf android/app/build android/build android/.gradle
pnpm android
```

If it still fails, clear Gradle caches (`~/.gradle/caches`) once, then rebuild. Do not import `@op-engineering/op-sqlite` at file top-level — use `shared/lib/sqlite` (`client.native.ts` lazy-requires it).

---

## How to grow the graph later

1. Add nodes to `seed/graph.seed.json` (keep `b2Context` containing `highlightChunk`).
2. Bump `"version"` (e.g. `1` → `2`).
3. Relaunch app → `runSeed` upserts new/changed rows.

Do not paste copyrighted textbook sentences; content is the product and a legal surface.
