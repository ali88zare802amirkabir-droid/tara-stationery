import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  children,
  as: Tag = 'div',
}: {
  className?: string;
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'aside' | 'li';
}) {
  return (
    <Tag
      className={cn(
        'rounded-3xl border border-line bg-surface shadow-soft transition-shadow duration-300',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="truncate text-base font-bold text-ink-900">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-ink-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'start',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
            <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-display-sm text-ink-900">{title}</h2>
        {description ? (
          <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  tone = 'canvas',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'canvas' | 'white' | 'soft';
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-14 sm:py-16 lg:py-20',
        tone === 'white' && 'bg-surface',
        tone === 'soft' && 'bg-canvas-soft',
        className,
      )}
    >
      <div className="shell">{children}</div>
    </section>
  );
}
