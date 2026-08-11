import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@shared/theme/useTheme';

type ProgressRingProps = {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function ProgressRing({
  value,
  max,
  size = 88,
  strokeWidth = 8,
  label,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max <= 0 ? 0 : Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.progress.track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.progress.fill}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={[theme.type.title, { color: theme.text.primary }]}>
          {value}/{max}
        </Text>
        {label ? (
          <Text style={[theme.type.label, { color: theme.text.secondary }]}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
