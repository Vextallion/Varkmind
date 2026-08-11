import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@shared/theme/useTheme';

type SafeAreaTemplateProps = {
  children: React.ReactNode;
  /** Tab screens should use `['top']` — bottom inset belongs to the tab bar. */
  edges?: Array<'top' | 'bottom'>;
};

export const SafeAreaTemplate: React.FC<SafeAreaTemplateProps> = ({
  children,
  edges = ['top'],
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const backgroundColor = theme.BG.white;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {edges.includes('top') ? (
        <View style={{ height: insets.top, backgroundColor }} />
      ) : null}
      <View style={{ flex: 1 }}>{children}</View>
      {edges.includes('bottom') ? (
        <View style={{ height: insets.bottom, backgroundColor }} />
      ) : null}
    </View>
  );
};
