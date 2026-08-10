import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/** Main B2 → C1 transformer drill. Full UI in Sprint 2. */
export const C1CardWidget: React.FC = () => {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>C1 Card Widget</Text>
      <Text style={styles.hint}>Register Upgrade drill — Sprint 2</Text>
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
