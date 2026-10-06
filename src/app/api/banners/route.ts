import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await query<{
    id: string; eyebrow: string; title: string; subtitle: string; description: string;
    button_text: string; button_link: string; secondary_button_text: string; secondary_button_link: string;
    image: string; art: string; theme: 'brand' | 'sunset' | 'mint' | 'lilac';
    status: string; order: number; starts_at: string | null; ends_at: string | null;
  }>('SELECT * FROM banners ORDER BY "order" ASC');
  const banners = rows.map((r) => ({
    id: r.id, eyebrow: r.eyebrow, title: r.title, subtitle: r.subtitle,
    description: r.description, buttonText: r.button_text, buttonLink: r.button_link,
    secondaryButtonText: r.secondary_button_text, secondaryButtonLink: r.secondary_button_link,
    image: r.image, art: r.art, theme: r.theme, status: r.status, order: r.order,
    startsAt: r.starts_at, endsAt: r.ends_at,
  }));
  return NextResponse.json({ banners });
}
