'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, HeartHandshake, PackageCheck, Sparkles } from 'lucide-react';
import { Section } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/Button';
import { useCatalogStore } from '@/store/catalogStore';
import { useActiveCategories, usePublishedProducts } from '@/hooks/useCatalog';
import { latinDigits, toPersianDigits } from '@/lib/format';

const BRAND_ART: Record<string, string> = {
  'پنتر': 'panter',
  'فامیلیا': 'familia',
  'فانو': 'fano',
  'سی‌پی': 'cp',
  'پیکو': 'pico',
  'زیت': 'zit',
  'نوآوا': 'nova',
  'اطلس': 'atlas',
};

export function BrandsRow() {
  const products = useCatalogStore((state) => state.products);
  const uniqueBrands = Array.from(new Set(products.map((product) => product.brand)));

  return (
    <Section tone="white" className="!py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-2xs font-bold text-ink-400">برندهایی که با آن‌ها کار می‌کنیم</p>
        <h2 className="text-display-sm text-ink-900">همکاری با نمایندگان رسمی</h2>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {uniqueBrands.map((brand) => (
          <li key={brand}>
            <Link
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
            >
              {/* Wordmarks are 2:1, so they must never be cropped into a square. */}
              <span className="relative block h-12 w-full overflow-hidden rounded-xl">
                <Image
                  src={`/media/brands/brand-${BRAND_ART[brand] ?? 'atlas'}.svg`}
                  alt={`برند ${brand}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 290px, (min-width: 640px) 33vw, 45vw"
                  className="object-contain"
                />
              </span>
              <span className="text-xs font-bold text-ink-600 transition-colors group-hover:text-brand-700">
                {brand}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const PILLARS = [
  {
    icon: PackageCheck,
    title: 'انتخاب دقیق',
    text: 'هر کالا پیش از انتشار در فروشگاه از نظر کیفیت چاپ، دوام و بسته‌بندی بررسی می‌شود.',
  },
  {
    icon: HeartHandshake,
    title: 'قیمت شفاف',
    text: 'قیمت‌ها بدون هزینه پنهان اعلام می‌شوند؛ اگر تخفیفی فعال باشد، درصد آن روی کارت محصول دیده می‌شود.',
  },
  {
    icon: Award,
    title: 'پشتیبانی واقعی',
    text: 'قبل و بعد از خرید، برای انتخاب ابزار مناسب و پیگیری سفارش کنار شما هستیم.',
  },
];

export function AboutStore() {
  const settings = useCatalogStore((state) => state.settings);
  const activeCategories = useActiveCategories();
  const publishedProducts = usePublishedProducts();

  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-4xl border border-line shadow-card">
            <Image
              src="/media/about.svg"
              alt="فروشگاه لوازم‌التحریر تارا"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 end-4 flex items-center gap-3 rounded-3xl border border-line bg-surface px-4 py-3 shadow-lift sm:end-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="tnum block text-sm font-extrabold text-ink-900">
                {toPersianDigits(12)}+ هزار
              </span>
              <span className="block text-2xs text-ink-400">سفارش تحویل‌شده</span>
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
            <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
            درباره تارا
          </p>
          <h2 className="text-display-md text-ink-900">
            لوازم‌التحریری که کار را ساده‌تر می‌کند، نه سخت‌تر
          </h2>
          <p className="mt-4 text-sm leading-8 text-ink-500">
            {settings.storeName} با یک هدف ساده شروع شد: اینکه خرید لوازم‌التحریر در ایران نباید
            حدس و گمان باشد. امروز بیش از {toPersianDigits(publishedProducts.length)} کالا در{' '}
            {toPersianDigits(activeCategories.length)} دسته‌بندی تخصصی موجود است و تیم ما هر هفته موجودی و
            قیمت‌ها را به‌روز نگه می‌دارد.
          </p>

          <div className="mt-8 space-y-5">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-brand-600 shadow-soft">
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-ink-900">{title}</h3>
                  <p className="mt-1 text-xs leading-6 text-ink-500">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-2.5 sm:flex-row">
            <ButtonLink href="/about" size="lg">
              داستان ما
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              تماس با ما
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CallToAction() {
  const settings = useCatalogStore((state) => state.settings);

  return (
    <div className="shell pb-16 pt-4 sm:pb-20">
      <div className="relative overflow-hidden rounded-4xl border border-line bg-ink-900 p-8 text-center shadow-panel sm:p-14">
        <div className="grid-lines absolute inset-0 opacity-20" aria-hidden />
        <div
          className="pointer-events-none absolute -top-16 start-1/4 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 end-1/4 h-56 w-56 rounded-full bg-accent/25 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-display-sm text-white">
            آماده‌اید سال تحصیلی را حرفه‌ای شروع کنید؟
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/65">
            بیش از {toPersianDigits(32)} کالای منتخب با ضمانت اصالت، ارسال سریع و امکان پرداخت در
            محل تحویل. برای مشاوره رایگان با {settings.storeName} تماس بگیرید.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
            <ButtonLink href="/products" variant="white" size="lg">
              شروع خرید
            </ButtonLink>
            <ButtonLink
              href={`tel:${latinDigits(settings.phone)}`}
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              تماس با پشتیبانی
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
