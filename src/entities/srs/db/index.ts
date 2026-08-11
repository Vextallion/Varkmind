import { getDb, type SqlScalar } from '@shared/lib/sqlite';

import type { SrsGrade, SrsProgress } from '../model/types';

function asString(value: SqlScalar | undefined): string {
  return value == null ? '' : String(value);
}

function asGrade(value: SqlScalar | undefined): SrsGrade | null {
  const text = asString(value);
  if (text === 'hard' || text === 'good' || text === 'easy') {
    return text;
  }
  return null;
}

export async function loadSrsProgress(
  chunkId: string,
): Promise<SrsProgress | null> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT chunk_id, interval_days, ease_factor, repetitions, next_review_at, last_grade
    FROM srs_progress
    WHERE chunk_id = ?
    LIMIT 1
    `,
    [chunkId],
  );
  const row = result.rows?.[0];
  if (!row) {
    return null;
  }

  return {
    chunkId: asString(row.chunk_id),
    intervalDays: Number(row.interval_days),
    easeFactor: Number(row.ease_factor),
    repetitions: Number(row.repetitions),
    nextReviewAt: asString(row.next_review_at),
    lastGrade: asGrade(row.last_grade),
  };
}

export async function saveSrsProgress(progress: SrsProgress): Promise<void> {
  const db = getDb();
  await db.execute(
    `
    INSERT INTO srs_progress (
      chunk_id, interval_days, ease_factor, repetitions, next_review_at, last_grade
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(chunk_id) DO UPDATE SET
      interval_days = excluded.interval_days,
      ease_factor = excluded.ease_factor,
      repetitions = excluded.repetitions,
      next_review_at = excluded.next_review_at,
      last_grade = excluded.last_grade
    `,
    [
      progress.chunkId,
      progress.intervalDays,
      progress.easeFactor,
      progress.repetitions,
      progress.nextReviewAt,
      progress.lastGrade,
    ],
  );
}
