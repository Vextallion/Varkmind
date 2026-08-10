import { StatusBar } from 'react-native';

import { LibraryScreen } from '@screens/LibraryScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function LibraryRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <LibraryScreen />
    </SafeAreaTemplate>
  );
}
