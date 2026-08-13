import { getDb, type SqlScalar } from '@shared/lib/sqlite';

function asString(value: SqlScalar | undefined): string {
  return value == null ? '' : String(value);
}

function addHours(from: Date, hours: number): string {
  const next = new Date(from.getTime());
  next.setHours(next.getHours() + hours);
  return next.toISOString();
}

function addDays(from: Date, days: number): string {
  const next = new Date(from.getTime());
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

/** Stage 2 = 48h, Stage 3 = Day 7. Shorter in __DEV__ so the queue is testable. */
function stageDueDates(from: Date): { stage2DueAt: string; stage3DueAt: string } {
  if (__DEV__) {
    return {
      stage2DueAt: from.toISOString(), // due right away so Home queue lights up after Day-1
      stage3DueAt: addHours(from, 1),
    };
  }
  return {
    stage2DueAt: addHours(from, 48),
    stage3DueAt: addDays(from, 7),
  };
}

/** Mark Day-1 Active progress on Good/Easy. Schedules 48h + Day-7 constraints. */
export async function markDay1Active(chunkId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.execute(
    `
    SELECT chunk_id, status, day1_completed_at
    FROM chunk_status
    WHERE chunk_id = ?
    LIMIT 1
    `,
    [chunkId],
  );
  const row = existing.rows?.[0];
  if (row?.day1_completed_at) {
    return false;
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const { stage2DueAt, stage3DueAt } = stageDueDates(now);

  await db.execute(
    `
    INSERT INTO chunk_status (
      chunk_id, status, day1_completed_at,
      stage2_due_at, stage3_due_at
    ) VALUES (?, 'active', ?, ?, ?)
    ON CONFLICT(chunk_id) DO UPDATE SET
      status = CASE
        WHEN chunk_status.status = 'mastered' THEN 'mastered'
        ELSE 'active'
      END,
      day1_completed_at = COALESCE(chunk_status.day1_completed_at, excluded.day1_completed_at),
      stage2_due_at = COALESCE(chunk_status.stage2_due_at, excluded.stage2_due_at),
      stage3_due_at = COALESCE(chunk_status.stage3_due_at, excluded.stage3_due_at)
    `,
    [chunkId, nowIso, stage2DueAt, stage3DueAt],
  );
  return true;
}

/**
 * Advance Active Production when the learner re-produces a due chunk (Good/Easy).
 * Stage 2 (48h) then Stage 3 (Day 7) → mastered.
 */
export async function advanceActiveProduction(
  chunkId: string,
): Promise<'stage2' | 'stage3' | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const result = await db.execute(
    `
    SELECT stage2_due_at, stage2_completed_at, stage3_due_at, stage3_completed_at
    FROM chunk_status
    WHERE chunk_id = ?
    LIMIT 1
    `,
    [chunkId],
  );
  const row = result.rows?.[0];
  if (!row) {
    return null;
  }

  const stage2Due = asString(row.stage2_due_at);
  const stage2Done = asString(row.stage2_completed_at);
  const stage3Due = asString(row.stage3_due_at);
  const stage3Done = asString(row.stage3_completed_at);

  if (stage2Due && !stage2Done && stage2Due <= now) {
    await db.execute(
      `
      UPDATE chunk_status
      SET stage2_completed_at = ?
      WHERE chunk_id = ?
      `,
      [now, chunkId],
    );
    return 'stage2';
  }

  if (stage3Due && !stage3Done && stage3Due <= now) {
    await db.execute(
      `
      UPDATE chunk_status
      SET stage3_completed_at = ?, status = 'mastered'
      WHERE chunk_id = ?
      `,
      [now, chunkId],
    );
    return 'stage3';
  }

  return null;
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

function startOfUtcDayIso(date = new Date()): string {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start.toISOString();
}

/** Day-1 completions since UTC midnight — proxy for Upgrade progress today. */
export async function countDay1CompletedToday(): Promise<number> {
  const db = getDb();
  const since = startOfUtcDayIso();
  const result = await db.execute(
    `
    SELECT COUNT(*) AS count
    FROM chunk_status
    WHERE day1_completed_at IS NOT NULL
      AND day1_completed_at >= ?
    `,
    [since],
  );
  return Number(result.rows?.[0]?.count ?? 0);
}

export async function markEmbedUsed(chunkIds: string[]): Promise<void> {
  if (chunkIds.length === 0) {
    return;
  }
  const db = getDb();
  const now = new Date().toISOString();
  for (const chunkId of chunkIds) {
    await db.execute(
      `
      UPDATE chunk_status
      SET embed_used_at = COALESCE(embed_used_at, ?)
      WHERE chunk_id = ?
      `,
      [now, chunkId],
    );
  }
}

export type EmbedCandidateRow = {
  chunkId: string;
  b2Text: string;
  c1Text: string;
  contextText: string;
};

/** Recent / Active chunks for Embed input + micro-task (local only). */
export async function listEmbedCandidates(
  limit = 12,
): Promise<EmbedCandidateRow[]> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT
      b.id AS chunk_id,
      b.text AS b2_text,
      r.text AS c1_text,
      COALESCE(c.text, b.text) AS context_text,
      cs.day1_completed_at AS day1_completed_at,
      cs.embed_used_at AS embed_used_at
    FROM chunk_status cs
    INNER JOIN b2_chunks b ON b.id = cs.chunk_id
    INNER JOIN c1_replacements r
      ON r.b2_chunk_id = b.id AND r.is_primary = 1
    LEFT JOIN contexts c ON c.id = b.id || ':ctx'
    WHERE cs.status IN ('active', 'mastered')
      AND cs.day1_completed_at IS NOT NULL
    ORDER BY
      CASE WHEN cs.embed_used_at IS NULL THEN 0 ELSE 1 END ASC,
      cs.day1_completed_at DESC
    LIMIT ?
    `,
    [limit],
  );

  return (result.rows ?? []).map(row => ({
    chunkId: asString(row.chunk_id),
    b2Text: asString(row.b2_text),
    c1Text: asString(row.c1_text),
    contextText: asString(row.context_text),
  }));
}

export type DueActiveRow = {
  chunkId: string;
  prompt: string;
  dueAt: string;
  stage: 'stage2' | 'stage3';
};

export async function listDueActiveConstraints(): Promise<DueActiveRow[]> {
  const db = getDb();
  const now = new Date().toISOString();
  const result = await db.execute(
    `
    SELECT
      cs.chunk_id AS chunk_id,
      b.text AS prompt,
      CASE
        WHEN cs.stage2_completed_at IS NULL
          AND cs.stage2_due_at IS NOT NULL
          AND cs.stage2_due_at <= ?
          THEN cs.stage2_due_at
        WHEN cs.stage3_completed_at IS NULL
          AND cs.stage3_due_at IS NOT NULL
          AND cs.stage3_due_at <= ?
          THEN cs.stage3_due_at
        ELSE NULL
      END AS due_at,
      CASE
        WHEN cs.stage2_completed_at IS NULL
          AND cs.stage2_due_at IS NOT NULL
          AND cs.stage2_due_at <= ?
          THEN 'stage2'
        WHEN cs.stage3_completed_at IS NULL
          AND cs.stage3_due_at IS NOT NULL
          AND cs.stage3_due_at <= ?
          THEN 'stage3'
        ELSE NULL
      END AS stage
    FROM chunk_status cs
    INNER JOIN b2_chunks b ON b.id = cs.chunk_id
    WHERE
      (
        cs.stage2_completed_at IS NULL
        AND cs.stage2_due_at IS NOT NULL
        AND cs.stage2_due_at <= ?
      )
      OR (
        cs.stage3_completed_at IS NULL
        AND cs.stage3_due_at IS NOT NULL
        AND cs.stage3_due_at <= ?
      )
    ORDER BY due_at ASC
    `,
    [now, now, now, now, now, now],
  );

  return (result.rows ?? [])
    .map(row => {
      const stage = asString(row.stage);
      if (stage !== 'stage2' && stage !== 'stage3') {
        return null;
      }
      return {
        chunkId: asString(row.chunk_id),
        prompt: asString(row.prompt),
        dueAt: asString(row.due_at),
        stage,
      } satisfies DueActiveRow;
    })
    .filter((row): row is DueActiveRow => row != null);
}
