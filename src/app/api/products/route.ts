import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category_id: string | null;
  price: string;
  compare_price: string | null;
  stock: number;
  low_stock_threshold: number;
  rating: number;
  review_count: number;
  sold_count: number;
  images: unknown;
  short_description: string;
  description: string;
  features: unknown;
  specifications: unknown;
  variants: unknown;
  tags: unknown;
  featured: boolean;
  bestseller: boolean;
  new_product: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  seo: unknown;
  art: string;
}

const toProduct = (r: ProductRow) => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  sku: r.sku,
  brand: r.brand,
  categoryId: r.category_id,
  price: Number(r.price),
  comparePrice: r.compare_price === null ? null : Number(r.compare_price),
  stock: r.stock,
  lowStockThreshold: r.low_stock_threshold,
  rating: r.rating,
  reviewCount: r.review_count,
  soldCount: r.sold_count,
  images: r.images ?? [],
  shortDescription: r.short_description,
  description: r.description,
  features: r.features ?? [],
  specifications: r.specifications ?? [],
  variants: r.variants ?? [],
  tags: r.tags ?? [],
  featured: r.featured,
  bestseller: r.bestseller,
  newProduct: r.new_product,
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  seo: r.seo ?? {},
  art: r.art,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('cat');
  const q = searchParams.get('q');
  const brand = searchParams.get('brand');
  const sort = searchParams.get('sort') || 'newest';
  const status = searchParams.get('status') || 'active';

  const params: unknown[] = [];
  let where = 'WHERE 1=1';
  if (status !== 'all') {
    params.push(status);
    where += ` AND status = $${params.length}`;
  }
  if (cat) {
    params.push(cat);
    where += ` AND category_id = $${params.length}`;
  }
  if (brand) {
    params.push(brand);
    where += ` AND brand = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    where += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length} OR sku ILIKE $${params.length})`;
  }

  let order = 'created_at DESC';
  switch (sort) {
    case 'price_asc': order = 'price ASC'; break;
    case 'price_desc': order = 'price DESC'; break;
    case 'rating': order = 'rating DESC'; break;
    case 'sold': order = 'sold_count DESC'; break;
    default: order = 'created_at DESC';
  }

  const rows = await query<ProductRow>(
    `SELECT * FROM products ${where} ORDER BY ${order} LIMIT 200`,
    params
  );
  return NextResponse.json({ products: rows.map(toProduct), count: rows.length });
}
