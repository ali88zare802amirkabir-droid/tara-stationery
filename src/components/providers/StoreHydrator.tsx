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
    // Replace the seeded demo dataset with live Postgres data when available.
    (async () => {
      try {
        const [p, c, b] = await Promise.all([
          fetch('/api/products').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/categories').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/banners').then((r) => (r.ok ? r.json() : null)),
        ]);
        if (p?.products?.length) {
          useCatalogStore.setState({
            products: p.products,
            categories: c?.categories ?? useCatalogStore.getState().categories,
            banners: b?.banners ?? useCatalogStore.getState().banners,
          });
        }
      } catch {
        // Keep the seeded fallback when the server / DB is unreachable.
      }
    })();
  }, []);

  useEffect(() => {
    if (ready) document.documentElement.dataset.hydrated = 'true';
  }, [ready]);

  return null;
}