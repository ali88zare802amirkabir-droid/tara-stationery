'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input, Textarea, Select, RadioCards } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Overlay';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/Feedback';
import { useCatalogStore, type NewBannerInput } from '@/store/catalogStore';
import { useActiveBanners } from '@/hooks/useCatalog';
import { useUIStore } from '@/store/uiStore';
import { toPersianDigits } from '@/lib/format';
import type { Banner } from '@/types';

type Draft = NewBannerInput & { id?: string };

const emptyDraft: Draft = {
  title: '',
  subtitle: '',
  description: '',
  eyebrow: '',
  buttonText: '',
  buttonLink: '/products',
  secondaryButtonText: '',
  secondaryButtonLink: '/categories',
  image: '/media/banners/banner-1.svg',
  art: 'hero',
  theme: 'brand',
  status: 'draft',
  startsAt: null,
  endsAt: null,
};

const LINK_OPTIONS = [
  { value: '/products', label: 'همه محصولات' },
  { value: '/categories', label: 'دسته‌بندی‌ها' },
  { value: '/categories/lovaz-hanri', label: 'لوازم هنری' },
  { value: '/categories/kole-va-kif', label: 'کوله و کیف' },
  { value: '/categories/kado-va-fantazi', label: 'کادو و فانتزی' },
  { value: '/products?sort=discount-desc', label: 'تخفیف‌دارها' },
  { value: '/admin', label: 'پنل مدیریت' },
];

const THEME_PREVIEW = {
  brand: 'from-brand-50 via-surface to-white',
  mint: 'from-success-soft via-surface to-white',
  lilac: 'from-accent-soft via-surface to-white',
  sunset: 'from-warning-soft via-surface to-white',
} as const;

