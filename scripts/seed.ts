import { products } from '../src/data/products';
import { categories } from '../src/data/categories';
import { brands } from '../src/data/brands';
import { banners } from '../src/data/banners';
import pg from 'pg';

const ssl = { rejectUnauthorized: false };

const main = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl });

  const upsertCat = `INSERT INTO categories (id,slug,name,description,long_description,icon,image,parent_id,"order",status,seo_title,seo_description)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (id) DO UPDATE SET slug=EXCLUDED.slug,name=EXCLUDED.name,description=EXCLUDED.description,long_description=EXCLUDED.long_description,icon=EXCLUDED.icon,image=EXCLUDED.image,parent_id=EXCLUDED.parent_id,"order"=EXCLUDED."order",status=EXCLUDED.status,seo_title=EXCLUDED.seo_title,seo_description=EXCLUDED.seo_description`;
  for (const c of categories) {
    await pool.query(upsertCat, [c.id, c.slug, c.name, c.description, c.longDescription, c.icon, c.image, c.parentId ?? null, c.order, c.status, c.seoTitle, c.seoDescription]);
  }
  console.log('categories:', categories.length);

  const upsertBrand = `INSERT INTO brands (id,slug,name,name_fa,since,description) VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (id) DO UPDATE SET slug=EXCLUDED.slug,name=EXCLUDED.name,name_fa=EXCLUDED.name_fa,since=EXCLUDED.since,description=EXCLUDED.description`;
  for (const b of brands) {
    await pool.query(upsertBrand, [b.id, b.slug, b.name, b.nameFa, b.since, b.description]);
  }
  console.log('brands:', brands.length);

  const upsertBanner = `INSERT INTO banners (id,eyebrow,title,subtitle,description,button_text,button_link,secondary_button_text,secondary_button_link,image,art,theme,status,"order",starts_at,ends_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,subtitle=EXCLUDED.subtitle,description=EXCLUDED.description,button_text=EXCLUDED.button_text,button_link=EXCLUDED.button_link,image=EXCLUDED.image,theme=EXCLUDED.theme,status=EXCLUDED.status,"order"=EXCLUDED."order"`;
  for (const b of banners) {
    await pool.query(upsertBanner, [b.id, b.eyebrow, b.title, b.subtitle, b.description, b.buttonText, b.buttonLink, b.secondaryButtonText, b.secondaryButtonLink, b.image, b.art, b.theme, b.status, b.order, b.startsAt, b.endsAt]);
  }
  console.log('banners:', banners.length);

  const upsertProduct = `INSERT INTO products (id,slug,name,sku,brand,category_id,price,compare_price,stock,low_stock_threshold,rating,review_count,sold_count,images,short_description,description,features,specifications,variants,tags,featured,bestseller,new_product,status,created_at,updated_at,seo,art)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15,$16,$17::jsonb,$18::jsonb,$19::jsonb,$20::jsonb,$21,$22,$23,$24,$25::timestamptz,$26::timestamptz,$27::jsonb,$28)
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,price=EXCLUDED.price,compare_price=EXCLUDED.compare_price,stock=EXCLUDED.stock,low_stock_threshold=EXCLUDED.low_stock_threshold,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,sold_count=EXCLUDED.sold_count,images=EXCLUDED.images,short_description=EXCLUDED.short_description,description=EXCLUDED.description,features=EXCLUDED.features,specifications=EXCLUDED.specifications,variants=EXCLUDED.variants,tags=EXCLUDED.tags,featured=EXCLUDED.featured,bestseller=EXCLUDED.bestseller,new_product=EXCLUDED.new_product,status=EXCLUDED.status,updated_at=now(),seo=EXCLUDED.seo,art=EXCLUDED.art`;
  for (const p of products) {
    await pool.query(upsertProduct, [
      p.id, p.slug, p.name, p.sku, p.brand, p.categoryId || null,
      p.price, p.comparePrice ?? null, p.stock, p.lowStockThreshold ?? 0,
      p.rating, p.reviewCount, p.soldCount ?? 0,
      JSON.stringify(p.images ?? []), p.shortDescription, p.description,
      JSON.stringify(p.features ?? []), JSON.stringify(p.specifications ?? []),
      JSON.stringify(p.variants ?? []), JSON.stringify(p.tags ?? []),
      !!p.featured, !!p.bestseller, !!p.newProduct, p.status,
      p.createdAt || new Date().toISOString(), p.updatedAt || new Date().toISOString(),
      JSON.stringify(p.seo ?? {}), p.art,
    ]);
  }
  console.log('products:', products.length);
  await pool.end();
  console.log('seed done');
};

main().catch((e) => { console.error('seed error', e.message); process.exit(1); });
