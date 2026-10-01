'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  GripVertical,
  ImagePlus,
  Info,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Wand2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input, Textarea, Select, Switch, RadioCards, FieldShell } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Overlay';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Tooltip } from '@/components/ui/Disclosure';
import { useCatalogStore } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { productFormSchema, type ProductFormValues } from '@/lib/validation';
import { createId, slugify } from '@/lib/utils';
import { formatPrice, toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

/* ------------------------------------------------------------------ helpers */

const ART_LIBRARY = Array.from({ length: 32 }, (_, index) => index);

const defaultSpec = () => ({ id: createId('spec'), key: '', value: '' });
const defaultVariant = () => ({ id: createId('var'), name: '', values: [], enabled: true });

function buildDefaults(product: Product | null, threshold: number, nextArt: string): ProductFormValues {
  if (!product) {
    return {
      name: '',
      slug: '',
      sku: `NEW-${String(Date.now() % 100000).padStart(5, '0')}`,
      brand: '',
      categoryId: '',
      tagsInput: '',
      price: 100_000,
      comparePrice: '',
      discountOverride: false,
      manualDiscount: 10,
      stock: 20,
      lowStockThreshold: threshold,
      availability: 'in-stock',
      images: [{ src: `/media/products/p${nextArt}-1.svg`, alt: '' }],
      mainImageIndex: 0,
      shortDescription: '',
      description: '',
      featuresInput: '',
specifications: [defaultSpec()],
      variants: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywordsInput: '',
      status: 'draft',
      featured: false,
      bestseller: false,
      newProduct: false,
    };
  }

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    brand: product.brand,
    categoryId: product.categoryId,
    tagsInput: product.tags.join('، '),
    price: product.price,
    comparePrice: product.comparePrice ?? '',
    discountOverride: false,
    manualDiscount: 10,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    availability: product.stock > 0 ? 'in-stock' : 'out-of-stock',
    images: product.images.length > 0 ? product.images : [{ src: `/media/products/p${product.art}-1.svg`, alt: '' }],
    mainImageIndex: 0,
    shortDescription: product.shortDescription,
    description: product.description,
    featuresInput: product.features.join('\n'),
    specifications: product.specifications.length
      ? product.specifications.map((spec) => ({ id: createId('spec'), key: spec.key, value: spec.value }))
      : [defaultSpec()],
    variants: product.variants.length
      ? product.variants.map((variant) => ({ ...variant, id: createId('var') }))
      : [],
    seoTitle: product.seo.title,
    seoDescription: product.seo.description,
    seoKeywordsInput: product.seo.keywords.join('، '),
    status: product.status,
    featured: product.featured,
    bestseller: product.bestseller,
    newProduct: product.newProduct,
  };
}

  /**
 * Walks react-hook-form's nested error object and returns every message with a
 * readable label. A generic walker is used instead of a hand-maintained list so
 * newly added fields can never produce a silent "1 error" with no detail.
 */
const FIELD_LABELS: Record<string, string> = {
  name: 'نام محصول',
  slug: 'نشانی صفحه',
  sku: 'کد کالا',
  brand: 'برند',
  categoryId: 'دسته‌بندی',
  price: 'قیمت فروش',
  comparePrice: 'قیمت قبلی',
  manualDiscount: 'درصد تخفیف',
  stock: 'موجودی انبار',
  lowStockThreshold: 'حد هشدار موجودی',
  images: 'تصاویر محصول',
  mainImageIndex: 'تصویر اصلی',
  shortDescription: 'توضیح کوتاه',
  description: 'توضیح کامل',
  featuresInput: 'ویژگی‌ها',
  specifications: 'مشخصات فنی',
  key: 'عنوان مشخصه',
  value: 'مقدار مشخصه',
  variants: 'گزینه‌های محصول',
  seoTitle: 'عنوان سئو',
  seoDescription: 'توضیح سئو',
  seoKeywordsInput: 'کلمات کلیدی',
  status: 'وضعیت انتشار',
  availability: 'وضعیت فروش',
  tagsInput: 'برچسب‌ها',
};