export function AdminBanners() {
  const banners = useCatalogStore((state) => state.banners);
  const addBanner = useCatalogStore((state) => state.addBanner);
  const updateBanner = useCatalogStore((state) => state.updateBanner);
  const deleteBanner = useCatalogStore((state) => state.deleteBanner);
  const reorderBanners = useCatalogStore((state) => state.reorderBanners);
  const pushToast = useUIStore((state) => state.pushToast);

  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const ordered = useMemo(
    () => banners.slice().sort((a, b) => a.order - b.order),
    [banners],
  );
  const liveBanners = useActiveBanners();

  const move = (id: string, direction: -1 | 1) => {
    const ids = ordered.map((banner) => banner.id);
    const index = ids.indexOf(id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderBanners(ids);
    pushToast({ title: 'ترتیب بنرها تغییر کرد', variant: 'info' });
  };

  const save = () => {
    if (!editing) return;
    if (editing.title.trim().length < 3) {
      setFormError('عنوان بنر باید حداقل ۳ نویسه باشد.');
      return;
    }
    if (editing.buttonText.trim() && !editing.buttonLink.trim()) {
      setFormError('اگر متن دکمه را وارد می‌کنید، لینک آن هم لازم است.');
      return;
    }

    const payload: NewBannerInput = {
      title: editing.title.trim(),
      subtitle: editing.subtitle.trim(),
      description: editing.description.trim(),
      eyebrow: editing.eyebrow.trim(),
      buttonText: editing.buttonText.trim(),
      buttonLink: editing.buttonLink.trim() || '/products',
      secondaryButtonText: editing.secondaryButtonText.trim(),
      secondaryButtonLink: editing.secondaryButtonLink.trim(),
      image: editing.image,
      art: editing.art,
      theme: editing.theme,
      status: editing.status,
      startsAt: editing.startsAt,
      endsAt: editing.endsAt,
    };

    if (editing.id) {
      updateBanner(editing.id, payload);
      pushToast({ title: 'بنر به‌روزرسانی شد', description: payload.title, variant: 'success' });
    } else {
      addBanner(payload);
      pushToast({ title: 'بنر جدید ساخته شد', description: payload.title, variant: 'success' });
    }
    setEditing(null);
    setFormError(null);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-display-sm text-ink-900">بنرها و اسلایدر صفحه اصلی</h2>
          <p className="mt-2 text-sm text-ink-500">
            بنر فعال با ترتیب بالاتر، در صفحه اصلی نمایش داده می‌شود. بنر پیش‌نویس در فروشگاه دیده
            نمی‌شود.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setFormError(null);
            setEditing({ ...emptyDraft });
          }}
          leadingIcon={<Plus className="h-3.5 w-3.5" aria-hidden />}
        >
          بنر جدید
        </Button>
      </header>

      <div className="rounded-3xl border border-brand-100 bg-brand-50/60 px-5 py-4">
        <p className="text-2xs text-brand-700">
          <span className="tnum font-extrabold">{toPersianDigits(liveBanners.length)}</span> بنر فعال
          وجود دارد. بنر اول به‌عنوان هیرو صفحه اصلی استفاده می‌شود.
        </p>
      </div>

      {ordered.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-6 w-6" aria-hidden />}
          title="هنوز بنری ساخته نشده"
          description="یک بنر بسازید تا در صفحه اصلی نمایش داده شود."
          action={
            <Button
              onClick={() => {
                setFormError(null);
                setEditing({ ...emptyDraft });
              }}
            >
              ساخت اولین بنر
            </Button>
          }
        />
      ) : (
        <ul className="space-y-4">
          {ordered.map((banner, index) => {
            const isPrimary = banner.status === 'active' && index === 0;
            return (
              <li key={banner.id}>
                <Card className="overflow-hidden">
                  <div className="grid gap-0 md:grid-cols-[18rem_1fr]">
                    <div className="relative aspect-[16/10] bg-canvas-soft md:aspect-auto md:min-h-[13rem]">
                      <Image
                        src={banner.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 288px, 92vw"
                        className="object-cover"
                      
                          priority
                        />
                      {isPrimary ? (
                        <span className="absolute end-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[0.625rem] font-extrabold text-white">
                          هیرو صفحه اصلی
                        </span>
                      ) : null}
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          {banner.eyebrow ? (
                            <p className="text-2xs font-bold text-brand-600">{banner.eyebrow}</p>
                          ) : null}
                          <h3 className="mt-1 text-sm font-extrabold text-ink-900">{banner.title}</h3>
                          {banner.subtitle ? (
                            <p className="mt-1 text-2xs text-ink-500">{banner.subtitle}</p>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            size="sm"
                            tone={banner.status === 'active' ? 'success' : 'warning'}
                          >
                            {banner.status === 'active' ? 'فعال' : 'پیش‌نویس'}
                          </Badge>
                          <Badge size="sm" tone="neutral">
                            {banner.theme}
                          </Badge>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2-fallback text-2xs leading-6 text-ink-500">
                        {banner.description || 'بدون توضیح'}
                      </p>

                      <dl className="mt-4 grid gap-2 text-2xs sm:grid-cols-2">
                        <div className="flex items-center gap-1.5">
                          <dt className="text-ink-400">دکمه اصلی:</dt>
                          <dd className="font-bold text-ink-700">
                            {banner.buttonText || '—'}
                            {banner.buttonText ? (
                              <code dir="ltr" className="ms-1.5 text-[0.625rem] text-ink-400">
                                {banner.buttonLink}
                              </code>
                            ) : null}
                          </dd>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <dt className="text-ink-400">دکمه دوم:</dt>
                          <dd className="font-bold text-ink-700">
                            {banner.secondaryButtonText || '—'}
                          </dd>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <dt className="text-ink-400">زمان‌بندی:</dt>
                          <dd className="tnum font-bold text-ink-700">
                            {banner.startsAt || banner.endsAt
                              ? `${banner.startsAt ?? '—'} تا ${banner.endsAt ?? '—'}`
                              : 'همیشه فعال'}
                          </dd>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <dt className="text-ink-400">ترتیب:</dt>
                          <dd className="tnum font-bold text-ink-700">
                            {toPersianDigits(banner.order)}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => move(banner.id, -1)}
                          disabled={index === 0}
                          aria-label={`انتقال بنر ${banner.title} به بالا`}
                          className="h-9 w-9"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => move(banner.id, 1)}
                          disabled={index === ordered.length - 1}
                          aria-label={`انتقال بنر ${banner.title} به پایین`}
                          className="h-9 w-9"
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            updateBanner(banner.id, {
                              status: banner.status === 'active' ? 'draft' : 'active',
                            });
                            pushToast({
                              title:
                                banner.status === 'active' ? 'بنر غیرفعال شد' : 'بنر فعال شد',
                              description: banner.title,
                              variant: 'info',
                            });
                          }}
                          leadingIcon={
                            banner.status === 'active' ? (
                              <EyeOff className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <Eye className="h-3.5 w-3.5" aria-hidden />
                            )
                          }
                        >
                          {banner.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormError(null);
                            setEditing({
                              id: banner.id,
                              title: banner.title,
                              subtitle: banner.subtitle,
                              description: banner.description,
                              eyebrow: banner.eyebrow,
                              buttonText: banner.buttonText,
                              buttonLink: banner.buttonLink,
                              secondaryButtonText: banner.secondaryButtonText,
                              secondaryButtonLink: banner.secondaryButtonLink,
                              image: banner.image,
                              art: banner.art,
                              theme: banner.theme,
                              status: banner.status,
                              startsAt: banner.startsAt,
                              endsAt: banner.endsAt,
                            });
                          }}
                          leadingIcon={<Pencil className="h-3.5 w-3.5" aria-hidden />}
                        >
                          ویرایش
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(banner)}
                          aria-label={`حذف بنر ${banner.title}`}
                          className="h-9 w-9 text-ink-400 hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                        <ButtonLink
                          href="/"
                          variant="ghost"
                          size="sm"
                          className="ms-auto"
                        >
                          مشاهده در سایت
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'ویرایش بنر' : 'بنر جدید'}
        description="محتوایی که در هیرو صفحه اصلی نمایش داده می‌شود."
        className="max-w-2xl"
      >
        {editing ? (
          <div className="space-y-4">
            {formError ? (
              <p className="rounded-2xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-2xs font-bold text-danger-strong">
                {formError}
              </p>
            ) : null}

            <div className={`relative overflow-hidden rounded-2xl border border-line bg-gradient-to-bl ${THEME_PREVIEW[editing.theme]} p-4`}>
              <p className="text-2xs font-bold text-brand-600">
                {editing.eyebrow || 'برچسب بالای عنوان'}
              </p>
              <p className="mt-1.5 text-sm font-extrabold text-ink-900">
                {editing.title || 'عنوان بنر اینجا نمایش داده می‌شود'}
              </p>
              <p className="mt-1 text-2xs text-ink-500">{editing.subtitle || 'زیرعنوان'}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-brand-600 px-3 py-1 text-[0.625rem] font-bold text-white">
                  {editing.buttonText || 'دکمه اصلی'}
                </span>
                {editing.secondaryButtonText ? (
                  <span className="rounded-full border border-line bg-surface px-3 py-1 text-[0.625rem] font-bold text-ink-600">
                    {editing.secondaryButtonText}
                  </span>
                ) : null}
              </div>
            </div>

            <Input
              label="برچسب بالای عنوان"
              value={editing.eyebrow}
              onChange={(event) => setEditing({ ...editing, eyebrow: event.target.value })}
              placeholder="مثال: فصل نو درس با تخفیف ویژه"
            />
            <Input
              label="عنوان اصلی"
              required
              value={editing.title}
              onChange={(event) => setEditing({ ...editing, title: event.target.value })}
              placeholder="عنوان بزرگ بنر"
            />
            <Input
              label="زیرعنوان"
              value={editing.subtitle}
              onChange={(event) => setEditing({ ...editing, subtitle: event.target.value })}
              placeholder="یک جمله کوتاه"
            />
            <Textarea
              label="توضیحات"
              rows={3}
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
              placeholder="توضیح کامل‌تر برای خواندن"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="متن دکمه اصلی"
                value={editing.buttonText}
                onChange={(event) => setEditing({ ...editing, buttonText: event.target.value })}
                placeholder="مشاهده محصولات"
              />
              <Select
                label="لینک دکمه اصلی"
                value={editing.buttonLink}
                onChange={(event) => setEditing({ ...editing, buttonLink: event.target.value })}
                options={LINK_OPTIONS}
              />
              <Input
                label="متن دکمه دوم"
                value={editing.secondaryButtonText}
                onChange={(event) =>
                  setEditing({ ...editing, secondaryButtonText: event.target.value })
                }
                placeholder="اختیاری"
              />
              <Select
                label="لینک دکمه دوم"
                value={editing.secondaryButtonLink}
                onChange={(event) =>
                  setEditing({ ...editing, secondaryButtonLink: event.target.value })
                }
                options={LINK_OPTIONS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="تصویر بنر"
                value={editing.image}
                onChange={(event) => setEditing({ ...editing, image: event.target.value })}
                options={[
                  ...['banner-1', 'banner-2', 'banner-3'].map((slug) => ({
                    value: `/media/banners/${slug}.svg`,
                    label: `بنر ${slug.replace('banner-', '')}`,
                  })),
                  { value: '/media/hero.svg', label: 'تصویر هیرو' },
                  { value: '/media/about.svg', label: 'تصویر درباره ما' },
                ]}
              />
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-bold text-ink-600">پوسته رنگی</p>
                <RadioCards
                  name="banner-theme"
                  value={editing.theme}
                  onChange={(value) =>
                    setEditing({ ...editing, theme: value as Banner['theme'] })
                  }
                  options={[
                    { value: 'brand', label: 'آبی' },
                    { value: 'mint', label: 'سبز' },
                    { value: 'lilac', label: 'بنفش' },
                    { value: 'sunset', label: 'گرم' },
                  ]}
                  columns={4}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="وضعیت"
                type="date"
                value={editing.startsAt ?? ''}
                onChange={(event) =>
                  setEditing({ ...editing, startsAt: event.target.value || null })
                }
                hint="اختیاری"
              />
              <Input
                label="پایان نمایش"
                type="date"
                value={editing.endsAt ?? ''}
                onChange={(event) => setEditing({ ...editing, endsAt: event.target.value || null })}
                hint="اختیاری"
              />
              <div>
                <p className="mb-2 text-xs font-bold text-ink-600">انتشار</p>
                <RadioCards
                  name="banner-status"
                  value={editing.status}
                  onChange={(value) => setEditing({ ...editing, status: value as Banner['status'] })}
                  options={[
                    { value: 'active', label: 'فعال' },
                    { value: 'draft', label: 'پیش‌نویس' },
                  ]}
                  columns={2}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                انصراف
              </Button>
              <Button onClick={save}>{editing.id ? 'ذخیره تغییرات' : 'ساخت بنر'}</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="حذف بنر"
        description={
          <>
            بنر «<span className="font-bold text-ink-800">{deleteTarget?.title}</span>» حذف می‌شود.
          </>
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteBanner(deleteTarget.id);
          pushToast({ title: 'بنر حذف شد', description: deleteTarget.title, variant: 'danger' });
        }}
      />
    </div>
  );
}
