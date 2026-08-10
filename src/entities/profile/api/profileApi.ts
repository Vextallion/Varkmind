import type { Profile } from '../model/types';

export async function fetchProfile(_userId: string): Promise<Profile | null> {
  return null;
}

export async function upsertProfile(profile: Profile): Promise<Profile> {
  return profile;
}
