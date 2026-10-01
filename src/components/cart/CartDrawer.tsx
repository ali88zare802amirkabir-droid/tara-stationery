'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { Drawer } from '@/components/ui/Overlay';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Feedback';
import { useCartStore, selectCartTotals } from '@/store/cartStore';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { formatPrice, toPersianDigits } from '@/lib/format';

export const CartDrawer = memo(function CartDrawer() {
  const mounted = useIsMounted();
  const open = useUIStore((state) => state.sheet === 'cart');
  const setSheet = useUIStore((state) => state.openSheet);
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const settings = useCatalogStore((state) => state.settings);

  const close = useCallback(() => setSheet(null), [setSheet]);
  const totals = selectCartTotals(
    items,
    settings.freeShippingThreshold,
    settings.shippingCost,
    settings.taxRate,
  );

  return (
    <Drawer
      open={mounted && open}
      onClose={close}
      title="سبد خرید شما"
      side="end"
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-500">مجموع کالاها</span>
              <span className="tnum font-extrabold text-ink-900">
                {formatPrice(totals.subtotal)} تومان
              </span>
            </div>
            {totals.savings > 0 ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500">سود شما از خرید</span>
                <span className="tnum font-extrabold text-success-strong">
                  {formatPrice(totals.savings)} تومان
                </span>
              </div>
            ) : null}
            <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="font-bold text-ink-800">مبلغ قابل پرداخت</span>
              <span className="tnum font-extrabold text-brand-700">
                {formatPrice(totals.total)} تومان
              </span>
            </div>
            <ButtonLink href="/cart" size="lg" fullWidth onClick={close} className="mt-1">
              مشاهده سبد خرید کامل
            </ButtonLink>
            <Button variant="ghost" fullWidth onClick={close}>
              ادامه خرید
            </Button>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" aria-hidden />}
            title="سبد خرید خالی است"
            description="هنوز محصولی انتخاب نکرده‌اید. از میان بیش از ۳۰ کالای لوازم‌التحریر انتخاب کنید."
            action={
              <ButtonLink href="/products" onClick={close}>
                مشاهده محصولات
              </ButtonLink>
            }
          />
        </div>
      ) : (
        <div>
          {totals.freeShippingGap > 0 ? (
            <div className="border-b border-line bg-brand-50/60 px-5 py-3">
              <p className="flex items-center gap-2 text-2xs font-semibold text-brand-700">
                <Truck className="h-3.5 w-3.5" aria-hidden />
                {formatPrice(totals.freeShippingGap)} تومان تا ارسال رایگان
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (totals.subtotal / settings.freeShippingThreshold) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="border-b border-line bg-success-soft px-5 py-3 text-2xs font-semibold text-success-strong">
              ارسال این سفارش رایگان است.
            </div>
          )}

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantLabel ?? ''}`} className="flex gap-3 px-5 py-4">
                <Link
                  href={`/products/${item.slug}`}
                  onClick={close}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-sunken"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-2xs text-ink-400">{item.brand}</p>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={close}
                        className="mt-0.5 line-clamp-2-fallback text-xs font-bold leading-5 text-ink-800 transition-colors hover:text-brand-700"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantLabel)}
                      aria-label={`حذف ${item.name} از سبد خرید`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-300 transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>

                  {item.variantLabel ? (
                    <p className="mt-1 text-2xs text-ink-400">گزینه: {item.variantLabel}</p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-0.5">
                      <button
                        type="button"
                        onClick={() => decrement(item.productId, item.variantLabel)}
                        aria-label={`کاهش تعداد ${item.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface-sunken hover:text-ink-800"
                      >
                        <Minus className="h-3 w-3" aria-hidden />
                      </button>
                      <span className="tnum w-6 text-center text-xs font-extrabold text-ink-800">
                        {toPersianDigits(item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.productId, item.variantLabel)}
                        disabled={item.quantity >= item.stock}
                        aria-label={`افزایش تعداد ${item.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <Plus className="h-3 w-3" aria-hidden />
                      </button>
                    </div>
                    <div className="text-end">
                      <p className="tnum text-sm font-extrabold text-ink-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.comparePrice ? (
                        <p className="tnum text-[0.625rem] text-ink-300 line-through">
                          {formatPrice(item.comparePrice * item.quantity)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
});
