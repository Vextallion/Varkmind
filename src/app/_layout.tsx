import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';

import i18n from '@shared/config/locales/i18n';
import { QueryProvider } from '@shared/providers/withQuery';
import { useAppFonts } from '@shared/theme/fonts';
import { ThemeProvider } from '@shared/theme/themeProvider';
import { palette } from '@shared/theme/tokens/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryProvider>
            <ThemeProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </QueryProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.paper,
  },
});
