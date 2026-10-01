import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductGridSkeleton } from '@/components/ui/Feedback';
import { products } from '@/data/products';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  if (!product) return { title: 'محصول پیدا نشد' };

  return {
    title: product.seo.title.replace(' | خرید با قیمت مناسب از تارا', ''),
    description: product.seo.description,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]?.src].filter(Boolean) as string[],
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  return (
    <Suspense
      key={slug}
      fallback={
        <div className="shell py-12">
          <ProductGridSkeleton count={4} />
        </div>
      }
    >
      <ProductDetail />
    </Suspense>
  );
}
