import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStateStorage } from '@shared/lib/mmkv';

import type { LearningOutcome } from './types';

type ProfileState = {
  outcome: LearningOutcome | null;
  onboardingCompleted: boolean;
  diagnosticDoneCount: number;
  isHydrated: boolean;
  setOutcome: (outcome: LearningOutcome) => void;
  setDiagnosticDoneCount: (count: number) => void;
  completeOnboarding: (outcome: LearningOutcome) => void;
  resetOnboarding: () => void;
  setHydrated: (value: boolean) => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    set => ({
      outcome: null,
      onboardingCompleted: false,
      diagnosticDoneCount: 0,
      isHydrated: false,
      setOutcome: outcome => set({ outcome }),
      setDiagnosticDoneCount: diagnosticDoneCount =>
        set({ diagnosticDoneCount }),
      completeOnboarding: outcome =>
        set({
          outcome,
          onboardingCompleted: true,
          diagnosticDoneCount: 3,
        }),
      resetOnboarding: () =>
        set({
          outcome: null,
          onboardingCompleted: false,
          diagnosticDoneCount: 0,
        }),
      setHydrated: isHydrated => set({ isHydrated }),
    }),
    {
      name: 'profile.local',
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: state => ({
        outcome: state.outcome,
        onboardingCompleted: state.onboardingCompleted,
        diagnosticDoneCount: state.diagnosticDoneCount,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
    },
  ),
);
