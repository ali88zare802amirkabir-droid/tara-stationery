-- Tara store — Postgres schema for Neon.
CREATE TABLE IF NOT EXISTS categories (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  icon           TEXT NOT NULL DEFAULT '',
  image          TEXT NOT NULL DEFAULT '',
  parent_id      TEXT,
  "order"        INTEGER NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'active',
  seo_title      TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS brands (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  name_fa     TEXT NOT NULL DEFAULT '',
  since       INTEGER,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS banners (
  id                    TEXT PRIMARY KEY,
  eyebrow               TEXT NOT NULL DEFAULT '',
  title                 TEXT NOT NULL DEFAULT '',
  subtitle              TEXT NOT NULL DEFAULT '',
  description           TEXT NOT NULL DEFAULT '',
  button_text           TEXT NOT NULL DEFAULT '',
  button_link           TEXT NOT NULL DEFAULT '',
  secondary_button_text TEXT NOT NULL DEFAULT '',
  secondary_button_link TEXT NOT NULL DEFAULT '',
  image                 TEXT NOT NULL DEFAULT '',
  art                   TEXT NOT NULL DEFAULT '',
  theme                 TEXT NOT NULL DEFAULT 'brand',
  status                TEXT NOT NULL DEFAULT 'active',
  "order"               INTEGER NOT NULL DEFAULT 0,
  starts_at             TEXT,
  ends_at               TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id                      TEXT PRIMARY KEY,
  slug                    TEXT NOT NULL UNIQUE,
  name                    TEXT NOT NULL,
  sku                     TEXT NOT NULL DEFAULT '',
  brand                   TEXT NOT NULL DEFAULT '',
  category_id             TEXT,
  price                   NUMERIC(12,0) NOT NULL DEFAULT 0,
  compare_price           NUMERIC(12,0),
  stock                   INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold     INTEGER NOT NULL DEFAULT 0,
  rating                  DOUBLE PRECISION NOT NULL DEFAULT 0,
  review_count            INTEGER NOT NULL DEFAULT 0,
  sold_count              INTEGER NOT NULL DEFAULT 0,
  images                  JSONB,
  short_description       TEXT NOT NULL DEFAULT '',
  description             TEXT NOT NULL DEFAULT '',
  features                JSONB,
  specifications          JSONB,
  variants                JSONB,
  tags                    JSONB,
  featured                BOOLEAN NOT NULL DEFAULT false,
  bestseller              BOOLEAN NOT NULL DEFAULT false,
  new_product             BOOLEAN NOT NULL DEFAULT false,
  status                  TEXT NOT NULL DEFAULT 'active',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  seo                     JSONB,
  art                     TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS customers (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL DEFAULT '',
  city       TEXT NOT NULL DEFAULT '',
  address    TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id         TEXT PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  customer_id TEXT,
  status     TEXT NOT NULL DEFAULT 'pending',
  total      NUMERIC(12,0) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  name       TEXT NOT NULL DEFAULT '',
  price      NUMERIC(12,0) NOT NULL DEFAULT 0,
  quantity   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY,
  product_id  TEXT NOT NULL,
  author      TEXT NOT NULL DEFAULT '',
  rating      DOUBLE PRECISION NOT NULL DEFAULT 0,
  date        TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  verified    BOOLEAN NOT NULL DEFAULT false,
  helpful     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
