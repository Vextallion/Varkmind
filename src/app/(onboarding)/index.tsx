import React from 'react';
import { StatusBar } from 'react-native';

import { OnboardingScreen } from '@screens/OnboardingScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function OnboardingRoute() {
  return (
    <SafeAreaTemplate edges={['top', 'bottom']}>
      <StatusBar barStyle={statusBarTheme} />
      <OnboardingScreen />
    </SafeAreaTemplate>
  );
}
