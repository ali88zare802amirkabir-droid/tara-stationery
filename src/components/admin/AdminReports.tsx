'use client';

import { useMemo } from 'react';
import { BarChart3, Boxes, Percent, TrendingUp, Wallet } from 'lucide-react';
import { AreaChart, BarChart, DonutChart, ProgressBar, formatRevenue } from './Charts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { salesSeries, trafficSeries } from '@/data/analytics';
import { discountPercent, useCatalogStore } from '@/store/catalogStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, toPersianDigits } from '@/lib/format';

const DONUT_COLORS = ['#4A73E8', '#17A186', '#7C4DE8', '#D08A1E', '#E5306A', '#2F8AD6', '#5A6B87', '#C2740B'];

export function AdminReports() {
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const cartItems = useCartStore((state) => state.items);

  const analytics = useMemo(() => {
    const active = products.filter((product) => product.status === 'active');
    const inventoryValue = active.reduce((sum, p) => sum + p.price * p.stock, 0);
    const potentialRevenue = active.reduce((sum, p) => sum + p.price * p.soldCount, 0);
    const discounted = active.filter((product) => discountPercent(product) > 0);
    const averageDiscount =
      discounted.length > 0
        ? Math.round(
            discounted.reduce((sum, p) => sum + discountPercent(p), 0) / discounted.length,
          )
        : 0;
    const averagePrice =
      active.length > 0 ? Math.round(active.reduce((sum, p) => sum + p.price, 0) / active.length) : 0;
    const cartValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalUnitsSold = active.reduce((sum, p) => sum + p.soldCount, 0);

    return {
      inventoryValue,
      potentialRevenue,
      averageDiscount,
      averagePrice,
      cartValue,
      totalUnitsSold,
      discountedCount: discounted.length,
      activeCount: active.length,
    };
  }, [products, cartItems]);

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

  const brandRevenue = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      if (product.status !== 'active') continue;
      map.set(product.brand, (map.get(product.brand) ?? 0) + product.price * product.soldCount);
    }
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  const topCategories = useMemo(
    () =>
      categories
        .map((category) => ({
          label: category.name,
          value: products
            .filter((product) => product.categoryId === category.id && product.status === 'active')
            .reduce((sum, product) => sum + product.soldCount, 0),
        }))
        .filter((entry) => entry.value > 0)
        .sort((a, b) => b.value - a.value),
    [categories, products],
  );

  const bestMonth = useMemo(
    () => salesSeries.reduce((best, point) => (point.revenue > best.revenue ? point : best), salesSeries[0]),
    [],
  );

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-display-sm text-ink-900">گزارش‌ها و تحلیل</h2>
        <p className="mt-2 text-sm text-ink-500">
          ارزش موجودی و آمار فروش مستقیماً از وضعیت واقعی فروشگاه محاسبه می‌شود؛ داده‌های نمودارها
          نمایشی‌اند.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'ارزش موجودی انبار',
            value: `${formatPrice(analytics.inventoryValue)} تومان`,
            hint: `${toPersianDigits(analytics.activeCount)} کالای فعال`,
            icon: Boxes,
          },
          {
            label: 'درآمد تجمعی نمایشی',
            value: `${formatPrice(analytics.potentialRevenue)} تومان`,
            hint: `${toPersianDigits(analytics.totalUnitsSold)} فروش ثبت‌شده`,
            icon: Wallet,
          },
          {
            label: 'میانگین قیمت کالا',
            value: `${formatPrice(analytics.averagePrice)} تومان`,
            hint: `${toPersianDigits(analytics.discountedCount)} کالای دارای تخفیف`,
            icon: Percent,
          },
          {
            label: 'بهترین ماه فروش',
            value: bestMonth.label,
            hint: `${formatRevenue(bestMonth.revenue)} فروش`,
            icon: TrendingUp,
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <stat.icon className="h-4.5 w-4.5" aria-hidden />
            </span>
            <p className="mt-3.5 text-2xs text-ink-400">{stat.label}</p>
            <p className="tnum mt-1 text-lg font-extrabold text-ink-900">{stat.value}</p>
            <p className="mt-1 text-2xs text-ink-400">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-ink-900">روند فروش سالانه</h3>
          <Badge tone="info">۱۲ ماه گذشته</Badge>
        </div>
        <AreaChart
          data={salesSeries.map((point) => ({
            label: point.label,
            value: point.revenue,
            secondary: point.orders,
          }))}
          valueFormat={formatRevenue}
          height={300}
        />
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-extrabold text-ink-900">فروش بر اساس برند</h3>
          <p className="mt-1 text-2xs text-ink-400">مجموع ارزش فروش تجمعی هر برند (تومان)</p>
          <div className="mt-5">
            <BarChart
              data={brandRevenue.slice(0, 8)}
              valueFormat={formatRevenue}
              height={240}
              accent="brand"
            />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-extrabold text-ink-900">پرفروش‌ترین دسته‌ها</h3>
          <p className="mt-1 text-2xs text-ink-400">تعداد فروش ثبت‌شده در هر دسته</p>
          <div className="mt-5">
            <BarChart
              data={topCategories.slice(0, 8)}
              valueFormat={(value) => `${toPersianDigits(value)} فروش`}
              height={240}
              accent="accent"
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <h3 className="text-sm font-extrabold text-ink-900">بازدید هفته</h3>
          <p className="mt-1 text-2xs text-ink-400">توزیع بازدید در طول هفته</p>
          <div className="mt-5">
            <BarChart data={trafficSeries} accent="mint" height={220} />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-extrabold text-ink-900">سهم دسته‌بندی‌ها</h3>
          <p className="mt-1 text-2xs text-ink-400">نسبت محصولات فعال</p>
          <div className="mt-5">
            <DonutChart
              data={categoryDistribution}
              centerLabel="کالای فعال"
              centerValue={toPersianDigits(analytics.activeCount)}
              size={180}
            />
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-extrabold text-ink-900">شاخص‌های کلیدی فروشگاه</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <ProgressBar
            value={analytics.discountedCount}
            max={analytics.activeCount}
            tone="brand"
            label="سهم کالاهای دارای تخفیف"
          />
          <ProgressBar
            value={Math.min(100, Math.round((analytics.cartValue / Math.max(analytics.inventoryValue, 1)) * 100))}
            tone="success"
            label="نسبت ارزش سبد به موجودی"
          />
          <ProgressBar
            value={Math.min(100, Math.round((analytics.averageDiscount / 50) * 100))}
            tone="warning"
            label="شدت میانگین تخفیف"
          />
          <ProgressBar
            value={Math.min(100, Math.round((products.filter((p) => p.featured).length / Math.max(analytics.activeCount, 1)) * 100))}
            tone="accent"
            label="پوشش محصولات ویژه"
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-surface-muted px-5 py-4">
        <BarChart3 className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
        <p className="flex-1 text-2xs leading-5 text-ink-500">
          برای تولید گزارش‌های واقعی، کافی است همین کامپوننت‌ها به داده‌های API متصل شوند؛ ساختار
          نمودارها و جدول‌ها بدون تغییر اساسی باقی می‌ماند.
        </p>
      </div>
    </div>
  );
}
