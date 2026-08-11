import { getDb } from './client';
import { runMigrations } from './migrate';

let ready: Promise<void> | null = null;

/** Runs schema migrations. Seed lives in entities/register-graph. */
export function initDatabase(): Promise<void> {
  if (!ready) {
    ready = runMigrations(getDb());
  }
  return ready;
}
