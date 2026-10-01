import type { Brand, StoreSettings } from '@/types';

export const brands: Brand[] = [
  {
    id: 'brand_panter',
    slug: 'panter',
    name: 'Panter',
    nameFa: 'پنتر',
    since: 1370,
    description: 'نوآور در نوشت‌افزار با کیفیت چاپ و مخزن پیشرفته',
  },
  {
    id: 'brand_familia',
    slug: 'familia',
    name: 'Familia',
    nameFa: 'فامیلیا',
    since: 1358,
    description: 'متخصص لوازم مدرسه و نوشت‌افزار مدرسه‌ای',
  },
  {
    id: 'brand_fano',
    slug: 'fano',
    name: 'Fano',
    nameFa: 'فانو',
    since: 1382,
    description: 'مداد رنگی و ابزار هنری با پیگمنت استاندارد اروپا',
  },
  {
    id: 'brand_cp',
    slug: 'cp',
    name: 'CP',
    nameFa: 'سی‌پی',
    since: 1365,
    description: 'ابزار هندسی و ست ریاضی با دقت صنعتی',
  },
  {
    id: 'brand_pico',
    slug: 'pico',
    name: 'Pico',
    nameFa: 'پیکو',
    since: 1390,
    description: 'کوله مدرسه و کیف با طراحی ارگونومیک',
  },
  {
    id: 'brand_zit',
    slug: 'zit',
    name: 'Zit',
    nameFa: 'زیت',
    since: 1375,
    description: 'هایلایتر و ماژیک با جوهر روان و بدون نشت',
  },
  {
    id: 'brand_nova',
    slug: 'nova',
    name: 'Nova',
    nameFa: 'نوآوا',
    since: 1395,
    description: 'لوازم فانتزی و کادویی با طراحی رنگی',
  },
  {
    id: 'brand_atlas',
    slug: 'atlas',
    name: 'Atlas',
    nameFa: 'اطلس',
    since: 1348,
    description: 'لوازم اداری و ملزومات با دوام بالا',
  },
];

export const brandById = new Map(brands.map((brand) => [brand.id, brand]));
export const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

export const defaultSettings: StoreSettings = {
  storeName: 'تارا',
  tagline: 'لوازم‌التحریر حرفه‌ای برای مدرسه، دانشگاه و میز کار شما',
  phone: '۰۲۱-۹۱۰۰۲۰۳۰',
  landline: '۰۲۱-۸۸۷۷۶۶۵۵',
  email: 'hello@tara.ir',
  address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، برج نگین، طبقه ۹، واحد ۹۰۳',
  postalCode: '۱۹۶۹۷۴۳۵۱۱',
  workingHours: 'شنبه تا چهارشنبه ۹ تا ۱۹ — پنج‌شنبه ۹ تا ۱۴',
  instagram: 'https://instagram.com/tara',
  telegram: 'https://t.me/tara',
  whatsapp: 'https://wa.me/989121002030',
  freeShippingThreshold: 800_000,
  shippingCost: 49_000,
  taxRate: 0.09,
  defaultLowStockThreshold: 8,
  announcement: 'ارسال رایگان برای خریدهای بالای ۸۰۰٬۰۰۰ تومان — ارسال به سراسر ایران',
  announcementEnabled: true,
  codEnabled: true,
  maintainanceMode: false,
};