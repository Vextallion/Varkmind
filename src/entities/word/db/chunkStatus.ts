import { getDb, type SqlScalar } from '@shared/lib/sqlite';

import type { ChunkStatus } from '../model/types';

function asString(value: SqlScalar | undefined): string {
  return value == null ? '' : String(value);
}

function asStatus(value: SqlScalar | undefined): ChunkStatus {
  const text = asString(value);
  if (text === 'active' || text === 'mastered') {
    return text;
  }
  return 'passive';
}

/** Mark Day-1 Active progress on Good/Easy. Idempotent per chunk. */
export async function markDay1Active(chunkId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.execute(
    'SELECT chunk_id, status FROM chunk_status WHERE chunk_id = ? LIMIT 1',
    [chunkId],
  );
  const row = existing.rows?.[0];
  if (row && asStatus(row.status) !== 'passive') {
    return false;
  }

  const now = new Date().toISOString();
  await db.execute(
    `
    INSERT INTO chunk_status (chunk_id, status, day1_completed_at)
    VALUES (?, 'active', ?)
    ON CONFLICT(chunk_id) DO UPDATE SET
      status = CASE
        WHEN chunk_status.status = 'passive' THEN 'active'
        ELSE chunk_status.status
      END,
      day1_completed_at = COALESCE(chunk_status.day1_completed_at, excluded.day1_completed_at)
    `,
    [chunkId, now],
  );
  return true;
}

export async function countActiveChunks(): Promise<number> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT COUNT(*) AS count
    FROM chunk_status
    WHERE status = 'active' OR status = 'mastered'
    `,
  );
  return Number(result.rows?.[0]?.count ?? 0);
}
