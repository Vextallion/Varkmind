import React from 'react';

/** Theme state lives in Zustand (`useThemeStore`). */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
