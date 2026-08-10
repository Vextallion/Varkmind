import { StatusBar } from 'react-native';

import { LearnScreen } from '@screens/LearnScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function LearnRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <LearnScreen />
    </SafeAreaTemplate>
  );
}
