import { getDb } from './client';
import { MIGRATION_001_REGISTER_GRAPH } from './migrations/001_register_graph';
import { MIGRATION_002_CHUNK_STATUS } from './migrations/002_chunk_status';
import { MIGRATION_003_ACTIVE_STAGES } from './migrations/003_active_stages';
import { MIGRATION_004_TOPIC_VOCAB } from './migrations/004_topic_vocab';
import { MIGRATION_005_TOPIC_DEFINITION } from './migrations/005_topic_definition';
import type { SqlDB } from './types';

type Migration = {
  version: number;
  sql: string;
};

const MIGRATIONS: Migration[] = [
  { version: 1, sql: MIGRATION_001_REGISTER_GRAPH },
  { version: 2, sql: MIGRATION_002_CHUNK_STATUS },
  { version: 3, sql: MIGRATION_003_ACTIVE_STAGES },
  { version: 4, sql: MIGRATION_004_TOPIC_VOCAB },
  { version: 5, sql: MIGRATION_005_TOPIC_DEFINITION },
];

export async function runMigrations(db: SqlDB = getDb()): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = await db.execute(
    'SELECT version FROM schema_migrations ORDER BY version ASC',
  );
  const appliedVersions = new Set(
    (applied.rows ?? []).map(row => Number(row.version)),
  );

  for (const migration of MIGRATIONS) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

    await db.transaction(async tx => {
      const statements = migration.sql
        .split(';')
        .map(part => part.trim())
        .filter(Boolean);

      for (const statement of statements) {
        await tx.execute(statement);
      }

      await tx.execute(
        'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
        [migration.version, new Date().toISOString()],
      );
    });
  }
}
