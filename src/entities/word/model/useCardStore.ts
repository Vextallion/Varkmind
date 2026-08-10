import { create } from 'zustand';

export type DrillPhase = 'input' | 'success' | 'pitfall';

type DrillCardState = {
  b2ChunkId: string | null;
  b2Text: string;
  targetC1Text: string;
  input: string;
  highlightIndex: number;
  phase: DrillPhase;
  pitfallMessage: string | null;
  setCard: (payload: {
    b2ChunkId: string;
    b2Text: string;
    targetC1Text: string;
  }) => void;
  setInput: (input: string) => void;
  setHighlightIndex: (index: number) => void;
  setPhase: (phase: DrillPhase) => void;
  setPitfallMessage: (message: string | null) => void;
  resetDrill: () => void;
};

const initialState = {
  b2ChunkId: null as string | null,
  b2Text: '',
  targetC1Text: '',
  input: '',
  highlightIndex: 0,
  phase: 'input' as DrillPhase,
  pitfallMessage: null as string | null,
};

/** Ephemeral drill UI — not persisted (session-only). */
export const useCardStore = create<DrillCardState>(set => ({
  ...initialState,
  setCard: ({ b2ChunkId, b2Text, targetC1Text }) =>
    set({
      ...initialState,
      b2ChunkId,
      b2Text,
      targetC1Text,
    }),
  setInput: input => set({ input }),
  setHighlightIndex: highlightIndex => set({ highlightIndex }),
  setPhase: phase => set({ phase }),
  setPitfallMessage: pitfallMessage => set({ pitfallMessage }),
  resetDrill: () => set(initialState),
}));
