import { StatusBar } from 'react-native';

import { TopicDetailScreen } from '@screens/TopicDetailScreen';

import { statusBarTheme } from '@shared/theme/statusBarTheme';
import { SafeAreaTemplate } from '@shared/ui/templates/SafeArea';

export default function TopicDetailRoute() {
  return (
    <SafeAreaTemplate>
      <StatusBar barStyle={statusBarTheme} />
      <TopicDetailScreen />
    </SafeAreaTemplate>
  );
}
