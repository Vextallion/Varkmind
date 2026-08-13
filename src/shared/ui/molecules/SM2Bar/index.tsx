import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { SrsGrade } from '@entities/srs';

import { useTheme } from '@shared/theme/useTheme';

type SM2BarProps = {
  onGrade: (grade: SrsGrade) => void;
  disabled?: boolean;
};

const GRADE_KEYS: { grade: SrsGrade; key: 'hard' | 'good' | 'easy' }[] = [
  { grade: 'hard', key: 'hard' },
  { grade: 'good', key: 'good' },
  { grade: 'easy', key: 'easy' },
];

export function SM2Bar({ onGrade, disabled = false }: SM2BarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(200).springify().damping(18)}
      style={{
        flexDirection: 'row',
        gap: theme.space.sm,
      }}
    >
      {GRADE_KEYS.map(({ grade, key }) => {
        const tone =
          grade === 'hard'
            ? theme.status.danger
            : grade === 'easy'
              ? theme.status.success
              : theme.text.accent;

        return (
          <Pressable
            key={grade}
            disabled={disabled}
            onPress={() => onGrade(grade)}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: 'center',
              paddingVertical: theme.space.md,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: tone,
              backgroundColor: theme.BG.surface,
              opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
              transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
            })}
          >
            <Text style={[theme.type.bodyMedium, { color: tone }]}>
              {t(`sm2.${key}`)}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
