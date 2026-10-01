'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PriceTag } from '@/components/products/PriceTag';
import { Rating } from '@/components/ui/Rating';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { toPersianDigits } from '@/lib/format';

export function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const remove = useWishlistStore((state) => state.remove);
  const clear = useWishlistStore((state) => state.clear);
  const addToCart = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openSheet);
  const pushToast = useUIStore((state) => state.pushToast);
  const products = useCatalogStore((state) => state.products);

  const detailed = useMemo(
    () =>
      items
        .map((wishlistItem) => ({
          wishlistItem,
          product: products.find((entry) => entry.id === wishlistItem.productId),
        }))
        .filter((entry): entry is { wishlistItem: (typeof items)[number]; product: NonNullable<typeof entry.product> } =>
          Boolean(entry.product),
        ),
    [items, products],
  );

  const recommendations = useMemo(
    () =>
      products
        .filter((product) => product.status === 'active' && !items.some((item) => item.productId === product.id))
        .slice()
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 4),
    [products, items],
  );

  const moveToCart = (productId: string) => {
    const entry = detailed.find((item) => item.product.id === productId);
    if (!entry?.product) return;
    addToCart(entry.product);
    remove(productId);
    pushToast({
      title: 'به سبد خرید منتقل شد',
      description: entry.product.name,
      variant: 'success',
    });
    openCart('cart');
  };

  const addAllToCart = () => {
    let added = 0;
    for (const entry of detailed) {
      if (!entry.product || entry.product.stock <= 0) continue;
      addToCart(entry.product);
      remove(entry.product.id);
      added += 1;
    }
    if (added > 0) {
      pushToast({
        title: `${toPersianDigits(added)} کالا به سبد خرید منتقل شد`,
        variant: 'success',
      });
      openCart('cart');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <div className="border-b border-line bg-surface">
          <div className="shell py-3.5">
            <Breadcrumb items={[{ label: 'علاقه‌مندی‌ها' }]} />
          </div>
        </div>

        <div className="shell py-14">
          <EmptyState
            icon={<Heart className="h-6 w-6" aria-hidden />}
            title="لیست علاقه‌مندی‌ها خالی است"
            description="با زدن آیکن قلب روی هر کالا، آن را اینجا ذخیره کنید تا بعداً راحت پیدایش کنید. لیست شما در مرورگر خودتان ذخیره می‌شود."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ButtonLink href="/products">مشاهده محصولات</ButtonLink>
                <ButtonLink href="/products?sort=bestselling" variant="outline">
                  پرفروش‌ترین‌ها
                </ButtonLink>
              </div>
            }
          />
        </div>

        {recommendations.length > 0 ? (
          <section className="border-t border-line bg-surface py-12">
            <div className="shell">
              <h2 className="text-display-sm text-ink-900">محبوب‌ترین‌های فروشگاه</h2>
              <p className="mt-2 text-sm text-ink-500">
                شاید یکی از این‌ها همان چیزی باشد که دنبالش هستید.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {recommendations.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="shell py-3.5">
          <Breadcrumb items={[{ label: 'علاقه‌مندی‌ها' }]} />
        </div>
      </div>

      <div className="shell py-8 sm:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-display-sm text-ink-900">علاقه‌مندی‌ها</h1>
            <p className="tnum mt-2 text-sm text-ink-500">
              {toPersianDigits(detailed.length)} کالا ذخیره شده است
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={addAllToCart} leadingIcon={<ShoppingCart className="h-3.5 w-3.5" aria-hidden />}>
              انتقال همه به سبد
            </Button>
            <Button variant="ghost" size="sm" onClick={clear}>
              پاک کردن لیست
            </Button>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {detailed.map(({ wishlistItem, product }) => {
            if (!product) return null;
            const outOfStock = product.stock <= 0;
            return (
              <motion.li
                key={wishlistItem.productId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 rounded-3xl border border-line bg-surface p-4 shadow-soft transition-shadow hover:shadow-card"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-sunken"
                >
                  <Image
                    src={wishlistItem.image}
                    alt={wishlistItem.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-2xs text-ink-400">{product.brand}</p>
                      <Link
                        href={`/products/${product.slug}`}
                        className="mt-0.5 line-clamp-2-fallback text-sm font-bold leading-6 text-ink-900 transition-colors hover:text-brand-700"
                      >
                        {product.name}
                      </Link>
                      <Rating value={product.rating} showValue={false} className="mt-1.5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`حذف ${product.name} از علاقه‌مندی‌ها`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-blush transition-colors hover:bg-blush-soft"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <PriceTag product={product} size="sm" showUnit={false} />
                    <Button
                      size="sm"
                      variant="soft"
                      disabled={outOfStock}
                      onClick={() => moveToCart(product.id)}
                      leadingIcon={<ShoppingCart className="h-3.5 w-3.5" aria-hidden />}
                    >
                      {outOfStock ? 'ناموجود' : 'انتقال به سبد'}
                    </Button>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        {recommendations.length > 0 ? (
          <section className="mt-14 border-t border-line pt-10">
            <h2 className="text-display-sm text-ink-900">شاید این‌ها را هم بپسندید</h2>
            <p className="mt-2 text-sm text-ink-500">پیشنهاد ما بر اساس محبوب‌ترین کالاهای فروشگاه.</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {recommendations.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
