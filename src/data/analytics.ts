import type { DemoCustomer, DemoOrder, Review } from '@/types';

export const reviewSeeds: Record<string, Review[]> = {
  default: [
    {
      id: 'rev_d1',
      author: 'مریم رضایی',
      rating: 5,
      date: '2026-02-14',
      title: 'کیفیت فراتر از انتظار',
      body: 'کیفیت ساخت واقعاً عالی است و بسته‌بندی هم مرتب بود. خیلی سریع‌تر از چیزی که انتظار داشتم رسید دستم و دقیقاً همون چیزی بود که توی سایت دیدم.',
      verified: true,
      helpful: 24,
    },
    {
      id: 'rev_d2',
      author: 'علی مرادی',
      rating: 4,
      date: '2026-01-30',
      title: 'ارزش خریدش را داشت',
      body: 'نسبت به قیمتش خیلی منصفانه بود. تنها نکته اینکه کاش رنگ‌های بیشتری داشت، ولی در کل برای استفاده روزانه کاملاً کافیه.',
      verified: true,
      helpful: 11,
    },
    {
      id: 'rev_d3',
      author: 'سارا امینی',
      rating: 5,
      date: '2026-01-18',
      title: 'دقیقاً همون چیزی که خواستم',
      body: 'دو هفته استفاده کردم و هنوز مثل روز اول سالمه. پشتیبانی فروشگاه هم برای سؤالی که داشتم سریع جواب داد.',
      verified: true,
      helpful: 9,
    },
  ],
};

const CUSTOMER_SEEDS: [string, string, string, string, number, number, string, DemoCustomer['tier']][] = [
  ['cus_001', 'نگار احمدی', '۰۹۱۲۱۲۳۴۵۶۷', 'تهران', 24, 8_940_000, '2023-04-12', 'gold'],
  ['cus_002', 'حسین کاظمی', '۰۹۱۹۸۷۶۵۴۳۲', 'کرج', 17, 5_320_000, '2023-07-02', 'silver'],
  ['cus_003', 'زهرا موسوی', '۰۹۳۵۱۱۲۲۳۴۵', 'مشهد', 11, 3_180_000, '2024-01-19', 'silver'],
  ['cus_004', 'رضا رحیمی', '۰۹۱۲۹۹۸۸۷۷۶', 'اصفهان', 8, 2_050_000, '2024-05-30', 'bronze'],
  ['cus_005', 'الهام صادقی', '۰۹۳۹۴۴۵۵۶۶۷', 'تبریز', 19, 6_720_000, '2023-09-08', 'gold'],
  ['cus_006', 'مهدی نیکو', '۰۹۱۷۷۷۸۸۹۹۰', 'شیراز', 5, 1_240_000, '2024-11-14', 'bronze'],
  ['cus_007', 'فاطمه کریمی', '۰۹۱۳۳۳۲۲۱۱۴', 'تهران', 31, 12_480_000, '2022-11-25', 'gold'],
  ['cus_008', 'امیر شریفی', '۰۹۹۰۲۲۱۱۳۳۵', 'رشت', 3, 690_000, '2025-06-09', 'bronze'],
  ['cus_009', 'مینا قاسمی', '۰۹۱۲۵۵۵۴۴۳۳', 'اهواز', 14, 4_210_000, '2024-02-21', 'silver'],
  ['cus_010', 'سینا طاهری', '۰۹۳۶۶۶۷۷۸۸', 'یزد', 6, 1_870_000, '2025-01-17', 'bronze'],
];

export const demoCustomers: DemoCustomer[] = CUSTOMER_SEEDS.map(
  ([id, name, phone, city, orders, totalSpent, joinedAt, tier]) => ({
    id,
    name,
    phone,
    city,
    orders,
    totalSpent,
    joinedAt,
    tier,
  }),
);

const ORDER_STATUSES: DemoOrder['status'][] = [
  'delivered',
  'shipped',
  'processing',
  'pending',
  'delivered',
  'cancelled',
];

export const demoOrders: DemoOrder[] = Array.from({ length: 12 }, (_, index) => {
  const customer = demoCustomers[index % demoCustomers.length];
  const daysAgo = index * 3 + 1;
  const date = new Date(Date.UTC(2026, 2, 20 - daysAgo));
  return {
    id: `ord_${String(1400 + index)}`,
    customer: customer.name,
    phone: customer.phone,
    city: customer.city,
    items: (index % 5) + 1,
    total: 320_000 + ((index * 187_000) % 2_400_000),
    status: ORDER_STATUSES[index % ORDER_STATUSES.length],
    createdAt: date.toISOString().slice(0, 10),
  };
});

export interface DashboardPoint {
  label: string;
  orders: number;
  revenue: number;
}

export const salesSeries: DashboardPoint[] = [
  { label: 'فروردین', orders: 128, revenue: 48_200_000 },
  { label: 'اردیبهشت', orders: 156, revenue: 61_400_000 },
  { label: 'خرداد', orders: 141, revenue: 52_900_000 },
  { label: 'تیر', orders: 189, revenue: 74_600_000 },
  { label: 'مرداد', orders: 172, revenue: 68_300_000 },
  { label: 'شهریور', orders: 214, revenue: 86_700_000 },
  { label: 'مهر', orders: 246, revenue: 102_400_000 },
  { label: 'آبان', orders: 198, revenue: 81_500_000 },
  { label: 'آذر', orders: 231, revenue: 94_800_000 },
  { label: 'دی', orders: 268, revenue: 111_300_000 },
  { label: 'بهمن', orders: 254, revenue: 104_900_000 },
  { label: 'اسفند', orders: 302, revenue: 128_600_000 },
];

export const trafficSeries = [
  { label: 'شنبه', value: 420 },
  { label: 'یکشنبه', value: 510 },
  { label: 'دوشنبه', value: 486 },
  { label: 'سه‌شنبه', value: 604 },
  { label: 'چهارشنبه', value: 712 },
  { label: 'پنج‌شنبه', value: 388 },
  { label: 'جمعه', value: 264 },
];