import { StatusBar } from 'react-native';

import { RegisterLibraryScreen } from '@screens/RegisterLibraryScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function RegisterLibraryRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <RegisterLibraryScreen />
    </SafeAreaTemplate>
  );
}
