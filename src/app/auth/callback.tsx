import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { createSessionFromUrl } from '@features/auth/lib/createSessionFromUrl';

import { useSessionStore } from '@entities/user';
import { mapSupabaseUser } from '@entities/user/model/mapSupabaseUser';

import { getSupabase } from '@shared/api';
import { useTheme } from '@shared/theme/useTheme';

WebBrowser.maybeCompleteAuthSession();

/**
 * Deep-link landing for `varkmind://auth/callback`.
 * Completes OAuth when the OS opens the app instead of only closing the browser session.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const url = Linking.useURL();
  const params = useLocalSearchParams<{
    code?: string;
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  }>();

  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const setSession = useSessionStore(s => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (started.current || isAuthenticated) {
      return;
    }
    started.current = true;

    let cancelled = false;

    async function finish() {
      try {
        if (params.error) {
          throw new Error(
            String(params.error_description || params.error),
          );
        }

        let ok = false;
        const href = url ?? (await Linking.getInitialURL());

        try {
          if (href) {
            ok = await createSessionFromUrl(href);
          }
          if (!ok && params.code) {
            ok = await createSessionFromUrl(
              `varkmind://auth/callback?code=${encodeURIComponent(String(params.code))}`,
            );
          }
          if (!ok && params.access_token && params.refresh_token) {
            ok = await createSessionFromUrl(
              `varkmind://auth/callback#access_token=${encodeURIComponent(String(params.access_token))}&refresh_token=${encodeURIComponent(String(params.refresh_token))}`,
            );
          }
        } catch {
          // Code may already be consumed by WebBrowser auth session — fall through to getSession.
        }

        if (!ok) {
          const { data } = await getSupabase().auth.getSession();
          if (data.session?.user && data.session.access_token) {
            setSession(
              mapSupabaseUser(data.session.user),
              data.session.access_token,
            );
            ok = true;
          }
        }

        if (!ok && !cancelled) {
          throw new Error('AUTH_CALLBACK_NO_SESSION');
        }
      } catch (e) {
        if (cancelled) {
          return;
        }
        setError(e instanceof Error ? e.message : String(e));
        router.replace('/(auth)/sign-in');
      }
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    params.access_token,
    params.code,
    params.error,
    params.error_description,
    params.refresh_token,
    router,
    setSession,
    url,
  ]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.BG.white,
        gap: theme.space.md,
        paddingHorizontal: theme.space.xl,
      }}
    >
      <ActivityIndicator color={theme.text.accent} size="large" />
      <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
        Signing you in…
      </Text>
      {error ? (
        <Text style={[theme.type.caption, { color: theme.status.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
