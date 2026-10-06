import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const rows = await query<Record<string, unknown>>(
    'SELECT * FROM products WHERE slug = $1 AND status = $2 LIMIT 1',
    [slug, 'active']
  );
  const row = rows[0];
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ product: row });
}
