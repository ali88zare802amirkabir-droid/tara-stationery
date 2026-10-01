import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: { default: 'پنل مدیریت', template: '%s | پنل مدیریت تارا' },
  description:
    'پنل مدیریت نمایشی فروشگاه تارا: مدیریت محصولات، دسته‌بندی‌ها، بنرها، سفارش‌ها، مشتریان، گزارش‌ها و تنظیمات.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <div className="mx-auto flex w-full max-w-[100rem]">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </AdminShell>
  );
}
