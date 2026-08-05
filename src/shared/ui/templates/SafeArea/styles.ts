import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
  },
});

export const useStyles = () => {
  return {
    ...styles,

    safeArea: (backgroundColor: string) => ({
      ...styles.safeArea,
      backgroundColor,
    }),
  };
};
