import type { SqlDB } from './types';

export function getDb(): SqlDB {
  throw new Error(
    'SQLite Register Graph runs on iOS/Android native builds only (op-sqlite).',
  );
}
