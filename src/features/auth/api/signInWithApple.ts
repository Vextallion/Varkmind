import { Platform } from 'react-native';

import * as AppleAuthentication from 'expo-apple-authentication';

import { getSupabase, isSupabaseConfigured } from '@shared/api';

export async function signInWithApple(): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  if (Platform.OS !== 'ios') {
    throw new Error('APPLE_IOS_ONLY');
  }

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw new Error('APPLE_UNAVAILABLE');
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('APPLE_NO_TOKEN');
  }

  const { error } = await getSupabase().auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });

  if (error) {
    throw error;
  }
}
