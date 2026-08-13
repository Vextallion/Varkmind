import { mmkv, storageKeys } from '@shared/lib/mmkv';

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isEmbedInputDoneToday(): boolean {
  return mmkv.getString(storageKeys.embedInputDoneDate) === todayKey();
}

export function markEmbedInputDoneToday(): void {
  mmkv.set(storageKeys.embedInputDoneDate, todayKey());
}

export function isEmbedMicroDoneToday(): boolean {
  return mmkv.getString(storageKeys.embedMicroDoneDate) === todayKey();
}

export function markEmbedMicroDoneToday(): void {
  mmkv.set(storageKeys.embedMicroDoneDate, todayKey());
}

export function isEmbedDoneToday(): boolean {
  return isEmbedInputDoneToday() && isEmbedMicroDoneToday();
}
