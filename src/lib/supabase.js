import { createClient } from '@supabase/supabase-js'

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase env variables missing. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
────────────────────────────────────────────────────────────────────
  SCHEMA SQL LENGKAP (termasuk Storage & image_url)
  Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════
-- 1. SETTINGS TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS settings (
  id         SERIAL PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('store_name',    'RestoGear'),
  ('whatsapp',      '6281234567890'),
  ('tagline',       'Peralatan Restoran Second Berkualitas Premium'),
  ('about_p1',      'Kami adalah spesialis jual beli peralatan restoran dan dapur komersial second berkualitas. Setiap produk melalui proses inspeksi menyeluruh sebelum dijual untuk memastikan performa optimal.'),
  ('about_p2',      'Berlokasi di Jakarta, kami telah melayani ratusan pelaku bisnis kuliner — dari warung makan, kafe, hingga hotel berbintang — dengan layanan jujur dan transparan.'),
  ('about_tagline', 'Kualitas terjamin, harga bersahabat — mitra terbaik untuk bisnis kuliner Anda.'),
  ('address',       'Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan'),
  ('email',         'info@restogear.id'),
  ('phone_display', '+62 812-3456-7890'),
  ('hours',         'Senin–Sabtu, 08.00 – 17.00 WIB'),
  ('cta_desc',      'Konsultasikan kebutuhan peralatan Anda dengan tim kami. Gratis konsultasi, pengiriman aman, harga transparan.'),
  ('hero_images',   '[]'),
  ('about_images',  '[]'),
  ('cta_cover_url', '')
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════
-- 2. CATEGORIES TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT '📦',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, icon, sort_order) VALUES
  ('Alat Masak',      '🍳', 1),
  ('Kulkas & Freezer','🧊', 2),
  ('Furniture Resto', '🪑', 3),
  ('Mesin Minuman',   '☕', 4),
  ('Kompor & Oven',   '🔥', 5),
  ('Peralatan Bar',   '🍹', 6),
  ('Kasir & Display', '🏪', 7),
  ('Peralatan Cuci',  '🚿', 8)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════
-- 3. PRODUCTS TABLE (termasuk image_url)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT,
  price        BIGINT NOT NULL,
  orig_price   BIGINT DEFAULT 0,
  icon         TEXT DEFAULT '📦',
  image_url    TEXT DEFAULT NULL,
  badge        TEXT DEFAULT '',
  category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','draft')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Jika tabel products sudah ada, tambahkan kolom image_url:
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

INSERT INTO products (name, description, price, orig_price, icon, badge, category_id, status) VALUES
  ('Kompor Gas 4 Tungku Rinnai',  'Kondisi mulus, sedikit bekas pakai. Performa optimal.', 1500000, 2200000, '🔥', 'sale', 5, 'active'),
  ('Kulkas 2 Pintu Sharp 400L',   'Bekas resto 6 bulan, kondisi sangat baik. Kompresor normal.', 2800000, 0, '🧊', 'new', 2, 'active'),
  ('Set Meja + 4 Kursi Kayu',     'Kayu jati solid, sedikit cat mengelupas. Kokoh dan estetik.', 950000, 1500000, '🪑', 'sale', 3, 'active'),
  ('Mesin Espresso Semi-Auto',    'Merek Saeco, fungsi normal, termasuk grinder.', 5500000, 9000000, '☕', '', 4, 'active'),
  ('Wok Pan Carbon Steel 50cm',   'Kondisi prima, seasoning bagus. Ideal untuk masak volume besar.', 350000, 0, '🍳', '', 1, 'active'),
  ('Display Cooler 3 Pintu',      'Kaca bening, lampu normal, suhu stabil. Cocok untuk minuman.', 4200000, 7000000, '🏪', 'hot', 7, 'active'),
  ('Oven Deck 2 Tray Gas',        'Cocok untuk bakery & restoran. Api merata, kondisi baik.', 3800000, 0, '🔥', '', 5, 'active'),
  ('Blender Commercial Waring',   'Motor kuat 3.5 HP, jar baru. Ideal untuk jus dan smoothie.', 1200000, 2000000, '🍹', 'sale', 6, 'active')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════
-- 4. FAQ TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS faqs (
  id         SERIAL PRIMARY KEY,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Apakah ada garansi untuk produk yang dibeli?', 'Kami memberikan garansi kondisi sesuai deskripsi selama 7 hari sejak barang diterima.', 1),
  ('Apakah bisa dikirim ke luar kota atau luar pulau?', 'Ya, kami melayani pengiriman ke seluruh Indonesia menggunakan ekspedisi terpercaya.', 2),
  ('Bagaimana cara pembayaran yang tersedia?', 'Kami menerima transfer bank (BCA, BRI, Mandiri), dan bisa dicicil via marketplace.', 3),
  ('Apakah bisa melihat barang secara langsung?', 'Sangat bisa! Silakan kunjungi showroom kami di Jakarta Selatan, Senin–Sabtu 08.00–17.00 WIB.', 4),
  ('Apakah ada diskon untuk pembelian partai besar?', 'Tentu! Kami memberikan harga spesial untuk pembelian dalam jumlah banyak.', 5),
  ('Apakah tersedia layanan beli tunai langsung?', 'Ya, transaksi tunai bisa dilakukan langsung di showroom kami.', 6)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════
-- 5. ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read settings"    ON settings    FOR SELECT USING (true);
CREATE POLICY "Public read categories"  ON categories  FOR SELECT USING (true);
CREATE POLICY "Public read products"    ON products    FOR SELECT USING (true);
CREATE POLICY "Public read faqs"        ON faqs        FOR SELECT USING (true);

CREATE POLICY "Auth write settings"    ON settings    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write categories"  ON categories  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write products"    ON products    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write faqs"        ON faqs        FOR ALL USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════
-- 6. TRIGGER updated_at
-- ═══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════
-- 7. STORAGE BUCKETS
--    Jalankan di SQL Editor ATAU buat manual di
--    Supabase Dashboard → Storage → New Bucket
-- ═══════════════════════════════════════════════

-- Buat bucket (public agar foto bisa diakses tanpa login)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('hero-images',    'hero-images',    true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('about-images',   'about-images',   true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('cta-images',     'cta-images',     true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: publik bisa baca, authenticated bisa upload/hapus
CREATE POLICY "Public read hero"    ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Auth upload hero"    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete hero"    ON storage.objects FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read products"    ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Auth upload products"    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete products"    ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update products"    ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read about"   ON storage.objects FOR SELECT USING (bucket_id = 'about-images');
CREATE POLICY "Auth upload about"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'about-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete about"   ON storage.objects FOR DELETE USING (bucket_id = 'about-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read cta"     ON storage.objects FOR SELECT USING (bucket_id = 'cta-images');
CREATE POLICY "Auth upload cta"     ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cta-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete cta"     ON storage.objects FOR DELETE USING (bucket_id = 'cta-images' AND auth.role() = 'authenticated');

────────────────────────────────────────────────────────────────────
*/
