import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-line bg-surface p-3 shadow-soft">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="mt-4 h-3 w-1/3" />
      <Skeleton className="mt-2.5 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-4/5" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-line-strong bg-surface-muted px-6 py-14 text-center',
        className,
      )}
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-brand-500 shadow-soft">
        {icon}
      </div>
      <h3 className="mt-5 text-base font-extrabold text-ink-900">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-400">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'خطایی رخ داد',
  description = 'بارگذاری این بخش با مشکل مواجه شد. لطفاً دوباره تلاش کنید.',
  onRetry,
  action,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-danger/20 bg-danger-soft/40 px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-danger">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-extrabold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-500">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-danger px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-danger-strong"
        >
          تلاش دوباره
        </button>
      ) : action}
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onChange,
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const pages: (number | 'gap')[] = [];
  for (let index = 1; index <= pageCount; index += 1) {
    if (index === 1 || index === pageCount || Math.abs(index - page) <= 1) {
      pages.push(index);
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap');
    }
  }

  return (
    <nav className={cn('flex items-center justify-center gap-1.5', className)} aria-label="صفحه‌بندی">
      <button
        type="button"
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        aria-label="صفحه قبل"
        className="h-10 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:pointer-events-none disabled:opacity-40"
      >
        قبلی
      </button>
      {pages.map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-ink-400">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              'tnum h-10 min-w-10 rounded-xl px-3 text-xs font-bold transition-colors',
              entry === page
                ? 'bg-brand-600 text-white shadow-[0_8px_18px_-10px_rgba(52,89,206,0.9)]'
                : 'border border-line bg-surface text-ink-600 hover:border-brand-300 hover:text-brand-700',
            )}
          >
            {toPersianDigits(entry)}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(page + 1, pageCount))}
        disabled={page === pageCount}
        aria-label="صفحه بعد"
        className="h-10 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:pointer-events-none disabled:opacity-40"
      >
        بعدی
      </button>
    </nav>
  );
}
