import { Share } from 'react-native';

import { brand } from '@shared/config/brand';

import { useShareProgressStore } from './useShareProgressStore';

export type ShareCardPayload = {
  b2Text: string;
  c1Text: string;
  activeChunksCount: number;
};

export function buildShareCardPayload(
  payload: ShareCardPayload,
): ShareCardPayload {
  return {
    b2Text: payload.b2Text.trim(),
    c1Text: payload.c1Text.trim(),
    activeChunksCount: Math.max(0, payload.activeChunksCount),
  };
}

export function formatShareMessage(payload: ShareCardPayload): string {
  const card = buildShareCardPayload(payload);
  return [
    `${brand.name} · B2 → C1`,
    '',
    `Before: ${card.b2Text}`,
    `After: ${card.c1Text}`,
    '',
    `Active Chunks · ${card.activeChunksCount}`,
  ].join('\n');
}

export async function shareUpgradeCard(
  payload: ShareCardPayload,
): Promise<void> {
  const message = formatShareMessage(payload);
  await Share.share({
    message,
    title: `${brand.name} · B2 → C1`,
  });
}

export function getLastUpgradeOrDemo(demo: {
  b2Text: string;
  c1Text: string;
}): { b2Text: string; c1Text: string } {
  const last = useShareProgressStore.getState().lastUpgrade;
  if (last?.b2Text && last?.c1Text) {
    return last;
  }
  return demo;
}
