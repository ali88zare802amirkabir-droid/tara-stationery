import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' | 'blush';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  success: 'bg-success-soft text-success-strong ring-success/15',
  warning: 'bg-warning-soft text-warning-strong ring-warning/20',
  danger: 'bg-danger-soft text-danger-strong ring-danger/15',
  info: 'bg-info-soft text-info ring-info/15',
  neutral: 'bg-surface-sunken text-ink-500 ring-line',
  accent: 'bg-accent-soft text-accent ring-accent/15',
  blush: 'bg-blush-soft text-blush ring-blush/15',
};

export interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ tone = 'neutral', children, className, icon, size = 'md' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-2xs',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export interface StockBadgeProps {
  stock: number;
  threshold: number;
  className?: string;
}

export function StockBadge({ stock, threshold, className }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <Badge tone="neutral" className={className}>
        ناموجود
      </Badge>
    );
  }
  if (stock <= threshold) {
    return (
      <Badge tone="warning" className={className}>
        تنها {formatNumber(stock)} عدد باقی مانده
      </Badge>
    );
  }
  return (
    <Badge tone="success" className={className}>
      موجود در انبار
    </Badge>
  );
}
