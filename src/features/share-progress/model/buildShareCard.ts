export type ShareCardPayload = {
  b2Text: string;
  c1Text: string;
  activeChunksCount: number;
};

/** Viral "B2 → C1 Upgrade" card — Sprint 3. */
export function buildShareCardPayload(
  payload: ShareCardPayload,
): ShareCardPayload {
  return payload;
}
