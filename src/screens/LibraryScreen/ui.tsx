import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

export const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text.primary }]}>Library</Text>
      <Text style={[styles.hint, { color: theme.text.primary }]}>
        Collocations · Passive / Active / Mastered
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  hint: {
    fontSize: 14,
    opacity: 0.6,
  },
});
