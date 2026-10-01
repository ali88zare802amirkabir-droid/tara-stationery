import type { Metadata } from 'next';
import { CartPage } from '@/components/cart/CartPage';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'مدیریت سبد خرید، تغییر تعداد و مشاهده خلاصه سفارش در فروشگاه تارا.',
};

export default function CartRoute() {
  return <CartPage />;
}
