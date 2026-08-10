import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStateStorage } from '@shared/lib/mmkv';

export enum ThemesList {
  primary = 'primary',
  dark = 'dark',
}

type ThemeState = {
  theme: ThemesList;
  changeTheme: (theme: ThemesList) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: ThemesList.primary,
      changeTheme: theme => set({ theme }),
      toggleTheme: () =>
        set(state => ({
          theme:
            state.theme === ThemesList.primary
              ? ThemesList.dark
              : ThemesList.primary,
        })),
    }),
    {
      name: 'settings.theme',
      storage: createJSONStorage(() => mmkvStateStorage),
    },
  ),
);
