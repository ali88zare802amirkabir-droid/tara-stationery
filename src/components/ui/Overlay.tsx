'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useIsMounted } from '@/hooks/useIsMounted';

interface BaseProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

export function Modal({ open, onClose, title, description, children, className }: BaseProps) {
  const mounted = useIsMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('button, [href], input')?.focus();
    }, 60);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/35 backdrop-blur-[3px]"
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-4xl border border-line bg-surface p-5 shadow-panel sm:rounded-4xl sm:p-6',
              className,
            )}
          >
            {(title || description) && (
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  {title ? <h2 className="text-lg font-extrabold text-ink-900">{title}</h2> : null}
                  {description ? (
                    <p className="mt-1 text-xs leading-relaxed text-ink-400">{description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="بستن"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-surface-sunken hover:text-ink-700"
                >
                  <X className="h-4.5 w-4.5" aria-hidden />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: 'start' | 'end' | 'bottom';
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  hideHeader?: boolean;
}

export function Drawer({
  open,
  onClose,
  title,
  side = 'end',
  children,
  className,
  footer,
  hideHeader = false,
}: DrawerProps) {
  const mounted = useIsMounted();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const sideClasses =
    side === 'bottom'
      ? 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-4xl'
      : side === 'start'
        ? 'inset-y-0 start-0 w-[min(22rem,88vw)] rounded-e-4xl'
        : 'inset-y-0 end-0 w-[min(26rem,92vw)] rounded-s-4xl';

  const offsets =
    side === 'bottom' ? { y: '100%', x: 0 } : side === 'start' ? { x: '-100%', y: 0 } : { x: '100%', y: 0 };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/30 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : 'پنل'}
            initial={offsets}
            animate={{ x: 0, y: 0 }}
            exit={offsets}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className={cn(
              'absolute flex flex-col overflow-hidden border-line bg-surface shadow-panel',
              sideClasses,
              className,
            )}
          >
            {!hideHeader && (
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                <h2 className="text-sm font-extrabold text-ink-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="بستن پنل"
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-surface-sunken hover:text-ink-700"
                >
                  <X className="h-4.5 w-4.5" aria-hidden />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer ? <div className="border-t border-line bg-surface-muted px-5 py-4">{footer}</div> : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
