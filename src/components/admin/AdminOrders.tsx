'use client';

import { useMemo, useState } from 'react';
import { PackageSearch, Search, ShoppingCart, Truck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/Feedback';
import { demoOrders } from '@/data/analytics';
import { formatPrice, formatShortDate, toPersianDigits } from '@/lib/format';
import { normalizeFa } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const STATUS_META: Record<OrderStatus, { label: string; tone: 'info' | 'success' | 'warning' | 'neutral' | 'danger' }> = {
  pending: { label: 'در انتظار تأیید', tone: 'warning' },
  processing: { label: 'در حال پردازش', tone: 'info' },
  shipped: { label: 'ارسال شده', tone: 'info' },
  delivered: { label: 'تحویل شده', tone: 'success' },
  cancelled: { label: 'لغو شده', tone: 'danger' },
};

export function AdminOrders() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const filtered = useMemo(() => {
    const term = normalizeFa(query);
    return demoOrders.filter((order) => {
      if (term && !normalizeFa(`${order.id} ${order.customer} ${order.city} ${order.phone}`).includes(term)) {
        return false;
      }
      if (status && order.status !== status) return false;
      return true;
    });
  }, [query, status]);

  const totals = useMemo(
    () => ({
      count: demoOrders.length,
      value: demoOrders.reduce((sum, order) => sum + order.total, 0),
      pending: demoOrders.filter((order) => order.status === 'pending').length,
      delivered: demoOrders.filter((order) => order.status === 'delivered').length,
    }),
    [],
  );

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-display-sm text-ink-900">سفارش‌ها</h2>
        <p className="mt-2 text-sm text-ink-500">
          سفارش‌های این بخش کاملاً نمایشی هستند و به هیچ سرویسی متصل نیستند.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'کل سفارش‌ها', value: toPersianDigits(totals.count), tone: 'brand' as const },
          {
            label: 'ارزش کل (تومان)',
            value: formatPrice(totals.value),
            tone: 'success' as const,
          },
          { label: 'در انتظار تأیید', value: toPersianDigits(totals.pending), tone: 'warning' as const },
          { label: 'تحویل شده', value: toPersianDigits(totals.delivered), tone: 'info' as const },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-2xs text-ink-400">{stat.label}</p>
            <p className="tnum mt-2 text-xl font-extrabold text-ink-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو بر اساس شماره سفارش، نام یا شهر…"
            aria-label="جستجوی سفارش"
            leadingIcon={<Search className="h-4 w-4" aria-hidden />}
          />
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="فیلتر وضعیت سفارش"
            options={[
              { value: '', label: 'همه وضعیت‌ها' },
              ...(Object.keys(STATUS_META) as OrderStatus[]).map((key) => ({
                value: key,
                label: STATUS_META[key].label,
              })),
            ]}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="h-6 w-6" aria-hidden />}
          title="سفارشی پیدا نشد"
          description="فیلترها را تغییر دهید تا نتایج بیشتری نمایش داده شود."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-start text-xs">
              <caption className="sr-only">جدول سفارش‌های نمایشی</caption>
              <thead>
                <tr className="border-b border-line bg-surface-muted text-2xs text-ink-400">
                  <th scope="col" className="px-5 py-3 text-start font-bold">شماره سفارش</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">مشتری</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">شهر</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">تعداد کالا</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">مبلغ (تومان)</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">وضعیت</th>
                  <th scope="col" className="px-5 py-3 text-start font-bold">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-surface-muted">
                    <td className="tnum px-5 py-3 font-bold text-ink-800">{order.id}</td>
                    <td className="px-3 py-3">
                      <span className="block text-2xs font-bold text-ink-800">{order.customer}</span>
                      <span className="tnum block text-[0.625rem] text-ink-400">{order.phone}</span>
                    </td>
                    <td className="px-3 py-3 text-2xs text-ink-500">{order.city}</td>
                    <td className="tnum px-3 py-3 text-2xs text-ink-600">
                      {toPersianDigits(order.items)}
                    </td>
                    <td className="tnum px-3 py-3 text-2xs font-bold text-ink-800">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge size="sm" tone={STATUS_META[order.status].tone}>
                        {STATUS_META[order.status].label}
                      </Badge>
                    </td>
                    <td className="tnum px-5 py-3 text-2xs text-ink-400">
                      {formatShortDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-surface-muted px-5 py-4">
        <ShoppingCart className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
        <p className="flex-1 text-2xs leading-5 text-ink-500">
          در نسخه واقعی، این بخش به سیستم سفارش متصل می‌شود و می‌توانید وضعیت هر سفارش را به‌روز
          کنید، فاکتور صادر کنید و کد رهگیری پستی ثبت کنید.
        </p>
        <Badge tone="info" icon={<Truck className="h-3 w-3" aria-hidden />}>
          نمایشی
        </Badge>
      </div>
    </div>
  );
}
