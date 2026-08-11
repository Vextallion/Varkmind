# Varkmind

**Sound less B2 today.**

Varkmind is a local-first mobile app that breaks the English **B2 plateau** — moving lexicon from *passive recognition* to *active production* through surgical **Register Upgrade** drills (bland B2 → professional C1).

Not another streak game. Not a dictionary. A precision tool for people who already speak English but still sound basic at work.

---

## The idea

| Problem | Varkmind |
|--------|----------|
| You know the word — you still say “very important” | Upgrade to C1 collocations in context |
| SRS taps feel like progress; speech doesn’t | **Active Chunks** — acquired only after real use |
| AI mid-drill = lag + wrong register | Curated **Register Graph** locally; AI only in the background |
| Generic “Unit 12” courses | Outcome focus: Tech Lead · Academic 7.5+ · C-Level |

**Primary loop:** B2 context → type the C1 rewrite → live highlight → SM-2 → 48h Active Constraint.

---

## Product principles

1. **Core Drill First** — one mechanic must feel world-class before anything else ships.
2. **Local-first** — drills run at 0 ms from SQLite; network is never on the hot path.
3. **Active > streaks** — retention is proven in spontaneous output, not calendar flames.
4. **No mid-session GPT** — trust and latency win over generative novelty.

See [`startup.md`](./startup.md) for the full product spec, [`PLAN.md`](./PLAN.md) for sprints, and [`DESIGN.md`](./DESIGN.md) for UX direction.

---

## Stack

| Layer | Choice |
|-------|--------|
| App | Expo (SDK 57) · React Native · Expo Router |
| Architecture | Feature-Sliced Design (`src/`) |
| UI state | Zustand |
| Server state | TanStack Query |
| Fast KV | MMKV (tokens, settings, flags) |
| Learning DB | SQLite (`@op-engineering/op-sqlite`) — Register Graph + SRS |
| Backend | Supabase (Auth, sync, Edge Functions) |
| i18n | i18next · copy in `src/shared/config/locales/` |

Brand identity: `src/shared/config/brand.ts` (name / scheme / storage id). UI strings use `{{brand}}` in locales.

---

## Develop

> MMKV and native modules need a **dev build** — Expo Go is not enough.

```bash
pnpm install
pnpm prebuild          # generate native projects when needed
pnpm android           # expo run:android
pnpm ios               # expo run:ios
pnpm start             # Metro
```

| Script | Purpose |
|--------|---------|
| `pnpm android` / `pnpm ios` | Native run |
| `pnpm lint` | ESLint |
| `pnpm pretty:all` | Prettier |

---

## Docs map

| File | What |
|------|------|
| [`startup.md`](./startup.md) | Spec & architecture |
| [`PLAN.md`](./PLAN.md) | Sprint checklist |
| [`DESIGN.md`](./DESIGN.md) | Editorial Instrument UX |
| [`LEGAL.md`](./LEGAL.md) | Trademarks, content, compliance |

---

## Status

Early build — design system and Core Drill shell in progress. Register Graph (SQLite), auth, and outcome decks next.

---

## License

Proprietary. See [`LICENSE`](./LICENSE).
