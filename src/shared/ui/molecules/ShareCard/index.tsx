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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: theme.space.md,
        }}
      >
        <Text style={[theme.type.label, { color: theme.text.accent }]}>
          {t('shareCard.title')}
        </Text>
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('shareCard.activeChunks', { count: activeChunksCount })}
        </Text>
      </View>

      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('common.before')}
        </Text>
        <Text
          style={[
            theme.type.body,
            {
              color: theme.text.secondary,
              textDecorationLine: 'line-through',
              opacity: 0.85,
            },
          ]}
        >
          {b2Text}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: theme.border.primary,
        }}
      />

      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.label, { color: theme.text.accent }]}>
          {t('common.after')}
        </Text>
        <Text
          style={[
            theme.type.title,
            {
              color: theme.text.primary,
              fontFamily: theme.font.display,
            },
          ]}
        >
          {c1Text}
        </Text>
      </View>
    </View>
  );
}
