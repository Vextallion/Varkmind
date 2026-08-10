export type RegisterKind = 'academic' | 'business' | 'it' | 'general';

export type B2Chunk = {
  id: string;
  text: string;
};

export type C1Replacement = {
  id: string;
  b2ChunkId: string;
  text: string;
  register: RegisterKind;
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
