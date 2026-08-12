import { getDb, type SqlScalar } from '@shared/lib/sqlite';

import type {
  CommonPitfall,
  DrillCard,
  RegisterGraphNode,
  RegisterKind,
} from '../model/types';

function asString(value: SqlScalar | undefined): string {
  return value == null ? '' : String(value);
}

function asRegister(value: SqlScalar | undefined): RegisterKind {
  const text = asString(value);
  if (
    text === 'academic' ||
    text === 'business' ||
    text === 'it' ||
    text === 'general'
  ) {
    return text;
  }
  return 'general';
}

function normalizeInput(input: string): string {
  return input.trim().toLowerCase();
}

export async function getGraphNodeByB2Id(
  b2ChunkId: string,
): Promise<RegisterGraphNode | null> {
  const db = getDb();
  const b2Result = await db.execute(
    'SELECT id, text, outcome_tags FROM b2_chunks WHERE id = ? LIMIT 1',
    [b2ChunkId],
  );
  const b2Row = b2Result.rows?.[0];
  if (!b2Row) {
    return null;
  }

  const [replacements, contexts, pitfalls] = await Promise.all([
    db.execute(
      'SELECT id, b2_chunk_id, text, register, is_primary FROM c1_replacements WHERE b2_chunk_id = ?',
      [b2ChunkId],
    ),
    db.execute(
      'SELECT id, b2_chunk_id, text FROM contexts WHERE b2_chunk_id = ?',
      [b2ChunkId],
    ),
    db.execute(
      'SELECT id, b2_chunk_id, bad_text, explanation FROM common_pitfalls WHERE b2_chunk_id = ?',
      [b2ChunkId],
    ),
  ]);

  return {
    b2: {
      id: asString(b2Row.id),
      text: asString(b2Row.text),
      outcomeTags: asString(b2Row.outcome_tags)
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    },
    replacements: (replacements.rows ?? []).map(
      (row: Record<string, SqlScalar>) => ({
        id: asString(row.id),
        b2ChunkId: asString(row.b2_chunk_id),
        text: asString(row.text),
        register: asRegister(row.register),
        isPrimary: Number(row.is_primary) === 1,
      }),
    ),
    contexts: (contexts.rows ?? []).map((row: Record<string, SqlScalar>) => ({
      id: asString(row.id),
      b2ChunkId: asString(row.b2_chunk_id),
      text: asString(row.text),
    })),
    pitfalls: (pitfalls.rows ?? []).map((row: Record<string, SqlScalar>) => ({
      id: asString(row.id),
      b2ChunkId: asString(row.b2_chunk_id),
      text: asString(row.bad_text),
      explanation: asString(row.explanation),
    })),
  };
}

