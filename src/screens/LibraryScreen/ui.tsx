import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

export const LibraryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.BG.white }]}>
      <Text
        style={[
          theme.type.displayMd,
          { color: theme.text.primary, marginBottom: theme.space.sm },
        ]}
      >
        {t('library.title')}
      </Text>
      <Text style={[theme.type.body, { color: theme.text.secondary }]}>
        {t('library.subtitle')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
