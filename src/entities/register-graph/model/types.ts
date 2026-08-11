export type RegisterKind = 'academic' | 'business' | 'it' | 'general';

export type B2Chunk = {
  id: string;
  text: string;
  outcomeTags: string[];
};

export type C1Replacement = {
  id: string;
  b2ChunkId: string;
  text: string;
  register: RegisterKind;
  isPrimary: boolean;
};

export type ContextExample = {
  id: string;
  b2ChunkId: string;
  text: string;
};

export type CommonPitfall = {
  id: string;
  b2ChunkId: string;
  text: string;
  explanation: string;
};

export type RegisterGraphNode = {
  b2: B2Chunk;
  replacements: C1Replacement[];
  contexts: ContextExample[];
  pitfalls: CommonPitfall[];
};

/** Card shape used by the Learn Core Drill. */
export type DrillCard = {
  b2ChunkId: string;
  b2Text: string;
  highlightChunk: string;
  targetC1Text: string;
  register: RegisterKind;
  contextText: string;
  pitfall: CommonPitfall | null;
};
