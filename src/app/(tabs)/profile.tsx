import { StatusBar } from 'react-native';

import { ProfileScreen } from '@screens/ProfileScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function ProfileRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <ProfileScreen />
    </SafeAreaTemplate>
  );
}
