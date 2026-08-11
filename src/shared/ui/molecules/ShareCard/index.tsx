import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type ShareCardProps = {
  b2Text: string;
  c1Text: string;
  activeChunksCount: number;
};

export function ShareCard({
  b2Text,
  c1Text,
  activeChunksCount,
}: ShareCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{
        padding: theme.space.xl,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.BG.surface,
        borderWidth: 1,
        borderColor: theme.border.primary,
        gap: theme.space.lg,
      }}
    >
      <Text style={[theme.type.label, { color: theme.text.accent }]}>
        {t('shareCard.title')}
      </Text>
      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
          {t('common.before')}
        </Text>
        <Text style={[theme.type.body, { color: theme.text.secondary }]}>
          {b2Text}
        </Text>
      </View>
      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
          {t('common.after')}
        </Text>
        <Text
          style={[
            theme.type.bodyMedium,
            { color: theme.text.primary, fontFamily: theme.font.display },
          ]}
        >
          {c1Text}
        </Text>
      </View>
      <Text style={[theme.type.label, { color: theme.text.accent }]}>
        {t('shareCard.activeChunks', { count: activeChunksCount })}
      </Text>
    </View>
  );
}
