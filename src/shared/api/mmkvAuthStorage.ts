import type { SupportedStorage } from '@supabase/supabase-js';

import { mmkv } from '@shared/lib/mmkv';

/** Sync MMKV adapter for Supabase Auth persistence. */
export const mmkvAuthStorage: SupportedStorage = {
  getItem: key => mmkv.getString(key) ?? null,
  setItem: (key, value) => {
    mmkv.set(key, value);
  },
  removeItem: key => {
    mmkv.remove(key);
  },
};
