import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { signOut } from '@features/auth';

import { useProfileStore } from '@entities/profile';
import { useSessionStore } from '@entities/user';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';
import { ShareCard } from '@shared/ui/molecules/ShareCard';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const user = useSessionStore(s => s.user);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const resetOnboarding = useProfileStore(s => s.resetOnboarding);
  const [busy, setBusy] = useState(false);

  const onSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } finally {
      setBusy(false);
    }
  };

  const onReplayOnboarding = () => {
    resetOnboarding();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.BG.white }}
      contentContainerStyle={{
        padding: theme.space.xl,
        gap: theme.space.xl,
      }}
    >
      <View style={{ gap: theme.space.sm }}>
        <Text style={[theme.type.displayMd, { color: theme.text.primary }]}>
          {t('profile.title')}
        </Text>
        <Text style={[theme.type.body, { color: theme.text.secondary }]}>
          {t('profile.subtitle')}
        </Text>
      </View>

      <View
        style={{
          gap: theme.space.md,
          padding: theme.space.lg,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.BG.surface,
          borderWidth: 1,
          borderColor: theme.border.primary,
        }}
      >
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('profile.account')}
        </Text>
        <Text style={[theme.type.title, { color: theme.text.primary }]}>
          {user?.displayName ?? t('profile.signedOut')}
        </Text>
        {user?.email ? (
          <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
            {user.email}
          </Text>
        ) : null}
        {user?.isGuest ? (
          <Text style={[theme.type.caption, { color: theme.text.accent }]}>
            {t('profile.guestMode')}
          </Text>
        ) : null}

        {isAuthenticated ? (
          <Button
            disabled={busy}
            label={t('profile.signOut')}
            variant="secondary"
            onPress={onSignOut}
          />
        ) : (
          <Button
            label={t('profile.signIn')}
            onPress={() => router.push('/(auth)/sign-in')}
          />
        )}
        <Button
          label={t('profile.replayOnboarding')}
          variant="ghost"
          onPress={onReplayOnboarding}
        />
      </View>

      <ShareCard
        b2Text={t('demo.shareB2')}
        c1Text={t('demo.shareC1')}
        activeChunksCount={0}
      />
    </ScrollView>
  );
};
