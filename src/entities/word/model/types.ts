export type WordId = string;

export type ChunkStatus = 'passive' | 'active' | 'mastered';

export type Word = {
  id: WordId;
  b2ChunkId: string;
  c1ReplacementId: string;
  status: ChunkStatus;
  term: string;
  translation?: string;
};

export type CreateWordInput = {
  term: string;
};
