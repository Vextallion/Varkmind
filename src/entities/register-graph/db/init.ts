import { getDb, initDatabase } from '@shared/lib/sqlite';

import { runSeed } from '../seed/runSeed';

let ready: Promise<void> | null = null;

export function initRegisterGraph(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await initDatabase();
      await runSeed(getDb());
    })();
  }
  return ready;
}
