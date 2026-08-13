import { getDb, type SqlScalar } from '@shared/lib/sqlite';

import type { TopicEntry, TopicSummary } from '../model/types';

function asString(value: SqlScalar | undefined): string {
  if (value == null) {
    return '';
  }
  return String(value);
}

function asNumber(value: SqlScalar | undefined): number {
  return Number(value ?? 0);
}

export async function listTopics(): Promise<TopicSummary[]> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT
      t.id,
      t.title,
      t.image_key,
      t.sort_order,
      COUNT(e.id) AS entry_count
    FROM topics t
    LEFT JOIN topic_entries e ON e.topic_id = t.id
    GROUP BY t.id
    ORDER BY t.sort_order ASC, t.title COLLATE NOCASE ASC
    `,
  );

  return (result.rows ?? []).map((row: Record<string, SqlScalar>) => ({
    id: asString(row.id),
    title: asString(row.title),
    imageKey: asString(row.image_key),
    sortOrder: asNumber(row.sort_order),
    entryCount: asNumber(row.entry_count),
  }));
}

export async function getTopicById(
  topicId: string,
): Promise<TopicSummary | null> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT
      t.id,
      t.title,
      t.image_key,
      t.sort_order,
      COUNT(e.id) AS entry_count
    FROM topics t
    LEFT JOIN topic_entries e ON e.topic_id = t.id
    WHERE t.id = ?
    GROUP BY t.id
    LIMIT 1
    `,
    [topicId],
  );
  const row = result.rows?.[0] as Record<string, SqlScalar> | undefined;
  if (!row) {
    return null;
  }
  return {
    id: asString(row.id),
    title: asString(row.title),
    imageKey: asString(row.image_key),
    sortOrder: asNumber(row.sort_order),
    entryCount: asNumber(row.entry_count),
  };
}

export async function listTopicEntries(topicId: string): Promise<TopicEntry[]> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT id, topic_id, term, definition, gloss, example
    FROM topic_entries
    WHERE topic_id = ?
    ORDER BY term COLLATE NOCASE ASC
    `,
    [topicId],
  );

  return (result.rows ?? []).map((row: Record<string, SqlScalar>) => ({
    id: asString(row.id),
    topicId: asString(row.topic_id),
    term: asString(row.term),
    definition: asString(row.definition),
    gloss: asString(row.gloss),
    example: asString(row.example),
  }));
}

export async function pickRandomTopicEntry(
  topicId: string,
  excludeId?: string,
): Promise<TopicEntry | null> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT id, topic_id, term, definition, gloss, example
    FROM topic_entries
    WHERE topic_id = ?
      AND (? IS NULL OR id != ?)
    ORDER BY RANDOM()
    LIMIT 1
    `,
    [topicId, excludeId ?? null, excludeId ?? null],
  );
  const row = result.rows?.[0] as Record<string, SqlScalar> | undefined;
  if (!row) {
    return null;
  }
  return {
    id: asString(row.id),
    topicId: asString(row.topic_id),
    term: asString(row.term),
    definition: asString(row.definition),
    gloss: asString(row.gloss),
    example: asString(row.example),
  };
}
