import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStateStorage, setAuthToken } from '@shared/lib/mmkv';

import type { AuthProvider, User } from './types';

type SessionState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string) => void;
  setGuest: () => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
};

const guestUser: User = {
  id: 'guest',
  email: null,
  displayName: 'Guest',
  avatarUrl: null,
  provider: 'guest' satisfies AuthProvider,
  isGuest: true,
};

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
      setSession: (user, accessToken) => {
        setAuthToken(accessToken);
        set({
          user,
          accessToken,
          isAuthenticated: !user.isGuest,
        });
      },
      setGuest: () => {
        setAuthToken(null);
        set({
          user: guestUser,
          accessToken: null,
          isAuthenticated: false,
        });
      },
      clearSession: () => {
        setAuthToken(null);
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
      setHydrated: isHydrated => set({ isHydrated }),
    }),
    {
      name: 'session.user',
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        if (state?.accessToken) {
          setAuthToken(state.accessToken);
        }
        // isHydrated is set by useAuthBootstrap after Supabase getSession.
      },
    },
  ),
);
