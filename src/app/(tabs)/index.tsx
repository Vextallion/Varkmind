import { StatusBar } from 'react-native';

import { DashboardScreen } from '@screens/DashboardScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function DashboardRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <DashboardScreen />
    </SafeAreaTemplate>
  );
}
