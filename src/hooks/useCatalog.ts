'use client';

import { useMemo } from 'react';
import { discountPercent, useCatalogStore } from '@/store/catalogStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Banner, Category, Product } from '@/types';

/**
 * Derived-state hooks.
 *
 * Zustand v5 compares `useSyncExternalStore` snapshots by reference, so a
 * selector that builds a new array on every call (`.filter()`, `.map()`,
 * `.sort()`) makes React re-render forever. Every hook here therefore selects a
 * **stable** slice from the store first and derives the list inside `useMemo`.
 */

export function usePublishedProducts(): Product[] {
  const products = useCatalogStore((state) => state.products);
  return useMemo(() => products.filter((product) => product.status === 'active'), [products]);
}

export function useActiveCategories(): Category[] {
  const categories = useCatalogStore((state) => state.categories);
  return useMemo(
    () =>
      categories
        .filter((category) => category.status === 'active')
        .slice()
        .sort((a, b) => a.order - b.order),
    [categories],
  );
}

export function useActiveBanners(): Banner[] {
  const banners = useCatalogStore((state) => state.banners);
  return useMemo(
    () =>
      banners
        .filter((banner) => banner.status === 'active')
        .slice()
        .sort((a, b) => a.order - b.order),
    [banners],
  );
}

export function useFeaturedProducts(): Product[] {
  const products = usePublishedProducts();
  return useMemo(
    () => products.filter((product) => product.featured),
    [products],
  );
}

export function useBestSellers(): Product[] {
  const products = usePublishedProducts();
  return useMemo(
    () => products.slice().sort((a, b) => b.soldCount - a.soldCount),
    [products],
  );
}

export function useNewProducts(): Product[] {
  const products = usePublishedProducts();
  return useMemo(
    () => products.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [products],
  );
}

export function useDiscountedProducts(): Product[] {
  const products = usePublishedProducts();
  return useMemo(
    () =>
      products
        .filter((product) => discountPercent(product) > 0)
        .slice()
        .sort((a, b) => discountPercent(b) - discountPercent(a)),
    [products],
  );
}

export function useCartCount(): number {
  const items = useCartStore((state) => state.items);
  return useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
}

export function useCartSubtotal(): number {
  const items = useCartStore((state) => state.items);
  return useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
}

export function useWishlistIds(): string[] {
  const items = useWishlistStore((state) => state.items);
  return useMemo(() => items.map((item) => item.productId), [items]);
}
