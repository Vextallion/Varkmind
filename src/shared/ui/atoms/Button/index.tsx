import React from 'react';
import {
  Pressable,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
};

export function Button({
  label,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();

  const container: ViewStyle = {
    borderRadius: theme.radius.md,
    paddingVertical: theme.space.md,
    paddingHorizontal: theme.space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.45 : 1,
  };

  const labelStyle: TextStyle = {
    ...theme.type.bodyMedium,
  };

  if (variant === 'primary') {
    container.backgroundColor = theme.button.primary;
    labelStyle.color = theme.button.textOnPrimary;
  } else if (variant === 'secondary') {
    container.backgroundColor = theme.BG.surface;
    container.borderWidth = 1;
    container.borderColor = theme.border.primary;
    labelStyle.color = theme.text.primary;
  } else {
    container.backgroundColor = 'transparent';
    labelStyle.color = theme.text.accent;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={[container, style as ViewStyle]}
      {...rest}
    >
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  );
}
