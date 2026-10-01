'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, HeartHandshake, PackageCheck, Target, Users } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Disclosure';
import { useCatalogStore } from '@/store/catalogStore';
import { useActiveCategories, usePublishedProducts } from '@/hooks/useCatalog';
import { toPersianDigits } from '@/lib/format';

const VALUES = [
  {
    icon: PackageCheck,
    title: 'کیفیت قبل از هر چیز',
    text: 'هر کالا پیش از انتشار از نظر کیفیت چاپ، دوام و بسته‌بندی بررسی می‌شود؛ کالایی که استاندارد نداشته باشد وارد فروشگاه نمی‌شود.',
  },
  {
    icon: HeartHandshake,
    title: 'قیمت شفاف',
    text: 'قیمت‌ها بدون هزینه پنهان اعلام می‌شوند و اگر تخفیفی فعال باشد، درصد آن روی کارت محصول دیده می‌شود.',
  },
  {
    icon: Users,
    title: 'مشاوره صادقانه',
    text: 'اگر کالایی برای نیاز شما مناسب نیست، همان را می‌گوییم. فروش یک‌باره برای ما ارزشی ندارد.',
  },
  {
    icon: Award,
    title: 'پشتیبانی پس از خرید',
    text: 'موجودی و قیمت‌ها هفتگی به‌روزرسانی می‌شود و تیم پشتیبانی برای پیگیری سفارش در دسترس است.',
  },
];

const TIMELINE = [
  {
    year: '۱۳۹۷',
    title: 'شروع با یک مغازه کوچک',
    text: 'کار را با فروش لوازم‌التحریر مدرسه‌ای در یک پاساژ شروع کردیم و تنها ۴۰ قلم کالا داشتیم.',
  },
  {
    year: '۱۴۰۰',
    title: 'ورود به فروش آنلاین',
    text: 'با رشد تقاضای خرید غیرحضوری، سایت و پنل سفارش آنلاین راه‌اندازی شد.',
  },
  {
    year: '۱۴۰۳',
    title: 'همکاری با برندهای رسمی',
    text: 'نمایندگی رسمی فروش چند برند معتبر داخلی و واردات کالای هنری تخصصی.',
  },
  {
    year: '۱۴۰۵',
    title: 'بازطراحی کامل فروشگاه',
    text: 'نسخه جدید سایت با تمرکز بر سرعت، شفافیت قیمت و تجربه کاربری ساده‌تر رونمایی شد.',
  },
];

const FAQ = [
  {
    id: 'faq-1',
    title: 'ارسال سفارش چقدر طول می‌کشد؟',
    content:
      'سفارش‌های ثبت‌شده تا ساعت ۱۴ همان روز پردازش می‌شوند. تحویل در تهران ۲۴ تا ۴۸ ساعت و در سایر شهرها ۲ تا ۵ روز کاری زمان می‌برد.',
  },
  {
    id: 'faq-2',
    title: 'هزینه ارسال چقدر است؟',
    content:
      'هزینه ارسال بر اساس شهر مقصد محاسبه می‌شود و برای سفارش‌های بالای ۸۰۰٬۰۰۰ تومان، ارسال رایگان است.',
  },
  {
    id: 'faq-3',
    title: 'امکان مرجوع کردن کالا وجود دارد؟',
    content:
      'بله. تا هفت روز پس از تحویل، اگر کالا استفاده نشده و در بسته‌بندی اصلی باشد، می‌توانید آن را مرجوع کنید.',
  },
  {
    id: 'faq-4',
    title: 'آیا برای خرید عمده هم تخفیف دارید؟',
    content:
      'برای خریدهای مدرسه‌ای و سازمانی، شرایط ویژه‌ای در نظر گرفته می‌شود. کافی است از طریق صفحه تماس با ما درخواست دهید.',
  },
  {
    id: 'faq-5',
    title: 'پرداخت چگونه انجام می‌شود؟',
    content:
      'در این نسخه نمایشی، پرداخت در محل تحویل به‌عنوان یکی از مزیت‌های فروشگاه معرفی شده است. درگاه بانکی واقعی پیاده‌سازی نشده و هیچ اطلاعات کارتی دریافت نمی‌شود.',
  },
];

