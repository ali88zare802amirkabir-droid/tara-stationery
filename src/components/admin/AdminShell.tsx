'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Menu, Search, ShieldAlert } from 'lucide-react';
import { AdminMobileNav } from './AdminSidebar';
import { Input } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Badge';
import { useCatalogStore } from '@/store/catalogStore';
import { useCartCount } from '@/hooks/useCatalog';
import { useIsMounted } from '@/hooks/useIsMounted';
import { toPersianDigits } from '@/lib/format';
import { adminNav } from './AdminSidebar';
import { cn } from '@/lib/utils';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'داشبورد', subtitle: 'نمای کلی وضعیت فروشگاه' },
  '/admin/products': { title: 'مدیریت محصولات', subtitle: 'افزودن، ویرایش و حذف کالاها' },
  '/admin/products/new': { title: 'افزودن محصول', subtitle: 'ثبت کالای جدید در فروشگاه' },
  '/admin/categories': { title: 'دسته‌بندی‌ها', subtitle: 'ساختار و محتوای دسته‌ها' },
  '/admin/banners': { title: 'بنرها و اسلایدر', subtitle: 'مدیریت بنرهای صفحه اصلی' },
  '/admin/orders': { title: 'سفارش‌ها', subtitle: 'سفارش‌های نمایشی فروشگاه' },
  '/admin/customers': { title: 'مشتریان', subtitle: 'فهرست و سطح مشتریان' },
  '/admin/reports': { title: 'گزارش‌ها', subtitle: 'آمار فروش و موجودی' },
  '/admin/settings': { title: 'تنظیمات فروشگاه', subtitle: 'اطلاعات تماس و قواعد سفارش' },
};

function currentTitle(pathname: string) {
  if (pathname.startsWith('/admin/products/') && pathname.endsWith('/edit')) {
    return { title: 'ویرایش محصول', subtitle: 'ویرایش اطلاعات کالای موجود' };
  }
  if (pathname.startsWith('/admin/')) {
    const base = `/admin/${pathname.split('/')[2] ?? ''}`;
    return pageMeta[base] ?? pageMeta['/admin'];
  }
  return pageMeta['/admin'];
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const settings = useCatalogStore((state) => state.settings);
  const cartCount = useCartCount();
  const meta = currentTitle(pathname);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[110] focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
      >
        رفتن به محتوای اصلی
      </a>

      <AdminMobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-surface/92 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="باز کردن منوی پنل مدیریت"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-surface-sunken lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-extrabold text-ink-900 sm:text-base">
                {meta.title}
              </h1>
              <p className="truncate text-2xs text-ink-400">{meta.subtitle}</p>
            </div>

            <form
              role="search"
              action="/admin/products"
              className="hidden md:block"
            >
              <Input
                type="search"
                name="q"
                placeholder="جستجوی سریع محصول…"
                aria-label="جستجوی سریع در پنل مدیریت"
                leadingIcon={<Search className="h-4 w-4" aria-hidden />}
                containerClassName="w-56"
              />
            </form>

            <Link
              href="/"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line px-3 text-2xs font-bold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">مشاهده فروشگاه</span>
            </Link>

            <div className="flex items-center gap-2.5 border-s border-line ps-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-2xs font-extrabold text-white">
                مد
              </span>
              <span className="hidden leading-tight md:block">
                <span className="block text-2xs font-bold text-ink-800">مدیر فروشگاه</span>
                <span className="block text-[0.625rem] text-ink-400">
                  {mounted && cartCount > 0 ? `${toPersianDigits(cartCount)} کالا در سبد` : 'نسخه نمایشی'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-t border-line px-4 py-1.5 no-scrollbar sm:px-6 lg:hidden">
            {adminNav.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-2xs font-bold transition-colors',
                  pathname === item.href
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-sunken text-ink-500 hover:text-ink-800',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        {settings.maintainanceMode ? (
          <div className="flex items-center gap-2.5 border-b border-warning/25 bg-warning-soft px-4 py-2.5 text-2xs font-bold text-warning-strong sm:px-6">
            <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
            حالت تعمیرات فعال است — فروشگاه عمومی موقتاً در دسترس نیست. این وضعیت فقط در مرورگر
            شما ذخیره می‌شود.
          </div>
        ) : null}

        <main id="admin-main" className="min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>

        <footer className="border-t border-line px-4 py-4 text-2xs text-ink-400 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>
              پنل مدیریت نمایشی {settings.storeName} — تمام تغییرات فقط در مرورگر شما ذخیره
              می‌شود.
            </p>
            <div className="flex items-center gap-2">
              <Badge tone="info">بدون بک‌اند</Badge>
              <Badge tone="neutral">بدون درگاه پرداخت</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
