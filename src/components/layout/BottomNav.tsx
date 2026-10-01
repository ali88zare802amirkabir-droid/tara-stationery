'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react';
import { useCartCount } from '@/hooks/useCatalog';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const setSheet = useUIStore((state) => state.openSheet);
  const cartCount = useCartCount();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const items = [
    { label: 'خانه', href: '/', icon: Home, match: (p: string) => p === '/' },
    { label: 'محصولات', href: '/products', icon: LayoutGrid, match: (p: string) => p.startsWith('/products') || p.startsWith('/categories') },
    { label: 'جستجو', href: '/search', icon: Search, match: (p: string) => p.startsWith('/search') },
    { label: 'علاقه‌مندی', href: '/wishlist', icon: Heart, match: (p: string) => p.startsWith('/wishlist'), count: wishlistCount },
  ];

  return (
    <nav
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/94 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 py-2.5 text-[0.625rem] font-bold transition-colors',
                  active ? 'text-brand-600' : 'text-ink-400',
                )}
              >
                <span className="relative">
                  <item.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.9} aria-hidden />
                  {mounted && typeof item.count === 'number' && item.count > 0 ? (
                    <span className="tnum absolute -top-1 -end-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush px-1 text-[0.5rem] font-extrabold text-white">
                      {toPersianDigits(item.count)}
                    </span>
                  ) : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={() => setSheet('cart')}
            aria-label="سبد خرید"
            className="relative flex w-full flex-col items-center gap-1 py-2.5 text-[0.625rem] font-bold text-ink-400 transition-colors"
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.9} aria-hidden />
              {mounted && cartCount > 0 ? (
                <span className="tnum absolute -top-1 -end-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[0.5rem] font-extrabold text-white">
                  {toPersianDigits(cartCount)}
                </span>
              ) : null}
            </span>
            سبد خرید
          </button>
        </li>
      </ul>
    </nav>
  );
}
