'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Heart, LayoutDashboard, LogIn, Phone, ShoppingBag, X } from 'lucide-react';
import { Drawer } from '@/components/ui/Overlay';
import { Logo } from './Logo';
import { useCatalogStore } from '@/store/catalogStore';
import { useActiveCategories, useCartCount, useCartSubtotal } from '@/hooks/useCatalog';
import { useWishlistStore } from '@/store/wishlistStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { formatPrice, latinDigits, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'خانه', href: '/', description: 'صفحه اصلی فروشگاه' },
  { label: 'محصولات', href: '/products', description: 'همه کالاها با فیلتر و مرتب‌سازی' },
  { label: 'دسته‌بندی‌ها', href: '/categories', description: 'دسته‌بندی محصولات تارا' },
  { label: 'علاقه‌مندی‌ها', href: '/wishlist', description: 'محصولات ذخیره‌شده شما' },
  { label: 'سبد خرید', href: '/cart', description: 'مشاهده و مدیریت سبد خرید' },
  { label: 'درباره ما', href: '/about', description: 'داستان و ارزش‌های تارا' },
  { label: 'تماس با ما', href: '/contact', description: 'راه‌های ارتباط با فروشگاه' },
  { label: 'پنل مدیریت', href: '/admin', description: 'مدیریت محصولات و سفارش‌ها' },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const categories = useActiveCategories();
  const settings = useCatalogStore((state) => state.settings);
  const cartCount = useCartCount();
  const cartSubtotal = useCartSubtotal();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <Drawer open={open} onClose={onClose} side="start" hideHeader>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-surface-sunken hover:text-ink-700"
          >
            <X className="h-4.5 w-4.5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav aria-label="منوی موبایل" className="p-4">
            <ul className="space-y-1">
              {LINKS.map((link) => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-2xl px-3.5 py-3 transition-colors',
                        active ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface-sunken',
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">{link.label}</span>
                        <span className="mt-0.5 block truncate text-2xs text-ink-400">
                          {link.description}
                        </span>
                      </span>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-ink-300" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <p className="mb-2.5 px-1 text-2xs font-bold text-ink-400">دسته‌بندی‌های پرطرفدار</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={onClose}
                    className="rounded-full border border-line bg-surface-muted px-3 py-1.5 text-2xs font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="space-y-2 border-t border-line bg-surface-muted p-4">
          <div className="flex gap-2">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface py-2.5 text-2xs font-bold text-ink-700 transition-colors hover:border-brand-300"
            >
              <Heart className="h-4 w-4 text-blush" aria-hidden />
              علاقه‌مندی
              {mounted && wishlistCount > 0 ? (
                <span className="tnum rounded-full bg-blush-soft px-1.5 text-[0.625rem] text-blush">
                  {toPersianDigits(wishlistCount)}
                </span>
              ) : null}
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-2.5 text-2xs font-bold text-white transition-colors hover:bg-brand-600"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              سبد خرید
              {mounted && cartCount > 0 ? (
                <span className="tnum rounded-full bg-white/20 px-1.5 text-[0.625rem]">
                  {toPersianDigits(cartCount)}
                </span>
              ) : null}
            </Link>
          </div>
          {mounted && cartCount > 0 ? (
            <p className="tnum text-center text-2xs text-ink-400">
              مجموع سبد: {formatPrice(cartSubtotal)} تومان
            </p>
          ) : null}
          <a
            href={`tel:${latinDigits(settings.phone)}`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-2.5 text-2xs font-bold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Phone className="h-4 w-4 text-brand-500" aria-hidden />
            تماس با پشتیبانی
          </a>
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-2.5 text-2xs font-bold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <LayoutDashboard className="h-4 w-4 text-brand-500" aria-hidden />
            ورود به پنل مدیریت
          </Link>
          <p className="flex items-center justify-center gap-1.5 pt-1 text-2xs text-ink-300">
            <LogIn className="h-3 w-3" aria-hidden />
            نسخه نمایشی — بدون ورود به حساب
          </p>
        </div>
      </div>
    </Drawer>
  );
}
