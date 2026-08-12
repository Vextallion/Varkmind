import type { Session } from '@supabase/supabase-js';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

import { useSessionStore } from '@entities/user';
import { mapSupabaseUser } from '@entities/user/model/mapSupabaseUser';

import { getSupabase } from '@shared/api';

function applySession(session: Session): void {
  if (!session.user || !session.access_token) {
    return;
  }
  useSessionStore
    .getState()
    .setSession(mapSupabaseUser(session.user), session.access_token);
}

/** Complete OAuth / deep-link auth from a redirect URL. Returns true if a session was applied. */
export async function createSessionFromUrl(url: string): Promise<boolean> {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const { access_token, refresh_token, code } = params;

  if (access_token && refresh_token) {
    const { data, error } = await getSupabase().auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) {
      throw error;
    }
    if (data.session) {
      applySession(data.session);
      return true;
    }
    return false;
  }

  if (code) {
    const { data, error } =
      await getSupabase().auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }
    if (data.session) {
      applySession(data.session);
      return true;
    }
    return false;
  }

  return false;
}
