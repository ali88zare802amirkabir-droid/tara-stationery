import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await query<{
    id: string; slug: string; name: string; description: string; long_description: string;
    icon: string; image: string; parent_id: string | null; order: number; status: string;
    seo_title: string; seo_description: string;
  }>('SELECT * FROM categories ORDER BY "order" ASC');
  const categories = rows.map((r) => ({
    id: r.id, slug: r.slug, name: r.name, description: r.description,
    longDescription: r.long_description, icon: r.icon, image: r.image,
    parentId: r.parent_id, order: r.order, status: r.status,
    seoTitle: r.seo_title, seoDescription: r.seo_description,
  }));
  return NextResponse.json({ categories });
}
