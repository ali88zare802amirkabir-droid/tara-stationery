'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageSearch, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FilterDrawer, FilterPanel, ActiveFilterChips } from './FilterPanel';
import { EmptyState, Pagination } from '@/components/ui/Feedback';
import { Button, ButtonLink } from '@/components/ui/Button';
import { buildCatalogIndex, countActiveFilters, emptyFilterState, searchProducts } from '@/lib/catalog';
import { useCatalogStore } from '@/store/catalogStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { FilterState, Product, SortOption } from '@/types';

const PAGE_SIZE = 12;

interface CatalogBrowserProps {
  /** Products to search within. Defaults to the whole published catalogue. */
  source?: Product[];
  /** Locks the category group in the filter panel. */
  lockedCategoryId?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Reads the `q` param into the filter query (search page). */
  syncQueryParam?: boolean;
  className?: string;
}

function parseFilters(params: URLSearchParams, lockedCategoryId?: string): FilterState {
  const sort = params.get('sort');
  const validSorts: SortOption[] = [
    'newest',
    'bestselling',
    'price-asc',
    'price-desc',
    'discount-desc',
    'rating-desc',
  ];

  return {
    query: params.get('q') ?? '',
    categoryIds: lockedCategoryId
      ? [lockedCategoryId]
      : params.getAll('category').filter(Boolean),
    brandIds: params.getAll('brand').filter(Boolean),
    minPrice: params.get('min') ? Number(params.get('min')) : null,
    maxPrice: params.get('max') ? Number(params.get('max')) : null,
    inStockOnly: params.get('stock') === '1',
    discountedOnly: params.get('discount') === '1',
    minRating: params.get('rating') ? Number(params.get('rating')) : null,
    sort: validSorts.includes(sort as SortOption) ? (sort as SortOption) : 'newest',
  };
}

export function CatalogBrowser({
  source,
  lockedCategoryId,
  title,
  description,
  eyebrow,
  emptyTitle = 'محصولی پیدا نشد',
  emptyDescription = 'با این فیلترها نتیجه‌ای وجود ندارد. فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.',
  syncQueryParam = false,
  className,
}: CatalogBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useIsMounted();
  const allProducts = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);

  const [filters, setFilters] = useState<FilterState>(() =>
    parseFilters(new URLSearchParams(searchParams.toString()), lockedCategoryId),
  );
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // The initial URL sync must not run during hydration, otherwise the router
  // would replace the current entry before the user interacted with anything.
  useEffect(() => {
    if (!mounted || !syncQueryParam) return;
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.inStockOnly) params.set('stock', '1');
    if (filters.discountedOnly) params.set('discount', '1');
    if (filters.minRating !== null) params.set('rating', String(filters.minRating));
    if (filters.minPrice !== null) params.set('min', String(filters.minPrice));
    if (filters.maxPrice !== null) params.set('max', String(filters.maxPrice));
    filters.brandIds.forEach((brand) => params.append('brand', brand));
    filters.categoryIds
      .filter((id) => id !== lockedCategoryId)
      .forEach((id) => params.append('category', id));
    const query = params.toString();
    router.replace(query ? `/search?${query}` : '/search', { scroll: false });
  }, [filters, mounted, router, lockedCategoryId, syncQueryParam]);

  const pool = useMemo(
    () => source ?? allProducts.filter((product) => product.status === 'active'),
    [source, allProducts],
  );

  const index = useMemo(
    () => buildCatalogIndex(pool, categories),
    [pool, categories],
  );

  const results = useMemo(() => searchProducts(pool, filters, index), [pool, filters, index]);

  const pageCount = Math.max(Math.ceil(results.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, pageCount);
  const paged = useMemo(
    () => results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [results, safePage],
  );

  const activeCount = countActiveFilters(filters);

  const apply = useCallback((next: FilterState) => {
    setFilters(next);
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const reset = useCallback(() => {
    apply({ ...emptyFilterState, categoryIds: lockedCategoryId ? [lockedCategoryId] : [] });
  }, [apply, lockedCategoryId]);

  // "Load more" mode when the caller prefers infinite-ish paging.
  const useLoadMore = results.length > PAGE_SIZE * 2;
  const visible = useLoadMore ? results.slice(0, visibleCount) : paged;

  return (
    <div className={cn('shell py-10 sm:py-14', className)}>
      <header className="mb-7 sm:mb-9">
        {eyebrow ? (
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
            <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-display-sm text-ink-900">{title}</h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p>
        ) : null}
      </header>

      <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <FilterPanel
              filters={filters}
              onChange={apply}
              onReset={reset}
              products={results}
              showCategories={!lockedCategoryId}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="tnum text-xs text-ink-500">
              <>
                <span className="font-extrabold text-ink-900">
                  {toPersianDigits(results.length)}
                </span>{' '}
                کالا یافت شد
              </>
            </p>

            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDrawerOpen(true)}
                  leadingIcon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />}
                >
                  فیلتر
                  {activeCount > 0 ? ` (${toPersianDigits(activeCount)})` : ''}
                </Button>
              </div>
              {useLoadMore && visibleCount < results.length ? (
                <Button variant="soft" size="sm" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  نمایش {toPersianDigits(Math.min(PAGE_SIZE, results.length - visibleCount))} کالای دیگر
                </Button>
              ) : null}
            </div>
          </div>

          {activeCount > 0 ? (
            <ActiveFilterChips filters={filters} onChange={apply} className="mb-5" />
          ) : null}

          {results.length === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-6 w-6" aria-hidden />}
              title={emptyTitle}
              description={emptyDescription}
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button onClick={reset}>حذف فیلترها</Button>
                  <ButtonLink href="/products" variant="outline">
                    همه محصولات
                  </ButtonLink>
                </div>
              }
            />
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((product, index) => (
                  <li key={product.id}>
                    <ProductCard product={product} priority={index < 4} />
                  </li>
                ))}
              </ul>

              {!useLoadMore ? (
                <Pagination
                  page={safePage}
                  pageCount={pageCount}
                  onChange={(next) => {
                    setPage(next);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-10"
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={apply}
        onReset={reset}
        products={results}
        showCategories={!lockedCategoryId}
      />
    </div>
  );
}
