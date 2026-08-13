import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

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
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutUp.duration(140)}
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
    </Animated.View>
  );
}
