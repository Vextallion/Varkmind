import * as WebBrowser from 'expo-web-browser';

import { getSupabase, isSupabaseConfigured } from '@shared/api';

import { createSessionFromUrl } from '../lib/createSessionFromUrl';
import { getAuthRedirectUrl } from '../lib/redirect';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const redirectTo = getAuthRedirectUrl();
  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error('GOOGLE_NO_URL');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !result.url) {
    throw new Error('GOOGLE_CANCELLED');
  }

  await createSessionFromUrl(result.url);
}
