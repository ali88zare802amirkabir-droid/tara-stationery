import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistOptions, STORAGE_KEYS } from './storage';
import type { CartItem, Product } from '@/types';

export interface CartState {
  items: CartItem[];
  coupon: string | null;
  addItem: (product: Product, quantity?: number, variantLabel?: string | null) => void;
  removeItem: (productId: string, variantLabel?: string | null) => void;
  setQuantity: (productId: string, quantity: number, variantLabel?: string | null) => void;
  increment: (productId: string, variantLabel?: string | null) => void;
  decrement: (productId: string, variantLabel?: string | null) => void;
  clear: () => void;
  applyCoupon: (coupon: string | null) => void;
  hydrate: () => void;
}

const lineKey = (productId: string, variantLabel: string | null) => `${productId}::${variantLabel ?? ''}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1, variantLabel = null) => {
        const key = lineKey(product.id, variantLabel);
        set((state) => {
          const existing = state.items.find(
            (item) => lineKey(item.productId, item.variantLabel) === key,
          );
          if (existing) {
            const nextQuantity = Math.min(existing.quantity + quantity, product.stock);
            return {
              items: state.items.map((item) =>
                lineKey(item.productId, item.variantLabel) === key
                  ? { ...item, quantity: nextQuantity }
                  : item,
              ),
            };
          }
          const item: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            image: product.images[0]?.src ?? '/media/products/p0-1.svg',
            price: product.price,
            comparePrice: product.comparePrice,
            stock: product.stock,
            quantity: Math.min(quantity, Math.max(product.stock, 1)),
            variantLabel,
            art: product.art,
            addedAt: Date.now(),
          };
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId, variantLabel = null) => {
        const key = lineKey(productId, variantLabel);
        set((state) => ({
          items: state.items.filter(
            (item) => lineKey(item.productId, item.variantLabel) !== key,
          ),
        }));
      },

      setQuantity: (productId, quantity, variantLabel = null) => {
        const key = lineKey(productId, variantLabel);
        set((state) => ({
          items: state.items.flatMap((item) => {
            if (lineKey(item.productId, item.variantLabel) !== key) return [item];
            if (quantity <= 0) return [];
            return [{ ...item, quantity: Math.min(quantity, Math.max(item.stock, 1)) }];
          }),
        }));
      },

      increment: (productId, variantLabel = null) => {
        const key = lineKey(productId, variantLabel);
        set((state) => ({
          items: state.items.map((item) =>
            lineKey(item.productId, item.variantLabel) === key
              ? { ...item, quantity: Math.min(item.quantity + 1, Math.max(item.stock, 1)) }
              : item,
          ),
        }));
      },

      decrement: (productId, variantLabel = null) => {
        const key = lineKey(productId, variantLabel);
        set((state) => ({
          items: state.items.flatMap((item) => {
            if (lineKey(item.productId, item.variantLabel) !== key) return [item];
            if (item.quantity <= 1) return [];
            return [{ ...item, quantity: item.quantity - 1 }];
          }),
        }));
      },

      clear: () => set({ items: [], coupon: null }),
      applyCoupon: (coupon) => set({ coupon }),
      hydrate: () => {
        void useCartStore.persist.rehydrate();
      },
    }),
    { name: STORAGE_KEYS.cart, ...persistOptions },
  ),
);

export const cartLineKey = lineKey;

export interface CartTotals {
  count: number;
  subtotal: number;
  listTotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingGap: number;
}

export function selectCartTotals(
  items: CartItem[],
  freeShippingThreshold: number,
  shippingCost: number,
  taxRate: number,
): CartTotals {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const listTotal = items.reduce(
    (sum, item) => sum + (item.comparePrice ?? item.price) * item.quantity,
    0,
  );
  const savings = Math.max(listTotal - subtotal, 0);
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const tax = Math.round(subtotal * taxRate);
  return {
    count,
    subtotal,
    listTotal,
    savings,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    freeShippingGap: Math.max(freeShippingThreshold - subtotal, 0),
  };
}

export function isCartEmpty(state: CartState): boolean {
  return getCartCount(state) === 0;
}

function getCartCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export const selectCartCount = (state: CartState) => getCartCount(state);