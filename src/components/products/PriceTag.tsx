import { cn } from '@/lib/utils';
import { discountPercent } from '@/store/catalogStore';
import { formatPrice, toPersianDigits } from '@/lib/format';
import type { Product } from '@/types';

export interface PriceTagProps {
  product: Pick<Product, 'price' | 'comparePrice'>;
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'end';
  className?: string;
  showUnit?: boolean;
}

export function PriceTag({ product, size = 'md', align = 'start', className, showUnit = true }: PriceTagProps) {
  const discount = discountPercent(product as Product);
  const sizes = {
    sm: { current: 'text-sm', old: 'text-2xs', badge: 'text-[0.625rem] px-1.5 py-0.5' },
    md: { current: 'text-lg', old: 'text-xs', badge: 'text-2xs px-2 py-0.5' },
    lg: { current: 'text-3xl', old: 'text-sm', badge: 'text-xs px-2.5 py-1' },
  }[size];

  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline gap-x-2 gap-y-1',
        align === 'end' && 'justify-end',
        className,
      )}
    >
      <span className={cn('tnum font-extrabold leading-none text-ink-900', sizes.current)}>
        {formatPrice(product.price)}
      </span>
      {showUnit ? <span className="text-2xs font-medium text-ink-400">تومان</span> : null}
      {product.comparePrice && product.comparePrice > product.price ? (
        <>
          <span className={cn('tnum font-medium text-ink-400 line-through', sizes.old)}>
            {formatPrice(product.comparePrice)}
          </span>
          <span
            className={cn(
              'tnum rounded-full bg-danger-soft font-extrabold text-danger-strong',
              sizes.badge,
            )}
          >
            {toPersianDigits(discount)}٪ تخفیف
          </span>
        </>
      ) : null}
    </div>
  );
}
