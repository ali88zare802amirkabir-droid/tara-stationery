'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Send, Store } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, FieldShell } from '@/components/ui/Form';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { latinDigits } from '@/lib/format';

const SUBJECTS = [
  { value: 'order', label: 'پیگیری سفارش' },
  { value: 'product', label: 'سؤال درباره محصول' },
  { value: 'wholesale', label: 'خرید عمده و سازمانی' },
  { value: 'return', label: 'مرجوعی و بازگشت کالا' },
  { value: 'other', label: 'سایر موارد' },
];

export function ContactPage() {
  const settings = useCatalogStore((state) => state.settings);
  const pushToast = useUIStore((state) => state.pushToast);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'order', message: '' });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    pushToast({
      title: 'پیام شما ثبت شد',
      description: 'در نسخه نمایشی، پیام فقط در مرورگر شما ثبت می‌شود و ارسال نمی‌گردد.',
      variant: 'success',
    });
    setForm({ name: '', phone: '', email: '', subject: 'order', message: '' });
  };

  const channels = [
    {
      icon: Phone,
      title: 'تلفن فروشگاه',
      value: settings.phone,
      href: `tel:${latinDigits(settings.phone)}`,
      note: 'شنبه تا چهارشنبه ۹ تا ۱۹',
    },
    {
      icon: Phone,
      title: 'تلفن Landline',
      value: settings.landline,
      href: `tel:${latinDigits(settings.landline)}`,
      note: 'پشتیبانی سازمانی و عمده‌فروشی',
    },
    {
      icon: Mail,
      title: 'پست الکترونیک',
      value: settings.email,
      href: `mailto:${settings.email}`,
      note: 'پاسخ تا ۲۴ ساعت کاری',
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      value: settings.workingHours,
      note: 'پنج‌شنبه نیمه‌وقت',
    },
  ];

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="shell py-3.5">
          <Breadcrumb items={[{ label: 'تماس با ما' }]} />
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-line bg-gradient-to-bl from-sky-50 via-surface to-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="shell relative py-12 lg:py-14">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
            <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
            ارتباط با ما
          </p>
          <h1 className="text-display-sm text-ink-900">هر سؤالی دارید، با ما در میان بگذارید</h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-ink-500">
            پیش از خرید یا بعد از آن، تیم تارا آماده پاسخ‌گویی است. این فرم نمایشی است و پیامی به
            سرور ارسال نمی‌کند.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12 sm:py-12">
        <div className="space-y-4">
          <ul className="grid gap-3 sm:grid-cols-2">
            {channels.map((channel) => (
              <li
                key={channel.title}
                className="rounded-3xl border border-line bg-surface p-5 shadow-soft"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <channel.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </span>
                <h2 className="mt-3.5 text-xs font-extrabold text-ink-900">{channel.title}</h2>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="tnum mt-1 block text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="mt-1 text-xs leading-6 text-ink-700">{channel.value}</p>
                )}
                <p className="mt-1 text-2xs text-ink-400">{channel.note}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
              <MapPin className="h-4 w-4 text-brand-500" aria-hidden />
              نشانی فروشگاه
            </h2>
            <p className="mt-3 text-xs leading-7 text-ink-500">{settings.address}</p>
            <p className="tnum mt-2 text-2xs text-ink-400">کد پستی: {settings.postalCode}</p>

            <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-canvas-soft">
              <Image
                src="/media/contact.svg"
                alt="نقشه دسترسی به فروشگاه"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
            <h2 className="text-sm font-extrabold text-ink-900">شبکه‌های اجتماعی</h2>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {[
                { href: settings.instagram, label: 'اینستاگرام', icon: Instagram },
                { href: settings.telegram, label: 'تلگرام', icon: Send },
                { href: settings.whatsapp, label: 'واتساپ', icon: MessageCircle },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface px-3.5 py-2 text-2xs font-bold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
            <Store className="h-5 w-5 text-brand-500" aria-hidden />
            فرم تماس
          </h2>
          <p className="mt-2 text-xs leading-6 text-ink-400">
            فیلدهای ستاره‌دار الزامی هستند. این فرم فقط در حافظه مرورگر پردازش می‌شود.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="نام و نام خانوادگی"
                required
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="مثلاً: مریم رضایی"
                minLength={3}
              />
              <Input
                label="شماره تماس"
                required
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder="۰۹۱۲۰۰۰۰۰۰۰"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="پست الکترونیک"
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                placeholder="you@example.com"
                dir="ltr"
                className="text-end"
              />
              <Select
                label="موضوع پیام"
                value={form.subject}
                onChange={(event) => update('subject', event.target.value)}
                options={SUBJECTS}
              />
            </div>

            <FieldShell label="متن پیام" required htmlFor="contact-message">
              <Textarea
                id="contact-message"
                rows={6}
                required
                minLength={10}
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                placeholder="پیام خود را بنویسید…"
                className="min-h-[9rem]"
              />
            </FieldShell>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-2xs text-ink-300">با ارسال پیام، قوانین حریم خصوصی را می‌پذیرید.</p>
              <Button type="submit" leadingIcon={<Send className="h-4 w-4" aria-hidden />}>
                ارسال پیام
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
