import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDecimal, toPersianDigits } from '@/lib/format';

export interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
  className?: string;
  compact?: boolean;
}

export function Rating({
  value,
  reviewCount,
  size = 'sm',
  showValue = true,
  className,
  compact = false,
}: RatingProps) {
  const rounded = Math.round(value * 10) / 10;
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      aria-label={`امتیاز ${formatDecimal(rounded)} از ۵`}
    >
      <div className="flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((index) => {
          const fill = Math.max(0, Math.min(value - index + 1, 1));
          return (
            <span key={index} className={cn('relative', starSize)}>
              <Star className={cn(starSize, 'absolute inset-0 text-line-strong')} fill="currentColor" strokeWidth={0} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn(starSize, 'text-warning')} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue ? (
        <span className="tnum text-2xs font-bold text-ink-600">{formatDecimal(rounded)}</span>
      ) : null}
      {!compact && typeof reviewCount === 'number' ? (
        <span className="tnum text-2xs text-ink-400">({toPersianDigits(reviewCount)} نظر)</span>
      ) : null}
    </div>
  );
}
