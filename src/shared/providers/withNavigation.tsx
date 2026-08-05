import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '@shared/theme/themeProvider';

export const withNavigation = (children: Function) => () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>{children()}</ThemeProvider>
    </SafeAreaProvider>
  );
};
