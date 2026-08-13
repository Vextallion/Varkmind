export const MIGRATION_004_TOPIC_VOCAB = `
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  image_key TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS topic_entries (
  id TEXT PRIMARY KEY NOT NULL,
  topic_id TEXT NOT NULL,
  term TEXT NOT NULL,
  gloss TEXT NOT NULL,
  example TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_topic_entries_topic
  ON topic_entries(topic_id);
`;
