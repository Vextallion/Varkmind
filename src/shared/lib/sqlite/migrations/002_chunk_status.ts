export const MIGRATION_002_CHUNK_STATUS = `
CREATE TABLE IF NOT EXISTS chunk_status (
  chunk_id TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL DEFAULT 'passive',
  day1_completed_at TEXT,
  FOREIGN KEY (chunk_id) REFERENCES b2_chunks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chunk_status_status
  ON chunk_status(status);
`;
