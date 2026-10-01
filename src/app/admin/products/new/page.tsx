import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductForm } from '@/components/admin/ProductForm';
import { Skeleton } from '@/components/ui/Feedback';

export const metadata: Metadata = { title: 'افزودن محصول' };

export default function NewProductPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
      <ProductForm product={null} />
    </Suspense>
  );
}
