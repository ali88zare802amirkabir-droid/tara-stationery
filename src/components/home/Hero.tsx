'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { SearchBox } from '@/components/layout/SearchBox';
import { ButtonLink } from '@/components/ui/Button';
import { useActiveBanners } from '@/hooks/useCatalog';
import { toPersianDigits } from '@/lib/format';

const themes = {
  brand: {
    shell: 'bg-gradient-to-bl from-brand-50 via-surface to-white',
    ring: 'ring-brand-100',
    accent: 'text-brand-700',
    chipBg: 'bg-brand-100 text-brand-700',
    button: 'primary' as const,
  },
  mint: {
    shell: 'bg-gradient-to-bl from-mint-50 via-surface to-white',
    ring: 'ring-success/10',
    accent: 'text-success-strong',
    chipBg: 'bg-success-soft text-success-strong',
    button: 'secondary' as const,
  },
  lilac: {
    shell: 'bg-gradient-to-bl from-accent-soft via-surface to-white',
    ring: 'ring-accent/10',
    accent: 'text-accent',
    chipBg: 'bg-accent-soft text-accent',
    button: 'secondary' as const,
  },
  sunset: {
    shell: 'bg-gradient-to-bl from-warning-soft via-surface to-white',
    ring: 'ring-warning/10',
    accent: 'text-warning-strong',
    chipBg: 'bg-warning-soft text-warning-strong',
    button: 'secondary' as const,
  },
};

export function Hero() {
  const banners = useActiveBanners();
  const banner = banners[0];

  if (!banner) return null;
  const theme = themes[banner.theme] ?? themes.brand;

  return (
    <section className="relative overflow-hidden pb-4 pt-6 sm:pt-10">
      <div
        className="pointer-events-none absolute -top-24 start-[-6rem] h-72 w-72 rounded-full bg-brand-100/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 end-[-4rem] h-80 w-80 rounded-full bg-accent-soft/60 blur-3xl"
        aria-hidden
      />

      <div className="shell">
        <div
          className={`relative overflow-hidden rounded-4xl border border-line ring-1 ${theme.ring} ${theme.shell} shadow-card`}
        >
          <div className="dot-grid absolute inset-0 opacity-50" aria-hidden />

          <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:p-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              {banner.eyebrow ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-2xs font-extrabold ${theme.chipBg}`}
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {banner.eyebrow}
                </span>
              ) : null}

              <h1 className="mt-5 text-display-lg text-ink-900">{banner.title}</h1>

              <p className={`mt-3 text-sm font-bold ${theme.accent}`}>{banner.subtitle}</p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-ink-500">
                {banner.description}
              </p>

              <div className="mt-7 max-w-xl">
                <SearchBox variant="hero" />
                <div className="mt-3 flex flex-wrap items-center gap-2 text-2xs text-ink-400">
                  <span>جستجوهای محبوب:</span>
                  {['خودکار', 'دفتر یادداشت', 'مداد رنگی', 'کوله مدرسه'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface/80 px-2.5 py-1 font-semibold text-ink-500 ring-1 ring-line"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <ButtonLink
                  href={banner.buttonLink}
                  size="lg"
                  trailingIcon={<ArrowLeft className="h-4 w-4" aria-hidden />}
                >
                  {banner.buttonText}
                </ButtonLink>
                {banner.secondaryButtonText ? (
                  <ButtonLink href={banner.secondaryButtonLink} variant="outline" size="lg">
                    {banner.secondaryButtonText}
                  </ButtonLink>
                ) : null}
              </div>

              <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  { value: `${toPersianDigits(32)}+`, label: 'کالای متنوع' },
                  { value: `${toPersianDigits(8)}`, label: 'دسته‌بندی تخصصی' },
                  { value: `${toPersianDigits(4.6)}`, label: 'میانگین رضایت' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="tnum block text-xl font-extrabold text-ink-900">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-2xs text-ink-400">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface shadow-lift sm:aspect-[16/11]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -bottom-4 start-4 flex items-center gap-2 rounded-2xl border border-line bg-surface/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:start-6">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-warning-soft text-warning-strong">
                  <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} aria-hidden />
                </span>
                <span>
                  <span className="block text-2xs text-ink-400">رضایت مشتریان</span>
                  <span className="tnum block text-xs font-extrabold text-ink-900">
                    {toPersianDigits(98)}٪ در سال گذشته
                  </span>
                </span>
              </div>

              <div className="absolute -top-3 end-3 hidden rounded-2xl border border-line bg-surface/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:block">
                <span className="tnum block text-xs font-extrabold text-brand-700">
                  {toPersianDigits(12)}+ هزار
                </span>
                <span className="block text-2xs text-ink-400">سفارش تحویل‌شده</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
