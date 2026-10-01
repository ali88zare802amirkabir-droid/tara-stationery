import { discountPercent } from '@/store/catalogStore';
import type { Category, FilterState, Product, SortOption } from '@/types';
import { normalizeFa } from './utils';

export const emptyFilterState: FilterState = {
  query: '',
  categoryIds: [],
  brandIds: [],
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  discountedOnly: false,
  minRating: null,
  sort: 'newest',
};

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'bestselling', label: 'پرفروش‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'discount-desc', label: 'بیشترین تخفیف' },
  { value: 'rating-desc', label: 'بالاترین امتیاز' },
];

function productHaystack(product: Product, categoryName: string, brandName: string): string {
  return normalizeFa(
    [
      product.name,
      product.brand,
      brandName,
      categoryName,
      product.shortDescription,
      product.tags.join(' '),
      product.sku,
      product.specifications.map((spec) => `${spec.key} ${spec.value}`).join(' '),
      product.slug.replace(/-/g, ' '),
    ].join(' '),
  );
}

export interface CatalogIndex {
  haystacks: Map<string, string>;
  categories: Category[];
}

export function buildCatalogIndex(products: Product[], categories: Category[]): CatalogIndex {
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  const haystacks = new Map<string, string>();
  for (const product of products) {
    const categoryName = categoryNameById.get(product.categoryId) ?? '';
    haystacks.set(product.id, productHaystack(product, categoryName, product.brand));
  }
  return { haystacks, categories };
}

export function searchProducts(
  products: Product[],
  filters: FilterState,
  index: CatalogIndex,
): Product[] {
  const terms = normalizeFa(filters.query).split(' ').filter(Boolean);

  const result = products.filter((product) => {
    if (product.status !== 'active') return false;

    if (terms.length > 0) {
      const haystack = index.haystacks.get(product.id) ?? normalizeFa(product.name);
      if (!terms.every((term) => haystack.includes(term))) return false;
    }

    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(product.categoryId)) {
      return false;
    }

    if (filters.brandIds.length > 0 && !filters.brandIds.includes(product.brand.trim())) {
      return false;
    }

    if (filters.minPrice !== null && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

    if (filters.inStockOnly && product.stock <= 0) return false;
    if (filters.discountedOnly && discountPercent(product) <= 0) return false;
    if (filters.minRating !== null && product.rating < filters.minRating) return false;

    return true;
  });

  return sortProducts(result, filters.sort);
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = products.slice();
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'bestselling':
      return sorted.sort((a, b) => b.soldCount - a.soldCount);
    case 'discount-desc':
      return sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt) || b.soldCount - a.soldCount,
      );
  }
}

export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.categoryIds.length) count += 1;
  if (filters.brandIds.length) count += 1;
  if (filters.minPrice !== null || filters.maxPrice !== null) count += 1;
  if (filters.inStockOnly) count += 1;
  if (filters.discountedOnly) count += 1;
  if (filters.minRating !== null) count += 1;
  return count;
}

export function priceBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 5_000_000 };
  const prices = products.map((product) => product.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function relatedProducts(product: Product, products: Product[], limit = 8): Product[] {
  return products
    .filter((candidate) => candidate.id !== product.id && candidate.status === 'active')
    .map((candidate) => {
      let score = 0;
      if (candidate.categoryId === product.categoryId) score += 4;
      if (candidate.brand === product.brand) score += 3;
      const sharedTags = candidate.tags.filter((tag) => product.tags.includes(tag)).length;
      score += sharedTags * 1.5;
      if (candidate.price <= product.price * 1.25 && candidate.price >= product.price * 0.7) score += 1;
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.soldCount - a.candidate.soldCount)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function similarProducts(product: Product, products: Product[], limit = 6): Product[] {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.categoryId === product.categoryId &&
        candidate.status === 'active',
    )
    .slice()
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, limit);
}

export function searchSuggestions(products: Product[], query: string, limit = 6): Product[] {
  const term = normalizeFa(query);
  if (!term) return [];
  const terms = term.split(' ').filter(Boolean);
  return products
    .filter((product) => product.status === 'active')
    .map((product) => {
      const normalizedName = normalizeFa(product.name);
      const normalizedBrand = normalizeFa(product.brand);
      let score = 0;
      if (normalizedName === term) score += 100;
      if (normalizedName.startsWith(term)) score += 40;
      if (normalizedName.includes(term)) score += 20;
      if (normalizedBrand.includes(term)) score += 14;
      for (const t of terms) if (normalizeFa(product.tags.join(' ')).includes(t)) score += 5;
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.product.soldCount - a.product.soldCount)
    .slice(0, limit)
    .map((entry) => entry.product);
}

export function relatedSearches(products: Product[], limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (product.status !== 'active') continue;
    for (const tag of product.tags) counts.set(tag, (counts.get(tag) ?? 0) + product.soldCount);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}