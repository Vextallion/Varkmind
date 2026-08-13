import {
  listEmbedCandidates,
  markEmbedUsed,
  type EmbedCandidateRow,
} from '@entities/word';

import {
  isEmbedInputDoneToday,
  isEmbedMicroDoneToday,
  markEmbedInputDoneToday,
  markEmbedMicroDoneToday,
} from './dayKey';

const INPUT_COUNT = 3;
const MICRO_CHUNK_COUNT = 3;

export type EmbedInputCard = EmbedCandidateRow;

export type EmbedMicroTask = {
  chunks: EmbedCandidateRow[];
};

export async function loadEmbedInputCards(): Promise<EmbedInputCard[]> {
  const rows = await listEmbedCandidates(24);
  return rows.slice(0, INPUT_COUNT);
}

export async function loadEmbedMicroTask(): Promise<EmbedMicroTask | null> {
  const rows = await listEmbedCandidates(24);
  if (rows.length === 0) {
    return null;
  }
  return { chunks: rows.slice(0, Math.min(MICRO_CHUNK_COUNT, rows.length)) };
}

export function normalizePhrase(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** True when every required C1 phrase appears in the freeform output. */
export function microTaskContainsAll(
  output: string,
  chunks: EmbedCandidateRow[],
): boolean {
  const haystack = normalizePhrase(output);
  return chunks.every(chunk => haystack.includes(normalizePhrase(chunk.c1Text)));
}

export async function completeEmbedInput(): Promise<void> {
  markEmbedInputDoneToday();
}

export async function completeEmbedMicroTask(
  chunkIds: string[],
): Promise<void> {
  await markEmbedUsed(chunkIds);
  markEmbedMicroDoneToday();
}

export function getEmbedRitualFlags(): {
  inputDone: boolean;
  microDone: boolean;
  embedDone: boolean;
} {
  const inputDone = isEmbedInputDoneToday();
  const microDone = isEmbedMicroDoneToday();
  return {
    inputDone,
    microDone,
    embedDone: inputDone && microDone,
  };
}
