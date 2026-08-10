import { StatusBar } from 'react-native';

import { HomeScreen } from '@screens/HomeScreen/ui';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function Index() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <HomeScreen />
    </SafeAreaTemplate>
  );
}
