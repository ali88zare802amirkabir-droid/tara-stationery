'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { OrderRequestModal } from '@/components/cart/OrderRequestModal';
import { selectCartTotals, useCartStore } from '@/store/cartStore';
import { useCatalogStore } from '@/store/catalogStore';
import { formatPrice, toPersianDigits } from '@/lib/format';

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const settings = useCatalogStore((state) => state.settings);
  const [orderOpen, setOrderOpen] = useState(false);

  const totals = useMemo(
    () =>
      selectCartTotals(items, settings.freeShippingThreshold, settings.shippingCost, settings.taxRate),
    [items, settings],
  );

  if (items.length === 0) {
    return (
      <>
        <div className="border-b border-line bg-surface">
          <div className="shell py-3.5">
            <Breadcrumb items={[{ label: 'سبد خرید' }]} />
          </div>
        </div>
        <div className="shell py-14">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" aria-hidden />}
            title="سبد خرید شما خالی است"
            description="هنوز کالایی به سبد اضافه نکرده‌اید. از میان بیش از ۳۰ کالای منتخب تارا، اولین خرید خود را شروع کنید."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ButtonLink href="/products">مشاهده محصولات</ButtonLink>
                <ButtonLink href="/categories" variant="outline">
                  دسته‌بندی‌ها
                </ButtonLink>
              </div>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="shell py-3.5">
          <Breadcrumb items={[{ label: 'سبد خرید' }]} />
        </div>
      </div>

      <div className="shell py-8 sm:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-display-sm text-ink-900">سبد خرید</h1>
            <p className="tnum mt-2 text-sm text-ink-500">
              {toPersianDigits(totals.count)} کالا در سبد شما
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clear} leadingIcon={<X className="h-3.5 w-3.5" aria-hidden />}>
            خالی کردن سبد
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
          <div className="min-w-0">
            {totals.freeShippingGap > 0 ? (
              <div className="mb-4 rounded-3xl border border-brand-100 bg-brand-50/60 p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-brand-700">
                  <Truck className="h-4 w-4" aria-hidden />
                  تنها {formatPrice(totals.freeShippingGap)} تومان تا ارسال رایگان
                </p>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white">
                  <motion.div
                    className="h-full rounded-full bg-brand-500"
                    initial={false}
                    animate={{
                      width: `${Math.min(
                        100,
                        (totals.subtotal / settings.freeShippingThreshold) * 100,
                      )}%`,
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-3xl border border-success/20 bg-success-soft px-4 py-3 text-xs font-bold text-success-strong">
                ارسال این سفارش رایگان است.
              </div>
            )}

            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={`${item.productId}-${item.variantLabel ?? ''}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl border border-line bg-surface p-4 shadow-soft"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-sunken sm:h-28 sm:w-28"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-2xs text-ink-400">{item.brand}</p>
                            <Link
                              href={`/products/${item.slug}`}
                              className="mt-1 line-clamp-2-fallback text-sm font-bold leading-6 text-ink-900 transition-colors hover:text-brand-700"
                            >
                              {item.name}
                            </Link>
                            {item.variantLabel ? (
                              <p className="mt-1 text-2xs text-ink-400">گزینه: {item.variantLabel}</p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantLabel)}
                            aria-label={`حذف ${item.name} از سبد خرید`}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-danger-soft hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                          <div className="flex items-center gap-1 rounded-full border border-line bg-surface-sunken p-0.5">
                            <button
                              type="button"
                              onClick={() => decrement(item.productId, item.variantLabel)}
                              aria-label={`کاهش تعداد ${item.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface hover:text-brand-700"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden />
                            </button>
                            <span className="tnum w-8 text-center text-xs font-extrabold text-ink-900">
                              {toPersianDigits(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => increment(item.productId, item.variantLabel)}
                              disabled={item.quantity >= item.stock}
                              aria-label={`افزایش تعداد ${item.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface hover:text-brand-700 disabled:opacity-30"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          </div>

                          <div className="text-end">
                            <p className="tnum text-base font-extrabold text-ink-900">
                              {formatPrice(item.price * item.quantity)} تومان
                            </p>
                            {item.comparePrice ? (
                              <p className="tnum text-2xs text-ink-400 line-through">
                                {formatPrice(item.comparePrice * item.quantity)} تومان
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
              <h2 className="text-sm font-extrabold text-ink-900">خلاصه سفارش</h2>

              <dl className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">قیمت کالاها ({toPersianDigits(totals.count)})</dt>
                  <dd className="tnum font-bold text-ink-800">
                    {formatPrice(totals.listTotal)} تومان
                  </dd>
                </div>
                {totals.savings > 0 ? (
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">سود شما از تخفیف</dt>
                    <dd className="tnum font-bold text-success-strong">
                      −{formatPrice(totals.savings)} تومان
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">هزینه ارسال</dt>
                  <dd className="tnum font-bold text-ink-800">
                    {totals.shipping === 0 ? 'رایگان' : `${formatPrice(totals.shipping)} تومان`}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">مالیات بر ارزش افزوده</dt>
                  <dd className="tnum font-bold text-ink-800">{formatPrice(totals.tax)} تومان</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
                  <dt className="font-extrabold text-ink-900">مبلغ قابل پرداخت</dt>
                  <dd className="tnum font-extrabold text-brand-700">
                    {formatPrice(totals.total)} تومان
                  </dd>
                </div>
              </dl>

              <Button fullWidth size="lg" className="mt-5" onClick={() => setOrderOpen(true)}>
                ثبت درخواست سفارش
              </Button>

              <OrderRequestModal
                open={orderOpen}
                onClose={() => setOrderOpen(false)}
                total={totals.total}
                count={totals.count}
              />

              <p className="mt-3 text-center text-2xs leading-5 text-ink-400">
                این یک فروشگاه نمایشی است؛ هیچ درگاه بانکی فعال نیست و اطلاعات کارت دریافت
                نمی‌شود.
              </p>
            </div>

            <div className="mt-4 rounded-3xl border border-line bg-surface-muted p-5">
              <h3 className="text-xs font-extrabold text-ink-800">شیوه‌های پرداخت (نمایشی)</h3>
              <ul className="mt-3 space-y-2.5 text-2xs leading-5 text-ink-500">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" aria-hidden />
                  پرداخت در محل تحویل (کد پستی و کارت به کاربر نیاز ندارد)
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" aria-hidden />
                  انتقال بانکی — به‌صورت نمایشی
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" aria-hidden />
                  فاکتور رسمی برای سفارش‌های سازمانی
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
