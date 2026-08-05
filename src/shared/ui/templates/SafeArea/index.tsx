import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@shared/theme/useTheme';

import { useStyles } from './styles';

interface SafeAreaTemplateProps {
  children: React.ReactNode;
}

export const SafeAreaTemplate: React.FC<SafeAreaTemplateProps> = ({
  children,
}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const backgroundColor = theme.BG.white;

  return (
    <>
      <View
        style={[styles.safeArea(backgroundColor), { height: insets.top }]}
      />
      {children}
      <View
        style={[styles.safeArea(backgroundColor), { height: insets.bottom }]}
      />
    </>
  );
};
