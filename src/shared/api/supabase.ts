import 'react-native-url-polyfill/auto';

import { type SupabaseClient, createClient } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from '@shared/config/env';

import { mmkvAuthStorage } from './mmkvAuthStorage';

export { isSupabaseConfigured };

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env',
    );
  }

  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: mmkvAuthStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
}
