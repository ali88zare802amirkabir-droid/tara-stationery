'use client';

import { useMemo } from 'react';
import { CatalogBrowser } from '@/components/products/CatalogBrowser';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useCatalogStore } from '@/store/catalogStore';

export function ProductsBrowser() {
  const products = useCatalogStore((state) => state.products);
  const activeProducts = useMemo(
    () => products.filter((product) => product.status === 'active'),
    [products],
  );

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="shell py-3.5">
          <Breadcrumb items={[{ label: 'محصولات' }]} />
        </div>
      </div>
      <CatalogBrowser
        source={activeProducts}
        title="همه محصولات فروشگاه"
        description="نوشت‌افزار، دفتر، لوازم هنری، ابزار هندسی و لوازم اداری؛ همه در یک فهرست قابل فیلتر و مرتب‌سازی."
        eyebrow="فروشگاه"
      />
    </>
  );
}
