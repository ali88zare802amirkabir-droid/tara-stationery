'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { BottomNav } from './BottomNav';

/**
 * Route-group shell: the storefront chrome wraps every non-admin page. The
 * admin section ships its own sidebar shell, so it opts out of this one.
 */
export function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-dvh bg-canvas">{children}</main>;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[110] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
      >
        رفتن به محتوای اصلی
      </a>
      <SiteHeader />
      <main id="main" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  );
}