export async function getPrimaryCard(
  b2ChunkId: string,
): Promise<DrillCard | null> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT
      b.id AS b2_chunk_id,
      b.text AS highlight_chunk,
      c.text AS b2_sentence,
      r.text AS target_c1_text,
      r.register AS register,
      p.bad_text AS pitfall_bad_text,
      p.explanation AS pitfall_explanation,
      p.id AS pitfall_id
    FROM b2_chunks b
    INNER JOIN c1_replacements r
      ON r.b2_chunk_id = b.id AND r.is_primary = 1
    LEFT JOIN contexts c
      ON c.id = ?
    LEFT JOIN common_pitfalls p
      ON p.b2_chunk_id = b.id
    WHERE b.id = ?
    LIMIT 1
    `,
    [`${b2ChunkId}:ctx`, b2ChunkId],
  );

  const row = result.rows?.[0];
  if (!row) {
    return null;
  }

  const highlightChunk = asString(row.highlight_chunk);
  const b2Sentence = asString(row.b2_sentence) || highlightChunk;
  const pitfallId = row.pitfall_id;

  return {
    b2ChunkId: asString(row.b2_chunk_id),
    b2Text: b2Sentence,
    highlightChunk,
    targetC1Text: asString(row.target_c1_text),
    register: asRegister(row.register),
    contextText: b2Sentence,
    pitfall:
      pitfallId == null
        ? null
        : {
            id: asString(pitfallId),
            b2ChunkId: asString(row.b2_chunk_id),
            text: asString(row.pitfall_bad_text),
            explanation: asString(row.pitfall_explanation),
          },
  };
}

export async function listCardsByRegister(
  register: RegisterKind,
): Promise<DrillCard[]> {
  const db = getDb();
  const result = await db.execute(
    `
    SELECT b.id AS b2_chunk_id
    FROM b2_chunks b
    INNER JOIN c1_replacements r
      ON r.b2_chunk_id = b.id AND r.is_primary = 1
    WHERE r.register = ?
    ORDER BY b.id ASC
    `,
    [register],
  );

  const cards: DrillCard[] = [];
  for (const row of result.rows ?? []) {
    const card = await getPrimaryCard(asString(row.b2_chunk_id));
    if (card) {
      cards.push(card);
    }
  }
  return cards;
}

export async function getDueDrillCard(
  outcomeTag?: string | null,
): Promise<DrillCard | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const tag = outcomeTag?.trim() || null;

  async function queryDue(filterTag: string | null): Promise<string | null> {
    if (filterTag) {
      const due = await db.execute(
        `
        SELECT b.id AS b2_chunk_id
        FROM b2_chunks b
        INNER JOIN c1_replacements r
          ON r.b2_chunk_id = b.id AND r.is_primary = 1
        LEFT JOIN srs_progress s
          ON s.chunk_id = b.id
        WHERE (s.chunk_id IS NULL OR s.next_review_at <= ?)
          AND (',' || REPLACE(b.outcome_tags, ' ', '') || ',') LIKE ?
        ORDER BY COALESCE(s.next_review_at, '') ASC, b.id ASC
        LIMIT 1
        `,
        [now, `%,${filterTag},%`],
      );
      const id = due.rows?.[0]?.b2_chunk_id;
      return id == null ? null : asString(id);
    }

    const due = await db.execute(
      `
      SELECT b.id AS b2_chunk_id
      FROM b2_chunks b
      INNER JOIN c1_replacements r
        ON r.b2_chunk_id = b.id AND r.is_primary = 1
      LEFT JOIN srs_progress s
        ON s.chunk_id = b.id
      WHERE s.chunk_id IS NULL OR s.next_review_at <= ?
      ORDER BY COALESCE(s.next_review_at, '') ASC, b.id ASC
      LIMIT 1
      `,
      [now],
    );
    const id = due.rows?.[0]?.b2_chunk_id;
    return id == null ? null : asString(id);
  }

  const filteredId = await queryDue(tag);
  if (filteredId) {
    return getPrimaryCard(filteredId);
  }

  // Soft fallback when deck filter has nothing due.
  if (tag) {
    const anyId = await queryDue(null);
    if (anyId) {
      return getPrimaryCard(anyId);
    }
  }

  return null;
}

export function findReplacementMatch(
  b2ChunkId: string,
  input: string,
): boolean {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return false;
  }

  const db = getDb();
  const result = db.executeSync(
    `
    SELECT text FROM c1_replacements
    WHERE b2_chunk_id = ?
    `,
    [b2ChunkId],
  );

  return (result.rows ?? []).some(
    (row: Record<string, SqlScalar>) =>
      normalizeInput(asString(row.text)) === normalized,
  );
}

export function findPitfall(
  b2ChunkId: string,
  input: string,
): CommonPitfall | null {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return null;
  }

  const db = getDb();
  const result = db.executeSync(
    `
    SELECT id, b2_chunk_id, bad_text, explanation
    FROM common_pitfalls
    WHERE b2_chunk_id = ?
    `,
    [b2ChunkId],
  );

  for (const row of result.rows ?? []) {
    const bad = normalizeInput(asString(row.bad_text));
    if (bad && normalized.includes(bad)) {
      return {
        id: asString(row.id),
        b2ChunkId: asString(row.b2_chunk_id),
        text: asString(row.bad_text),
        explanation: asString(row.explanation),
      };
    }
  }

  return null;
}

export { initRegisterGraph } from './init';
