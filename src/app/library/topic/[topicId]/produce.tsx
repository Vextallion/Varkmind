import { StatusBar } from 'react-native';

import { TopicProduceScreen } from '@screens/TopicProduceScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function TopicProduceRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <TopicProduceScreen />
    </SafeAreaTemplate>
  );
}
