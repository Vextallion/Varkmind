export type { SrsProgress } from '../model/types';

export async function loadSrsProgress(_chunkId: string): Promise<null> {
  return null;
}

export async function saveSrsProgress(_progress: unknown): Promise<void> {
  // TODO: SQLite srs_progress
}
