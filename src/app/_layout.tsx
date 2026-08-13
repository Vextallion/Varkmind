import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { requireOptionalNativeModule } from 'expo';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useAuthBootstrap } from '@features/auth';

import { useProfileStore } from '@entities/profile';
import { initRegisterGraph } from '@entities/register-graph/db/init';
import { initTopicVocab } from '@entities/topic-vocab';
import { useSessionStore } from '@entities/user';

import i18n from '@shared/config/locales/i18n';
import { QueryProvider } from '@shared/providers/withQuery';
import { useAppFonts } from '@shared/theme/fonts';
import { ThemeProvider } from '@shared/theme/themeProvider';
import { palette } from '@shared/theme/tokens/colors';

SplashScreen.preventAutoHideAsync();

/** Hide Expo Dev Client teal FAB — not part of product UI. Shake still opens the menu. */
if (__DEV__) {
  try {
    const DevMenuPreferences = requireOptionalNativeModule<{
      setPreferencesAsync?: (prefs: {
        showFloatingActionButton?: boolean;
      }) => Promise<void>;
    }>('DevMenuPreferences');
    void DevMenuPreferences?.setPreferencesAsync?.({
      showFloatingActionButton: false,
    });
  } catch {
    // Native module unavailable (web / plain Expo Go).
  }
}

function AuthNavigation({ bootReady }: { bootReady: boolean }) {
  useAuthBootstrap();

  const isSessionHydrated = useSessionStore(s => s.isHydrated);
  const user = useSessionStore(s => s.user);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const isProfileHydrated = useProfileStore(s => s.isHydrated);
  const onboardingCompleted = useProfileStore(s => s.onboardingCompleted);

  const hasAccess = isAuthenticated || Boolean(user?.isGuest);
  const isHydrated = isSessionHydrated && isProfileHydrated;

  useEffect(() => {
    if (
      useProfileStore.persist.hasHydrated() &&
      !useProfileStore.getState().isHydrated
    ) {
      useProfileStore.getState().setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (bootReady && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [bootReady, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={hasAccess && onboardingCompleted}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="library/register" />
        <Stack.Screen name="library/topic/[topicId]" />
      </Stack.Protected>
      <Stack.Protected guard={hasAccess && !onboardingCompleted}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={!hasAccess}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="auth/callback" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([initRegisterGraph(), initTopicVocab()])
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setDbReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const bootReady = Boolean((fontsLoaded || fontError) && dbReady);

  if (!bootReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryProvider>
            <ThemeProvider>
              <AuthNavigation bootReady={bootReady} />
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
