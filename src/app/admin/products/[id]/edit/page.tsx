import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductEditForm } from '@/components/admin/ProductEditForm';
import { Skeleton } from '@/components/ui/Feedback';

export const metadata: Metadata = { title: 'ویرایش محصول' };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense key={id} fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
      <ProductEditForm />
    </Suspense>
  );
}
