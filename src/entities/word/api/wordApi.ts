import type { CreateWordInput, Word, WordId } from '../model/types';

/** Supabase / sync stubs — wired in later sprints. */
export async function fetchWords(): Promise<Word[]> {
  return [];
}

export async function fetchWordById(_id: WordId): Promise<Word | null> {
  return null;
}

export async function createWord(input: CreateWordInput): Promise<Word> {
  return {
    id: 'local-stub',
    b2ChunkId: '',
    c1ReplacementId: '',
    status: 'passive',
    term: input.term,
  };
}

export async function syncProgress(): Promise<void> {
  // TODO: outbox → Supabase
}
