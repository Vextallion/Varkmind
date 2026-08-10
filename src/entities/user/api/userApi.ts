import type { User, UserId } from '../model/types';

export async function fetchCurrentUser(): Promise<User | null> {
  return null;
}

export async function fetchUserById(_id: UserId): Promise<User | null> {
  return null;
}

export async function signOut(): Promise<void> {
  // TODO: supabase.auth.signOut()
}
