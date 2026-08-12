/**
 * Local SQLite access for words / collocation progress.
 */
export { countActiveChunks, markDay1Active } from './chunkStatus';

export async function listLocalWords(): Promise<never[]> {
  return [];
}
