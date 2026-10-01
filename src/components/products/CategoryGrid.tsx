'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatPrice, toPersianDigits } from '@/lib/format';
import { useCatalogStore } from '@/store/catalogStore';
import { useActiveCategories } from '@/hooks/useCatalog';

export function CategoryGrid() {
  const categories = useActiveCategories();
  const products = useCatalogStore((state) => state.products);
  const activeProducts = useMemo(
    () => products.filter((product) => product.status === 'active'),
    [products],
  );

  return (
    <div className="shell py-10 sm:py-14">
      <div className="border-b border-line pb-4">
        <Breadcrumb items={[{ label: 'دسته‌بندی‌ها' }]} />
      </div>

      <header className="mb-9 mt-6 max-w-2xl">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
          <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
          دسته‌بندی‌های فروشگاه
        </p>
        <h1 className="text-display-sm text-ink-900">
          هر دسته، مجموعه‌ای کامل و تست‌شده
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
          موجودی هر دسته‌بندی از پنل مدیریت خوانده می‌شود، بنابراین تعداد کالاها همیشه با وضعیت
          واقعی فروشگاه هماهنگ است.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const inCategory = activeProducts.filter(
            (product) => product.categoryId === category.id,
          );
          const count = inCategory.length;
          const cheapest = inCategory.reduce(
            (min, product) => Math.min(min, product.price),
            Number.POSITIVE_INFINITY,
          );

          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-canvas-soft">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
                    className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-base font-extrabold text-ink-900 transition-colors group-hover:text-brand-700">
                    {category.name}
                  </h2>
                  <p className="mt-2 line-clamp-2-fallback text-xs leading-6 text-ink-500">
                    {category.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="tnum text-2xs text-ink-400">
                      {toPersianDigits(count)} کالا موجود
                      {Number.isFinite(cheapest) ? (
                        <> · از {formatPrice(cheapest)} تومان</>
                      ) : null}
                    </span>
                    <span className="inline-flex items-center gap-1 text-2xs font-extrabold text-brand-700">
                      مشاهده
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
