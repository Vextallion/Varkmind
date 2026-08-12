import { useEffect } from 'react';

import { useSessionStore } from '@entities/user';
import { mapSupabaseUser } from '@entities/user/model/mapSupabaseUser';

import { getSupabase, isSupabaseConfigured } from '@shared/api';

const SESSION_FETCH_TIMEOUT_MS = 2500;

function waitForPersistHydration(): Promise<void> {
  if (useSessionStore.persist.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('AUTH_SESSION_TIMEOUT'));
    }, ms);

    Promise.resolve(promise).then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function useAuthBootstrap(): void {
  const setSession = useSessionStore(s => s.setSession);
  const clearSession = useSessionStore(s => s.clearSession);
  const setHydrated = useSessionStore(s => s.setHydrated);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      await waitForPersistHydration();
      if (!mounted) {
        return;
      }

      // Unblock splash from local MMKV — do not wait on network.
      setHydrated(true);

      if (!isSupabaseConfigured()) {
        return;
      }

      try {
        const { data } = await withTimeout(
          getSupabase().auth.getSession(),
          SESSION_FETCH_TIMEOUT_MS,
        );
        if (!mounted) {
          return;
        }

        const session = data.session;
        if (session?.user && session.access_token) {
          setSession(mapSupabaseUser(session.user), session.access_token);
          return;
        }

        const current = useSessionStore.getState().user;
        if (current && !current.isGuest) {
          clearSession();
        }
      } catch {
        // Offline / DNS / slow network — keep persisted guest or auth state.
      }
    }

    void bootstrap();

    if (!isSupabaseConfigured()) {
      return () => {
        mounted = false;
      };
    }

    const { data: subscription } = getSupabase().auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }
        if (session?.user && session.access_token) {
          setSession(mapSupabaseUser(session.user), session.access_token);
          return;
        }
        const current = useSessionStore.getState().user;
        if (current && !current.isGuest) {
          clearSession();
        }
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [clearSession, setHydrated, setSession]);
}
