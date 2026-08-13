/**
 * Local SQLite access for words / collocation progress.
 */
export {
  advanceActiveProduction,
  countActiveChunks,
  countDay1CompletedToday,
  listDueActiveConstraints,
  listEmbedCandidates,
  markDay1Active,
  markEmbedUsed,
} from './chunkStatus';
export type { DueActiveRow, EmbedCandidateRow } from './chunkStatus';

export async function listLocalWords(): Promise<never[]> {
  return [];
}
