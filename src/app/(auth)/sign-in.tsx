import { StatusBar } from 'react-native';

import { AuthScreen } from '@screens/AuthScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function SignInRoute() {
  return (
    <SafeAreaTemplate edges={['top', 'bottom']}>
      <StatusBar barStyle={statusBarTheme} />
      <AuthScreen />
    </SafeAreaTemplate>
  );
}
