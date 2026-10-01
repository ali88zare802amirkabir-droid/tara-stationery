export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Specification {
  key: string;
  value: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  /** Values offered under this variant axis, e.g. ["آبی", "مشکی"]. */
  values: string[];
  enabled: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  categoryId: string;
  /** Price in تومان. */
  price: number;
  /** Previous price in تومان. 0 or null means no discount. */
  comparePrice: number | null;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: ProductImage[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Specification[];
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  newProduct: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  seo: ProductSeo;
  /** Placeholder artwork key, used to pick the generated illustration. */
  art: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  parentId: string | null;
  order: number;
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  eyebrow: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  image: string;
  art: string;
  /** Tailwind-friendly gradient classes kept declarative for admin previews. */
  theme: 'brand' | 'sunset' | 'mint' | 'lilac';
  status: ProductStatus;
  order: number;
  startsAt: string | null;
  endsAt: string | null;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  nameFa: string;
  since: number;
  description: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  quantity: number;
  variantLabel: string | null;
  art: string;
  addedAt: number;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  comparePrice: number | null;
  rating: number;
  art: string;
  addedAt: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface DemoOrder {
  id: string;
  customer: string;
  phone: string;
  city: string;
  items: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface DemoCustomer {
  id: string;
  name: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  tier: 'bronze' | 'silver' | 'gold';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  landline: string;
  email: string;
  address: string;
  postalCode: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  freeShippingThreshold: number;
  shippingCost: number;
  taxRate: number;
  defaultLowStockThreshold: number;
  announcement: string;
  announcementEnabled: boolean;
  codEnabled: boolean;
  maintainanceMode: boolean;
}

export type SortOption =
  | 'newest'
  | 'bestselling'
  | 'price-asc'
  | 'price-desc'
  | 'discount-desc'
  | 'rating-desc';

export interface FilterState {
  query: string;
  categoryIds: string[];
  brandIds: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  discountedOnly: boolean;
  minRating: number | null;
  sort: SortOption;
}

export interface CatalogSnapshot {
  products: Product[];
  categories: Category[];
  banners: Banner[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'danger' | 'info' | 'warning';
}