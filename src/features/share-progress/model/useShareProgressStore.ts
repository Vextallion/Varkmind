import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStateStorage } from '@shared/lib/mmkv';

type LastUpgrade = {
  b2Text: string;
  c1Text: string;
};

type ShareProgressState = {
  lastUpgrade: LastUpgrade | null;
  recordLastUpgrade: (upgrade: LastUpgrade) => void;
};

export const useShareProgressStore = create<ShareProgressState>()(
  persist(
    set => ({
      lastUpgrade: null,
      recordLastUpgrade: lastUpgrade => set({ lastUpgrade }),
    }),
    {
      name: 'share.lastUpgrade',
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: state => ({ lastUpgrade: state.lastUpgrade }),
    },
  ),
);

export function recordLastUpgrade(upgrade: LastUpgrade): void {
  useShareProgressStore.getState().recordLastUpgrade(upgrade);
}
