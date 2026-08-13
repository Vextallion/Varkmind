import React from 'react';
import { Pressable, Text, type ViewStyle } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const { theme } = useTheme();

  const style: ViewStyle = {
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: selected ? theme.border.accent : theme.border.primary,
    backgroundColor: selected ? theme.BG.accentSoft : theme.BG.surface,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        style,
        {
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Text
        style={[
          theme.type.label,
          { color: selected ? theme.text.accent : theme.text.secondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
