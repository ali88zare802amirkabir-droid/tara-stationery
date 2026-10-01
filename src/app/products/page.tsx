import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsBrowser } from '@/components/products/ProductsBrowser';
import { ProductGridSkeleton } from '@/components/ui/Feedback';

export const metadata: Metadata = {
  title: 'همه محصولات لوازم‌التحریر',
  description:
    'مشاهده و فیلتر همه محصولات فروشگاه لوازم‌التحریر تارا بر اساس دسته‌بندی، برند، قیمت، موجودی، تخفیف و امتیاز کاربران.',
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-10">
          <ProductGridSkeleton count={12} />
        </div>
      }
    >
      <ProductsBrowser />
    </Suspense>
  );
}
