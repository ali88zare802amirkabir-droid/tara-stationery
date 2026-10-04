'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BadgeCheck,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Logo } from './Logo';
import { useCatalogStore } from '@/store/catalogStore';
import { useActiveCategories } from '@/hooks/useCatalog';
import { useUIStore } from '@/store/uiStore';
import { latinDigits, toPersianDigits } from '@/lib/format';

const TRUST = [
  { icon: Truck, title: 'ارسال سریع', text: 'تحویل ۲۴ تا ۷۲ ساعت' },
  { icon: ShieldCheck, title: 'ضمانت اصالت', text: 'کالای اورجینال' },
  { icon: BadgeCheck, title: '۷ روز مهلت بازگشت', text: 'بدون قید و شرط' },
  { icon: Headphones, title: 'پشتیبانی', text: 'شنبه تا پنجشنبه' },
];

const USEFUL = [
  { label: 'پیگیری سفارش', href: '/contact' },
  { label: 'شرایط ارسال', href: '/contact' },
  { label: 'روش‌های پرداخت', href: '/cart' },
  { label: 'بازگشت کالا', href: '/contact' },
  { label: 'سوالات متداول', href: '/about' },
];

export function SiteFooter() {
  const settings = useCatalogStore((state) => state.settings);
  const categories = useActiveCategories();
  const pushToast = useUIStore((state) => state.pushToast);
  const [email, setEmail] = useState('');

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    pushToast({
      title: 'عضویت در خبرنامه ثبت شد',
      description: 'کد تخفیف welcome10 برای شما ارسال می‌شود (نسخه نمایشی).',
      variant: 'success',
    });
    setEmail('');
  };

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="border-b border-line bg-canvas-soft">
        <div className="shell grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-brand-500 shadow-soft">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-extrabold text-ink-900">{title}</span>
                <span className="block text-2xs text-ink-400">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="shell grid gap-10 py-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">{settings.tagline}</p>

          <form onSubmit={subscribe} className="mt-5">
            <label htmlFor="footer-newsletter" className="text-xs font-bold text-ink-700">
              عضویت در خبرنامه
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ایمیل شما"
                className="h-11 min-w-0 flex-1 rounded-2xl border border-line bg-surface px-3.5 text-sm text-ink-800 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15"
              />
              <button
                type="submit"
                aria-label="عضویت در خبرنامه"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white transition-colors hover:bg-brand-700"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-2xs text-ink-400">
              با عضویت، از تخفیف‌های ویژه باخبر می‌شوید. این فرم نمایشی است.
            </p>
          </form>
        </div>

        <nav aria-label="دسته‌بندی‌های فروشگاه" className="lg:col-span-2">
          <h3 className="text-xs font-extrabold text-ink-900">دسته‌بندی‌ها</h3>
          <ul className="mt-4 space-y-2.5">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-xs text-ink-500 transition-colors hover:text-brand-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="لینک‌های مفید" className="lg:col-span-2">
          <h3 className="text-xs font-extrabold text-ink-900">لینک‌های مفید</h3>
          <ul className="mt-4 space-y-2.5">
            {USEFUL.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-ink-500 transition-colors hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h3 className="text-xs font-extrabold text-ink-900">راه‌های ارتباطی</h3>
          <ul className="mt-4 space-y-3.5 text-xs text-ink-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              <span className="leading-relaxed">{settings.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              <a
                href={`tel:${latinDigits(settings.phone)}`}
                className="tnum transition-colors hover:text-brand-700"
              >
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              <a
                href={`mailto:${settings.email}`}
                className="transition-colors hover:text-brand-700"
              >
                {settings.email}
              </a>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-2">
            {[
              { href: settings.instagram, label: 'اینستاگرام', icon: Instagram },
              { href: settings.telegram, label: 'تلگرام', icon: Send },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-line text-ink-400 transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-2xs text-ink-400 sm:flex-row">
          <p>
            © {toPersianDigits(1404)} فروشگاه {settings.storeName} — تمامی حقوق محفوظ است.
          </p>
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" aria-hidden />
            نسخه نمایشی فرانت‌اند — بدون درگاه پرداخت و بک‌اند
          </p>
        </div>
      </div>
    </footer>
  );
}
