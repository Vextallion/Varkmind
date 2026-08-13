export const MIGRATION_006_EMBED = `
ALTER TABLE chunk_status ADD COLUMN embed_used_at TEXT;

CREATE INDEX IF NOT EXISTS idx_chunk_status_embed_used
  ON chunk_status(embed_used_at);
`;
