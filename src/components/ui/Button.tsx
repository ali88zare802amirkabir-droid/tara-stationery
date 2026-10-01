import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'soft' | 'white';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-spring select-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-[0_10px_24px_-12px_rgba(52,89,206,0.9)] hover:bg-brand-600 hover:shadow-[0_16px_30px_-12px_rgba(52,89,206,0.85)]',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 shadow-card',
  outline: 'border border-line-strong bg-surface text-ink-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50',
  ghost: 'text-ink-600 hover:bg-surface-sunken hover:text-ink-900',
  danger: 'bg-danger text-white hover:bg-danger-strong shadow-[0_10px_24px_-12px_rgba(220,43,69,0.9)]',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  white: 'bg-white text-ink-900 shadow-card hover:shadow-lift',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[0.95rem]',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
});

export interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  leadingIcon,
  trailingIcon,
  ariaLabel,
  onClick,
  prefetch,
}: ButtonLinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('tel') || href.startsWith('mailto');
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
        onClick={onClick}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      prefetch={prefetch}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  );
}
