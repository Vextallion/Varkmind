export const MIGRATION_001_REGISTER_GRAPH = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS b2_chunks (
  id TEXT PRIMARY KEY NOT NULL,
  text TEXT NOT NULL,
  outcome_tags TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS c1_replacements (
  id TEXT PRIMARY KEY NOT NULL,
  b2_chunk_id TEXT NOT NULL,
  text TEXT NOT NULL,
  register TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (b2_chunk_id) REFERENCES b2_chunks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contexts (
  id TEXT PRIMARY KEY NOT NULL,
  b2_chunk_id TEXT NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (b2_chunk_id) REFERENCES b2_chunks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS common_pitfalls (
  id TEXT PRIMARY KEY NOT NULL,
  b2_chunk_id TEXT NOT NULL,
  bad_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  FOREIGN KEY (b2_chunk_id) REFERENCES b2_chunks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS srs_progress (
  chunk_id TEXT PRIMARY KEY NOT NULL,
  interval_days REAL NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review_at TEXT NOT NULL,
  last_grade TEXT,
  FOREIGN KEY (chunk_id) REFERENCES b2_chunks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_c1_replacements_b2
  ON c1_replacements(b2_chunk_id);

CREATE INDEX IF NOT EXISTS idx_contexts_b2
  ON contexts(b2_chunk_id);

CREATE INDEX IF NOT EXISTS idx_pitfalls_b2
  ON common_pitfalls(b2_chunk_id);

CREATE INDEX IF NOT EXISTS idx_srs_next_review
  ON srs_progress(next_review_at);
`;
