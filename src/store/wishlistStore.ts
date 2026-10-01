import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistOptions, STORAGE_KEYS } from './storage';
import type { Product, WishlistItem } from '@/types';

export interface WishlistState {
  items: WishlistItem[];
  toggle: (product: Product) => void;
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  hydrate: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      add: (product) =>
        set((state) =>
          state.items.some((item) => item.productId === product.id)
            ? state
            : {
                items: [
                  ...state.items,
                  {
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    brand: product.brand,
                    image: product.images[0]?.src ?? '/media/products/p0-1.svg',
                    price: product.price,
                    comparePrice: product.comparePrice,
                    rating: product.rating,
                    art: product.art,
                    addedAt: Date.now(),
                  },
                ],
              },
        ),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),

      toggle: (product) =>
        set((state) =>
          state.items.some((item) => item.productId === product.id)
            ? { items: state.items.filter((item) => item.productId !== product.id) }
            : {
                items: [
                  ...state.items,
                  {
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    brand: product.brand,
                    image: product.images[0]?.src ?? '/media/products/p0-1.svg',
                    price: product.price,
                    comparePrice: product.comparePrice,
                    rating: product.rating,
                    art: product.art,
                    addedAt: Date.now(),
                  },
                ],
              },
        ),

      clear: () => set({ items: [] }),
      hydrate: () => {
        void useWishlistStore.persist.rehydrate();
      },
    }),
    { name: STORAGE_KEYS.wishlist, ...persistOptions },
  ),
);

export const selectWishlistIds = (state: WishlistState) =>
  state.items.map((item) => item.productId);

export const selectWishlistCount = (state: WishlistState) => state.items.length;