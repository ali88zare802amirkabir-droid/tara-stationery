'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  FolderTree,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { AreaChart, BarChart, DonutChart, ProgressBar, formatRevenue } from './Charts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { useCatalogStore, discountPercent } from '@/store/catalogStore';
import { useCartStore } from '@/store/cartStore';
import { salesSeries, trafficSeries, demoOrders } from '@/data/analytics';
import { formatDecimal, formatPrice, formatShortDate, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';

const DONUT_COLORS = ['#4A73E8', '#17A186', '#7C4DE8', '#D08A1E', '#E5306A', '#2F8AD6', '#5A6B87', '#C2740B'];

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  trend,
  index,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Package;
  tone: 'brand' | 'success' | 'warning' | 'accent';
  trend?: number;
  index: number;
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    success: 'bg-success-soft text-success-strong ring-success/15',
    warning: 'bg-warning-soft text-warning-strong ring-warning/20',
    accent: 'bg-accent-soft text-accent ring-accent/15',
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="h-full p-5 transition-shadow hover:shadow-card">
        <div className="flex items-start justify-between gap-3">
          <span className={cn('grid h-11 w-11 place-items-center rounded-2xl ring-1', tones)}>
            <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
          </span>
          {typeof trend === 'number' ? (
            <span
              className={cn(
                'tnum inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-bold',
                trend >= 0 ? 'bg-success-soft text-success-strong' : 'bg-danger-soft text-danger-strong',
              )}
            >
              <TrendingUp
                className={cn('h-3 w-3', trend < 0 && 'rotate-180')}
                aria-hidden
              />
              {toPersianDigits(Math.abs(trend))}٪
            </span>
          ) : null}
        </div>
        <p className="tnum mt-4 text-2xl font-extrabold text-ink-900">{value}</p>
        <p className="mt-1 text-xs font-bold text-ink-700">{label}</p>
        <p className="mt-1 text-2xs text-ink-400">{hint}</p>
      </Card>
    </motion.div>
  );
}

