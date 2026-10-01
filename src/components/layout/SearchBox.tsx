'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Search, TrendingUp, X } from 'lucide-react';
import { useCatalogStore } from '@/store/catalogStore';
import { useWishlistIds } from '@/hooks/useCatalog';
import { relatedSearches, searchSuggestions } from '@/lib/catalog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { formatPrice, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';

export function SearchBox({
  variant = 'header',
  autoFocus = false,
  onNavigate,
  className,
  placeholder = 'جستجو بین خودکار، دفتر، کوله…',
}: {
  variant?: 'header' | 'page' | 'hero';
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const products = useCatalogStore((state) => state.products);
  const wishlistIds = useWishlistIds();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedValue(query, 180);

  const suggestions = debounced.trim().length > 1 ? searchSuggestions(products, debounced, 5) : [];
  const popular = relatedSearches(products, 6);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/products');
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit(query);
        }}
        className={cn(
          'flex items-center gap-2 rounded-full border bg-surface transition-all duration-200',
          isHero
            ? 'h-13 border-line px-2 shadow-card focus-within:border-brand-300 focus-within:shadow-lift'
            : 'h-11 border-line px-3 focus-within:border-brand-300 focus-within:shadow-soft',
        )}
      >
        <Search className={cn('shrink-0 text-ink-300', isHero ? 'h-5 w-5' : 'h-4.5 w-4.5')} aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="جستجوی محصولات"
          aria-controls="search-suggestions"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink-800 outline-none placeholder:text-ink-300"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="پاک کردن جستجو"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-300 transition-colors hover:bg-surface-sunken hover:text-ink-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : null}
        <button
          type="submit"
          className={cn(
            'shrink-0 rounded-full font-bold transition-colors',
            isHero
              ? 'bg-brand-500 px-4 py-2.5 text-xs text-white hover:bg-brand-600'
              : 'bg-brand-50 px-3 py-1.5 text-2xs text-brand-700 hover:bg-brand-100',
          )}
        >
          جستجو
        </button>
      </form>

      {open ? (
        <div
          id="search-suggestions"
          className={cn(
            'absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-line bg-surface shadow-panel',
            isHero ? 'w-full min-w-[22rem]' : 'w-full min-w-[20rem]',
          )}
        >
          {suggestions.length > 0 ? (
            <div>
              <p className="flex items-center gap-1.5 border-b border-line px-4 py-2.5 text-2xs font-bold text-ink-400">
                <Search className="h-3.5 w-3.5" aria-hidden />
                نتایج پیشنهادی
              </p>
              <ul className="max-h-[19rem] overflow-y-auto py-1.5">
                {suggestions.map((product) => {
                  const saved = wishlistIds.includes(product.id);
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-surface-muted"
                      >
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                          <Image
                            src={product.images[0]?.src ?? '/media/products/p0-1.svg'}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-ink-800">{product.name}</span>
                          <span className="tnum block text-2xs text-ink-400">
                            {product.brand} · {formatPrice(product.price)} تومان
                          </span>
                        </span>
                        {saved ? (
                          <span className="shrink-0 rounded-full bg-blush-soft px-2 py-0.5 text-[0.625rem] font-bold text-blush">
                            ذخیره‌شده
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => submit(query)}
                className="w-full border-t border-line px-4 py-3 text-center text-2xs font-extrabold text-brand-700 transition-colors hover:bg-brand-50"
              >
                مشاهده همه نتایج برای «{query.trim()}»
              </button>
            </div>
          ) : query.trim().length > 1 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs font-bold text-ink-700">نتیجه‌ای یافت نشد</p>
              <p className="mt-1 text-2xs text-ink-400">
                املای عبارت را بررسی کنید یا کلمه دیگری بنویسید.
              </p>
            </div>
          ) : (
            <div className="px-4 py-4">
              <p className="flex items-center gap-1.5 text-2xs font-bold text-ink-400">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                جستجوهای پرطرفدار
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {popular.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => submit(tag)}
                    className="rounded-full bg-surface-sunken px-3 py-1.5 text-2xs font-semibold text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function RecentSearches({ className }: { className?: string }) {
  const products = useCatalogStore((state) => state.products);
  const popular = relatedSearches(products, 8);
  return (
    <section className={cn('rounded-3xl border border-line bg-surface p-5 shadow-soft', className)}>
      <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
        <Clock className="h-4 w-4 text-brand-500" aria-hidden />
        جستجوهای پرتکرار
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {popular.map((tag, index) => (
          <li key={tag}>
            <Link
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-2xs font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="tnum text-ink-300">{toPersianDigits(index + 1)}</span>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
