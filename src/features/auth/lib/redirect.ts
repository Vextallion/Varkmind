import * as Linking from 'expo-linking';

import { brand } from '@shared/config/brand';

/** Deep-link redirect for magic link / OAuth (scheme from brand). */
export function getAuthRedirectUrl(): string {
  return Linking.createURL('auth/callback', {
    scheme: brand.scheme,
  });
}
