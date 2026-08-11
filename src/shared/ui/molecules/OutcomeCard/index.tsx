import React from 'react';
import { Pressable, Text } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type OutcomeCardProps = {
  title: string;
  description: string;
  selected?: boolean;
  onPress?: () => void;
};

export function OutcomeCard({
  title,
  description,
  selected = false,
  onPress,
}: OutcomeCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: theme.space.lg,
        borderRadius: theme.radius.lg,
        borderWidth: 1.5,
        borderColor: selected ? theme.border.accent : theme.border.primary,
        backgroundColor: selected ? theme.BG.accentSoft : theme.BG.surface,
        gap: theme.space.xs,
      }}
    >
      <Text
        style={[
          theme.type.title,
          { color: selected ? theme.text.accent : theme.text.primary },
        ]}
      >
        {title}
      </Text>
      <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
        {description}
      </Text>
    </Pressable>
  );
}
