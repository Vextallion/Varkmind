/**
 * Local SQLite access for words / collocation progress.
 */
export {
  advanceActiveProduction,
  countActiveChunks,
  listDueActiveConstraints,
  markDay1Active,
} from './chunkStatus';
export type { DueActiveRow } from './chunkStatus';

export async function listLocalWords(): Promise<never[]> {
  return [];
}
