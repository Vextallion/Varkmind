import type { User as SupabaseUser } from '@supabase/supabase-js';

import type { AuthProvider, User } from './types';

function resolveProvider(supabaseUser: SupabaseUser): AuthProvider {
  const provider = supabaseUser.app_metadata?.provider as string | undefined;
  if (provider === 'apple') {
    return 'apple';
  }
  if (provider === 'google') {
    return 'google';
  }
  return 'email';
}

export function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const meta = supabaseUser.user_metadata ?? {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? null,
    displayName:
      (meta.full_name as string | undefined) ??
      (meta.name as string | undefined) ??
      supabaseUser.email ??
      null,
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
    provider: resolveProvider(supabaseUser),
    isGuest: false,
  };
}
