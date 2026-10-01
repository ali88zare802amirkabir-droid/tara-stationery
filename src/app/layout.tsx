import type { Metadata, Viewport } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { ToastViewport } from '@/components/ui/Toast';
import { StoreShell } from '@/components/layout/StoreShell';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tara-store.onrender.com'
  ),
  title: {
    default: 'تارا | فروشگاه آنلاین لوازم‌التحریر',
    template: '%s | تارا',
  },
  description:
    'تارا فروشگاه آنلاین لوازم‌التحریر با بیش از ۳۰ کالای منتخب نوشت‌افزار، دفتر، لوازم هنری، ابزار هندسی و کوله مدرسه؛ با ضمانت اصالت و ارسال سریع.',
  keywords: [
    'لوازم التحریر',
    'خرید خودکار',
    'دفتر یادداشت',
    'مداد رنگی',
    'کوله مدرسه',
    'ابزار هندسی',
    'لوازم هنری',
  ],
  applicationName: 'تارا',
  authors: [{ name: 'Tara' }],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    title: 'تارا | فروشگاه آنلاین لوازم‌التحریر',
    description: 'لوازم‌التحریر حرفه‌ای برای مدرسه، دانشگاه و میز کار شما.',
    images: ['/media/hero.svg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F4F7FD',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <StoreHydrator />
        <StoreShell>{children}</StoreShell>
        <ToastViewport />
      </body>
    </html>
  );
}
