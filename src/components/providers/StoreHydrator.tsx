'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useCatalogStore } from '@/store/catalogStore';
import { useWishlistStore } from '@/store/wishlistStore';

/**
 * Rehydrates every persisted store once, after mount. Stores use
 * `skipHydration` so the initial client render matches the server HTML exactly.
 */
export function StoreHydrator() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    useCartStore.getState().hydrate();
    useWishlistStore.getState().hydrate();
    useCatalogStore.getState().hydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) document.documentElement.dataset.hydrated = 'true';
  }, [ready]);

  return null;
}