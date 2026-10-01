'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Feedback';
import { useCatalogStore } from '@/store/catalogStore';

export function ProductEditForm() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const products = useCatalogStore((state) => state.products);
  const product = useMemo(
    () => products.find((entry) => entry.id === productId) ?? null,
    [products, productId],
  );

  if (!product) {
    return (
      <EmptyState
        icon={<PackageSearch className="h-6 w-6" aria-hidden />}
        title="محصول موردنظر پیدا نشد"
        description="ممکن است این محصول حذف شده باشد یا شناسه اشتباه است."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/admin/products">بازگشت به فهرست</ButtonLink>
            <ButtonLink href="/admin/products/new" variant="outline">
              افزودن محصول جدید
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return <ProductForm key={product.id} product={product} />;
}
