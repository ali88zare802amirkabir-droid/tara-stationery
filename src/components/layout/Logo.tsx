'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  variant = 'default',
  size = 'md',
  showName = true,
  className,
}: {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}) {
  const marks = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }[size];
  const names = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }[size];

  return (
    <Link
      href="/"
      aria-label="تارا — صفحه اصلی"
      className={cn('group inline-flex items-center gap-2.5 outline-none', className)}
    >
      <span
        className={cn(
          'relative grid place-items-center rounded-2xl transition-transform duration-300 ease-spring group-hover:-rotate-6',
          marks,
          variant === 'light' ? 'bg-white/12 ring-1 ring-white/25' : 'bg-brand-500',
        )}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-2/3 w-2/3" fill="none">
          <path
            d="M9 5.5h7.5L23 12v14.5H9z"
            fill="white"
            fillOpacity="0.95"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M16.5 5.5V12H23" stroke="#4A73E8" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M5.5 9.5v14.8A2.2 2.2 0 0 0 7.7 26.5H17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12.5 15.5h6M12.5 19h4" stroke="#4A73E8" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      {showName ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-extrabold tracking-tight',
              names,
              variant === 'light' ? 'text-white' : 'text-ink-900',
            )}
          >
            تارا
          </span>
          <span
            className={cn(
              'mt-1 text-[0.6rem] font-semibold',
              variant === 'light' ? 'text-white/60' : 'text-ink-300',
            )}
          >
            لوازم‌التحریر حرفه‌ای
          </span>
        </span>
      ) : null}
    </Link>
  );
}
