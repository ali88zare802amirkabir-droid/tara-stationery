'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this would forward to an error-reporting service.
    console.error('Tara storefront error:', error);
  }, [error]);

  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl border border-danger/20 bg-danger-soft text-danger">
        <TriangleAlert className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-display-sm text-ink-900">مشکلی پیش آمد</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-ink-500">
        بخشی از فروشگاه نتوانست نمایش داده شود. می‌توانید دوباره تلاش کنید یا به صفحه اصلی بروید.
      </p>
      {error.digest ? (
        <p className="tnum mt-3 text-2xs text-ink-300">کد خطا: {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <ButtonLink
          href="/"
          size="lg"
          onClick={reset}
          leadingIcon={<RefreshCw className="h-4 w-4" aria-hidden />}
        >
          تلاش دوباره
        </ButtonLink>
        <Link
          href="/products"
          className="inline-flex h-13 items-center justify-center rounded-full border border-line-strong bg-surface px-7 text-[0.95rem] font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}
