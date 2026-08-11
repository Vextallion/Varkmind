import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { ShareCard } from '@shared/ui/molecules/ShareCard';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

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

      <ShareCard
        b2Text={t('demo.shareB2')}
        c1Text={t('demo.shareC1')}
        activeChunksCount={0}
      />
    </ScrollView>
  );
};
