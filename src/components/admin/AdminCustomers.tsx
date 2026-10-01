'use client';

import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/Feedback';
import { demoCustomers } from '@/data/analytics';
import { formatDate, formatPrice, toPersianDigits } from '@/lib/format';
import { normalizeFa } from '@/lib/utils';
import type { DemoCustomer } from '@/types';

const TIERS: Record<DemoCustomer['tier'], { label: string; tone: 'warning' | 'info' | 'brand' }> = {
  bronze: { label: 'برنزی', tone: 'warning' },
  silver: { label: 'نقره‌ای', tone: 'info' },
  gold: { label: 'طلایی', tone: 'brand' },
};

export function AdminCustomers() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState('');
  const filtered = useMemo(() => {
    const term = normalizeFa(query);
    return demoCustomers.filter((customer) => {
      if (term && !normalizeFa(`${customer.name} ${customer.phone} ${customer.city}`).includes(term)) {
        return false;
      }
      if (tier && customer.tier !== tier) return false;
      return true;
    });
  }, [query, tier]);

  const totalSpent = demoCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-display-sm text-ink-900">مشتریان</h2>
        <p className="mt-2 text-sm text-ink-500">
          فهرست نمایشی مشتریان فروشگاه به‌همراه سطح و مجموع خرید.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'تعداد مشتری', value: toPersianDigits(demoCustomers.length) },
          { label: 'مجموع خرید (تومان)', value: formatPrice(totalSpent) },
          {
            label: 'میانگین سبد',
            value: formatPrice(Math.round(totalSpent / demoCustomers.length)),
          },
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
            placeholder="جستجو بر اساس نام، شماره تماس یا شهر…"
            aria-label="جستجوی مشتری"
            leadingIcon={<Search className="h-4 w-4" aria-hidden />}
          />
          <Select
            value={tier}
            onChange={(event) => setTier(event.target.value)}
            aria-label="فیلتر سطح مشتری"
            options={[
              { value: '', label: 'همه سطوح' },
              { value: 'gold', label: 'طلایی' },
              { value: 'silver', label: 'نقره‌ای' },
              { value: 'bronze', label: 'برنزی' },
            ]}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" aria-hidden />}
          title="مشتری پیدا نشد"
          description="فیلترها را تغییر دهید تا نتایج بیشتری نمایش داده شود."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-start text-xs">
              <caption className="sr-only">جدول مشتریان</caption>
              <thead>
                <tr className="border-b border-line bg-surface-muted text-2xs text-ink-400">
                  <th scope="col" className="px-5 py-3 text-start font-bold">مشتری</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">شماره تماس</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">شهر</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">سفارش‌ها</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">مجموع خرید</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">سطح</th>
                  <th scope="col" className="px-5 py-3 text-start font-bold">عضویت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-surface-muted">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xs font-extrabold text-brand-700">
                          {customer.name.charAt(0)}
                        </span>
                        <span className="text-2xs font-bold text-ink-800">{customer.name}</span>
                      </div>
                    </td>
                    <td className="tnum px-3 py-3 text-2xs text-ink-600">{customer.phone}</td>
                    <td className="px-3 py-3 text-2xs text-ink-500">{customer.city}</td>
                    <td className="tnum px-3 py-3 text-2xs text-ink-600">
                      {toPersianDigits(customer.orders)}
                    </td>
                    <td className="tnum px-3 py-3 text-2xs font-bold text-ink-800">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge size="sm" tone={TIERS[customer.tier].tone}>
                        {TIERS[customer.tier].label}
                      </Badge>
                    </td>
                    <td className="tnum px-5 py-3 text-2xs text-ink-400">
                      {formatDate(customer.joinedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
