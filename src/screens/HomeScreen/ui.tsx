import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { Icon } from '@shared/ui/atoms/Icon';

import { useStyles } from './styles';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Icon height={50} width={50} name="box" color={theme.icon.primary} />
      <Text style={styles.text(theme.text.primary)}>{t('common.welcome')}</Text>
    </View>
  );
};
