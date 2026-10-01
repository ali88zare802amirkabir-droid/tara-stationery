'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Check, RotateCcw, Save, Store, Truck, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Switch } from '@/components/ui/Form';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { defaultSettings } from '@/data/brands';
import { formatPrice, toPersianDigits } from '@/lib/format';
import { useIsMounted } from '@/hooks/useIsMounted';
import type { StoreSettings } from '@/types';

const settingsSchema = z.object({
  storeName: z.string().min(2, 'نام فروشگاه الزامی است'),
  tagline: z.string().min(10, 'شعار فروشگاه باید حداقل ۱۰ نویسه باشد'),
  phone: z.string().min(8, 'شماره تماس معتبر وارد کنید'),
  landline: z.string().min(8, 'شماره ثابت معتبر وارد کنید'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  address: z.string().min(10, 'نشانی باید کامل باشد'),
  postalCode: z.string().min(4, 'کد پستی معتبر وارد کنید'),
  workingHours: z.string().min(5, 'ساعات کاری را وارد کنید'),
  instagram: z.string().url('آدرس اینستاگرام معتبر نیست'),
  telegram: z.string().url('آدرس تلگرام معتبر نیست'),
  whatsapp: z.string().url('آدرس واتساپ معتبر نیست'),
  freeShippingThreshold: z.coerce
    .number({ invalid_type_error: 'عدد وارد کنید' })
    .min(0, 'نمی‌تواند منفی باشد'),
  shippingCost: z.coerce.number({ invalid_type_error: 'عدد وارد کنید' }).min(0, 'نمی‌تواند منفی باشد'),
  taxRate: z.coerce.number({ invalid_type_error: 'عدد وارد کنید' }).min(0).max(0.3, 'نرخ بیش از حد است'),
  defaultLowStockThreshold: z.coerce
    .number({ invalid_type_error: 'عدد وارد کنید' })
    .min(0, 'نمی‌تواند منفی باشد'),
  announcement: z.string().max(120, 'متن اطلاعیه طولانی است'),
  announcementEnabled: z.boolean(),
  codEnabled: z.boolean(),
  maintainanceMode: z.boolean(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

function toForm(settings: StoreSettings): SettingsForm {
  return { ...settings };
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Store;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-surface-muted px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.9} aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-ink-900">{title}</h2>
          <p className="mt-0.5 text-2xs text-ink-400">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

export function AdminSettings() {
  const mounted = useIsMounted();
  const settings = useCatalogStore((state) => state.settings);
  const updateSettings = useCatalogStore((state) => state.updateSettings);
  const pushToast = useUIStore((state) => state.pushToast);
  const [resetOpen, setResetOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur',
    defaultValues: toForm(settings),
  });

  useEffect(() => {
    reset(toForm(settings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted ? settings : null]);

  const values = watch();
  const taxPercent = Math.round((Number(values.taxRate) || 0) * 100);
  const shippingOff = Number(values.freeShippingThreshold) - Number(values.shippingCost);

  const onSubmit = handleSubmit((data) => {
    updateSettings(data);
    pushToast({
      title: 'تنظیمات ذخیره شد',
      description: 'تغییرات بلافاصله در فروشگاه اعمال می‌شود.',
      variant: 'success',
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-display-sm text-ink-900">تنظیمات فروشگاه</h2>
          <p className="mt-2 text-sm text-ink-500">
            اطلاعات تماس، قواعد ارسال و پیام‌های فروشگاه. همه تغییرات در مرورگر شما ذخیره می‌شود.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setResetOpen(true)}
            leadingIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
          >
            بازگشت به پیش‌فرض
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting} leadingIcon={<Save className="h-3.5 w-3.5" aria-hidden />}>
            ذخیره تنظیمات
          </Button>
        </div>
      </header>

      {saved ? (
        <p className="flex items-center gap-2 rounded-2xl border border-success/25 bg-success-soft px-4 py-3 text-xs font-bold text-success-strong">
          <Check className="h-4 w-4" aria-hidden />
          تنظیمات با موفقیت ذخیره شد.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title="اطلاعات فروشگاه"
          description="نام، شعار و راه‌های ارتباطی"
          icon={Store}
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="نام فروشگاه"
                required
                error={errors.storeName?.message}
                {...register('storeName')}
              />
              <Input
                label="کد پستی"
                required
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
            <Textarea
              label="شعار فروشگاه"
              required
              rows={2}
              error={errors.tagline?.message}
              {...register('tagline')}
            />
            <Textarea
              label="نشانی"
              required
              rows={2}
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="تلفن همراه"
                required
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="تلفن ثابت"
                required
                error={errors.landline?.message}
                {...register('landline')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="پست الکترونیک"
                type="email"
                required
                error={errors.email?.message}
                {...register('email')}
                dir="ltr"
                className="text-end"
              />
              <Input
                label="ساعات کاری"
                required
                error={errors.workingHours?.message}
                {...register('workingHours')}
              />
            </div>
            <Input
              label="اینستاگرام"
              required
              error={errors.instagram?.message}
              {...register('instagram')}
              dir="ltr"
              className="text-end"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="تلگرام"
                required
                error={errors.telegram?.message}
                {...register('telegram')}
                dir="ltr"
                className="text-end"
              />
              <Input
                label="واتساپ"
                required
                error={errors.whatsapp?.message}
                {...register('whatsapp')}
                dir="ltr"
                className="text-end"
              />
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title="ارسال و پرداخت"
            description="هزینه ارسال، ارسال رایگان و مالیات"
            icon={Truck}
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="سقف ارسال رایگان (تومان)"
                  type="number"
                  required
                  error={errors.freeShippingThreshold?.message}
                  {...register('freeShippingThreshold')}
                />
                <Input
                  label="هزینه ارسال (تومان)"
                  type="number"
                  required
                  error={errors.shippingCost?.message}
                  {...register('shippingCost')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="نرخ مالیات بر ارزش افزوده (درصد)"
                  type="number"
                  step="0.5"
                  required
                  error={errors.taxRate?.message}
                  {...register('taxRate')}
                />
                <Input
                  label="حد هشدار پیش‌فرض موجودی"
                  type="number"
                  required
                  error={errors.defaultLowStockThreshold?.message}
                  {...register('defaultLowStockThreshold')}
                />
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <p className="text-2xs text-ink-500">پیش‌نمایش محاسبه</p>
                <ul className="mt-2 space-y-1.5 text-2xs text-ink-600">
                  <li className="flex items-center justify-between">
                    <span>سفارش {formatPrice(1_000_000)} تومانی</span>
                    <span className="tnum font-bold">
                      ارسال رایگان ({formatPrice(Math.max(shippingOff, 0))} تومان مانده)
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>مالیات {toPersianDigits(taxPercent)}٪ روی هر {formatPrice(1_000_000)} تومان</span>
                    <span className="tnum font-bold">
                      {formatPrice(Math.round((taxPercent / 100) * 1_000_000))} تومان
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 border-t border-line pt-4">
                <Switch
                  label="پرداخت در محل تحویل"
                  description="به‌عنوان مزیت فروشگاه نمایش داده می‌شود؛ درگاه واقعی وجود ندارد."
                  {...register('codEnabled')}
                />
                <Switch
                  label="حالت تعمیرات"
                  description="هشدار تعمیرات در پنل مدیریت نمایش داده می‌شود."
                  {...register('maintainanceMode')}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="نوار اطلاعیه"
            description="پیام بالای سایت در همه صفحات"
            icon={Wallet}
          >
            <div className="space-y-4">
              <Switch
                label="نمایش نوار اطلاعیه"
                description="در صورت خاموش بودن، نوار بالای سایت پنهان می‌شود."
                {...register('announcementEnabled')}
              />
              <Textarea
                label="متن اطلاعیه"
                rows={2}
                maxLength={120}
                error={errors.announcement?.message}
                hint={`${toPersianDigits(values.announcement?.length ?? 0)} از ۱۲۰ نویسه`}
                {...register('announcement')}
              />
            </div>
          </SectionCard>

          <Card className="p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
              <AlertTriangle className="h-4 w-4 text-warning-strong" aria-hidden />
              وضعیت فرم
            </h3>
            <p className="mt-2 text-2xs leading-5 text-ink-500">
              {isDirty
                ? 'تغییرات ذخیره نشده است. برای اعمال در فروشگاه، دکمه ذخیره را بزنید.'
                : 'همه تنظیمات ذخیره شده‌اند.'}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button type="submit" fullWidth loading={isSubmitting} leadingIcon={<Save className="h-4 w-4" aria-hidden />}>
                ذخیره تنظیمات
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => reset(toForm(settings))}
                disabled={!isDirty}
              >
                بازنشانی فرم
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        tone="primary"
        title="بازگشت تنظیمات به پیش‌فرض"
        description="تمام تنظیمات فروشگاه به مقادیر اولیه دمو برمی‌گردد."
        confirmLabel="بازگشت به پیش‌فرض"
        onConfirm={() => {
          updateSettings(defaultSettings);
          reset(toForm(defaultSettings));
          pushToast({ title: 'تنظیمات به پیش‌فرض برگشت', variant: 'success' });
        }}
      />
    </form>
  );
}
