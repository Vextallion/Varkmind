import { useProfileStore } from '../model/useProfileStore';

import type { LearningOutcome, Profile } from '../model/types';

/** Local-first profile read. Remote Supabase sync comes later. */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { outcome, onboardingCompleted } = useProfileStore.getState();
  return {
    userId,
    outcome,
    activeChunksCount: 0,
    onboardingCompleted,
  };
}

/** Persist locally; remote upsert is a no-op stub until a profiles table exists. */
export async function upsertProfile(profile: Profile): Promise<Profile> {
  if (profile.outcome && profile.onboardingCompleted) {
    useProfileStore.getState().completeOnboarding(profile.outcome);
  } else if (profile.outcome) {
    useProfileStore.getState().setOutcome(profile.outcome);
  }
  return profile;
}

export async function persistOutcomeLocally(
  outcome: LearningOutcome,
): Promise<void> {
  useProfileStore.getState().completeOnboarding(outcome);
}
