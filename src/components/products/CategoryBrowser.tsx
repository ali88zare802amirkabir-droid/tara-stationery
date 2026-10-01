'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { CatalogBrowser } from '@/components/products/CatalogBrowser';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState, ProductGridSkeleton } from '@/components/ui/Feedback';
import { ButtonLink } from '@/components/ui/Button';
import { useCatalogStore } from '@/store/catalogStore';
import { useActiveCategories } from '@/hooks/useCatalog';
import { toPersianDigits } from '@/lib/format';
import type { Product } from '@/types';

export function CategoryBrowser() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';

  const category = useCatalogStore((state) =>
    state.categories.find((entry) => entry.slug === slug),
  );
  const allProducts = useCatalogStore((state) => state.products);
  const activeCategories = useActiveCategories();
  const otherCategories = useMemo(
    () => activeCategories.filter((entry) => entry.slug !== slug),
    [activeCategories, slug],
  );

  const source = useMemo<Product[] | null>(() => {
    if (!category) return null;
    return allProducts.filter(
      (product) => product.categoryId === category.id && product.status === 'active',
    );
  }, [category, allProducts]);

  if (!category) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon={<span className="text-xl">؟</span>}
          title="این دسته‌بندی پیدا نشد"
          description="ممکن است دسته‌بندی حذف شده باشد یا آدرس آن اشتباه وارد شده باشد."
          action={<ButtonLink href="/categories">مشاهده همه دسته‌بندی‌ها</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="shell py-4">
          <Breadcrumb
            items={[
              { label: 'دسته‌بندی‌ها', href: '/categories' },
              { label: category.name },
            ]}
          />
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-line bg-gradient-to-bl from-brand-50 via-surface to-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="shell relative grid items-center gap-6 py-9 sm:py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-display-sm text-ink-900">{category.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-500">
              {category.longDescription}
            </p>
            <p className="tnum mt-4 text-2xs font-bold text-brand-700">
              {toPersianDigits(source?.length ?? 0)} کالا در این دسته موجود است
            </p>
          </div>
          <div className="relative mx-auto aspect-[16/10] w-full max-w-sm overflow-hidden rounded-3xl border border-line shadow-card">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              sizes="(min-width: 1024px) 32vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {source && source.length > 0 ? (
        <CatalogBrowser
          source={source}
          lockedCategoryId={category.id}
          title={`محصولات ${category.name}`}
          description="برای محدود کردن نتایج از فیلترهای کنار صفحه استفاده کنید."
        />
      ) : (
        <div className="shell py-12">
          <ProductGridSkeleton count={4} />
        </div>
      )}

      <section className="border-t border-line bg-surface py-12">
        <div className="shell">
          <h2 className="text-base font-extrabold text-ink-900">دسته‌بندی‌های دیگر</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {otherCategories.map((entry) => (
              <li key={entry.id}>
                <ButtonLink
                  href={`/categories/${entry.slug}`}
                  variant="outline"
                  size="sm"
                >
                  {entry.name}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
