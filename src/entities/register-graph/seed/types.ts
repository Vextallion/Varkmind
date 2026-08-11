import type { RegisterKind } from '../model/types';

export type SeedPitfall = {
  badText: string;
  explanation: string;
};

export type SeedNode = {
  id: string;
  b2Text: string;
  highlightChunk: string;
  primaryC1: string;
  register: RegisterKind;
  outcomeTags: string[];
  /** B2 sentence shown in the drill (must contain highlightChunk). */
  b2Context: string;
  /** Optional C1 example sentence for post-success / Library. */
  context: string;
  pitfall: SeedPitfall | null;
};

export type GraphSeedFile = {
  version: number;
  generatedAt: string;
  nodes: SeedNode[];
};
