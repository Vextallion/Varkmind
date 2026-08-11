import { brand } from '@shared/config/brand';

import type { SqlDB } from './types';

let db: SqlDB | null = null;

function openDb(): SqlDB {
  // Lazy require keeps Metro from evaluating the native module at import time.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { open } = require('@op-engineering/op-sqlite') as {
    open: (params: { name: string }) => SqlDB;
  };
  return open({ name: `${brand.storageId}.sqlite` });
}

export function getDb(): SqlDB {
  if (!db) {
    db = openDb();
  }
  return db;
}
