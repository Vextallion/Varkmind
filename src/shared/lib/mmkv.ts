import { Platform } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

type MemoryStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => boolean;
};

const memory = new Map<string, string>();

const memoryStorage: MemoryStorage = {
  getString: key => memory.get(key),
  set: (key, value) => {
    memory.set(key, value);
  },
  remove: key => memory.delete(key),
};

function createStorage(): MMKV | MemoryStorage {
  if (Platform.OS === 'web') {
    return memoryStorage;
  }

  try {
    return createMMKV({ id: 'shift-c1' });
  } catch {
    // Native module unavailable (e.g. Expo Go without dev build).
    return memoryStorage;
  }
}

export const mmkv = createStorage();

/** Zustand persist adapter backed by MMKV (or in-memory fallback). */
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
