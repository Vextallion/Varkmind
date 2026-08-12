import { useEffect } from 'react';

import { useSessionStore } from '@entities/user';
import { mapSupabaseUser } from '@entities/user/model/mapSupabaseUser';

import { getSupabase, isSupabaseConfigured } from '@shared/api';

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

export function useAuthBootstrap(): void {
  const setSession = useSessionStore(s => s.setSession);
  const clearSession = useSessionStore(s => s.clearSession);
  const setHydrated = useSessionStore(s => s.setHydrated);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      await waitForPersistHydration();

      if (!isSupabaseConfigured()) {
        if (mounted) {
          setHydrated(true);
        }
        return;
      }

      const supabase = getSupabase();
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      const session = data.session;
      if (session?.user && session.access_token) {
        setSession(mapSupabaseUser(session.user), session.access_token);
      } else {
        const current = useSessionStore.getState().user;
        if (current && !current.isGuest) {
          clearSession();
        }
      }

      setHydrated(true);
    }

    void bootstrap();

    if (!isSupabaseConfigured()) {
      return () => {
        mounted = false;
      };
    }

    const supabase = getSupabase();
    const { data: subscription } = supabase.auth.onAuthStateChange(
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
