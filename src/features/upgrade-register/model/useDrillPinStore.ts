import { create } from 'zustand';

type DrillPinState = {
  pinnedB2ChunkId: string | null;
  pinChunk: (b2ChunkId: string) => void;
  consumePin: () => string | null;
};

/** One-shot pin from Library → Learn. */
export const useDrillPinStore = create<DrillPinState>((set, get) => ({
  pinnedB2ChunkId: null,
  pinChunk: b2ChunkId => set({ pinnedB2ChunkId: b2ChunkId }),
  consumePin: () => {
    const id = get().pinnedB2ChunkId;
    if (id) {
      set({ pinnedB2ChunkId: null });
    }
    return id;
  },
}));
