# Feature-Sliced Design — Layer Rules

Import direction is **strictly top → bottom**. A layer may only import from layers below it.

```
app        → screens, widgets, features, entities, shared
screens    → widgets, features, entities, shared   (= FSD "pages")
widgets    → features, entities, shared
features   → entities, shared
entities   → shared
shared     → (nothing above; only internal / external libs)
```

## Layers

| Layer | Path | Role |
|-------|------|------|
| `app` | `src/app` | Expo Router, providers |
| `screens` | `src/screens` | Full pages (Dashboard, Learn, Library, Profile) |
| `widgets` | `src/widgets` | `c1-card-widget`, `active-queue` |
| `features` | `src/features` | `upgrade-register`, `active-production`, `share-progress` |
| `entities` | `src/entities` | `register-graph`, `word`, `srs`, `user`, `profile` |
| `shared` | `src/shared` | UI kit, theme, config, libs |

## Slice public API

Import from the slice root only:

```ts
// ✅
import { fetchWords } from '@entities/word';

// ❌
import { fetchWords } from '@entities/word/api/wordApi';
```

## Cross-slice rules

- No cross-imports between entities — compose in `features` / `widgets`.
- No cross-imports between features — compose in `widgets` / `screens`.
- Preferred segments: `api/`, `model/`, `ui/`, `db/` (when needed).

## Path aliases

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `@app/*` | `src/app/*` |
| `@screens/*` | `src/screens/*` |
| `@widgets/*` | `src/widgets/*` |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*` | `src/shared/*` |
