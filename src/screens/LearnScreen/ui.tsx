import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { C1CardWidget } from '@widgets/c1-card-widget';

export const LearnScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.BG.white }]}>
      <Text
        style={[
          theme.type.displayMd,
          { color: theme.text.primary, marginBottom: theme.space.lg },
        ]}
      >
        {t('learn.title')}
      </Text>
      <C1CardWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
