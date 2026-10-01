import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { SkeletonList } from '@/components/ui/Feedback';

export const metadata: Metadata = { title: 'مدیریت محصولات' };

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<SkeletonList rows={8} />}>
      <AdminProducts />
    </Suspense>
  );
}
