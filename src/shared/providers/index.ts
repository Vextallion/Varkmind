import 'react-native-gesture-handler';

import { compose } from '@shared/lib/compose';

import { withNavigation } from './withNavigation';

export { QueryProvider } from './withQuery';

export const withProviders = compose(withNavigation);
