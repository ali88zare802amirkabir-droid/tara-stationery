'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Overlay';
import { Logo } from '@/components/layout/Logo';
import { useCatalogStore } from '@/store/catalogStore';
import { toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
  exact?: boolean;
}

export const adminNav: AdminNavItem[] = [
  {
    href: '/admin',
    label: 'داشبورد',
    icon: LayoutDashboard,
    description: 'نمای کلی فروشگاه',
    exact: true,
  },
  { href: '/admin/products', label: 'محصولات', icon: Package, description: 'مدیریت کالاها' },
  {
    href: '/admin/products/new',
    label: 'افزودن محصول',
    icon: Star,
    description: 'ثبت کالای جدید',
  },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree, description: 'ساختار فروشگاه' },
  { href: '/admin/banners', label: 'بنرها', icon: ImageIcon, description: 'اسلایدر صفحه اصلی' },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingCart, description: 'سفارش‌های نمایشی' },
  { href: '/admin/customers', label: 'مشتریان', icon: Users, description: 'فهرست مشتریان' },
  { href: '/admin/reports', label: 'گزارش‌ها', icon: BarChart3, description: 'آمار و تحلیل' },
  { href: '/admin/settings', label: 'تنظیمات', icon: Settings, description: 'تنظیمات فروشگاه' },
];

function isActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (item.href === '/admin/products') return pathname.startsWith('/admin/products');
  return pathname === item.href;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const banners = useCatalogStore((state) => state.banners);

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= product.lowStockThreshold,
  ).length;

  const counts: Record<string, number> = {
    '/admin/products': products.length,
    '/admin/categories': categories.length,
    '/admin/banners': banners.length,
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <Logo size="sm" />
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="بستن منو"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-surface-sunken lg:hidden"
          >
            <X className="h-4.5 w-4.5" aria-hidden />
          </button>
        ) : null}
      </div>

      <nav aria-label="منوی پنل مدیریت" className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-3 text-2xs font-bold text-ink-400">مدیریت فروشگاه</p>
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const active = isActive(pathname, item);
            const count = counts[item.href];
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
                    active ? 'text-white' : 'text-ink-600 hover:bg-surface-sunken',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="absolute inset-0 rounded-2xl bg-brand-600 shadow-[0_10px_24px_-14px_rgba(52,89,206,0.9)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  ) : null}
                  <item.icon
                    className={cn(
                      'relative h-4.5 w-4.5 shrink-0 transition-colors',
                      active ? 'text-white' : 'text-ink-400 group-hover:text-brand-600',
                    )}
                    strokeWidth={1.9}
                    aria-hidden
                  />
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold">{item.label}</span>
                    <span
                      className={cn(
                        'mt-0.5 block truncate text-2xs',
                        active ? 'text-white/70' : 'text-ink-400',
                      )}
                    >
                      {item.description}
                    </span>
                  </span>
                  {typeof count === 'number' ? (
                    <span
                      className={cn(
                        'tnum relative shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-extrabold',
                        active ? 'bg-white/20 text-white' : 'bg-surface-sunken text-ink-400',
                      )}
                    >
                      {toPersianDigits(count)}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {lowStock > 0 ? (
          <div className="mt-5 rounded-2xl border border-warning/25 bg-warning-soft p-4">
            <p className="flex items-center gap-2 text-2xs font-extrabold text-warning-strong">
              <Truck className="h-3.5 w-3.5" aria-hidden />
              هشدار موجودی
            </p>
            <p className="tnum mt-1.5 text-2xs leading-5 text-warning-strong/85">
              {toPersianDigits(lowStock)} کالا موجودی کمی دارد و نیاز به بررسی دارد.
            </p>
            <Link
              href="/admin/products?stock=low"
              onClick={onNavigate}
              className="mt-2.5 inline-block text-2xs font-extrabold text-warning-strong underline-offset-4 hover:underline"
            >
              مشاهده کالاهای کم‌موجودی
            </Link>
          </div>
        ) : null}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-ink-500 transition-colors hover:bg-surface-sunken hover:text-ink-800"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-canvas">
            <Package className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold">مشاهده فروشگاه</span>
            <span className="block truncate text-2xs text-ink-400">بازگشت به سایت</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-s border-line lg:block">
      <div className="sticky top-0 h-dvh">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function AdminMobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} side="start" hideHeader>
      <SidebarContent onNavigate={onClose} />
    </Drawer>
  );
}
