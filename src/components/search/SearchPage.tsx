'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PackageSearch, Search as SearchIcon, Sparkles } from 'lucide-react';
import { CatalogBrowser } from '@/components/products/CatalogBrowser';
import { SearchBox, RecentSearches } from '@/components/layout/SearchBox';
import { EmptyState, ProductGridSkeleton } from '@/components/ui/Feedback';
import { useCatalogStore } from '@/store/catalogStore';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { relatedSearches, searchProducts, buildCatalogIndex, emptyFilterState } from '@/lib/catalog';
import { toPersianDigits } from '@/lib/format';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const debounced = useDebouncedValue(query, 200);
  const allProducts = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);

  const index = useMemo(
    () => buildCatalogIndex(allProducts, categories),
    [allProducts, categories],
  );

  const popular = useMemo(() => relatedSearches(allProducts, 8), [allProducts]);
  const active = useMemo(
    () => allProducts.filter((product) => product.status === 'active'),
    [allProducts],
  );
  const matchCount = useMemo(
    () => searchProducts(active, { ...emptyFilterState, query: debounced }, index).length,
    [active, debounced, index],
  );

  if (!query.trim()) {
    return (
      <div className="shell py-10 sm:py-14">
        <header className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface text-brand-500 shadow-soft">
            <SearchIcon className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-display-sm text-ink-900">جستجو در فروشگاه</h1>
          <p className="mt-2.5 text-sm leading-7 text-ink-500">
            نام کالا، برند یا دسته‌بندی را بنویسید؛ نتایج هم‌زمان با تایپ شما به‌روز می‌شود.
          </p>
          <SearchBox variant="page" autoFocus className="mx-auto mt-7 max-w-xl text-start" />
        </header>

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          <RecentSearches />
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
              <Sparkles className="h-4 w-4 text-brand-500" aria-hidden />
              موضوعات پیشنهادی
            </h2>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {popular.map((tag) => (
                <li key={tag}>
                  <a
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="inline-flex rounded-full border border-line bg-surface-muted px-3 py-1.5 text-2xs font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {tag}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="shell py-8 sm:py-10">
          <p className="text-xs font-bold text-brand-600">نتایج جستجو</p>
          <h1 className="text-display-sm text-ink-900">
            نتایج برای «{query}»
          </h1>
          <p className="tnum mt-2 text-sm text-ink-500">
            {toPersianDigits(matchCount)} کالا با این عبارت پیدا شد.
          </p>
          <p className="tnum mt-2 text-sm text-ink-500">
            {toPersianDigits(
              searchProducts(active, { ...emptyFilterState, query: debounced }, index).length,
            )}{' '}
            کالا با این عبارت پیدا شد.
          </p>
          <SearchBox variant="page" className="mt-5 max-w-xl" placeholder="جستجوی دیگری بنویسید…" />
        </div>
      </div>

      {matchCount === 0 ? (
        <div className="shell py-12">
          <EmptyState
            icon={<PackageSearch className="h-6 w-6" aria-hidden />}
            title="نتیجه‌ای برای این عبارت پیدا نشد"
            description="املای عبارت را بررسی کنید یا کلمه کلیدی دیگری امتحان کنید. می‌توانید از موضوعات پیشنهادی زیر شروع کنید."
            action={
              <div className="flex flex-wrap justify-center gap-1.5">
                {popular.slice(0, 5).map((tag) => (
                  <a
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-2xs font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            }
          />
        </div>
      ) : (
        <CatalogBrowser
          source={active}
          title={`محصولات مرتبط با «${query}»`}
          description="می‌توانید از فیلترهای سمت چپ نتایج را دقیق‌تر محدود کنید."
          syncQueryParam
          className="!pt-8"
        />
      )}
    </div>
  );
}

export function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-12">
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
