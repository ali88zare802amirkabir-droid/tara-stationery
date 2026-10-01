'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Backpack, BadgeCheck, Gift, GraduationCap, Headphones, Notebook, Palette, PenTool, Briefcase, ShieldCheck, Triangle, Truck } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Card';
import { useActiveCategories } from '@/hooks/useCatalog';
import { useCatalogStore } from '@/store/catalogStore';
import { toPersianDigits } from '@/lib/format';

const ICONS: Record<string, typeof PenTool> = {
  PenTool,
  Notebook,
  GraduationCap,
  Palette,
  Backpack,
  Triangle,
  Briefcase,
  Gift,
};

export function CategoryShowcase() {
  const categories = useActiveCategories();
  const products = useCatalogStore((state) => state.products);
  const activeProducts = useMemo(
    () => products.filter((product) => product.status === 'active'),
    [products],
  );

  return (
    <Section id="categories" tone="white">
      <SectionHeading
        eyebrow="دسته‌بندی‌ها"
        title="هر چیزی که برای نوشتن، درس خواندن و خلق کردن لازم دارید"
        description="هشت دسته‌بندی تخصصی که موجودی هر کدام را به‌صورت زنده از پنل مدیریت می‌گیرد."
        action={
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            همه دسته‌بندی‌ها
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((category, index) => {
          const Icon = ICONS[category.icon] ?? PenTool;
          const count = activeProducts.filter((product) => product.categoryId === category.id).length;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-3 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-canvas-soft">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 46vw"
                    className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
                  />
                  <span className="absolute end-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/92 text-brand-600 backdrop-blur transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden />
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
                  <h3 className="text-sm font-extrabold text-ink-900 transition-colors group-hover:text-brand-700">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2-fallback text-2xs leading-5 text-ink-400">
                    {category.description}
                  </p>
                  <p className="tnum mt-auto pt-3 text-2xs font-bold text-brand-600">
                    {toPersianDigits(count)} کالا
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

const FEATURES = [
  {
    icon: Truck,
    title: 'ارسال سریع به سراسر ایران',
    text: 'سفارش‌های ثبت‌شده تا ساعت ۱۴ همان روز پردازش و تحویل پست می‌شوند.',
  },
  {
    icon: ShieldCheck,
    title: 'پرداخت امن در محل تحویل',
    text: 'پرداخت را هنگام تحویل کالا انجام دهید؛ این مزیت فروشگاه است و درگاه بانکی در این نسخه نمایشی فعال نیست.',
  },
  {
    icon: BadgeCheck,
    title: 'ضمانت اصالت کالا',
    text: 'همه کالاها از نمایندگان رسمی تأمین و با فاکتور ارائه می‌شوند.',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی واقعی',
    text: 'کارشناسان ما برای انتخاب ابزار مناسب، پاسخ‌گوی شما هستند.',
  },
];

export function FeatureStrip() {
  return (
    <div className="relative -mt-2">
      <div className="shell">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3.5 rounded-3xl border border-line bg-surface p-5 shadow-soft transition-shadow duration-300 hover:shadow-card"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-2xs leading-5 text-ink-400">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
