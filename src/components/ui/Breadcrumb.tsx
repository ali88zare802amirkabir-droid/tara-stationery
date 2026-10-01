import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
  showHome = true,
}: {
  items: Crumb[];
  className?: string;
  showHome?: boolean;
}) {
  const all: Crumb[] = showHome ? [{ label: 'خانه', href: '/' }, ...items] : items;

  return (
    <nav aria-label="مسیر صفحه" className={cn('min-w-0', className)}>
      <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto text-2xs text-ink-400">
        {all.map((crumb, index) => {
          const isLast = index === all.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex shrink-0 items-center gap-1">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="rounded-md px-1 py-0.5 transition-colors hover:text-brand-600"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn('rounded-md px-1 py-0.5', isLast && 'font-bold text-ink-600')}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast ? (
                <ChevronLeft className="h-3 w-3 shrink-0 text-ink-200" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