export function AdminDashboard() {
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const cartItems = useCartStore((state) => state.items);
  const [range, setRange] = useState<'6m' | '12m'>('12m');

  const stats = useMemo(() => {
    const active = products.filter((product) => product.status === 'active');
    const inStock = active.filter((product) => product.stock > 0);
    const lowStock = active.filter(
      (product) => product.stock > 0 && product.stock <= product.lowStockThreshold,
    );
    const outOfStock = products.filter((product) => product.stock === 0);
    const cartValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const inventoryValue = active.reduce(
      (sum, product) => sum + product.price * product.stock,
      0,
    );
    const drafts = products.filter((product) => product.status === 'draft');

    return {
      total: products.length,
      active: active.length,
      inStock: inStock.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      categories: categories.length,
      drafts: drafts.length,
      cartValue,
      inventoryValue,
      averageRating:
        active.length > 0
          ? Math.round((active.reduce((sum, p) => sum + p.rating, 0) / active.length) * 10) / 10
          : 0,
    };
  }, [products, categories, cartItems]);

  const categoryDistribution = useMemo(
    () =>
      categories.map((category, index) => ({
        label: category.name,
        value: products.filter(
          (product) => product.categoryId === category.id && product.status === 'active',
        ).length,
        color: DONUT_COLORS[index % DONUT_COLORS.length],
      })),
    [categories, products],
  );

  const latestProducts = useMemo(
    () =>
      products
        .slice()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6),
    [products],
  );

  const topSellers = useMemo(
    () =>
      products
        .filter((product) => product.status === 'active')
        .slice()
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 5),
    [products],
  );

  const series = range === '6m' ? salesSeries.slice(-6) : salesSeries;
  const revenueSeries = series.map((point) => ({
    label: point.label,
    value: point.revenue,
    secondary: point.orders,
  }));

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-brand-600">نمای کلی</p>
          <h2 className="mt-1.5 text-display-sm text-ink-900">داشبورد فروشگاه</h2>
          <p className="mt-2 text-sm text-ink-500">
            داده‌ها به‌صورت زنده از وضعیت فروشگاه خوانده می‌شوند و سفارش‌ها نمایشی هستند.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
            {(['6m', '12m'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                aria-pressed={range === option}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-2xs font-bold transition-colors',
                  range === option ? 'bg-brand-600 text-white' : 'text-ink-500 hover:text-ink-800',
                )}
              >
                {option === '6m' ? '۶ ماه اخیر' : '۱۲ ماه اخیر'}
              </button>
            ))}
          </div>
          <ButtonLink href="/admin/products/new" size="sm">
            افزودن محصول
          </ButtonLink>
        </div>
      </header>

      {stats.drafts > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-warning/25 bg-warning-soft px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning-strong" aria-hidden />
          <p className="text-2xs font-bold text-warning-strong">
            {toPersianDigits(stats.drafts)} محصول در وضعیت پیش‌نویس است و در فروشگاه عمومی نمایش
            داده نمی‌شود.
          </p>
          <ButtonLink href="/admin/products?status=draft" variant="outline" size="sm" className="ms-auto">
            بررسی پیش‌نویس‌ها
          </ButtonLink>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          index={0}
          label="تعداد محصولات"
          value={toPersianDigits(stats.total)}
          hint={`${toPersianDigits(stats.active)} محصول فعال`}
          icon={Package}
          tone="brand"
          trend={8}
        />
        <StatCard
          index={1}
          label="محصولات موجود"
          value={toPersianDigits(stats.inStock)}
          hint={`${toPersianDigits(stats.outOfStock)} کالا ناموجود`}
          icon={Boxes}
          tone="success"
          trend={4}
        />
        <StatCard
          index={2}
          label="کم‌موجودی"
          value={toPersianDigits(stats.lowStock)}
          hint="نیازمند بررسی انبار"
          icon={AlertTriangle}
          tone="warning"
          trend={-12}
        />
        <StatCard
          index={3}
          label="دسته‌بندی‌ها"
          value={toPersianDigits(stats.categories)}
          hint="ساختار فعال فروشگاه"
          icon={FolderTree}
          tone="accent"
        />
        <StatCard
          index={4}
          label="سفارش‌های نمایشی"
          value={toPersianDigits(demoOrders.length)}
          hint={`${toPersianDigits(trafficSeries.reduce((sum, p) => sum + p.value, 0))} بازدید این هفته`}
          icon={ShoppingCart}
          tone="brand"
          trend={15}
        />
        <StatCard
          index={5}
          label="ارزش سبد کاربر"
          value={formatPrice(stats.cartValue)}
          hint={`موجودی انبار: ${formatPrice(stats.inventoryValue)} تومان`}
          icon={Wallet}
          tone="success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-ink-900">نمای فروش</h3>
              <p className="mt-1 text-2xs text-ink-400">
                مجموع درآمد نمایشی به تفکیک ماه (تومان)
              </p>
            </div>
            <Badge tone="success" icon={<TrendingUp className="h-3 w-3" aria-hidden />}>
              رشد {toPersianDigits(18)}٪ نسبت به سال قبل
            </Badge>
          </div>
          <AreaChart
            data={revenueSeries}
            valueFormat={formatRevenue}
            height={280}
          />
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-extrabold text-ink-900">توزیع دسته‌بندی‌ها</h3>
          <p className="mt-1 text-2xs text-ink-400">سهم هر دسته از محصولات فعال</p>
          <div className="mt-5">
            <DonutChart
              data={categoryDistribution}
              centerLabel="محصول فعال"
              centerValue={toPersianDigits(stats.active)}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5">
          <h3 className="text-sm font-extrabold text-ink-900">بازدید هفته</h3>
          <p className="mt-1 text-2xs text-ink-400">تعداد بازدید در هر روز هفته</p>
          <div className="mt-5">
            <BarChart data={trafficSeries} accent="mint" />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-extrabold text-ink-900">وضعیت موجودی</h3>
          <p className="mt-1 text-2xs text-ink-400">نسبت کالاها بر اساس وضعیت انبار</p>
          <div className="mt-5 space-y-4">
            <ProgressBar
              value={stats.inStock}
              max={stats.total}
              tone="success"
              label="موجود و فعال"
            />
            <ProgressBar
              value={stats.lowStock}
              max={stats.total}
              tone="warning"
              label="کم‌موجودی"
            />
            <ProgressBar
              value={stats.outOfStock}
              max={stats.total}
              tone="danger"
              label="ناموجود"
            />
            <ProgressBar
              value={stats.drafts}
              max={stats.total}
              tone="brand"
              label="پیش‌نویس"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-canvas-soft p-4">
            <p className="text-2xs text-ink-400">میانگین امتیاز محصولات فعال</p>
            <p className="tnum mt-1 text-lg font-extrabold text-ink-900">
              {formatDecimal(stats.averageRating)}{' '}
              <span className="text-sm font-bold text-ink-400">از ۵</span>
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-ink-900">پرفروش‌ترین‌ها</h3>
            <Link
              href="/admin/products?sort=bestselling"
              className="inline-flex items-center gap-1 text-2xs font-bold text-brand-700 hover:underline"
            >
              همه
              <ArrowLeft className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          <ol className="space-y-2.5">
            {topSellers.map((product, index) => (
              <li key={product.id} className="flex items-center gap-3">
                <span className="tnum grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-canvas-soft text-2xs font-extrabold text-ink-500">
                  {toPersianDigits(index + 1)}
                </span>
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                  <Image
                    src={product.images[0]?.src ?? '/media/products/p0-1.svg'}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  
                      priority
                    />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-2xs font-bold text-ink-800">
                    {product.name}
                  </span>
                  <span className="tnum block text-[0.625rem] text-ink-400">
                    {toPersianDigits(product.soldCount)} فروش
                  </span>
                </span>
                <span className="tnum shrink-0 text-2xs font-bold text-ink-700">
                  {formatPrice(product.price)}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h3 className="text-sm font-extrabold text-ink-900">آخرین تغییرات محصولات</h3>
            <p className="mt-1 text-2xs text-ink-400">شش مورد آخر تغییر کرده</p>
          </div>
          <ButtonLink href="/admin/products" variant="outline" size="sm">
            مدیریت محصولات
          </ButtonLink>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-start text-xs">
            <thead>
              <tr className="border-b border-line bg-surface-muted text-2xs text-ink-400">
                <th scope="col" className="px-5 py-3 text-start font-bold">محصول</th>
                <th scope="col" className="px-3 py-3 text-start font-bold">دسته‌بندی</th>
                <th scope="col" className="px-3 py-3 text-start font-bold">قیمت</th>
                <th scope="col" className="px-3 py-3 text-start font-bold">موجودی</th>
                <th scope="col" className="px-3 py-3 text-start font-bold">وضعیت</th>
                <th scope="col" className="px-5 py-3 text-start font-bold">آخرین تغییر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {latestProducts.map((product) => {
                const category = categories.find((entry) => entry.id === product.categoryId);
                return (
                  <tr key={product.id} className="transition-colors hover:bg-surface-muted">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                          <Image
                            src={product.images[0]?.src ?? '/media/products/p0-1.svg'}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          
                              priority
                            />
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-[16rem] truncate text-xs font-bold text-ink-800">
                            {product.name}
                          </span>
                          <span className="tnum block text-[0.625rem] text-ink-400">
                            {product.sku}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-2xs text-ink-500">{category?.name ?? '—'}</td>
                    <td className="tnum px-3 py-3 text-2xs font-bold text-ink-800">
                      {formatPrice(product.price)}
                      {discountPercent(product) > 0 ? (
                        <span className="ms-1.5 text-danger-strong">
                          {toPersianDigits(discountPercent(product))}٪-
                        </span>
                      ) : null}
                    </td>
                    <td className="tnum px-3 py-3 text-2xs text-ink-600">
                      {toPersianDigits(product.stock)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={product.status} />
                    </td>
                    <td className="tnum px-5 py-3 text-2xs text-ink-400">
                      {formatShortDate(product.updatedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === 'active') return <Badge tone="success">فعال</Badge>;
  if (status === 'draft') return <Badge tone="warning">پیش‌نویس</Badge>;
  return <Badge tone="neutral">بایگانی</Badge>;
}
