import type { Metadata } from 'next';
import { WishlistPage } from '@/components/wishlist/WishlistPage';

export const metadata: Metadata = {
  title: 'علاقه‌مندی‌ها',
  description: 'محصولات ذخیره‌شده و انتقال آن‌ها به سبد خرید در فروشگاه تارا.',
};

export default function WishlistRoute() {
  return <WishlistPage />;
}
