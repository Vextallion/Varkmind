import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { ActiveQueueWidget } from '@widgets/active-queue';

export const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text.primary }]}>
        Dashboard
      </Text>
      <Text style={[styles.meta, { color: theme.text.primary }]}>
        Active Chunks: 0
      </Text>
      <ActiveQueueWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  meta: {
    fontSize: 15,
    opacity: 0.7,
  },
});
