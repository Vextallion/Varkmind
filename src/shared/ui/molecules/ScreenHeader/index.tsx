import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  backLabel?: string;
  onBack?: () => void;
  bordered?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  meta,
  backLabel,
  onBack,
  bordered = true,
}: ScreenHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        paddingHorizontal: theme.space.xl,
        paddingTop: theme.space.lg,
        paddingBottom: theme.space.md,
        gap: theme.space.md,
        borderBottomWidth: bordered ? 1 : 0,
        borderBottomColor: theme.border.primary,
      }}
    >
      {onBack && backLabel ? (
        <Pressable
          onPress={onBack}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {backLabel}
          </Text>
        </Pressable>
      ) : null}
      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.displayMd, { color: theme.text.primary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {meta}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
