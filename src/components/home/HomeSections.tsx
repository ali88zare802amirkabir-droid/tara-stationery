'use client';

import { Hero } from '@/components/home/Hero';
import { CategoryShowcase, FeatureStrip } from '@/components/home/CategoryShowcase';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { AboutStore, BrandsRow, CallToAction } from '@/components/home/StoreSections';
import {
  useBestSellers,
  useDiscountedProducts,
  useFeaturedProducts,
  useNewProducts,
} from '@/hooks/useCatalog';

export function HomeSections() {
  const featured = useFeaturedProducts();
  const bestSellers = useBestSellers();
  const newProducts = useNewProducts();
  const discounted = useDiscountedProducts();

  return (
    <>
      <Hero />
      <FeatureStrip />
      <CategoryShowcase />

      <ProductShowcase
        eyebrow="پیشنهاد تارا"
        title="محصولات منتخب و پیشنهادی"
        description="کالاهایی که تیم ما به‌عنوان پیشنهاد این هفته انتخاب کرده است."
        products={featured}
        href="/products?sort=rating-desc"
        ctaLabel="مشاهده محصولات منتخب"
      />

      <ProductShowcase
        eyebrow="پرفروش‌ترین‌ها"
        title="محبوب‌ترین انتخاب‌های مشتریان"
        description="بر اساس تعداد سفارش ثبت‌شده در شش ماه گذشته."
        products={bestSellers}
        href="/products?sort=bestselling"
        ctaLabel="همه پرفروش‌ترین‌ها"
      />

      <BrandsRow />

      <ProductShowcase
        eyebrow="تازه رسیده‌ها"
        title="جدیدترین محصولات اضافه‌شده"
        description="هر محصولی که تازه به موجودی فروشگاه اضافه می‌شود، اینجا قرار می‌گیرد."
        products={newProducts}
        href="/products?sort=newest"
        ctaLabel="همه محصولات جدید"
      />

      <ProductShowcase
        eyebrow="تخفیف‌های ویژه"
        title="فرصت‌های خرید با قیمت پایین‌تر"
        description="محصولاتی که در حال حاضر با تخفیف و قیمت شکسته عرضه می‌شوند."
        products={discounted}
        href="/products?discount=1"
        ctaLabel="همه تخفیف‌دارها"
      />

      <AboutStore />
      <CallToAction />
    </>
  );
}
