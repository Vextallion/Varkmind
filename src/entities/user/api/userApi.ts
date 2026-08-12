import { getSupabase, isSupabaseConfigured } from '@shared/api';

import { mapSupabaseUser } from '../model/mapSupabaseUser';
import { useSessionStore } from '../model/useSessionStore';

import type { User, UserId } from '../model/types';

export async function fetchCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { data, error } = await getSupabase().auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return mapSupabaseUser(data.user);
}

export async function fetchUserById(_id: UserId): Promise<User | null> {
  return fetchCurrentUser();
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    await getSupabase().auth.signOut();
  }
  useSessionStore.getState().clearSession();
}
