'use client';

import { useState } from 'react';
import { CheckCircle2, ClipboardList, Copy, Info, X } from 'lucide-react';
import { Modal } from '@/components/ui/Overlay';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { formatPrice, toPersianDigits } from '@/lib/format';

export interface OrderResult {
  reference: string;
  total: number;
  count: number;
}

interface OrderRequestModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  count: number;
}

/**
 * Frontend-only order request. It deliberately collects no card data and calls
 * no payment gateway — it just confirms the request locally and empties the cart.
 */
export function OrderRequestModal({ open, onClose, total, count }: OrderRequestModalProps) {
  const [result, setResult] = useState<OrderResult | null>(null);
  const clear = useCartStore((state) => state.clear);
  const pushToast = useUIStore((state) => state.pushToast);
  const settings = useCatalogStore((state) => state.settings);

  const submit = () => {
    const reference = `TRA-${toPersianDigits(Math.floor(Math.random() * 9000) + 1000)}`;
    setResult({ reference, total, count });
    clear();
    pushToast({
      title: 'درخواست سفارش ثبت شد',
      description: `شماره پیگیری ${reference}`,
      variant: 'success',
    });
  };

  const close = () => {
    onClose();
    if (result) setResult(null);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={result ? 'درخواست شما ثبت شد' : 'ثبت درخواست سفارش'}
      description={
        result
          ? undefined
          : 'این یک فرم نمایشی است. هیچ اطلاعات کارت بانکی دریافت نمی‌شود و تراکنش واقعی انجام نمی‌شود.'
      }
    >
      {result ? (
        <div className="flex flex-col items-start gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success-strong">
            <CheckCircle2 className="h-6 w-6" aria-hidden />
          </span>
          <p className="text-sm leading-7 text-ink-600">
            درخواست شما با موفقیت ثبت شد. در نسخه واقعی، اینجا کد رهگیری برای شما پیامک می‌شود.
          </p>

          <dl className="w-full space-y-2.5 rounded-2xl border border-line bg-surface-muted p-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-ink-500">شماره پیگیری</dt>
              <dd className="tnum font-extrabold text-ink-900">{result.reference}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-ink-500">تعداد کالا</dt>
              <dd className="tnum font-bold text-ink-800">{toPersianDigits(result.count)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-ink-500">مبلغ سفارش</dt>
              <dd className="tnum font-extrabold text-brand-700">
                {formatPrice(result.total)} تومان
              </dd>
            </div>
          </dl>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                void navigator.clipboard?.writeText(result.reference);
                pushToast({ title: 'شماره پیگیری کپی شد', variant: 'info' });
              }}
              leadingIcon={<Copy className="h-3.5 w-3.5" aria-hidden />}
            >
              کپی شماره پیگیری
            </Button>
            <Button onClick={close}>بستن</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <dl className="space-y-2.5 rounded-2xl border border-line bg-surface-muted p-4 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">تعداد کالا</dt>
              <dd className="tnum font-bold text-ink-800">{toPersianDigits(count)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">مبلغ سفارش</dt>
              <dd className="tnum font-extrabold text-brand-700">
                {formatPrice(total)} تومان
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">شیوه پرداخت</dt>
              <dd className="font-bold text-ink-800">در محل تحویل (نمایشی)</dd>
            </div>
          </dl>

          <div className="flex gap-2.5 rounded-2xl border border-info/20 bg-info-soft px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden />
            <p className="text-2xs leading-5 text-ink-600">
              برای تکمیل سفارش، اطلاعات تحویل‌دهنده در نسخه واقعی از شما دریافت می‌شود. شماره تماس
              فروشگاه: <span className="tnum font-bold">{settings.phone}</span>
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={close}>
              انصراف
            </Button>
            <Button onClick={submit} leadingIcon={<ClipboardList className="h-4 w-4" aria-hidden />}>
              تأیید درخواست
            </Button>
          </div>

          <p className="flex items-start gap-1.5 text-2xs leading-5 text-ink-400">
            <X className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            هیچ داده‌ای به سرور ارسال نمی‌شود و سبد خرید پس از ثبت درخواست خالی می‌شود.
          </p>
        </div>
      )}
    </Modal>
  );
}
