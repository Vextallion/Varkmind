import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getDueActiveTasks } from '@features/active-production';

/** 48h Active Constraint queue. Full logic in Sprint 4. */
export const ActiveQueueWidget: React.FC = () => {
  const tasks = getDueActiveTasks();

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Active Production Queue</Text>
      <Text style={styles.hint}>
        {tasks.length === 0
          ? 'No chunks due for activation'
          : `${tasks.length} phrase(s) ready`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F4F7',
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 13,
    opacity: 0.6,
  },
});
