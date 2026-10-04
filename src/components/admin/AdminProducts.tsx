'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Form';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState, Pagination } from '@/components/ui/Feedback';
import { Tooltip } from '@/components/ui/Disclosure';
import { discountPercent, useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { formatPrice, formatShortDate, toPersianDigits } from '@/lib/format';
import { normalizeFa } from '@/lib/utils';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { Product, ProductStatus } from '@/types';

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<ProductStatus, { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  active: { label: 'فعال', tone: 'success' },
  draft: { label: 'پیش‌نویس', tone: 'warning' },
  archived: { label: 'بایگانی', tone: 'neutral' },
};

export function AdminProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const deleteProduct = useCatalogStore((state) => state.deleteProduct);
  const duplicateProduct = useCatalogStore((state) => state.duplicateProduct);
  const toggleProductStatus = useCatalogStore((state) => state.toggleProductStatus);
  const toggleProductFlag = useCatalogStore((state) => state.toggleProductFlag);
  const resetCatalog = useCatalogStore((state) => state.resetCatalog);
  const pushToast = useUIStore((state) => state.pushToast);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebouncedValue(query, 200);
  const [categoryId, setCategoryId] = useState(searchParams.get('category') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [stockFilter, setStockFilter] = useState(searchParams.get('stock') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'newest');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = normalizeFa(debouncedQuery);
    const list = products.filter((product) => {
      if (term && !normalizeFa(`${product.name} ${product.brand} ${product.sku}`).includes(term)) {
        return false;
      }
      if (categoryId && product.categoryId !== categoryId) return false;
      if (status && product.status !== status) return false;
      if (stockFilter === 'out' && product.stock > 0) return false;
      if (stockFilter === 'low') {
        if (product.stock <= 0 || product.stock > product.lowStockThreshold) return false;
      }
      if (stockFilter === 'in' && product.stock <= 0) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'stock-asc':
        return list.sort((a, b) => a.stock - b.stock);
      case 'sold':
        return list.sort((a, b) => b.soldCount - a.soldCount);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
      default:
        return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
  }, [products, debouncedQuery, categoryId, status, stockFilter, sort]);

  const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetFilters = () => {
    setQuery('');
    setCategoryId('');
    setStatus('');
    setStockFilter('');
    setSort('newest');
    setPage(1);
  };

  const hasFilters =
    Boolean(query) || Boolean(categoryId) || Boolean(status) || Boolean(stockFilter) || sort !== 'newest';

  const duplicate = (product: Product) => {
    const copy = duplicateProduct(product.id);
    setMenuFor(null);
    if (copy) {
      pushToast({
        title: 'نسخه کپی ساخته شد',
        description: `${copy.name} به‌عنوان پیش‌نویس ثبت شد.`,
        variant: 'success',
      });
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-display-sm text-ink-900">مدیریت محصولات</h2>
          <p className="mt-2 text-sm text-ink-500">
            <span className="tnum font-bold text-ink-700">{toPersianDigits(products.length)}</span>{' '}
            محصول ثبت شده است. تغییرات بلافاصله در فروشگاه اعمال می‌شود.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} leadingIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}>
            بازنشانی داده‌ها
          </Button>
          <ButtonLink href="/admin/products/new" size="sm" leadingIcon={<Plus className="h-3.5 w-3.5" aria-hidden />}>
            افزودن محصول
          </ButtonLink>
        </div>
      </header>

      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="جستجو بر اساس نام، برند یا کد کالا…"
            aria-label="جستجوی محصول"
            leadingIcon={<Search className="h-4 w-4" aria-hidden />}
          />
          <Select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setPage(1);
            }}
            aria-label="فیلتر دسته‌بندی"
            options={[
              { value: '', label: 'همه دسته‌بندی‌ها' },
              ...categories.map((category) => ({ value: category.id, label: category.name })),
            ]}
          />
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="فیلتر وضعیت"
            options={[
              { value: '', label: 'همه وضعیت‌ها' },
              { value: 'active', label: 'فعال' },
              { value: 'draft', label: 'پیش‌نویس' },
              { value: 'archived', label: 'بایگانی' },
            ]}
          />
          <Select
            value={stockFilter}
            onChange={(event) => {
              setStockFilter(event.target.value);
              setPage(1);
            }}
            aria-label="فیلتر موجودی"
            options={[
              { value: '', label: 'همه موجودی‌ها' },
              { value: 'in', label: 'موجود' },
              { value: 'low', label: 'کم‌موجودی' },
              { value: 'out', label: 'ناموجود' },
            ]}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-2xs text-ink-400">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            <span className="tnum">{toPersianDigits(filtered.length)}</span> نتیجه
          </p>
          <div className="flex items-center gap-2">
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="مرتب‌سازی"
              containerClassName="w-44"
              options={[
                { value: 'newest', label: 'آخرین تغییر' },
                { value: 'name', label: 'نام محصول' },
                { value: 'price-asc', label: 'ارزان‌ترین' },
                { value: 'price-desc', label: 'گران‌ترین' },
                { value: 'stock-asc', label: 'کم‌موجودترین' },
                { value: 'sold', label: 'پرفروش‌ترین' },
              ]}
            />
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                حذف فیلترها
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" aria-hidden />}
          title="محصولی با این شرایط پیدا نشد"
          description="فیلترها را تغییر دهید یا محصول جدیدی ثبت کنید."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={resetFilters}>حذف فیلترها</Button>
              <ButtonLink href="/admin/products/new">افزودن محصول</ButtonLink>
            </div>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[62rem] text-start text-xs">
              <caption className="sr-only">جدول مدیریت محصولات</caption>
              <thead>
                <tr className="border-b border-line bg-surface-muted text-2xs text-ink-400">
                  <th scope="col" className="w-10 px-4 py-3">
                    <span className="sr-only">انتخاب</span>
                  </th>
                  <th scope="col" className="px-2 py-3 text-start font-bold">محصول</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">دسته‌بندی</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">قیمت</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">موجودی</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">تخفیف</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">وضعیت</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">آخرین تغییر</th>
                  <th scope="col" className="px-4 py-3 text-start font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((product) => {
                  const category = categories.find((entry) => entry.id === product.categoryId);
                  const discount = discountPercent(product);
                  const low = product.stock > 0 && product.stock <= product.lowStockThreshold;
                  return (
                    <tr key={product.id} className="transition-colors hover:bg-surface-muted">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`انتخاب ${product.name}`}
                          className="h-4 w-4 rounded border-line-strong text-brand-500 focus:ring-brand-500/30"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                            <Image
                              src={product.images[0]?.src ?? '/media/products/p0-1.svg'}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-cover"
                            
                                priority
                              />
                          </span>
                          <span className="min-w-0">
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="block max-w-[18rem] truncate text-xs font-bold text-ink-800 hover:text-brand-700"
                            >
                              {product.name}
                            </Link>
                            <span className="tnum block text-[0.625rem] text-ink-400">
                              {product.sku} · {product.brand}
                            </span>
                            <span className="mt-1 flex flex-wrap gap-1">
                              {product.featured ? <Badge tone="brand" size="sm">ویژه</Badge> : null}
                              {product.bestseller ? <Badge tone="warning" size="sm">پرفروش</Badge> : null}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-2xs text-ink-500">{category?.name ?? '—'}</td>
                      <td className="tnum px-3 py-3">
                        <span className="block text-2xs font-bold text-ink-800">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice ? (
                          <span className="tnum block text-[0.625rem] text-ink-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        ) : null}
                      </td>
                      <td className="tnum px-3 py-3">
                        <span className={`text-2xs font-bold ${low ? 'text-warning-strong' : 'text-ink-700'}`}>
                          {toPersianDigits(product.stock)}
                        </span>
                        {product.stock === 0 ? (
                          <span className="block text-[0.625rem] text-danger-strong">ناموجود</span>
                        ) : low ? (
                          <span className="block text-[0.625rem] text-warning-strong">کم‌موجودی</span>
                        ) : null}
                      </td>
                      <td className="tnum px-3 py-3 text-2xs">
                        {discount > 0 ? (
                          <Badge tone="danger" size="sm">
                            {toPersianDigits(discount)}٪
                          </Badge>
                        ) : (
                          <span className="text-ink-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={STATUS_LABEL[product.status].tone} size="sm">
                          {STATUS_LABEL[product.status].label}
                        </Badge>
                      </td>
                      <td className="tnum px-3 py-3 text-2xs text-ink-400">
                        {formatShortDate(product.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Tooltip content="مشاهده در فروشگاه">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/products/${product.slug}`)}
                              aria-label={`مشاهده ${product.name} در فروشگاه`}
                              className="h-8 w-8"
                            >
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            </Button>
                          </Tooltip>
                          <Tooltip content="ویرایش">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                              aria-label={`ویرایش ${product.name}`}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                            </Button>
                          </Tooltip>
                          <Tooltip content="تغییر وضعیت انتشار">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                toggleProductStatus(product.id);
                                pushToast({
                                  title: product.status === 'active' ? 'محصول پیش‌نویس شد' : 'محصول منتشر شد',
                                  description: product.name,
                                  variant: 'info',
                                });
                              }}
                              aria-label={`تغییر وضعیت ${product.name}`}
                              className="h-8 w-8"
                            >
                              {product.status === 'active' ? (
                                <EyeOff className="h-3.5 w-3.5" aria-hidden />
                              ) : (
                                <Eye className="h-3.5 w-3.5" aria-hidden />
                              )}
                            </Button>
                          </Tooltip>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setMenuFor(menuFor === product.id ? null : product.id)}
                              aria-label={`گزینه‌های بیشتر برای ${product.name}`}
                              aria-expanded={menuFor === product.id}
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
                            </Button>
                            {menuFor === product.id ? (
                              <div className="absolute end-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-panel">
                                <MenuItem
                                  icon={Copy}
                                  label="ساخت نسخه کپی"
                                  onClick={() => duplicate(product)}
                                />
                                <MenuItem
                                  icon={product.featured ? Star : Sparkles}
                                  label={product.featured ? 'حذف از ویژه‌ها' : 'افزودن به ویژه‌ها'}
                                  onClick={() => {
                                    toggleProductFlag(product.id, 'featured');
                                    setMenuFor(null);
                                    pushToast({
                                      title: product.featured ? 'از ویژه‌ها حذف شد' : 'به ویژه‌ها اضافه شد',
                                      description: product.name,
                                      variant: 'info',
                                    });
                                  }}
                                />
                                <MenuItem
                                  icon={Sparkles}
                                  label={product.bestseller ? 'حذف پرفروش' : 'علامت پرفروش'}
                                  onClick={() => {
                                    toggleProductFlag(product.id, 'bestseller');
                                    setMenuFor(null);
                                  }}
                                />
                                <MenuItem
                                  icon={Trash2}
                                  label="حذف محصول"
                                  tone="danger"
                                  onClick={() => {
                                    setMenuFor(null);
                                    setDeleteTarget(product);
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
            <p className="tnum text-2xs text-ink-400">
              نمایش {toPersianDigits(rows.length)} از {toPersianDigits(filtered.length)} محصول
            </p>
            <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="حذف محصول"
        description={
          <>
            آیا از حذف «<span className="font-bold text-ink-800">{deleteTarget?.name}</span>» مطمئن
            هستید؟ این کالا از فروشگاه و دسته‌بندی مربوطه حذف می‌شود و قابل بازگشت نیست.
          </>
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteProduct(deleteTarget.id);
          pushToast({
            title: 'محصول حذف شد',
            description: deleteTarget.name,
            variant: 'danger',
          });
        }}
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        tone="primary"
        title="بازنشانی داده‌های نمونه"
        description="همه تغییرات محصولات، دسته‌بندی‌ها و بنرها حذف می‌شود و وضعیت اولیه دمو بازمی‌گردد. سبد خرید و علاقه‌مندی‌ها شما دست‌نخورده می‌ماند."
        confirmLabel="بازنشانی کن"
        onConfirm={() => {
          resetCatalog();
          pushToast({
            title: 'داده‌های نمونه بازنشانی شد',
            description: 'محصولات، دسته‌بندی‌ها و بنرها به وضعیت اولیه برگشتند.',
            variant: 'success',
          });
        }}
      />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-2xs font-bold transition-colors ${
        tone === 'danger'
          ? 'text-danger hover:bg-danger-soft'
          : 'text-ink-600 hover:bg-surface-sunken hover:text-ink-900'
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
    </button>
  );
}
