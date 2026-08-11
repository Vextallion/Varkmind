import type { SqlBatchTuple, SqlDB } from '@shared/lib/sqlite';

import seed from './graph.seed.json';
import type { GraphSeedFile } from './types';

const SEED_VERSION_KEY = 'seed_version';

function asSeed(data: typeof seed): GraphSeedFile {
  return data as GraphSeedFile;
}

async function getSeedVersion(db: SqlDB): Promise<number> {
  const result = await db.execute(
    'SELECT value FROM app_meta WHERE key = ? LIMIT 1',
    [SEED_VERSION_KEY],
  );
  const value = result.rows?.[0]?.value;
  return value == null ? 0 : Number(value);
}

async function setSeedVersion(db: SqlDB, version: number): Promise<void> {
  await db.execute(
    `INSERT INTO app_meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [SEED_VERSION_KEY, String(version)],
  );
}

export async function runSeed(db: SqlDB): Promise<void> {
  const graph = asSeed(seed);
  const current = await getSeedVersion(db);
  if (current >= graph.version) {
    return;
  }

  const now = new Date().toISOString();
  const commands: SqlBatchTuple[] = [];

  for (const node of graph.nodes) {
    commands.push([
      `INSERT INTO b2_chunks (id, text, outcome_tags, created_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         text = excluded.text,
         outcome_tags = excluded.outcome_tags`,
      [node.id, node.b2Text, node.outcomeTags.join(','), now],
    ]);

    commands.push([
      `INSERT INTO c1_replacements (id, b2_chunk_id, text, register, is_primary)
       VALUES (?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET
         text = excluded.text,
         register = excluded.register,
         is_primary = 1`,
      [`${node.id}:c1`, node.id, node.primaryC1, node.register],
    ]);

    commands.push([
      `INSERT INTO contexts (id, b2_chunk_id, text)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET text = excluded.text`,
      [`${node.id}:ctx`, node.id, node.b2Context],
    ]);

    if (node.context) {
      commands.push([
        `INSERT INTO contexts (id, b2_chunk_id, text)
         VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET text = excluded.text`,
        [`${node.id}:ctx-c1`, node.id, node.context],
      ]);
    }

    if (node.pitfall) {
      commands.push([
        `INSERT INTO common_pitfalls (id, b2_chunk_id, bad_text, explanation)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           bad_text = excluded.bad_text,
           explanation = excluded.explanation`,
        [
          `${node.id}:pit`,
          node.id,
          node.pitfall.badText,
          node.pitfall.explanation,
        ],
      ]);
    }
  }

  await db.executeBatch(commands);
  await setSeedVersion(db, graph.version);
}
