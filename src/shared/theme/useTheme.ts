import { useContext } from 'react';

import { ThemeContext, ThemesList } from './themeProvider';
import { themes } from './themes';

export function useTheme() {
  const { theme, changeTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    changeTheme(
      theme === ThemesList.primary ? ThemesList.dark : ThemesList.primary,
    );
  };

  return {
    theme: Object.freeze(themes[theme]),
    changeTheme,
    toggleTheme,
    themeName: theme,
  };
}
