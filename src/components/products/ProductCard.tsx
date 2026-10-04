'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from './PriceTag';
import { discountPercent } from '@/store/catalogStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
  compact?: boolean;
}

function ProductCardBase({ product, priority = false, className, compact = false }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const wishlist = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const pushToast = useUIStore((state) => state.pushToast);

  const inWishlist = wishlist.some((item) => item.productId === product.id);
  const discount = discountPercent(product);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= product.lowStockThreshold;

  const handleAdd = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (outOfStock) return;
      addToCart(product);
      pushToast({
        title: 'به سبد خرید اضافه شد',
        description: product.name,
        variant: 'success',
      });
    },
    [addToCart, outOfStock, product, pushToast],
  );

  const handleWishlist = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      toggleWishlist(product);
      pushToast({
        title: inWishlist ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد',
        description: product.name,
        variant: inWishlist ? 'info' : 'success',
      });
    },
    [inWishlist, product, pushToast, toggleWishlist],
  );

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-3 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift',
        className,
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-surface-sunken"
        aria-label={`مشاهده جزئیات ${product.name}`}
      >
        <Image
          src={product.images[0]?.src ?? '/media/products/p0-1.svg'}
          alt={product.images[0]?.alt ?? product.name}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 46vw"
          className="object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.06]"
        />

        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {discount > 0 ? (
              <Badge tone="danger" icon={<Sparkles className="h-3 w-3" aria-hidden />}>
                {toPersianDigits(discount)}٪
              </Badge>
            ) : null}
            {product.newProduct ? <Badge tone="info">جدید</Badge> : null}
            {product.bestseller ? <Badge tone="warning">پرفروش</Badge> : null}
          </div>
        </div>

        <div className="absolute inset-x-2.5 top-2.5 flex justify-end">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={inWishlist ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
            aria-pressed={inWishlist}
            className={cn(
              'pointer-events-auto grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all duration-200',
              inWishlist
                ? 'border-blush/25 bg-blush text-white'
                : 'border-line bg-surface/85 text-ink-400 hover:border-blush/30 hover:text-blush',
            )}
          >
            <Heart className="h-4 w-4" fill={inWishlist ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 flex translate-y-2 items-center justify-center gap-2 opacity-0 transition-all duration-300 ease-spring group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-sm:hidden">
          <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-ink-900/92 px-3.5 py-2 text-2xs font-bold text-white backdrop-blur">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            مشاهده سریع
          </span>
        </div>

        {outOfStock ? (
          <div className="absolute inset-0 grid place-items-center bg-surface/72 backdrop-blur-[1px]">
            <Badge tone="neutral" className="px-3 py-1.5 text-xs">
              ناموجود
            </Badge>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-2xs font-bold text-ink-400">{product.brand}</span>
          <Rating value={product.rating} showValue={false} compact />
        </div>

        <h3 className="mt-1.5 line-clamp-2-fallback min-h-[2.5rem] text-[0.8rem] font-bold leading-5 text-ink-800 transition-colors group-hover:text-brand-700">
          <Link href={`/products/${product.slug}`} className="outline-none">
            {product.name}
          </Link>
        </h3>

        {!compact ? (
          <p className="tnum mt-1 text-2xs text-ink-400">
            {toPersianDigits(product.soldCount)} فروش موفق
          </p>
        ) : null}

        <div className="mt-auto pt-3">
          <PriceTag product={product} size="sm" />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              aria-label={`افزودن ${product.name} به سبد خرید`}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-50 text-2xs font-extrabold text-brand-700 transition-all duration-200 hover:bg-brand-600 hover:text-white disabled:pointer-events-none disabled:opacity-45"
            >
              <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
              {outOfStock ? 'ناموجود' : 'افزودن به سبد'}
            </button>
            {lowStock ? (
              <span className="tnum hidden shrink-0 rounded-full bg-warning-soft px-2 py-1 text-[0.625rem] font-bold text-warning-strong sm:inline">
                {toPersianDigits(product.stock)} عدد
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
