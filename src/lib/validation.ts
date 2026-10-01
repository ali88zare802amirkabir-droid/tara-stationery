import { z } from 'zod';

/**
 * Shared contract for the "new product" and "edit product" forms.
 *
 * `ProductFormValues` is declared explicitly (rather than inferred from the
 * schema) so react-hook-form keeps precise field types while the zod schema
 * still owns validation and coercion.
 */
export interface ProductFormValues {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  tagsInput: string;

  price: number;
  /** Empty string means "no compare price". */
  comparePrice: number | '';
  discountOverride: boolean;
  manualDiscount: number;

  stock: number;
  lowStockThreshold: number;
  availability: 'in-stock' | 'backorder' | 'out-of-stock';

  images: { src: string; alt: string }[];
  mainImageIndex: number;

  shortDescription: string;
  description: string;
  featuresInput: string;

  specifications: { id: string; key: string; value: string }[];
  variants: { id: string; name: string; values: string[]; enabled: boolean }[];

  seoTitle: string;
  seoDescription: string;
  seoKeywordsInput: string;

  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  bestseller: boolean;
  newProduct: boolean;
}

/**
 * A blank spec row is a legitimate starting point in the form, so key/value are
 * only validated when one side is filled in — empty rows are dropped on submit.
 */
const specificationSchema = z
  .object({
    id: z.string().min(1),
    key: z.string(),
    value: z.string(),
  })
  .superRefine((spec, ctx) => {
    const key = spec.key.trim();
    const value = spec.value.trim();
    if (key && !value) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'برای این عنوان مقدار وارد کنید' });
    }
    if (!key && value) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['key'], message: 'برای این مقدار عنوان وارد کنید' });
    }
  });

const variantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'نام گزینه الزامی است'),
  values: z.array(z.string()).min(1, 'حداقل یک مقدار لازم است'),
  enabled: z.boolean(),
});

export const productFormSchema = z
  .object({
    name: z.string().min(3, 'نام محصول باید حداقل ۳ نویسه باشد').max(120, 'نام محصول طولانی است'),
    slug: z
      .string()
      .min(2, 'نشانی (slug) الزامی است')
      .regex(/^[a-z0-9-]+$/, 'نشانی فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و خط تیره باشد'),
    sku: z.string().min(3, 'کد کالا الزامی است').max(32, 'کد کالا طولانی است'),
    brand: z.string().min(2, 'برند را انتخاب کنید'),
    categoryId: z.string().min(1, 'دسته‌بندی را انتخاب کنید'),
    tagsInput: z.string(),

    price: z.coerce
      .number({ invalid_type_error: 'قیمت را وارد کنید' })
      .min(1000, 'قیمت باید بیشتر از ۱٬۰۰۰ تومان باشد'),
    comparePrice: z.union([z.number(), z.literal('')]).optional(),
    discountOverride: z.boolean(),
    manualDiscount: z.coerce
      .number({ invalid_type_error: 'درصد تخفیف را وارد کنید' })
      .min(0, 'درصد تخفیف نمی‌تواند منفی باشد')
      .max(90, 'درصد تخفیف حداکثر ۹۰ درصد است'),

    stock: z.coerce.number({ invalid_type_error: 'موجودی را وارد کنید' }).min(0, 'موجودی نمی‌تواند منفی باشد'),
    lowStockThreshold: z.coerce
      .number({ invalid_type_error: 'حد هشدار را وارد کنید' })
      .min(0, 'حد هشدار نمی‌تواند منفی باشد'),
    availability: z.enum(['in-stock', 'backorder', 'out-of-stock']),

    images: z
      .array(z.object({ src: z.string().min(1), alt: z.string() }))
      .min(1, 'حداقل یک تصویر لازم است')
      .max(6, 'حداکثر ۶ تصویر'),
    mainImageIndex: z.coerce.number().min(0).max(5),

    shortDescription: z
      .string()
      .min(20, 'توضیح کوتاه باید حداقل ۲۰ نویسه باشد')
      .max(180, 'توضیح کوتاه حداکثر ۱۸۰ نویسه است'),
    description: z.string().min(40, 'توضیح کامل باید حداقل ۴۰ نویسه باشد'),
    featuresInput: z.string(),

    specifications: z.array(specificationSchema),
    variants: z.array(variantSchema),

    seoTitle: z.string().max(70, 'عنوان سئو حداکثر ۷۰ نویسه است'),
    seoDescription: z.string().max(180, 'توضیح سئو حداکثر ۱۸۰ نویسه است'),
    seoKeywordsInput: z.string(),

    status: z.enum(['active', 'draft', 'archived']),
    featured: z.boolean(),
    bestseller: z.boolean(),
    newProduct: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const comparePrice = typeof values.comparePrice === 'number' ? values.comparePrice : null;

    if (comparePrice !== null && comparePrice <= values.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['comparePrice'],
        message: 'قیمت قبلی باید بیشتر از قیمت فعلی باشد',
      });
    }

    if (comparePrice !== null && values.discountOverride) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['comparePrice'],
        message: 'وقتی درصد تخفیف دستی را انتخاب می‌کنید، فیلد قیمت قبلی را خالی بگذارید',
      });
    }

    if (values.mainImageIndex >= values.images.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mainImageIndex'],
        message: 'تصویر اصلی باید در میان تصاویر انتخاب‌شده باشد',
      });
    }

    const specKeys = values.specifications
      .map((spec) => spec.key.trim())
      .filter(Boolean);
    if (new Set(specKeys).size !== specKeys.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specifications'],
        message: 'عنوان مشخصه‌ها نباید تکراری باشد',
      });
    }

    const variantNames = values.variants.map((variant) => variant.name.trim()).filter(Boolean);
    if (new Set(variantNames).size !== variantNames.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['variants'],
        message: 'نام محورهای گزینه نباید تکراری باشد',
      });
    }
  });
