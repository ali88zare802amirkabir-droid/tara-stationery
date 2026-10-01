'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Card';
import { ProductCard } from '@/components/products/ProductCard';
import { ButtonLink } from '@/components/ui/Button';
import { toPersianDigits } from '@/lib/format';
import type { Product } from '@/types';

interface ShowcaseProps {
  eyebrow: string;
  title: string;
  description?: string;
  products: Product[];
  href: string;
  ctaLabel?: string;
  maxItems?: number;
}

export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
  href,
  ctaLabel = 'مشاهده همه',
  maxItems = 8,
}: ShowcaseProps) {
  if (products.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <ButtonLink
            href={href}
            variant="outline"
            size="sm"
            trailingIcon={<ArrowLeft className="h-3.5 w-3.5" aria-hidden />}
          >
            {ctaLabel}
          </ButtonLink>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.slice(0, maxItems).map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>

      {products.length > maxItems ? (
        <div className="mt-8 text-center">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-ink-800"
          >
            مشاهده {toPersianDigits(products.length)} محصول
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}
    </Section>
  );
}
