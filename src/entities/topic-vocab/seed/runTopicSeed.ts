import type { SqlBatchTuple, SqlDB } from '@shared/lib/sqlite';

import { topicSeedFiles, topicsIndex } from './topicFiles';

const TOPIC_SEED_VERSION_KEY = 'topic_seed_version';

async function getTopicSeedVersion(db: SqlDB): Promise<number> {
  const result = await db.execute(
    'SELECT value FROM app_meta WHERE key = ? LIMIT 1',
    [TOPIC_SEED_VERSION_KEY],
  );
  const value = result.rows?.[0]?.value;
  return value == null ? 0 : Number(value);
}

async function setTopicSeedVersion(db: SqlDB, version: number): Promise<void> {
  await db.execute(
    `INSERT INTO app_meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [TOPIC_SEED_VERSION_KEY, String(version)],
  );
}

export async function runTopicSeed(db: SqlDB): Promise<void> {
  const current = await getTopicSeedVersion(db);
  if (current >= topicsIndex.version) {
    return;
  }

  const commands: SqlBatchTuple[] = [
    ['DELETE FROM topic_entries'],
    ['DELETE FROM topics'],
  ];

  topicsIndex.topics.forEach((topic, index) => {
    const file = topicSeedFiles[topic.id];
    if (!file) {
      return;
    }

    commands.push([
      `INSERT INTO topics (id, title, image_key, sort_order)
       VALUES (?, ?, ?, ?)`,
      [topic.id, topic.title, topic.imageKey, index],
    ]);

    for (const entry of file.entries) {
      commands.push([
        `INSERT INTO topic_entries (id, topic_id, term, definition, gloss, example)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          topic.id,
          entry.term,
          entry.definition,
          entry.gloss,
          entry.example,
        ],
      ]);
    }
  });

  await db.executeBatch(commands);
  await setTopicSeedVersion(db, topicsIndex.version);
}
