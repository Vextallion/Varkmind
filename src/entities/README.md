# entities

Business entities (`register-graph`, `word`, `srs`, `user`, `profile`).

## Structure (per slice)

```
entities/<name>/
  api/       # network / Supabase
  db/        # local SQLite (when needed)
  model/     # types, stores, domain logic
  ui/        # optional
  index.ts   # public API only
```

## Rules

- May import only from `@shared`.
- Must not import other entities.
- Consumers use `@entities/<name>` only.

See [FSD.md](../FSD.md).
