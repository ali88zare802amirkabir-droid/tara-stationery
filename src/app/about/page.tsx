import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'درباره ما',
  description:
    'داستان فروشگاه تارا، ارزش‌های ما، مسیر رشد کسب‌وکار و پاسخ سوالات متداول درباره ارسال، مرجوعی و پرداخت.',
};

export default function AboutRoute() {
  return <AboutPage />;
}
