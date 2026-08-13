import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { C1CardWidget } from '@widgets/c1-card-widget';

export const LearnScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.BG.white,
        paddingHorizontal: theme.space.xl,
        paddingTop: theme.space.lg,
        paddingBottom: theme.space.xl,
        gap: theme.space.lg,
      }}
    >
      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.label, { color: theme.text.accent }]}>
          {t('learn.eyebrow')}
        </Text>
        <Text style={[theme.type.displayMd, { color: theme.text.primary }]}>
          {t('learn.title')}
        </Text>
        <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
          {t('learn.sessionHint')}
        </Text>
      </View>
      <C1CardWidget />
    </View>
  );
};
