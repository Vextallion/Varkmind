import React, { useMemo } from 'react';
import {
  type StyleProp,
  type TextStyle,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type SpoilerTextProps = {
  children: string;
  revealed: boolean;
  onToggle: () => void;
  style?: StyleProp<TextStyle>;
};

function resolveLineHeight(style: StyleProp<TextStyle>, fallback: number): number {
  if (!style) {
    return fallback;
  }
  const flat = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;
  const value = (flat as TextStyle).lineHeight;
  return typeof value === 'number' ? value : fallback;
}

function resolveFontSize(style: StyleProp<TextStyle>, fallback: number): number {
  if (!style) {
    return fallback;
  }
  const flat = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;
  const value = (flat as TextStyle).fontSize;
  return typeof value === 'number' ? value : fallback;
}

/**
 * Compact Telegram-like spoiler: one-line frost chip sized to the text metrics.
 */
export const SpoilerText: React.FC<SpoilerTextProps> = ({
  children,
  revealed,
  onToggle,
  style,
}) => {
  const { theme } = useTheme();
  const lineHeight = resolveLineHeight(style, theme.type.body.lineHeight);
  const fontSize = resolveFontSize(style, theme.type.body.fontSize);

  const chipWidth = useMemo(() => {
    // Rough advance width for Latin/Cyrillic UI text; clamp so short glosses
    // don't look like a stub and long ones don't dominate the row.
    const estimated = Math.round(children.length * fontSize * 0.52);
    return Math.max(56, Math.min(220, estimated));
  }, [children.length, fontSize]);

  if (revealed) {
    return (
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: true }}
        style={{ alignSelf: 'flex-start' }}
      >
        <Text style={style}>{children}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: false }}
      style={{
        alignSelf: 'flex-start',
        height: lineHeight,
        width: chipWidth,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.BG.accentSoft,
        borderWidth: 1,
        borderColor: theme.border.primary,
        justifyContent: 'center',
        paddingHorizontal: theme.space.sm,
        overflow: 'hidden',
      }}
    >
      {/* Soft single bar — reads as frost, stays one line tall. */}
      <View
        style={{
          height: Math.max(6, Math.round(fontSize * 0.42)),
          borderRadius: 999,
          backgroundColor: theme.border.accent,
          opacity: 0.35,
        }}
      />
    </Pressable>
  );
};
