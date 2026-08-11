import { findReplacementMatch } from '@entities/register-graph';

/** Sync validation against local SQLite (0 ms path). */
export function validateC1Input(b2ChunkId: string, input: string): boolean {
  if (!b2ChunkId || !input.trim()) {
    return false;
  }
  return findReplacementMatch(b2ChunkId, input);
}
