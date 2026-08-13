export type LibraryChunkStatus = 'passive' | 'active' | 'mastered';

export type LibraryEntry = {
  b2ChunkId: string;
  b2Text: string;
  c1Text: string;
  highlightChunk: string;
  outcomeTags: string[];
  status: LibraryChunkStatus;
  contextText: string | null;
  pitfallExplanation: string | null;
};

export type LibraryStatusFilter = 'all' | LibraryChunkStatus;
export type LibraryOutcomeFilter = 'all' | 'tech' | 'academic' | 'biz';

export type ListLibraryOptions = {
  status?: LibraryStatusFilter;
  outcomeTag?: LibraryOutcomeFilter;
  query?: string;
};
