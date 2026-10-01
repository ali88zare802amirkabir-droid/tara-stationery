'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductTabs } from '@/components/products/ProductTabs';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Feedback';
import { useCatalogStore } from '@/store/catalogStore';
import { relatedProducts, similarProducts } from '@/lib/catalog';

export function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);

  const product = useMemo(
    () => products.find((entry) => entry.slug === slug),
    [products, slug],
  );

  const related = useMemo(
    () => (product ? relatedProducts(product, products, 8) : []),
    [product, products],
  );
  const similar = useMemo(
    () => (product ? similarProducts(product, products, 4) : []),
    [product, products],
  );

  if (!product) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon={<AlertTriangle className="h-6 w-6" aria-hidden />}
          title="این محصول پیدا نشد"
          description="ممکن است محصول حذف شده باشد یا آدرس آن اشتباه وارد شده باشد. از فهرست محصولات ادامه دهید."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink href="/products">همه محصولات</ButtonLink>
              <ButtonLink href="/search" variant="outline">
                جستجو در فروشگاه
              </ButtonLink>
            </div>
          }
        />
      </div>
    );
  }

  const category = categories.find((entry) => entry.id === product.categoryId);
  const unavailable = product.status !== 'active';

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="shell py-3.5">
          <Breadcrumb
            items={[
              { label: 'محصولات', href: '/products' },
              ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {unavailable ? (
        <div className="shell pt-5">
          <p className="flex items-center gap-2 rounded-2xl border border-warning/25 bg-warning-soft px-4 py-3 text-2xs font-bold text-warning-strong">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            این محصول در وضعیت «{product.status === 'draft' ? 'پیش‌نویس' : 'بایگانی'}» است و از فروشگاه عمومی نمایش داده نمی‌شود.
          </p>
        </div>
      ) : null}

      <div className="shell py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ProductGallery product={product} />
          </div>
          <ProductInfo product={product} />
        </div>

        <div className="mt-14 sm:mt-16">
          <ProductTabs product={product} />
        </div>
      </div>

      {related.length > 0 ? (
        <ProductShowcase
          eyebrow="پیشنهاد ما"
          title="محصولات مرتبط"
          description="کالاهایی که مشتریان آن‌ها را بیشتر با این محصول می‌بینند."
          products={related}
          href={`/products?category=${product.categoryId}`}
          ctaLabel="مشاهده دسته‌بندی"
          maxItems={4}
        />
      ) : null}

      {similar.length > 0 ? (
        <div className="border-t border-line bg-surface py-12">
          <div className="shell">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-display-sm text-ink-900">محصولات مشابه</h2>
                <p className="mt-2 text-sm text-ink-500">
                  گزینه‌های هم‌رده در همین دسته با نزدیک‌ترین قیمت.
                </p>
              </div>
              <ButtonLink
                href={`/products?category=${product.categoryId}`}
                variant="outline"
                size="sm"
              >
                دیدن همه
              </ButtonLink>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {similar.map((entry) => (
                <li key={entry.id}>
                  <ProductCard product={entry} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
