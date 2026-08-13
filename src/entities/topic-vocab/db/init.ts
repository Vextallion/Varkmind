import { getDb, initDatabase } from '@shared/lib/sqlite';

import { runTopicSeed } from '../seed/runTopicSeed';

let ready: Promise<void> | null = null;

export function initTopicVocab(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await initDatabase();
      await runTopicSeed(getDb());
    })();
  }
  return ready;
}
