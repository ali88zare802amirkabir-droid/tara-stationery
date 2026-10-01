import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoryBrowser } from '@/components/products/CategoryBrowser';
import { ProductGridSkeleton } from '@/components/ui/Feedback';
import { categories } from '@/data/categories';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) return { title: 'دسته‌بندی پیدا نشد' };
  return {
    title: category.seoTitle.replace(' | تارا', '') || category.name,
    description: category.seoDescription,
  };
}

export default async function CategoryDetailPage({ params }: Params) {
  const { slug } = await params;
  return (
    <Suspense
      key={slug}
      fallback={
        <div className="shell py-12">
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <CategoryBrowser />
    </Suspense>
  );
}
