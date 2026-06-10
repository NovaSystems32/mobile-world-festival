-- ============================================================
-- Mobile World — Supabase Schema
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200) NOT NULL,
  slug            VARCHAR(200) UNIQUE NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  wholesale_price DECIMAL(10,2),
  sku             VARCHAR(100),
  stock           INTEGER DEFAULT 0,
  low_stock_alert INTEGER DEFAULT 3,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active       BOOLEAN DEFAULT true,
  is_featured     BOOLEAN DEFAULT false,
  is_wholesale    BOOLEAN DEFAULT false,
  condition       VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
  images          TEXT[] DEFAULT '{}',
  main_image      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- STOCK HISTORY
CREATE TABLE IF NOT EXISTS stock_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  prev_stock  INTEGER NOT NULL,
  new_stock   INTEGER NOT NULL,
  changed_by  UUID,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(200) NOT NULL,
  phone      VARCHAR(50),
  email      VARCHAR(200),
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name   VARCHAR(200) NOT NULL,
  customer_phone  VARCHAR(50) NOT NULL,
  customer_email  VARCHAR(200),
  items           JSONB NOT NULL DEFAULT '[]',
  total           DECIMAL(10,2) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','contacted','closed','cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           VARCHAR(50) UNIQUE NOT NULL,
  description    TEXT,
  discount_type  VARCHAR(20) NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase   DECIMAL(10,2),
  max_uses       INTEGER,
  used_count     INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT true,
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  USING (is_active = true);

-- Authenticated users (admin) can do everything on products
CREATE POLICY "admin_all_products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can read categories
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT
  USING (true);

-- Admin can manage categories
CREATE POLICY "admin_all_categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin only for stock_history
CREATE POLICY "admin_all_stock_history"
  ON stock_history FOR ALL
  USING (auth.role() = 'authenticated');

-- Anyone can submit contact, admin can read
CREATE POLICY "public_insert_contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_read_contact"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Orders RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Coupons RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_coupons"
  ON coupons FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Categorías base
-- ============================================================

INSERT INTO categories (name, slug) VALUES
  ('Celulares', 'celulares'),
  ('Accesorios', 'accesorios'),
  ('Ofertas', 'ofertas')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA — Productos de ejemplo
-- ============================================================

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, is_featured, category_id, description)
SELECT
  'MOBI UM05',
  'mobi-um05',
  8990,
  15,
  3,
  'new',
  true,
  true,
  c.id,
  'Teléfono básico con pantalla a color, cámara y larga duración de batería.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, is_featured, is_wholesale, category_id, description)
SELECT
  'NOKIA 106',
  'nokia-106',
  12990,
  30,
  5,
  'new',
  true,
  true,
  true,
  c.id,
  'Nokia 106 clásico. Batería de larga duración, resistente y confiable.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, category_id, description)
SELECT
  'CAT B30',
  'cat-b30',
  18500,
  8,
  2,
  'new',
  true,
  c.id,
  'Teléfono resistente CAT B30, ideal para trabajo en campo.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, is_featured, category_id, description)
SELECT
  'NOKIA 2505 4G',
  'nokia-2505-4g',
  22000,
  12,
  3,
  'new',
  true,
  true,
  c.id,
  'Nokia 2505 con conectividad 4G, pantalla amplia y teclas grandes.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, is_wholesale, category_id, description)
SELECT
  'SAMSUNG E1272',
  'samsung-e1272',
  15900,
  20,
  5,
  'new',
  true,
  true,
  c.id,
  'Samsung E1272 Dual SIM. Clásico, resistente, con radio FM.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, category_id, description)
SELECT
  'NOKIA 110',
  'nokia-110',
  11500,
  25,
  5,
  'new',
  true,
  c.id,
  'Nokia 110 con Bluetooth, linterna y radio FM.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, category_id, description)
SELECT
  'MOBI M2160',
  'mobi-m2160',
  7500,
  0,
  3,
  'new',
  true,
  c.id,
  'MOBI M2160 básico con pantalla y cámara integrada.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, price, stock, low_stock_alert, condition, is_active, is_featured, category_id, description)
SELECT
  'MOBI UM06',
  'mobi-um06',
  9990,
  10,
  3,
  'new',
  true,
  true,
  c.id,
  'MOBI UM06 con pantalla a color y funciones multimedia.'
FROM categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;
