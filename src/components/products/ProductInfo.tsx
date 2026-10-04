'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Badge, StockBadge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';
import { PriceTag } from './PriceTag';
import { discountPercent, useCatalogStore } from '@/store/catalogStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const PERKS = [
  { icon: Truck, text: 'ارسال سریع به سراسر ایران' },
  { icon: ShieldCheck, text: 'ضمانت اصالت و سلامت کالا' },
  { icon: RotateCcw, text: 'هفت روز مهلت بازگشت' },
];

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState<string | null>(
    product.variants.find((entry) => entry.enabled)?.values[0] ?? null,
  );

  const addToCart = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openSheet);
  const pushToast = useUIStore((state) => state.pushToast);
  const wishlist = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const categories = useCatalogStore((state) => state.categories);
  const settings = useCatalogStore((state) => state.settings);

  const category = categories.find((entry) => entry.id === product.categoryId);
  const discount = discountPercent(product);
  const inWishlist = wishlist.some((item) => item.productId === product.id);
  const outOfStock = product.stock <= 0;
  const activeVariant = product.variants.find((entry) => entry.enabled && entry.name === 'رنگ');

  const lineTotal = useMemo(() => product.price * quantity, [product.price, quantity]);

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, quantity, variant);
    pushToast({
      title: `${toPersianDigits(quantity)} عدد به سبد اضافه شد`,
      description: product.name,
      variant: 'success',
    });
    openCart('cart');
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(product, quantity, variant);
    openCart('cart');
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-1.5">
        {category ? (
          <Link
            href={`/categories/${category.slug}`}
            className="text-2xs font-bold text-brand-600 transition-colors hover:text-brand-800"
          >
            {category.name}
          </Link>
        ) : null}
        <span className="text-ink-200" aria-hidden>
          /
        </span>
        <span className="text-2xs text-ink-400">{product.brand}</span>
        {product.newProduct ? <Badge tone="info">جدید</Badge> : null}
        {product.bestseller ? <Badge tone="warning">پرفروش</Badge> : null}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold leading-snug text-ink-900 sm:text-[1.75rem]">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
        <span className="tnum text-2xs text-ink-400">کد کالا: {product.sku}</span>
        <span className="tnum text-2xs text-ink-400">
          {toPersianDigits(product.soldCount)} فروش موفق
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-ink-500">{product.shortDescription}</p>

      <div className="mt-6 rounded-3xl border border-line bg-surface p-5 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PriceTag product={product} size="lg" />
          {discount > 0 ? (
            <Badge tone="danger" icon={<Sparkles className="h-3 w-3" aria-hidden />}>
              {toPersianDigits(discount)}٪ تخفیف این محصول
            </Badge>
          ) : null}
        </div>

        {product.comparePrice && product.comparePrice > product.price ? (
          <p className="mt-3 rounded-2xl bg-success-soft px-3.5 py-2.5 text-2xs font-semibold text-success-strong">
            با این خرید {formatPrice(product.comparePrice - product.price)} تومان صرفه‌جویی می‌کنید.
          </p>
        ) : null}

        <div className="mt-5">
          <StockBadge stock={product.stock} threshold={product.lowStockThreshold} />
        </div>

        {activeVariant ? (
          <fieldset className="mt-5">
            <legend className="mb-2 text-2xs font-bold text-ink-600">
              {activeVariant.name}
              {variant ? <span className="text-ink-400"> — {variant}</span> : null}
            </legend>
            <div className="flex flex-wrap gap-2">
              {activeVariant.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVariant(value)}
                  aria-pressed={variant === value}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-2xs font-bold transition-colors',
                    variant === value
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-line bg-surface text-ink-600 hover:border-brand-300 hover:text-brand-700',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-12 items-center gap-1 rounded-full border border-line bg-surface-sunken p-1">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={quantity <= 1 || outOfStock}
              aria-label="کاهش تعداد"
              className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink-600 transition-colors hover:text-brand-700 disabled:opacity-35"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span
              className="tnum w-9 text-center text-sm font-extrabold text-ink-900"
              aria-live="polite"
            >
              {toPersianDigits(quantity)}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(value + 1, Math.max(product.stock, 1)))}
              disabled={quantity >= product.stock || outOfStock}
              aria-label="افزایش تعداد"
              className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink-600 transition-colors hover:text-brand-700 disabled:opacity-35"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <Button
            size="lg"
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1"
            leadingIcon={<ShoppingCart className="h-4 w-4" aria-hidden />}
          >
            {outOfStock ? 'ناموجود' : 'افزودن به سبد خرید'}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="sm:w-auto"
          >
            خرید سریع
          </Button>

          <button
            type="button"
            onClick={() => {
              toggleWishlist(product);
              pushToast({
                title: inWishlist ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد',
                description: product.name,
                variant: inWishlist ? 'info' : 'success',
              });
            }}
            aria-pressed={inWishlist}
            aria-label={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            className={cn(
              'grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-all duration-200',
              inWishlist
                ? 'border-blush bg-blush text-white'
                : 'border-line bg-surface text-ink-400 hover:border-blush/40 hover:text-blush',
            )}
          >
            <Heart className="h-5 w-5" fill={inWishlist ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>

        {!outOfStock ? (
          <p className="tnum mt-3 text-2xs text-ink-400">
            جمع این انتخاب: {formatPrice(lineTotal)} تومان
            {product.stock <= product.lowStockThreshold ? (
              <span className="text-warning-strong">
                {' '}
                — تنها {toPersianDigits(product.stock)} عدد در انبار باقی مانده.
              </span>
            ) : null}
          </p>
        ) : null}

        <ul className="mt-5 grid gap-2 border-t border-line pt-4 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-2xs text-ink-500">
              <Icon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {product.features.length > 0 ? (
        <div className="mt-6 rounded-3xl border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
            <Check className="h-4 w-4 text-success" aria-hidden />
            ویژگی‌های شاخص
          </h2>
          <ul className="mt-3.5 space-y-2.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-xs leading-6 text-ink-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {product.specifications.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface">
          <h2 className="border-b border-line bg-surface-muted px-5 py-3.5 text-sm font-extrabold text-ink-900">
            مشخصات کلیدی
          </h2>
          <dl className="divide-y divide-line">
            {product.specifications.map((spec) => (
              <div key={spec.key} className="flex items-center justify-between gap-4 px-5 py-2.5">
                <dt className="text-2xs text-ink-400">{spec.key}</dt>
                <dd className="text-2xs font-bold text-ink-800">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <p className="mt-5 rounded-2xl bg-canvas-soft px-4 py-3 text-2xs leading-5 text-ink-400">
        ارسال رایگان برای خرید بالای{' '}
        <span className="tnum font-bold text-ink-600">
          {formatPrice(settings.freeShippingThreshold)} تومان
        </span>{' '}
        — هزینه ارسال عادی {formatPrice(settings.shippingCost)} تومان است.
      </p>
    </div>
  );
}
