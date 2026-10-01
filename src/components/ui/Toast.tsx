'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';

const icons = {
  success: CheckCircle2,
  danger: XCircle,
  info: Info,
  warning: TriangleAlert,
};

const tones = {
  success: 'border-success/25 bg-success-soft text-success-strong',
  danger: 'border-danger/25 bg-danger-soft text-danger-strong',
  info: 'border-info/25 bg-info-soft text-info',
  warning: 'border-warning/25 bg-warning-soft text-warning-strong',
};

export function ToastViewport() {
  const toasts = useUIStore((state) => state.toasts);
  const dismiss = useUIStore((state) => state.dismissToast);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:end-5 sm:bottom-5 sm:items-end"
      role="region"
      aria-label="اعلان‌ها"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lift backdrop-blur',
                tones[toast.variant],
              )}
            >
              <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-0.5 text-2xs leading-relaxed opacity-80">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={`بستن اعلان ${toasts.indexOf(toast) + 1} از ${toPersianDigits(toasts.length)}`}
                className="-me-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
