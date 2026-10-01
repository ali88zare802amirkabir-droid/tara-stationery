import type { Metadata } from 'next';
import { SearchPage } from '@/components/search/SearchPage';

export const metadata: Metadata = {
  title: 'جستجو در فروشگاه',
  description: 'جستجوی محصولات لوازم‌التحریر بر اساس نام، برند، دسته‌بندی و مشخصات فنی.',
};

export default function SearchRoute() {
  return <SearchPage />;
}
