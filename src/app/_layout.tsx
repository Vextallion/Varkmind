import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';

import i18n from '@shared/config/locales/i18n';
import { QueryProvider } from '@shared/providers/withQuery';
import { ThemeProvider } from '@shared/theme/themeProvider';

export default function RootLayout() {
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
  },
});
