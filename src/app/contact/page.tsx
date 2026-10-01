import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: 'تماس با ما',
  description:
    'راه‌های ارتباط با فروشگاه تارا: تلفن، پست الکترونیک، نشانی و فرم تماس برای پیگیری سفارش و خرید عمده.',
};

export default function ContactRoute() {
  return <ContactPage />;
}