function collectErrors(node: unknown, path: string[] = []): { label: string; message: string }[] {
  if (!node || typeof node !== 'object') return [];
  const record = node as Record<string, unknown>;
  const label = path.length ? FIELD_LABELS[path[path.length - 1]] ?? undefined : undefined;

  if (typeof record.message === 'string' && record.message) {
    const field = path[0] ? FIELD_LABELS[path[0]] : undefined;
    const inner = label && label !== field ? ` (${label})` : '';
    return [{ label: field ? `${field}${inner}` : 'ورودی', message: record.message }];
  }

  const out: { label: string; message: string }[] = [];
  for (const [key, value] of Object.entries(record)) {
    if (key === 'type' || key === 'ref') continue;
    out.push(...collectErrors(value, [...path, key]));
  }
  return out;
}

function Section({
  id,
  title,
  description,
  icon: Icon,
  children,
  action,
}: {
  id: string;
  title: string;
  description: string;
  icon: typeof Star;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card as="section" className="overflow-hidden" >
      <div id={id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-muted px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <Icon className="h-4.5 w-4.5" strokeWidth={1.9} aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-ink-900">{title}</h2>
            <p className="mt-0.5 text-2xs text-ink-400">{description}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

/* -------------------------------------------------------------------- form */

export function ProductForm({ product }: { product: Product | null }) {
  const router = useRouter();
  const categories = useCatalogStore((state) => state.categories);
  const products = useCatalogStore((state) => state.products);
  const settings = useCatalogStore((state) => state.settings);
  const addProduct = useCatalogStore((state) => state.addProduct);
  const updateProduct = useCatalogStore((state) => state.updateProduct);
  const deleteProduct = useCatalogStore((state) => state.deleteProduct);
  const duplicateProduct = useCatalogStore((state) => state.duplicateProduct);
  const pushToast = useUIStore((state) => state.pushToast);

  const brands = useMemo(
    () => Array.from(new Set(products.map((entry) => entry.brand))).sort(),
    [products],
  );

  const nextArt = useMemo(() => {
    const used = new Set(products.map((entry) => Number(entry.art) || 0));
    let index = 0;
    while (used.has(index) && index < 32) index += 1;
    return String(index);
  }, [products]);

  const isEdit = Boolean(product);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormValues>,
    mode: 'onBlur',
    defaultValues: buildDefaults(product, settings.defaultLowStockThreshold, nextArt),
  });

  const specs = useFieldArray({ control, name: 'specifications' });
  const variants = useFieldArray({ control, name: 'variants' });
  const images = useFieldArray({ control, name: 'images' });

  useEffect(() => {
    if (product) {
      reset(buildDefaults(product, settings.defaultLowStockThreshold, nextArt));
    }
  }, [product, settings.defaultLowStockThreshold, nextArt, reset]);

  const values = watch();
  const price = Number(values.price) || 0;
  const comparePrice = typeof values.comparePrice === 'number' ? values.comparePrice : null;
  const manualDiscount = Number(values.manualDiscount) || 0;
  const effectiveComparePrice =
    values.discountOverride && manualDiscount > 0
      ? Math.round(price / (1 - Math.min(manualDiscount, 89) / 100))
      : comparePrice;
  const effectiveDiscount =
    effectiveComparePrice && effectiveComparePrice > price
      ? Math.round(((effectiveComparePrice - price) / effectiveComparePrice) * 100)
      : 0;

  const generateSlug = () => {
    const slug = slugify(values.name);
    setValue('slug', slug, { shouldValidate: true, shouldDirty: true });
  };

  const generateSeo = () => {
    setValue('seoTitle', `${values.name} | خرید با قیمت مناسب از تارا`, {
      shouldDirty: true,
    });
    setValue('seoDescription', values.shortDescription, { shouldDirty: true });
    setValue(
      'seoKeywordsInput',
      [values.brand, ...values.tagsInput.split(/[،,]/).map((tag) => tag.trim())]
        .filter(Boolean)
        .join('، '),
      { shouldDirty: true },
    );
  };

  const onSubmit = handleSubmit((data) => {
    const tags = data.tagsInput
      .split(/[،,]/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const features = data.featuresInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const gallery = data.images.map((image, index) => ({
      src: image.src,
      alt: image.alt.trim() || `${data.name} — نمای ${index + 1}`,
    }));

    const stock = data.availability === 'out-of-stock' ? 0 : data.stock;

    const payload = {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      brand: data.brand,
      categoryId: data.categoryId,
      price: data.price,
      comparePrice: effectiveComparePrice && effectiveComparePrice > data.price ? effectiveComparePrice : null,
      stock,
      lowStockThreshold: data.lowStockThreshold,
      rating: product?.rating ?? 0,
      reviewCount: product?.reviewCount ?? 0,
      soldCount: product?.soldCount ?? 0,
      images: gallery,
      shortDescription: data.shortDescription,
      description: data.description,
      features,
      specifications: data.specifications
        .filter((spec) => spec.key.trim() && spec.value.trim())
        .map((spec) => ({ key: spec.key.trim(), value: spec.value.trim() })),
      variants: data.variants
        .filter((variant) => variant.name.trim() && variant.values.filter(Boolean).length > 0)
        .map((variant, index) => ({
          id: variant.id || `var_${index}`,
          name: variant.name.trim(),
          values: variant.values.filter(Boolean),
          enabled: variant.enabled,
        })),
      tags,
      featured: data.featured,
      bestseller: data.bestseller,
      newProduct: data.newProduct,
      status: data.status,
      seo: {
        title: data.seoTitle.trim() || `${data.name} | خرید با قیمت مناسب از تارا`,
        description: data.seoDescription.trim() || data.shortDescription,
        keywords: data.seoKeywordsInput
          .split(/[،,]/)
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      },
      art: product?.art ?? nextArt,
    };

    if (isEdit && product) {
      updateProduct(product.id, payload);
      pushToast({
        title: 'محصول به‌روزرسانی شد',
        description: payload.name,
        variant: 'success',
      });
      router.push('/admin/products');
    } else {
      const created = addProduct(payload);
      pushToast({
        title: 'محصول جدید ثبت شد',
        description: created.name,
        variant: 'success',
      });
      router.push(`/admin/products/${created.id}/edit`);
    }
  },
  () => {
    // Bring the error summary into view so the merchant never has to hunt for it.
    window.setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  });

  const [artPickerOpen, setArtPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [variantDraft, setVariantDraft] = useState<Record<string, string>>({});
  /** True once the merchant types in the slug field, after which we stop syncing it. */
  const [slugEdited, setSlugEdited] = useState(false);

  const errorSummary = useMemo(() => {
    const seen = new Set<string>();
    return collectErrors(errors).filter((item) => {
      const key = `${item.label}|${item.message}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [errors]);

  const summaryRef = useRef<HTMLDivElement>(null);

  const onNameChange = (name: string, apply: (value: string) => void) => {
    apply(name);
    if (!slugEdited) setValue('slug', slugify(name));
  };

  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-2xs font-bold text-ink-400 transition-colors hover:text-brand-700"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            بازگشت به فهرست محصولات
          </Link>
          <h2 className="mt-2 text-display-sm text-ink-900">
            {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            {isEdit ? (
              <>
                در حال ویرایش: <span className="font-bold text-ink-700">{product?.name}</span>
              </>
            ) : (
              'اطلاعات کالا را کامل کنید تا در فروشگاه نمایش داده شود.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEdit && product ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const copy = duplicateProduct(product.id);
                if (copy) {
                  pushToast({ title: 'نسخه کپی ساخته شد', description: copy.name, variant: 'success' });
                  router.push(`/admin/products/${copy.id}/edit`);
                }
              }}
              leadingIcon={<Copy className="h-3.5 w-3.5" aria-hidden />}
            >
              کپی محصول
            </Button>
          ) : null}
          <ButtonLink href="/admin/products" variant="outline" size="sm">
            انصراف
          </ButtonLink>
          <Button type="submit" size="sm" loading={isSubmitting} leadingIcon={<Save className="h-3.5 w-3.5" aria-hidden />}>
            {isEdit ? 'ذخیره تغییرات' : 'ثبت محصول'}
          </Button>
        </div>
      </header>

      {errors.root ? (
        <p className="flex items-center gap-2 rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-xs font-bold text-danger-strong">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          {errors.root.message}
        </p>
      ) : errorSummary.length > 0 ? (
        <div ref={summaryRef} className="rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-extrabold text-danger-strong">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            فرم با {toPersianDigits(errorSummary.length)} خطا ارسال نشد — لطفاً موارد زیر را اصلاح کنید:
          </p>
          <ul className="mt-2 space-y-1 ps-6 text-2xs text-danger-strong/90">
            {errorSummary.map((item) => (
              <li key={`${item.label}-${item.message}`} className="list-disc leading-5">
                <span className="font-extrabold">{item.label}:</span> {item.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-5">
          {/* ── basics ─────────────────────────────────────────────── */}
          <Section
            id="basics"
            title="اطلاعات پایه"
            description="نام، شناسه و جای‌گذاری کالا در فروشگاه"
            icon={Info}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    label="نام محصول"
                    required
                    placeholder="مثلاً: خودکار ژله‌ای پنتر مدل X7"
                    error={errors.name?.message}
                    name={field.name}
                    value={field.value}
                    onChange={(event) => onNameChange(event.target.value, field.onChange)}
                    onBlur={field.onBlur}
                    containerClassName="sm:col-span-2"
                  />
                )}
              />

              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <FieldShell
                    label="نشانی صفحه (slug)"
                    required
                    htmlFor="slug"
                    error={errors.slug?.message}
                    hint="در آدرس صفحه محصول استفاده می‌شود و از روی نام ساخته می‌شود."
                    action={
                      <button
                        type="button"
                        onClick={() => {
                          generateSlug();
                          setSlugEdited(false);
                        }}
                        disabled={!values.name}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[0.625rem] font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-40"
                      >
                        <Wand2 className="h-3 w-3" aria-hidden />
                        ساخت خودکار
                      </button>
                    }
                  >
                    <input
                      id="slug"
                      dir="ltr"
                      {...field}
                      onChange={(event) => {
                        setSlugEdited(true);
                        field.onChange(event);
                      }}
                      className={cn(
                        'h-11 w-full rounded-2xl border bg-surface px-3.5 text-sm text-ink-800 outline-none transition-colors focus:ring-4',
                        errors.slug
                          ? 'border-danger/60 focus:border-danger focus:ring-danger/15'
                          : 'border-line focus:border-brand-400 focus:ring-brand-500/15',
                      )}
                    />
                  </FieldShell>
                )}
              />

              <Controller
                control={control}
                name="sku"
                render={({ field }) => (
                  <Input
                    label="کد کالا (SKU)"
                    required
                    dir="ltr"
                    error={errors.sku?.message}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="text-end"
                  />
                )}
              />

              <Controller
                control={control}
                name="brand"
                render={({ field }) => (
                  <Select
                    label="برند"
                    required
                    placeholder="انتخاب برند"
                    error={errors.brand?.message}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={brands.map((brand) => ({ value: brand, label: brand }))}
                  />
                )}
              />

              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    label="دسته‌بندی"
                    required
                    placeholder="انتخاب دسته‌بندی"
                    error={errors.categoryId?.message}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={categories.map((category) => ({ value: category.id, label: category.name }))}
                  />
                )}
              />

              <Controller
                control={control}
                name="tagsInput"
                render={({ field }) => (
                  <Input
                    label="برچسب‌ها"
                    placeholder="خودکار، نوشت‌افزار، اداری"
                    hint="با ویرگول جدا کنید؛ در فیلترها و جستجو استفاده می‌شود."
                    containerClassName="sm:col-span-2"
                    {...field}
                  />
                )}
              />
            </div>
          </Section>

          {/* ── pricing ────────────────────────────────────────────── */}
          <Section
            id="pricing"
            title="قیمت‌گذاری"
            description="قیمت فروش، قیمت قبلی و درصد تخفیف"
            icon={Sparkles}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Controller
                control={control}
                name="price"
                render={({ field }) => (
                  <Input
                    label="قیمت فروش (تومان)"
                    required
                    type="number"
                    inputMode="numeric"
                    error={errors.price?.message}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              {values.discountOverride ? (
                <Controller
                  control={control}
                  name="manualDiscount"
                  render={({ field }) => (
                    <Input
                      label="درصد تخفیف"
                      required
                      type="number"
                      inputMode="numeric"
                      error={errors.manualDiscount?.message}
                      hint={
                        effectiveComparePrice
                          ? `قیمت قبلی: ${formatPrice(effectiveComparePrice)} تومان`
                          : 'درصد تخفیف را وارد کنید.'
                      }
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name="comparePrice"
                  render={({ field }) => (
                    <Input
                      label="قیمت قبلی (تومان)"
                      type="number"
                      inputMode="numeric"
                      hint="برای نمایش تخفیف خالی بگذارید."
                      error={errors.comparePrice?.message}
                      name={field.name}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              )}

              <Controller
                control={control}
                name="discountOverride"
                render={({ field }) => (
                  <FieldShell label="روش تخفیف" hint="یا قیمت قبلی، یا درصد دستی.">
                    <label className="flex h-11 cursor-pointer items-center gap-2.5 rounded-2xl border border-line px-3.5 text-xs font-bold text-ink-600 transition-colors hover:border-brand-300">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.checked);
                          if (event.target.checked) {
                            setValue('comparePrice', '', { shouldDirty: true });
                          }
                        }}
                        className="h-4 w-4 rounded border-line-strong text-brand-500 focus:ring-brand-500/30"
                      />
                      تعیین درصد دستی
                    </label>
                  </FieldShell>
                )}
              />
            </div>

            {values.discountOverride ? (
              <div className="mt-4">
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={1}
                  value={manualDiscount}
                  onChange={(event) =>
                    setValue('manualDiscount', Number(event.target.value), { shouldDirty: true })
                  }
                  aria-label="درصد تخفیف"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-brand-500"
                />
                <div className="mt-1.5 flex items-center justify-between text-2xs text-ink-400">
                  <span className="tnum">۰٪</span>
                  <span className="tnum font-bold text-brand-700">{toPersianDigits(manualDiscount)}٪</span>
                  <span className="tnum">۹۰٪</span>
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-canvas-soft px-4 py-3">
              <p className="text-2xs text-ink-500">پیش‌نمایش قیمت در فروشگاه:</p>
              <p className="tnum text-sm font-extrabold text-ink-900">
                {formatPrice(price)} تومان
              </p>
              {effectiveComparePrice && effectiveComparePrice > price ? (
                <>
                  <p className="tnum text-xs text-ink-300 line-through">
                    {formatPrice(effectiveComparePrice)} تومان
                  </p>
                  <Badge tone="danger">{toPersianDigits(effectiveDiscount)}٪ تخفیف</Badge>
                </>
              ) : (
                <Badge tone="neutral">بدون تخفیف</Badge>
              )}
            </div>
          </Section>

          {/* ── inventory ──────────────────────────────────────────── */}
          <Section
            id="inventory"
            title="موجودی و انبار"
            description="تعداد موجودی، حد هشدار و وضعیت قابل فروش"
            icon={Star}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Controller
                control={control}
                name="stock"
                render={({ field }) => (
                  <Input
                    label="موجودی انبار"
                    required
                    type="number"
                    inputMode="numeric"
                    error={errors.stock?.message}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                control={control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <Input
                    label="حد هشدار کمبود موجودی"
                    required
                    type="number"
                    inputMode="numeric"
                    error={errors.lowStockThreshold?.message}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                control={control}
                name="availability"
                render={({ field }) => (
                  <FieldShell label="وضعیت فروش">
                    <RadioCards
                      name="availability"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'in-stock', label: 'قابل فروش' },
                        { value: 'backorder', label: 'سفارشی' },
                        { value: 'out-of-stock', label: 'ناموجود' },
                      ]}
                      columns={3}
                    />
                  </FieldShell>
                )}
              />
            </div>
          </Section>

          {/* ── images ─────────────────────────────────────────────── */}
          <Section
            id="images"
            title="تصاویر محصول"
            description="تصویر اصلی و گالری (حداکثر ۶ تصویر)"
            icon={ImagePlus}
            action={
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => {
                  if (images.fields.length >= 6) {
                    pushToast({ title: 'حداکثر ۶ تصویر قابل انتخاب است', variant: 'warning' });
                    return;
                  }
                  images.append({ src: `/media/products/p${nextArt}-1.svg`, alt: '' });
                }}
                leadingIcon={<Plus className="h-3.5 w-3.5" aria-hidden />}
              >
                افزودن تصویر
              </Button>
            }
          >
            {errors.images ? (
              <p className="mb-3 text-2xs font-medium text-danger">{errors.images.message}</p>
            ) : null}

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.fields.map((field, index) => (
                <li
                  key={field.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 bg-surface-sunken transition-colors',
                    values.mainImageIndex === index ? 'border-brand-500' : 'border-transparent',
                  )}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={field.src}
                      alt={field.alt || `تصویر ${index + 1}`}
                      fill
                      sizes="(min-width: 640px) 200px, 45vw"
                      className="object-cover"
                    
                        priority
                      />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink-900/85 to-transparent p-2">
                    <label className="flex cursor-pointer items-center gap-1.5 text-2xs font-bold text-white">
                      <input
                        type="radio"
                        name="mainImageIndex"
                        checked={values.mainImageIndex === index}
                        onChange={() => setValue('mainImageIndex', index, { shouldDirty: true })}
                        className="h-3.5 w-3.5 border-white/40 text-brand-500"
                      />
                      اصلی
                    </label>
                    <div className="flex items-center gap-0.5">
                      <Tooltip content="انتقال به ابتدا">
                        <button
                          type="button"
                          onClick={() => images.move(index, 0)}
                          disabled={index === 0}
                          aria-label={`انتقال تصویر ${index + 1} به ابتدا`}
                          className="grid h-7 w-7 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/15 disabled:opacity-30"
                        >
                          <GripVertical className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </Tooltip>
                      <button
                        type="button"
                        onClick={() => images.remove(index)}
                        disabled={images.fields.length <= 1}
                        aria-label={`حذف تصویر ${index + 1}`}
                        className="grid h-7 w-7 place-items-center rounded-lg text-white/80 transition-colors hover:bg-danger disabled:opacity-30"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>

                  {values.mainImageIndex === index ? (
                    <span className="absolute end-2 top-2 rounded-full bg-brand-500 px-2 py-0.5 text-[0.625rem] font-extrabold text-white">
                      تصویر اصلی
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setArtPickerOpen(true)}
              leadingIcon={<ImagePlus className="h-3.5 w-3.5" aria-hidden />}
            >
              انتخاب از کتابخانه تصاویر
            </Button>

            <div className="mt-4 grid gap-3">
              {images.fields.map((field, index) => (
                <Input
                  key={field.id}
                  label={`متن جایگزین تصویر ${toPersianDigits(index + 1)}`}
                  placeholder="توضیح تصویر برای صفحه‌خوان‌ها"
                  value={field.alt}
                  onChange={(event) =>
                    images.update(index, { ...field, alt: event.target.value })
                  }
                />
              ))}
            </div>
          </Section>

          {/* ── description ────────────────────────────────────────── */}
          <Section
            id="description"
            title="توضیحات محصول"
            description="توضیح کوتاه برای کارت محصول و متن کامل صفحه"
            icon={Info}
          >
            <div className="space-y-4">
              <Controller
                control={control}
                name="shortDescription"
                render={({ field }) => (
                  <Textarea
                    label="توضیح کوتاه"
                    required
                    rows={2}
                    error={errors.shortDescription?.message}
                    hint={`${toPersianDigits(field.value?.length ?? 0)} از ۱۸۰ نویسه`}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    label="توضیح کامل"
                    required
                    rows={8}
                    error={errors.description?.message}
                    hint="هر بند را در یک خط بنویسید؛ فاصله خالی بندها را جدا می‌کند."
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="featuresInput"
                render={({ field }) => (
                  <Textarea
                    label="ویژگی‌های شاخص"
                    rows={5}
                    placeholder={'مخزن ژله‌ای با جریان یکنواخت جوهر\nنوک ۰٫۷ میلی‌متر برای نوشتار ریز'}
                    hint="هر ویژگی در یک خط."
                    {...field}
                  />
                )}
              />
            </div>
          </Section>

          {/* ── specifications ─────────────────────────────────────── */}
          <Section
            id="specifications"
            title="مشخصات فنی"
            description="جفت کلید و مقدار، دلخواه و پویا"
            icon={Info}
            action={
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => specs.append(defaultSpec())}
                leadingIcon={<Plus className="h-3.5 w-3.5" aria-hidden />}
              >
                افزودن مشخصه
              </Button>
            }
          >
            {errors.specifications ? (
              <p className="mb-3 text-2xs font-medium text-danger">{errors.specifications.message}</p>
            ) : null}

            <ul className="space-y-2.5">
              {specs.fields.map((field, index) => (
                <li key={field.id} className="flex items-start gap-2">
                  <Controller
                    control={control}
                    name={`specifications.${index}.key`}
                    render={({ field: specField }) => (
                      <Input
                        {...specField}
                        placeholder="عنوان (مثلاً رنگ)"
                        aria-label={`عنوان مشخصه ${index + 1}`}
                        className="sm:w-2/5"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`specifications.${index}.value`}
                    render={({ field: specField }) => (
                      <Input
                        {...specField}
                        placeholder="مقدار (مثلاً آبی)"
                        aria-label={`مقدار مشخصه ${index + 1}`}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => specs.remove(index)}
                    aria-label={`حذف مشخصه ${index + 1}`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line text-ink-300 transition-colors hover:border-danger/30 hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            {specs.fields.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line-strong px-4 py-6 text-center text-2xs text-ink-400">
                هنوز مشخصه‌ای اضافه نشده است.
              </p>
            ) : null}
          </Section>

          {/* ── variants ──────────────────────────────────────────── */}
          <Section
            id="variants"
            title="گزینه‌های محصول"
            description="رنگ، سایز یا مدل — هر محور با مقادیر خودش"
            icon={Info}
            action={
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => variants.append(defaultVariant())}
                leadingIcon={<Plus className="h-3.5 w-3.5" aria-hidden />}
              >
                افزودن گزینه
              </Button>
            }
          >
            {variants.fields.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line-strong px-4 py-6 text-center text-2xs text-ink-400">
                این محصول گزینه‌هایی ندارد. برای کالاهایی مثل خودکار چندرنگ، یک محور رنگ اضافه
                کنید.
              </p>
            ) : (
              <ul className="space-y-4">
                {variants.fields.map((field, index) => (
                  <li key={field.id} className="rounded-2xl border border-line bg-canvas-soft p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Controller
                        control={control}
                        name={`variants.${index}.name`}
                        render={({ field: variantField }) => (
                          <Input
                            {...variantField}
                            placeholder="نام محور (مثلاً رنگ)"
                            aria-label={`نام گزینه ${index + 1}`}
                            containerClassName="w-40"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`variants.${index}.enabled`}
                        render={({ field: variantField }) => (
                          <Switch
                            label="فعال"
                            checked={variantField.value}
                            onChange={(event) => variantField.onChange(event.target.checked)}
                            className="w-auto"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => variants.remove(index)}
                        aria-label={`حذف گزینه ${index + 1}`}
                        className="ms-auto grid h-9 w-9 place-items-center rounded-xl text-ink-300 transition-colors hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>

                    <div className="mt-3">
                      <Controller
                        control={control}
                        name={`variants.${index}.values`}
                        render={({ field: variantField }) => (
                          <FieldShell
                            label="مقادیر"
                            error={errors.variants?.[index]?.values?.message}
                            hint="با Enter یا ویرگول هر مقدار را اضافه کنید."
                          >
                            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-surface p-2.5">
                              {variantField.value.map((value, valueIndex) => (
                                <span
                                  key={`${value}-${valueIndex}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-2xs font-bold text-brand-700"
                                >
                                  {value}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      variantField.onChange(
                                        variantField.value.filter((_, i) => i !== valueIndex),
                                      )
                                    }
                                    aria-label={`حذف مقدار ${value}`}
                                    className="text-brand-400 transition-colors hover:text-brand-700"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                              <input
                                value={variantDraft[field.id] ?? ''}
                                onChange={(event) =>
                                  setVariantDraft((prev) => ({ ...prev, [field.id]: event.target.value }))
                                }
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ',') {
                                    event.preventDefault();
                                    const raw = (variantDraft[field.id] ?? '').trim();
                                    if (!raw) return;
                                    variantField.onChange([...variantField.value, raw]);
                                    setVariantDraft((prev) => ({ ...prev, [field.id]: '' }));
                                  }
                                }}
                                placeholder="مقدار جدید…"
                                aria-label={`افزودن مقدار به گزینه ${index + 1}`}
                                className="min-w-28 flex-1 bg-transparent px-1.5 py-1 text-2xs text-ink-800 outline-none placeholder:text-ink-300"
                              />
                            </div>
                          </FieldShell>
                        )}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* ── seo ───────────────────────────────────────────────── */}
          <Section
            id="seo"
            title="سئو و اشتراک‌گذاری"
            description="عنوان و توضیحی که در نتایج جستجو نمایش داده می‌شود"
            icon={Sparkles}
            action={
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={generateSeo}
                leadingIcon={<Wand2 className="h-3.5 w-3.5" aria-hidden />}
              >
                ساخت خودکار
              </Button>
            }
          >
            <div className="space-y-4">
              <Controller
                control={control}
                name="seoTitle"
                render={({ field }) => (
                  <Input
                    label="عنوان سئو"
                    error={errors.seoTitle?.message}
                    hint={`${toPersianDigits(field.value?.length ?? 0)} از ۷۰ نویسه`}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="seoDescription"
                render={({ field }) => (
                  <Textarea
                    label="توضیح سئو"
                    rows={3}
                    error={errors.seoDescription?.message}
                    hint={`${toPersianDigits(field.value?.length ?? 0)} از ۱۸۰ نویسه`}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="seoKeywordsInput"
                render={({ field }) => (
                  <Input
                    label="کلمات کلیدی"
                    placeholder="خودکار، نوشت‌افزار، پنتر"
                    hint="با ویرگول جدا کنید."
                    {...field}
                  />
                )}
              />
            </div>
          </Section>
        </div>

        {/* ── sidebar ────────────────────────────────────────────── */}
        <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <Section id="status" title="وضعیت انتشار" description="نمایش کالا در فروشگاه" icon={Check}>
            <div className="space-y-4">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <RadioCards
                    name="product-status"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: 'active', label: 'منتشرشده', description: 'در فروشگاه دیده می‌شود' },
                      { value: 'draft', label: 'پیش‌نویس', description: 'فقط در پنل دیده می‌شود' },
                      { value: 'archived', label: 'بایگانی', description: 'پنهان از فروشگاه' },
                    ]}
                    columns={1}
                  />
                )}
              />

              <div className="space-y-3 border-t border-line pt-4">
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => (
                    <Switch
                      label="محصول ویژه"
                      description="در بخش منتخب صفحه اصلی"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="bestseller"
                  render={({ field }) => (
                    <Switch
                      label="پرفروش"
                      description="نمایش نشان پرفروش"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="newProduct"
                  render={({ field }) => (
                    <Switch
                      label="محصول جدید"
                      description="نمایش نشان جدید"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  )}
                />
              </div>
            </div>
          </Section>

          <Card className="p-5">
            <h3 className="text-sm font-extrabold text-ink-900">خلاصه تغییرات</h3>
            <dl className="mt-3 space-y-2.5 text-2xs">
              <div className="flex items-center justify-between">
                <dt className="text-ink-400">قیمت فروش</dt>
                <dd className="tnum font-bold text-ink-800">{formatPrice(price)} تومان</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-400">تخفیف</dt>
                <dd className="tnum font-bold text-ink-800">
                  {toPersianDigits(effectiveDiscount)}٪
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-400">موجودی</dt>
                <dd className="tnum font-bold text-ink-800">
                  {toPersianDigits(values.stock)} عدد
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-400">وضعیت</dt>
                <dd>
                  <Badge
                    tone={
                      values.status === 'active' ? 'success' : values.status === 'draft' ? 'warning' : 'neutral'
                    }
                    size="sm"
                  >
                    {values.status === 'active' ? 'منتشرشده' : values.status === 'draft' ? 'پیش‌نویس' : 'بایگانی'}
                  </Badge>
                </dd>
              </div>
            </dl>

            {isDirty ? (
              <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-warning-soft px-3 py-2 text-2xs font-bold text-warning-strong">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                تغییرات ذخیره نشده است.
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-2">
              <Button type="submit" fullWidth loading={isSubmitting} leadingIcon={<Save className="h-4 w-4" aria-hidden />}>
                {isEdit ? 'ذخیره تغییرات' : 'ثبت محصول'}
              </Button>
              <ButtonLink href="/admin/products" variant="outline" fullWidth>
                انصراف و بازگشت
              </ButtonLink>
              {isEdit && product ? (
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => setDeleteOpen(true)}
                  leadingIcon={<Trash2 className="h-4 w-4" aria-hidden />}
                  className="text-danger hover:bg-danger-soft"
                >
                  حذف محصول
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </div>

      {/* ── art library modal ─────────────────────────────────────── */}
      <Modal
        open={artPickerOpen}
        onClose={() => setArtPickerOpen(false)}
        title="کتابخانه تصاویر"
        description="تصاویر این پروژه به‌صورت برداری و سبک تولید شده‌اند. یکی را برای تصویر انتخاب‌شده انتخاب کنید."
        className="max-w-3xl"
      >
        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {ART_LIBRARY.map((artIndex) => (
            <li key={artIndex}>
              <button
                type="button"
                onClick={() => {
                  const target = values.mainImageIndex;
                  const current = images.fields[target];
                  if (current) {
                    images.update(target, { ...current, src: `/media/products/p${artIndex}-1.svg` });
                  }
                  setArtPickerOpen(false);
                }}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl border-2 border-transparent transition-colors hover:border-brand-400"
              >
                <Image
                  src={`/media/products/p${artIndex}-1.svg`}
                  alt={`تصویر ${toPersianDigits(artIndex + 1)}`}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                
                    priority
                  />
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="حذف محصول"
        description={
          <>
            «<span className="font-bold text-ink-800">{product?.name}</span>» برای همیشه حذف
            می‌شود.
          </>
        }
        onConfirm={() => {
          if (!product) return;
          deleteProduct(product.id);
          pushToast({ title: 'محصول حذف شد', description: product.name, variant: 'danger' });
          router.push('/admin/products');
        }}
      />
    </form>
  );
}
