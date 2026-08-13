export const MIGRATION_003_ACTIVE_STAGES = `
ALTER TABLE chunk_status ADD COLUMN stage2_due_at TEXT;
ALTER TABLE chunk_status ADD COLUMN stage2_completed_at TEXT;
ALTER TABLE chunk_status ADD COLUMN stage3_due_at TEXT;
ALTER TABLE chunk_status ADD COLUMN stage3_completed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_chunk_status_stage2_due
  ON chunk_status(stage2_due_at);

CREATE INDEX IF NOT EXISTS idx_chunk_status_stage3_due
  ON chunk_status(stage3_due_at);
`;
