import type { RegisterGraphNode } from '../model/types';

/**
 * Local SQLite lookups for the Proprietary Register Graph.
 * Real queries + seed in Sprint 1.3.
 */
export async function getGraphNodeByB2Id(
  _b2ChunkId: string,
): Promise<RegisterGraphNode | null> {
  return null;
}

export async function findReplacementMatch(
  _b2ChunkId: string,
  _input: string,
): Promise<boolean> {
  return false;
}
