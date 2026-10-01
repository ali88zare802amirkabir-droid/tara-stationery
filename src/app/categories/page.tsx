import type { Metadata } from 'next';
import { CategoryGrid } from '@/components/products/CategoryGrid';

export const metadata: Metadata = {
  title: 'دسته‌بندی محصولات',
  description:
    'دسته‌بندی کامل محصولات فروشگاه لوازم‌التحریر تارا: نوشت‌افزار، دفتر و سررسید، لوازم مدرسه، لوازم هنری، کوله و کیف، ابزار هندسی، لوازم اداری و کادو و فانتزی.',
};

export default function CategoriesPage() {
  return <CategoryGrid />;
}