export function AboutPage() {
  const settings = useCatalogStore((state) => state.settings);
  const activeCategories = useActiveCategories();
  const publishedProducts = usePublishedProducts();

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="shell py-3.5">
          <Breadcrumb items={[{ label: 'درباره ما' }]} />
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-line bg-gradient-to-bl from-brand-50 via-surface to-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="shell relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
              <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
              درباره {settings.storeName}
            </p>
            <h1 className="text-display-sm text-ink-900">
              از یک مغازه کوچک تا انتخاب اول دانش‌آموزان
            </h1>
            <p className="mt-4 text-sm leading-8 text-ink-500">{settings.tagline}</p>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href="/products" size="lg">
                مشاهده محصولات
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="lg">
                تماس با ما
              </ButtonLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-4xl border border-line shadow-card">
            <Image
              src="/media/about.svg"
              alt="فروشگاه لوازم‌التحریر تارا"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Section>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {[
            { value: `${toPersianDigits(publishedProducts.length)}+`, label: 'کالای موجود' },
            { value: `${toPersianDigits(activeCategories.length)}`, label: 'دسته‌بندی تخصصی' },
            { value: `${toPersianDigits(12)}+ هزار`, label: 'سفارش تحویل‌شده' },
            { value: `${toPersianDigits(98)}٪`, label: 'رضایت مشتری' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-line bg-surface p-5 text-center shadow-soft"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="tnum block text-2xl font-extrabold text-ink-900">{stat.value}</span>
                <span className="mt-1.5 block text-2xs text-ink-400">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="ارزش‌های ما"
          title="چهار تعهدی که کار ما را تعریف می‌کند"
          description="این‌ها شعار تبلیغاتی نیستند؛ معیاری هستند که هر روز با آن‌ها تصمیم می‌گیریم."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 rounded-3xl border border-line bg-canvas p-5 transition-shadow hover:shadow-soft"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-ink-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="مسیر ما"
          title="از پاساژ تا فروشگاه آنلاین"
          description="چهار نقطه عطف از داستان کوتاه ما."
        />
        <ol className="relative space-y-4 border-s-2 border-line ps-6">
          {TIMELINE.map((entry, index) => (
            <li key={entry.year} className="relative">
              <span
                aria-hidden
                className="absolute -start-[1.9rem] top-2 grid h-4 w-4 place-items-center rounded-full border-2 border-brand-400 bg-canvas"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
              <p className="tnum text-2xs font-extrabold text-brand-600">
                {entry.year} — گام {toPersianDigits(index + 1)}
              </p>
              <h3 className="mt-1 text-sm font-extrabold text-ink-900">{entry.title}</h3>
              <p className="mt-1.5 text-xs leading-6 text-ink-500">{entry.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
              <span aria-hidden className="h-1 w-6 rounded-full bg-brand-300" />
              اهداف ما
            </p>
            <h2 className="text-display-sm text-ink-900">به کجا می‌رویم</h2>
            <p className="mt-3 text-sm leading-8 text-ink-500">
              هدف ما ساده است: اینکه خرید لوازم‌التحریر در ایران، تجربه‌ای شفاف و بی‌دردسر باشد.
              قیمت روشن، موجودی واقعی، مشاوره صادقانه و تحویلی که سر وقت انجام می‌شود.
            </p>
            <div className="mt-6 flex gap-3 rounded-3xl border border-brand-100 bg-brand-50/60 p-5">
              <Target className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              <p className="text-xs leading-6 text-brand-800">
                تا پایان سال آینده، همه دسته‌بندی‌ها را به موجودی لحظه‌ای انبار متصل می‌کنیم و
                پیشنهادهای شخصی‌سازی‌شده را برای هر دانش‌آموز فعال می‌کنیم.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href="/products">شروع خرید</ButtonLink>
              <ButtonLink href="/admin" variant="outline">
                مشاهده پنل مدیریت
              </ButtonLink>
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-display-sm text-ink-900">سوالات متداول</h2>
            <Accordion items={FAQ} defaultOpenId="faq-1" />
            <p className="mt-5 text-xs text-ink-400">
              پاسخ سوال دیگری را پیدا نکردید؟{' '}
              <Link href="/contact" className="font-bold text-brand-700 underline-offset-4 hover:underline">
                با ما تماس بگیرید
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
