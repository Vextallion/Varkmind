import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

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
    <View
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
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: theme.space.md,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: tone,
              backgroundColor: theme.BG.surface,
              opacity: disabled ? 0.4 : 1,
            }}
          >
            <Text style={[theme.type.bodyMedium, { color: tone }]}>
              {t(`sm2.${key}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
