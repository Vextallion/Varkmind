import { StatusBar } from 'react-native';

import { EmbedScreen } from '@screens/EmbedScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function EmbedRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <EmbedScreen />
    </SafeAreaTemplate>
  );
}
