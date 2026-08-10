import { router } from 'expo-router';

type NavigateArgs = {
  screen: string;
  params?: Record<string, string | number | (string | number)[] | null>;
};

export function goBack() {
  if (router.canGoBack()) {
    router.back();
  }
}

  router.push({
    pathname: screen as never,
    params,
  });
}
