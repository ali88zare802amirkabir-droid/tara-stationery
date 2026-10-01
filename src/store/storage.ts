import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * All client stores share this storage adapter so that persistence can be
 * deferred to an effect in `StoreHydrator`. Deferring the read keeps the first
 * client render identical to the server render (no hydration mismatch).
 */
const memory = new Map<string, string>();

const storage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    const fromWindow = window.localStorage.getItem(name);
    return fromWindow ?? memory.get(name) ?? null;
  },
  setItem: (name, value) => {
    memory.set(name, value);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(name, value);
      } catch {
        /* storage full or blocked — fall back to the in-memory map */
      }
    }
  },
  removeItem: (name) => {
    memory.delete(name);
    if (typeof window !== 'undefined') window.localStorage.removeItem(name);
  },
};

export const persistOptions = {
  storage: createJSONStorage(() => storage),
  skipHydration: true,
  version: 1,
} as const;

export const STORAGE_KEYS = {
  cart: 'tara.cart',
  wishlist: 'tara.wishlist',
  catalog: 'tara.catalog',
  settings: 'tara.settings',
  ui: 'tara.ui',
} as const;