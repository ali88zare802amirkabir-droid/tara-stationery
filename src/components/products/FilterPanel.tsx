'use client';

import { useMemo } from 'react';
import { Checkbox, RadioCards } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Overlay';
import { RangeSlider } from './RangeSlider';
import { countActiveFilters, priceBounds, sortOptions } from '@/lib/catalog';
import { useCatalogStore, discountPercent } from '@/store/catalogStore';
import { useActiveCategories } from '@/hooks/useCatalog';
import { formatDecimal, formatPrice, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { FilterState, Product } from '@/types';

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  products: Product[];
  /** Hide the category group when browsing inside a single category. */
  showCategories?: boolean;
  className?: string;
}

const RATINGS = [4.5, 4, 3.5];

export function FilterPanel({
  filters,
  onChange,
  onReset,
  products,
  showCategories = true,
  className,
}: FilterPanelProps) {
  const categories = useActiveCategories();
  const allProducts = useCatalogStore((state) => state.products);
  const bounds = useMemo(() => priceBounds(allProducts), [allProducts]);

  const activeProducts = useMemo(
    () => allProducts.filter((product) => product.status === 'active'),
    [allProducts],
  );

  const brands = useMemo(
    () => Array.from(new Set(allProducts.map((product) => product.brand))).sort(),
    [allProducts],
  );

  const countFor = (predicate: (product: Product) => boolean) =>
    activeProducts.filter(predicate).length;

  const activeCount = countActiveFilters(filters);

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-ink-900">فیلترها</h2>
        {activeCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            پاک کردن ({toPersianDigits(activeCount)})
          </Button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="sort-radio" className="text-xs font-bold text-ink-700">
            مرتب‌سازی
          </label>
        </div>
        <RadioCards
          name="sort-radio"
          value={filters.sort}
          onChange={(value) => onChange({ ...filters, sort: value as FilterState['sort'] })}
          options={sortOptions}
          columns={2}
        />
      </div>

      {showCategories ? (
        <fieldset className="rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 text-xs font-bold text-ink-700">دسته‌بندی</legend>
          <div className="mt-1 space-y-0.5">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                label={category.name}
                checked={filters.categoryIds.includes(category.id)}
                count={countFor((product) => product.categoryId === category.id)}
                onChange={() =>
                  onChange({ ...filters, categoryIds: toggleInList(filters.categoryIds, category.id) })
                }
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="rounded-2xl border border-line bg-surface p-4">
        <legend className="px-1 text-xs font-bold text-ink-700">برند</legend>
        <div className="mt-1 max-h-56 space-y-0.5 overflow-y-auto">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={filters.brandIds.includes(brand)}
              count={countFor((product) => product.brand === brand)}
              onChange={() => onChange({ ...filters, brandIds: toggleInList(filters.brandIds, brand) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-line bg-surface p-4">
        <legend className="px-1 text-xs font-bold text-ink-700">محدوده قیمت (تومان)</legend>
        <RangeSlider
          min={bounds.min}
          max={bounds.max}
          value={[filters.minPrice ?? bounds.min, filters.maxPrice ?? bounds.max]}
          onChange={([min, max]) =>
            onChange({
              ...filters,
              minPrice: min <= bounds.min ? null : min,
              maxPrice: max >= bounds.max ? null : max,
            })
          }
        />
      </fieldset>

      <fieldset className="rounded-2xl border border-line bg-surface p-4">
        <legend className="px-1 text-xs font-bold text-ink-700">وضعیت</legend>
        <div className="mt-1 space-y-0.5">
          <Checkbox
            label="فقط کالاهای موجود"
            checked={filters.inStockOnly}
            count={countFor((product) => product.stock > 0)}
            onChange={(event) => onChange({ ...filters, inStockOnly: event.target.checked })}
          />
          <Checkbox
            label="فقط کالاهای دارای تخفیف"
            checked={filters.discountedOnly}
            count={countFor((product) => discountPercent(product) > 0)}
            onChange={(event) => onChange({ ...filters, discountedOnly: event.target.checked })}
          />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-line bg-surface p-4">
        <legend className="px-1 text-xs font-bold text-ink-700">امتیاز کاربران</legend>
        <div className="mt-2 space-y-0.5">
          {RATINGS.map((rating) => (
            <Checkbox
              key={rating}
              label={
                <span className="flex items-center gap-1.5">
                  از {formatDecimal(rating)} به بالا
                  <span className="text-warning">★</span>
                </span>
              }
              checked={filters.minRating === rating}
              count={countFor((product) => product.rating >= rating)}
              onChange={() =>
                onChange({ ...filters, minRating: filters.minRating === rating ? null : rating })
              }
            />
          ))}
        </div>
      </fieldset>

      <p className="rounded-2xl bg-brand-50/70 px-4 py-3 text-2xs leading-5 text-brand-700">
        {toPersianDigits(products.length)} کالا با فیلترهای فعلی نمایش داده می‌شود.
      </p>
    </div>
  );
}

export function FilterDrawer({
  open,
  onClose,
  ...panelProps
}: FilterPanelProps & { open: boolean; onClose: () => void }) {
  const activeCount = countActiveFilters(panelProps.filters);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="فیلتر محصولات"
      side="start"
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" fullWidth onClick={panelProps.onReset}>
            پاک کردن همه
          </Button>
          <Button fullWidth onClick={onClose}>
            نمایش {toPersianDigits(panelProps.products.length)} کالا
            {activeCount > 0 ? ` (${toPersianDigits(activeCount)} فیلتر)` : ''}
          </Button>
        </div>
      }
    >
      <div className="p-5">
        <FilterPanel {...panelProps} />
      </div>
    </Drawer>
  );
}

export function ActiveFilterChips({
  filters,
  onChange,
  className,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  className?: string;
}) {
  const categories = useCatalogStore((state) => state.categories);
  const allProducts = useCatalogStore((state) => state.products);
  const bounds = useMemo(() => priceBounds(allProducts), [allProducts]);

  const chips: { key: string; label: string; clear: () => void }[] = [];

  filters.categoryIds.forEach((id) => {
    const category = categories.find((entry) => entry.id === id);
    if (!category) return;
    chips.push({
      key: `cat-${id}`,
      label: category.name,
      clear: () =>
        onChange({ ...filters, categoryIds: filters.categoryIds.filter((entry) => entry !== id) }),
    });
  });

  filters.brandIds.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      clear: () => onChange({ ...filters, brandIds: filters.brandIds.filter((entry) => entry !== brand) }),
    });
  });

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const from = filters.minPrice ?? bounds.min;
    const to = filters.maxPrice ?? bounds.max;
    chips.push({
      key: 'price',
      label: `${formatPrice(from)} تا ${formatPrice(to)}`,
      clear: () => onChange({ ...filters, minPrice: null, maxPrice: null }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({ key: 'stock', label: 'فقط موجود', clear: () => onChange({ ...filters, inStockOnly: false }) });
  }

  if (filters.discountedOnly) {
    chips.push({
      key: 'discount',
      label: 'فقط تخفیف‌دار',
      clear: () => onChange({ ...filters, discountedOnly: false }),
    });
  }

  if (filters.minRating !== null) {
    chips.push({
      key: 'rating',
      label: `امتیاز ${formatDecimal(filters.minRating)}+`,
      clear: () => onChange({ ...filters, minRating: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={chip.clear}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-2xs font-bold text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-100"
          >
            {chip.label}
            <span aria-hidden className="text-brand-400">
              ×
            </span>
            <span className="sr-only">حذف فیلتر</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              categoryIds: [],
              brandIds: [],
              minPrice: null,
              maxPrice: null,
              inStockOnly: false,
              discountedOnly: false,
              minRating: null,
            })
          }
          className="rounded-full px-2.5 py-1.5 text-2xs font-bold text-ink-400 underline-offset-4 transition-colors hover:text-ink-700 hover:underline"
        >
          حذف همه
        </button>
      </li>
    </ul>
  );
}
