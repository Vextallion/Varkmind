import { ThemesList, useThemeStore } from '@shared/model/useThemeStore';

import { themes } from './themes';

export function useTheme() {
  const themeName = useThemeStore(state => state.theme);
  const changeTheme = useThemeStore(state => state.changeTheme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  return {
    theme: Object.freeze(themes[themeName]),
    changeTheme,
    toggleTheme,
    themeName,
  };
}

export { ThemesList };
