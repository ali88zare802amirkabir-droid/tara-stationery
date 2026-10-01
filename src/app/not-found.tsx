import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { toPersianDigits } from '@/lib/format';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl border border-line bg-surface text-brand-500 shadow-soft">
        <Compass className="h-7 w-7" aria-hidden />
      </span>
      <p className="tnum mt-6 text-5xl font-extrabold text-ink-900">
        {toPersianDigits(404)}
      </p>
      <h1 className="mt-3 text-display-sm text-ink-900">این صفحه پیدا نشد</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-ink-500">
        ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه‌ای که دنبالش هستید حذف شده باشد. از
        میان‌برهای زیر ادامه دهید.
      </p>

      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <ButtonLink href="/" size="lg" leadingIcon={<Home className="h-4 w-4" aria-hidden />}>
          بازگشت به خانه
        </ButtonLink>
        <ButtonLink
          href="/products"
          size="lg"
          variant="outline"
          leadingIcon={<Search className="h-4 w-4" aria-hidden />}
        >
          جستجو در فروشگاه
        </ButtonLink>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2 text-2xs">
        {['/products', '/categories', '/cart', '/wishlist', '/admin'].map((href) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-line bg-surface px-3.5 py-1.5 font-semibold text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            {href}
          </Link>
        ))}
      </div>
    </div>
  );
}
