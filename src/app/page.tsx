import type { Metadata } from 'next';
import { HomeSections } from '@/components/home/HomeSections';

export const metadata: Metadata = {
  title: 'تارا | فروشگاه آنلاین لوازم‌التحریر',
  description:
    'تارا فروشگاه آنلاین لوازم‌التحریر با بیش از ۳۰ کالای منتخب نوشت‌افزار، دفتر، لوازم هنری، ابزار هندسی و کوله مدرسه؛ با ضمانت اصالت و ارسال سریع.',
};

export default function HomePage() {
  return <HomeSections />;
}
