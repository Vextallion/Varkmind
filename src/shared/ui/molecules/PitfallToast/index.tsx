import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type PitfallToastProps = {
  message: string;
  visible?: boolean;
};

export function PitfallToast({ message, visible = true }: PitfallToastProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!visible || !message) {
    return null;
  }

  return (
    <View
      style={{
        padding: theme.space.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.BG.surface,
        borderWidth: 1,
        borderColor: theme.status.danger,
        gap: theme.space.xs,
      }}
    >
      <Text style={[theme.type.label, { color: theme.status.danger }]}>
        {t('pitfall.title')}
      </Text>
      <Text style={[theme.type.caption, { color: theme.text.primary }]}>
        {message}
      </Text>
    </View>
  );
}
