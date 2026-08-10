import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStateStorage } from '@shared/lib/mmkv';

export type Accent = 'us' | 'uk';
export type PlaybackSpeed = 1 | 0.75;

type SettingsState = {
  accent: Accent;
  playbackSpeed: PlaybackSpeed;
  dailyActiveGoal: number;
  hapticsEnabled: boolean;
  setAccent: (accent: Accent) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setDailyActiveGoal: (count: number) => void;
  setHapticsEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      accent: 'us',
      playbackSpeed: 1,
      dailyActiveGoal: 15,
      hapticsEnabled: true,
      setAccent: accent => set({ accent }),
      setPlaybackSpeed: playbackSpeed => set({ playbackSpeed }),
      setDailyActiveGoal: dailyActiveGoal => set({ dailyActiveGoal }),
      setHapticsEnabled: hapticsEnabled => set({ hapticsEnabled }),
    }),
    {
      name: 'settings.ui',
      storage: createJSONStorage(() => mmkvStateStorage),
    },
  ),
);
