import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: '600',
  },
});

export const useStyles = () => ({
  ...styles,
  text: (color: string) => ({
    ...styles.text,
    color,
  }),
});
