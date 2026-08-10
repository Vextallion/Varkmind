import { createMMKV } from 'react-native-mmkv';

import type { StateStorage } from 'zustand/middleware';

export const mmkv = createMMKV({ id: 'shift-c1' });

export const mmkvStateStorage: StateStorage = {
  getItem: name => mmkv.getString(name) ?? null,
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  removeItem: name => {
    mmkv.remove(name);
  },
};

export const storageKeys = {
  authToken: 'auth.token',
  uiFlags: 'ui.flags',
} as const;

export function getAuthToken(): string | null {
  return mmkv.getString(storageKeys.authToken) ?? null;
}

export function setAuthToken(token: string | null): void {
  if (token === null) {
    mmkv.remove(storageKeys.authToken);
    return;
  }
  mmkv.set(storageKeys.authToken, token);
}
