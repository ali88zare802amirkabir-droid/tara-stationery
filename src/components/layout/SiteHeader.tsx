'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Headphones,
  Heart,
  LayoutDashboard,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import { Logo } from './Logo';
import { SearchBox } from './SearchBox';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileMenu } from './MobileMenu';
import { Tooltip } from '@/components/ui/Disclosure';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { useCartCount } from '@/hooks/useCatalog';
import { useIsMounted } from '@/hooks/useIsMounted';
import { toPersianDigits, latinDigits } from '@/lib/format';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'خانه', href: '/' },
  { label: 'محصولات', href: '/products' },
  { label: 'دسته‌بندی‌ها', href: '/categories' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس با ما', href: '/contact' },
];

export function AnnouncementBar() {
  const announcement = useCatalogStore((state) => state.settings.announcement);
  const enabled = useCatalogStore((state) => state.settings.announcementEnabled);
  if (!enabled || !announcement) return null;

  return (
    <div className="relative overflow-hidden bg-ink-900 text-white">
      <div className="dot-grid absolute inset-0 opacity-30" aria-hidden />
      <div className="shell relative flex h-9 items-center justify-center gap-2 text-2xs font-semibold">
        <Truck className="h-3.5 w-3.5 shrink-0 text-brand-300" aria-hidden />
        <span className="truncate text-center">{announcement}</span>
      </div>
    </div>
  );
}

function CountBadge({ value }: { value: number }) {
  return (
    <span className="tnum absolute -top-0.5 -end-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-brand-500 px-1 text-[0.625rem] font-extrabold text-white ring-2 ring-surface">
      {toPersianDigits(value > 99 ? 99 : value)}
    </span>
  );
}

function ActionButton({
  href,
  label,
  icon: Icon,
  count,
}: {
  href: string;
  label: string;
  icon: typeof Heart;
  count?: number;
}) {
  return (
    <Tooltip content={label} side="bottom">
      <Link
        href={href}
        aria-label={count ? `${label} (${toPersianDigits(count)} مورد)` : label}
        className="relative grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface-sunken hover:text-brand-700"
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
        {typeof count === 'number' && count > 0 ? <CountBadge value={count} /> : null}
      </Link>
    </Tooltip>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const setSheet = useUIStore((state) => state.openSheet);
  const cartCount = useCartCount();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const settings = useCatalogStore((state) => state.settings);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-line bg-surface/88 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-surface/70 backdrop-blur-md',
        )}
      >
        <div className="shell">
          <div className="flex h-[4.25rem] items-center gap-3 lg:h-18">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="باز کردن منوی اصلی"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-600 transition-colors hover:bg-surface-sunken lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>

            <Logo className="shrink-0" />

            <nav aria-label="منوی اصلی" className="hidden lg:flex lg:items-center lg:gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-xs font-bold transition-colors',
                    isActive(item.href)
                      ? 'text-brand-700'
                      : 'text-ink-600 hover:bg-surface-sunken hover:text-ink-900',
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                    />
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="mx-auto hidden min-w-0 max-w-md flex-1 xl:block">
              <SearchBox />
            </div>

            <div className="ms-auto flex items-center gap-0.5 lg:ms-0">
              <button
                type="button"
                onClick={() => setMobileSearch((value) => !value)}
                aria-label="جستجو"
                aria-expanded={mobileSearch}
                className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface-sunken hover:text-brand-700 xl:hidden"
              >
                {mobileSearch ? (
                  <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                ) : (
                  <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
                )}
              </button>

              <span className="hidden lg:inline-flex">
                <ActionButton href="/wishlist" label="علاقه‌مندی‌ها" icon={Heart} count={mounted ? wishlistCount : 0} />
              </span>

              <Tooltip content="سبد خرید" side="bottom">
                <button
                  type="button"
                  onClick={() => setSheet('cart')}
                  aria-label={mounted && cartCount > 0 ? `سبد خرید (${cartCount} کالا)` : 'سبد خرید'}
                  className="relative grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface-sunken hover:text-brand-700"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                  {mounted && cartCount > 0 ? <CountBadge value={cartCount} /> : null}
                </button>
              </Tooltip>

              <Tooltip content="پنل مدیریت" side="bottom">
                <Link
                  href="/admin"
                  aria-label="پنل مدیریت"
                  className="hidden h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-surface-sunken hover:text-brand-700 sm:grid"
                >
                  <LayoutDashboard className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                </Link>
              </Tooltip>
            </div>
          </div>

          {mobileSearch ? (
            <div className="pb-3 lg:hidden">
              <SearchBox variant="page" autoFocus onNavigate={() => setMobileSearch(false)} />
            </div>
          ) : null}
        </div>

        <div className="hidden border-t border-line bg-surface-muted lg:block">
          <div className="shell flex h-10 items-center justify-between gap-4 text-2xs text-ink-400">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                پشتیبانی: شنبه تا پنجشنبه ۹ تا ۱۹
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                ارسال به سراسر ایران
              </span>
            </div>
            <a
              href={`tel:${latinDigits(settings.phone)}`}
              className="flex items-center gap-1.5 font-bold text-ink-600 transition-colors hover:text-brand-700"
            >
              <Phone className="h-3.5 w-3.5 text-brand-500" aria-hidden />
              {settings.phone}
            </a>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
    </>
  );
}
