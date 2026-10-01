import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { banners as seedBanners } from '@/data/banners';
import { categories as seedCategories } from '@/data/categories';
import { defaultSettings } from '@/data/brands';
import { products as seedProducts } from '@/data/products';
import { persistOptions, STORAGE_KEYS } from './storage';
import { createId, slugify } from '@/lib/utils';
import type { Banner, Category, Product, StoreSettings } from '@/types';

interface CatalogState {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: StoreSettings;
  /* products */
  addProduct: (input: NewProductInput) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | null;
  toggleProductStatus: (id: string) => void;
  toggleProductFlag: (id: string, flag: 'featured' | 'bestseller' | 'newProduct') => void;
  resetProducts: () => void;
  resetCatalog: () => void;
  /* categories */
  addCategory: (input: NewCategoryInput) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
  /* banners */
  addBanner: (input: NewBannerInput) => Banner;
  updateBanner: (id: string, patch: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (orderedIds: string[]) => void;
  /* settings */
  updateSettings: (patch: Partial<StoreSettings>) => void;
  hydrate: () => void;
}

export type NewProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type NewCategoryInput = Omit<Category, 'id' | 'order'>;
export type NewBannerInput = Omit<Banner, 'id' | 'order'>;

const nextArtIndex = (products: Product[]) => {
  const used = new Set(products.map((product) => Number(product.art) || 0));
  let index = 0;
  while (used.has(index) && index < 32) index += 1;
  return String(index);
};

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      categories: seedCategories,
      banners: seedBanners,
      settings: defaultSettings,

      addProduct: (input) => {
        const product: Product = {
          ...input,
          slug: input.slug || slugify(input.name),
          id: createId('prd'),
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },

      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
              : product,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((product) => product.id !== id) })),

      duplicateProduct: (id) => {
        const source = get().products.find((product) => product.id === id);
        if (!source) return null;
        const copy: Product = {
          ...source,
          id: createId('prd'),
          slug: `${source.slug}-copy-${get().products.filter((p) => p.slug.startsWith(source.slug)).length}`,
          name: `${source.name} (کپی)`,
          status: 'draft',
          featured: false,
          bestseller: false,
          newProduct: false,
          soldCount: 0,
          reviewCount: 0,
          rating: source.rating,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        set((state) => ({ products: [copy, ...state.products] }));
        return copy;
      },

      toggleProductStatus: (id) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, status: product.status === 'active' ? 'draft' : 'active' }
              : product,
          ),
        })),

      toggleProductFlag: (id, flag) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, [flag]: !product[flag] } : product,
          ),
        })),

      resetProducts: () => set({ products: seedProducts }),

      /** Restores the whole demo dataset: products, categories and banners. */
      resetCatalog: () => set({ products: seedProducts, categories: seedCategories, banners: seedBanners }),

      addCategory: (input) => {
        const category: Category = {
          ...input,
          id: createId('cat'),
          order: get().categories.length + 1,
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },

      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...patch } : category,
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          products: state.products.map((product) =>
            product.categoryId === id ? { ...product, categoryId: 'cat_office' } : product,
          ),
        })),

      resetCategories: () => set({ categories: seedCategories }),

      addBanner: (input) => {
        const banner: Banner = {
          ...input,
          id: createId('bnr'),
          order: get().banners.length + 1,
        };
        set((state) => ({ banners: [...state.banners, banner] }));
        return banner;
      },

      updateBanner: (id, patch) =>
        set((state) => ({
          banners: state.banners.map((banner) => (banner.id === id ? { ...banner, ...patch } : banner)),
        })),

      deleteBanner: (id) =>
        set((state) => ({ banners: state.banners.filter((banner) => banner.id !== id) })),

      reorderBanners: (orderedIds) =>
        set((state) => ({
          banners: [...state.banners]
            .sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
            .map((banner, index) => ({ ...banner, order: index + 1 })),
        })),

      updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

      hydrate: () => {
        void useCatalogStore.persist.rehydrate();
      },
    }),
    { name: STORAGE_KEYS.catalog, ...persistOptions },
  ),
);

/* --------------------------------------------------------------- pure utils */

/**
 * Pure helper kept in this module so pricing logic lives next to the data.
 * Derived *lists* intentionally live in `hooks/useCatalog.ts` instead:
 * Zustand v5 compares snapshots by reference, so a selector returning a fresh
 * array on every call would cause an infinite re-render loop.
 */
export function discountPercent(product: Product): number {
  if (!product.comparePrice || product.comparePrice <= product.price) return 0;
  return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
}

export function nextArtKeyFor(products: Product[]): string {
  return nextArtIndex(products);
}