'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FolderTree, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, RadioCards } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Overlay';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/Feedback';
import { useCatalogStore, type NewCategoryInput } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { toPersianDigits } from '@/lib/format';
import { normalizeFa } from '@/lib/utils';
import type { Category } from '@/types';

const ICON_CHOICES = [
  'PenTool',
  'Notebook',
  'GraduationCap',
  'Palette',
  'Backpack',
  'Triangle',
  'Briefcase',
  'Gift',
];

type Draft = NewCategoryInput & { id?: string };

const emptyDraft: Draft = {
  slug: '',
  name: '',
  description: '',
  longDescription: '',
  icon: 'PenTool',
  image: '/media/categories/category-writing.svg',
  parentId: null,
  status: 'active',
  seoTitle: '',
  seoDescription: '',
};

export function AdminCategories() {
  const categories = useCatalogStore((state) => state.categories);
  const products = useCatalogStore((state) => state.products);
  const addCategory = useCatalogStore((state) => state.addCategory);
  const updateCategory = useCatalogStore((state) => state.updateCategory);
  const deleteCategory = useCatalogStore((state) => state.deleteCategory);
  const resetCategories = useCatalogStore((state) => state.resetCategories);
  const pushToast = useUIStore((state) => state.pushToast);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = normalizeFa(query);
    return categories
      .filter((category) => {
        if (term && !normalizeFa(`${category.name} ${category.description}`).includes(term)) return false;
        if (statusFilter && category.status !== statusFilter) return false;
        return true;
      })
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [categories, query, statusFilter]);

  const countFor = (categoryId: string) =>
    products.filter((product) => product.categoryId === categoryId).length;

  const save = () => {
    if (!editing) return;
    const name = editing.name.trim();
    if (name.length < 2) {
      setFormError('نام دسته‌بندی باید حداقل ۲ نویسه باشد.');
      return;
    }
    if (editing.slug && !/^[a-z0-9-]+$/.test(editing.slug)) {
      setFormError('نشانی فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.');
      return;
    }
    if (!editing.description.trim()) {
      setFormError('توضیح کوتاه الزامی است.');
      return;
    }

    const payload: NewCategoryInput = {
      slug: editing.slug.trim(),
      name,
      description: editing.description.trim(),
      longDescription: editing.longDescription.trim() || editing.description.trim(),
      icon: editing.icon,
      image: editing.image,
      parentId: editing.parentId,
      status: editing.status,
      seoTitle: editing.seoTitle.trim() || `${name} | خرید از تارا`,
      seoDescription: editing.seoDescription.trim() || editing.description.trim(),
    };

    if (editing.id) {
      updateCategory(editing.id, payload);
      pushToast({ title: 'دسته‌بندی به‌روزرسانی شد', description: name, variant: 'success' });
    } else {
      addCategory(payload);
      pushToast({ title: 'دسته‌بندی ساخته شد', description: name, variant: 'success' });
    }
    setEditing(null);
    setFormError(null);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-display-sm text-ink-900">مدیریت دسته‌بندی‌ها</h2>
          <p className="mt-2 text-sm text-ink-500">
            <span className="tnum font-bold text-ink-700">{toPersianDigits(categories.length)}</span>{' '}
            دسته‌بندی ثبت شده است. تغییرات بلافاصله در فروشگاه دیده می‌شود.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetOpen(true)}
            leadingIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
          >
            بازنشانی
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setFormError(null);
              setEditing({ ...emptyDraft });
            }}
            leadingIcon={<Plus className="h-3.5 w-3.5" aria-hidden />}
          >
            دسته‌بندی جدید
          </Button>
        </div>
      </header>

      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو در دسته‌بندی‌ها…"
            aria-label="جستجوی دسته‌بندی"
            leadingIcon={<Search className="h-4 w-4" aria-hidden />}
          />
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="فیلتر وضعیت"
            options={[
              { value: '', label: 'همه وضعیت‌ها' },
              { value: 'active', label: 'فعال' },
              { value: 'draft', label: 'پیش‌نویس' },
              { value: 'archived', label: 'بایگانی' },
            ]}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="h-6 w-6" aria-hidden />}
          title="دسته‌بندی پیدا نشد"
          description="فیلترها را تغییر دهید یا دسته‌بندی جدیدی بسازید."
          action={
            <Button
              onClick={() => {
                setFormError(null);
                setEditing({ ...emptyDraft });
              }}
            >
              ساخت دسته‌بندی
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-start text-xs">
              <caption className="sr-only">جدول مدیریت دسته‌بندی‌ها</caption>
              <thead>
                <tr className="border-b border-line bg-surface-muted text-2xs text-ink-400">
                  <th scope="col" className="px-4 py-3 text-start font-bold">ترتیب</th>
                  <th scope="col" className="px-2 py-3 text-start font-bold">دسته‌بندی</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">نشانی</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">تعداد کالا</th>
                  <th scope="col" className="px-3 py-3 text-start font-bold">وضعیت</th>
                  <th scope="col" className="px-4 py-3 text-start font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((category) => (
                  <tr key={category.id} className="transition-colors hover:bg-surface-muted">
                    <td className="tnum px-4 py-3 text-2xs text-ink-400">
                      {toPersianDigits(category.order)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                          <Image
                            src={category.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          
                              priority
                            />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-ink-800">{category.name}</span>
                          <span className="block max-w-[20rem] truncate text-2xs text-ink-400">
                            {category.description}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <code
                        dir="ltr"
                        className="rounded-lg bg-surface-sunken px-2 py-1 text-[0.625rem] text-ink-500"
                      >
                        /categories/{category.slug}
                      </code>
                    </td>
                    <td className="tnum px-3 py-3 text-2xs font-bold text-ink-700">
                      {toPersianDigits(countFor(category.id))}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        size="sm"
                        tone={
                          category.status === 'active'
                            ? 'success'
                            : category.status === 'draft'
                              ? 'warning'
                              : 'neutral'
                        }
                      >
                        {category.status === 'active'
                          ? 'فعال'
                          : category.status === 'draft'
                            ? 'پیش‌نویس'
                            : 'بایگانی'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormError(null);
                            setEditing({
                              id: category.id,
                              slug: category.slug,
                              name: category.name,
                              description: category.description,
                              longDescription: category.longDescription,
                              icon: category.icon,
                              image: category.image,
                              parentId: category.parentId,
                              status: category.status,
                              seoTitle: category.seoTitle,
                              seoDescription: category.seoDescription,
                            });
                          }}
                          leadingIcon={<Pencil className="h-3.5 w-3.5" aria-hidden />}
                        >
                          ویرایش
                        </Button>
                        <Link
                          href={`/categories/${category.slug}`}
                          target="_blank"
                          className="inline-flex h-9 items-center rounded-full px-3 text-2xs font-bold text-ink-500 transition-colors hover:bg-surface-sunken hover:text-brand-700"
                        >
                          مشاهده
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(category)}
                          aria-label={`حذف ${category.name}`}
                          className="h-9 w-9 text-ink-300 hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
        description="اطلاعات این دسته در فروشگاه و فیلترها استفاده می‌شود."
        className="max-w-2xl"
      >
        {editing ? (
          <div className="space-y-4">
            {formError ? (
              <p className="rounded-2xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-2xs font-bold text-danger-strong">
                {formError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="نام دسته‌بندی"
                required
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                placeholder="مثلاً: نوشت‌افزار"
              />
              <Input
                label="نشانی (slug)"
                dir="ltr"
                className="text-end"
                value={editing.slug}
                onChange={(event) => setEditing({ ...editing, slug: event.target.value })}
                placeholder="neveshtazar"
              />
            </div>

            <Textarea
              label="توضیح کوتاه"
              required
              rows={2}
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
              placeholder="یک جمله کوتاه برای کارت دسته‌بندی"
            />

            <Textarea
              label="توضیح کامل"
              rows={3}
              value={editing.longDescription}
              onChange={(event) => setEditing({ ...editing, longDescription: event.target.value })}
              placeholder="توضیح بلندتر برای صفحه دسته‌بندی"
            />

            <div>
              <p className="mb-2 text-xs font-bold text-ink-600">آیکن</p>
              <div className="flex flex-wrap gap-1.5">
                {ICON_CHOICES.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditing({ ...editing, icon })}
                    aria-pressed={editing.icon === icon}
                    className={`rounded-xl border px-3 py-1.5 text-2xs font-bold transition-colors ${
                      editing.icon === icon
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-line text-ink-500 hover:border-brand-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-ink-600">تصویر دسته‌بندی</p>
              <div className="flex items-center gap-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-sunken">
                  <Image
                    src={editing.image}
                    alt="پیش‌نمایش تصویر"
                    fill
                    sizes="64px"
                    className="object-cover"
                  
                      priority
                    />
                </span>
                <Select
                  value={editing.image}
                  onChange={(event) => setEditing({ ...editing, image: event.target.value })}
                  aria-label="انتخاب تصویر"
                  options={[
                    'category-writing',
                    'category-notebooks',
                    'category-school',
                    'category-art',
                    'category-bags',
                    'category-geometry',
                    'category-office',
                    'category-gifts',
                  ].map((slug) => ({
                    value: `/media/categories/${slug}.svg`,
                    label: slug.replace('category-', ''),
                  }))}
                  containerClassName="flex-1"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-ink-600">وضعیت</p>
              <RadioCards
                name="category-status"
                value={editing.status}
                onChange={(value) =>
                  setEditing({ ...editing, status: value as Category['status'] })
                }
                options={[
                  { value: 'active', label: 'فعال' },
                  { value: 'draft', label: 'پیش‌نویس' },
                  { value: 'archived', label: 'بایگانی' },
                ]}
                columns={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="عنوان سئو"
                value={editing.seoTitle}
                onChange={(event) => setEditing({ ...editing, seoTitle: event.target.value })}
                placeholder="اختیاری"
              />
              <Input
                label="توضیح سئو"
                value={editing.seoDescription}
                onChange={(event) => setEditing({ ...editing, seoDescription: event.target.value })}
                placeholder="اختیاری"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                انصراف
              </Button>
              <Button onClick={save}>{editing.id ? 'ذخیره تغییرات' : 'ساخت دسته‌بندی'}</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="حذف دسته‌بندی"
        description={
          <>
            «<span className="font-bold text-ink-800">{deleteTarget?.name}</span>» حذف می‌شود.
            محصولات این دسته به «لوازم اداری» منتقل می‌شوند تا در فروشگاه بدون دسته باقی نمانند.
          </>
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          const count = countFor(deleteTarget.id);
          deleteCategory(deleteTarget.id);
          pushToast({
            title: 'دسته‌بندی حذف شد',
            description: `${toPersianDigits(count)} محصول به دسته دیگری منتقل شد.`,
            variant: 'danger',
          });
        }}
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        tone="primary"
        title="بازنشانی دسته‌بندی‌ها"
        description="همه دسته‌بندی‌ها به وضعیت اولیه دمو برمی‌گردند."
        confirmLabel="بازنشانی کن"
        onConfirm={() => {
          resetCategories();
          pushToast({ title: 'دسته‌بندی‌ها بازنشانی شد', variant: 'success' });
        }}
      />
    </div>
  );
}
