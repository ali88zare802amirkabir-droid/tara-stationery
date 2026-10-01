import type { Metadata } from 'next';
import { AdminCategories } from '@/components/admin/AdminCategories';

export const metadata: Metadata = { title: 'مدیریت دسته‌بندی‌ها' };

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}
