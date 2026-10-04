'use client';

import { useMemo, useState } from 'react';
import { Check, MessageSquarePlus, ThumbsUp, Truck } from 'lucide-react';
import { Tabs, Tooltip } from '@/components/ui/Disclosure';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { reviewSeeds } from '@/data/analytics';
import { formatDate, formatDecimal, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const DISTRIBUTION = [
  { stars: 5, label: 'عالی' },
  { stars: 4, label: 'خوب' },
  { stars: 3, label: 'متوسط' },
  { stars: 2, label: 'ضعیف' },
  { stars: 1, label: 'خیلی بد' },
];

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState('description');
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState('');
  const pushToast = useUIStore((state) => state.pushToast);
  const reviews = reviewSeeds.default;

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const review of reviews) map.set(review.rating, (map.get(review.rating) ?? 0) + 1);
    return map;
  }, [reviews]);

  return (
    <div>
      <Tabs
        activeId={tab}
        onChange={setTab}
        className="max-w-full"
        tabs={[
          { id: 'description', label: 'توضیحات' },
          { id: 'specs', label: 'مشخصات فنی', count: product.specifications.length },
          { id: 'reviews', label: 'دیدگاه‌ها', count: product.reviewCount },
        ]}
      />

      {tab === 'description' ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-line bg-surface p-6 leading-8 text-ink-600">
              <p className="mb-4 text-sm leading-8">{product.description}</p>
              {product.features.length > 0 ? (
                <>
                  <h3 className="mb-3 mt-6 text-sm font-extrabold text-ink-900">نکات مهم پیش از خرید</h3>
                  <ul className="space-y-2.5">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-sm leading-7 text-ink-500">
                        <Check className="mt-1.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-line bg-surface p-5">
              <h3 className="text-sm font-extrabold text-ink-900">برچسب‌های این محصول</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-surface-sunken px-2.5 py-1 text-2xs font-semibold text-ink-500"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-5">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-800">
                <Truck className="h-4 w-4" aria-hidden />
                ارسال و تحویل
              </h3>
              <ul className="mt-3 space-y-2 text-2xs leading-5 text-brand-700">
                <li>• سفارش‌های تا ساعت ۱۴ همان روز پردازش می‌شوند.</li>
                <li>• تحویل ۲۴ تا ۷۲ ساعت در تهران و ۲ تا ۵ روز در سایر شهرها.</li>
                <li>• ارسال رایگان برای خریدهای بالای ۸۰۰٬۰۰۰ تومان.</li>
              </ul>
            </div>
          </aside>
        </div>
      ) : null}

      {tab === 'specs' ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface">
          <table className="w-full text-start text-sm">
            <caption className="sr-only">جدول مشخصات فنی {product.name}</caption>
            <tbody className="divide-y divide-line">
              {product.specifications.map((spec) => (
                <tr key={spec.key} className="transition-colors hover:bg-surface-muted">
                  <th scope="row" className="w-2/5 bg-surface-muted px-5 py-3.5 text-start text-xs font-bold text-ink-600">
                    {spec.key}
                  </th>
                  <td className="px-5 py-3.5 text-xs text-ink-800">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === 'reviews' ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <p className="tnum text-4xl font-extrabold text-ink-900">
              {formatDecimal(product.rating)}
            </p>
            <Rating value={product.rating} showValue={false} size="md" className="mt-2" />
            <p className="tnum mt-2 text-2xs text-ink-400">
              بر اساس {toPersianDigits(product.reviewCount)} دیدگاه ثبت‌شده
            </p>

            <ul className="mt-5 space-y-2">
              {DISTRIBUTION.map(({ stars, label }) => {
                const count = counts.get(stars) ?? 0;
                const percent = product.reviewCount === 0 ? 0 : (count / reviews.length) * 100;
                return (
                  <li key={stars} className="flex items-center gap-2 text-2xs text-ink-400">
                    <span className="w-12 shrink-0">{label}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
                      <span
                        className="block h-full rounded-full bg-warning"
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </span>
                    <span className="tnum w-6 shrink-0 text-end">{toPersianDigits(count)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-line bg-surface p-5">
              <label htmlFor="review-draft" className="text-xs font-bold text-ink-700">
                دیدگاه خود را بنویسید
              </label>
              <textarea
                id="review-draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="تجربه خود از این محصول را با دیگران به اشتراک بگذارید…"
                className="mt-2 w-full resize-y rounded-2xl border border-line bg-surface px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-2xs text-ink-400">
                  این فرم نمایشی است و دیدگاه‌ها ذخیره نمی‌شوند.
                </p>
                <Button
                  size="sm"
                  disabled={draft.trim().length < 5}
                  onClick={() => {
                    pushToast({
                      title: 'دیدگاه ثبت شد',
                      description: 'پس از تأیید مدیریت منتشر می‌شود (نسخه نمایشی).',
                      variant: 'success',
                    });
                    setDraft('');
                  }}
                  leadingIcon={<MessageSquarePlus className="h-3.5 w-3.5" aria-hidden />}
                >
                  ثبت دیدگاه
                </Button>
              </div>
            </div>

            <ul className="space-y-3">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-3xl border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-700">
                        {review.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-ink-800">{review.author}</p>
                        <p className="text-2xs text-ink-400">{formatDate(review.date)}</p>
                      </div>
                    </div>
                    {review.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-2xs font-bold text-success-strong">
                        <Check className="h-3 w-3" aria-hidden />
                        خرید تأییدشده
                      </span>
                    ) : null}
                  </div>

                  <Rating value={review.rating} showValue={false} className="mt-3" />
                  <h3 className="mt-2 text-sm font-extrabold text-ink-900">{review.title}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-ink-500">{review.body}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <Tooltip content="این دیدگاه برای شما مفید بود؟">
                      <button
                        type="button"
                        onClick={() => {
                          setHelpful((prev) => ({ ...prev, [review.id]: !prev[review.id] }));
                          pushToast({
                            title: 'رأی شما ثبت شد',
                            variant: 'info',
                          });
                        }}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-2xs font-bold transition-colors',
                          helpful[review.id]
                            ? 'border-brand-300 bg-brand-50 text-brand-700'
                            : 'border-line text-ink-400 hover:border-brand-200 hover:text-brand-700',
                        )}
                      >
                        <ThumbsUp className="h-3 w-3" aria-hidden />
                        مفید بود
                        <span className="tnum">
                          ({toPersianDigits(review.helpful + (helpful[review.id] ? 1 : 0))})
                        </span>
                      </button>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
