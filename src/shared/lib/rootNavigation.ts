import { createEffect } from 'effector';
import { router } from 'expo-router';

type NavigateFxType = {
  screen: string;
  params?: Record<string, string | number | (string | number)[] | null>;
};

export function goBack() {
  if (router.canGoBack()) {
    router.back();
  }
}

export const navigateFx = createEffect(({ screen, params }: NavigateFxType) => {
  router.push({
    pathname: screen as never,
    params,
  });
});
