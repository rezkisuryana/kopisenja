-- ============================================================
-- MIGRATION FIX — Jalankan ini di Supabase SQL Editor
-- Untuk memperbaiki error 400 saat tambah produk & upload foto
-- ============================================================

-- 1. Tambah kolom image_url ke tabel products (jika belum ada)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- 2. Tambah setting keys untuk foto (jika belum ada)
INSERT INTO settings (key, value) VALUES
  ('hero_images',   '[]'),
  ('about_images',  '[]'),
  ('cta_cover_url', '')
ON CONFLICT (key) DO NOTHING;

-- 3. Buat Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('hero-images',    'hero-images',    true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('about-images',   'about-images',   true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('cta-images',     'cta-images',     true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies — hapus dulu kalau sudah ada, buat ulang
DO $$ BEGIN

  -- hero-images
  DROP POLICY IF EXISTS "Public read hero"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth upload hero"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth delete hero"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth update hero"  ON storage.objects;

  -- product-images
  DROP POLICY IF EXISTS "Public read products"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth upload products"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth delete products"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth update products"  ON storage.objects;

  -- about-images
  DROP POLICY IF EXISTS "Public read about"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth upload about"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth delete about"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth update about"  ON storage.objects;

  -- cta-images
  DROP POLICY IF EXISTS "Public read cta"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth upload cta"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth delete cta"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth update cta"  ON storage.objects;

END $$;

-- hero-images
CREATE POLICY "Public read hero"  ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Auth upload hero"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update hero"  ON storage.objects FOR UPDATE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete hero"  ON storage.objects FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- product-images
CREATE POLICY "Public read products"  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Auth upload products"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update products"  ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete products"  ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- about-images
CREATE POLICY "Public read about"  ON storage.objects FOR SELECT USING (bucket_id = 'about-images');
CREATE POLICY "Auth upload about"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'about-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update about"  ON storage.objects FOR UPDATE USING (bucket_id = 'about-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete about"  ON storage.objects FOR DELETE USING (bucket_id = 'about-images' AND auth.role() = 'authenticated');

-- cta-images
CREATE POLICY "Public read cta"  ON storage.objects FOR SELECT USING (bucket_id = 'cta-images');
CREATE POLICY "Auth upload cta"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cta-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update cta"  ON storage.objects FOR UPDATE USING (bucket_id = 'cta-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete cta"  ON storage.objects FOR DELETE USING (bucket_id = 'cta-images' AND auth.role() = 'authenticated');

-- 5. Verifikasi
SELECT 
  'products.image_url' AS check_item,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='products' AND column_name='image_url'
  ) THEN '✅ OK' ELSE '❌ MISSING' END AS status

UNION ALL

SELECT 
  'bucket: product-images',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id='product-images')
  THEN '✅ OK' ELSE '❌ MISSING' END

UNION ALL

SELECT 
  'bucket: hero-images',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id='hero-images')
  THEN '✅ OK' ELSE '❌ MISSING' END

UNION ALL

SELECT 
  'bucket: about-images',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id='about-images')
  THEN '✅ OK' ELSE '❌ MISSING' END

UNION ALL

SELECT 
  'bucket: cta-images',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id='cta-images')
  THEN '✅ OK' ELSE '❌ MISSING' END

UNION ALL

SELECT 
  'setting: hero_images',
  CASE WHEN EXISTS (SELECT 1 FROM settings WHERE key='hero_images')
  THEN '✅ OK' ELSE '❌ MISSING' END;

-- ============================================================
-- MIGRATION v4 — Logo & Process Steps
-- ============================================================

-- 1. Tambah setting keys baru
INSERT INTO settings (key, value) VALUES
  ('logo_url',      ''),
  ('logo_text',     'RestoGear'),
  ('logo_emoji',    '🍴'),
  ('process_title', 'Proses Pembelian'),
  ('process_subtitle', 'Mudah, transparan, dan terpercaya — dari konsultasi hingga barang tiba di tangan Anda.'),
  ('process_steps', '[
    {"icon":"💬","title":"Konsultasi Kebutuhan","desc":"Ceritakan kebutuhan peralatan dan anggaran Anda. Tim kami siap membantu merekomendasikan pilihan terbaik via WhatsApp."},
    {"icon":"🔍","title":"Pilih Barang","desc":"Pilih produk dari katalog kami atau minta kami carikan barang spesifik. Harga transparan, tidak ada biaya tersembunyi."},
    {"icon":"📹","title":"Video Kondisi Barang","desc":"Kami kirimkan video kondisi barang secara real-time sebelum transaksi. Pastikan Anda puas dengan kondisinya."},
    {"icon":"💳","title":"Pembayaran","desc":"Pembayaran via transfer bank atau COD untuk area tertentu. Bukti transfer dikonfirmasi sebelum barang dikirim."},
    {"icon":"🚚","title":"Pengiriman","desc":"Barang dikemas aman dan dikirim via ekspedisi terpercaya ke seluruh Indonesia. Tracking nomor resi diberikan."}
  ]')
ON CONFLICT (key) DO NOTHING;

-- 2. Buat bucket untuk logo
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logo-images', 'logo-images', true, 2097152, ARRAY['image/jpeg','image/png','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies logo
DROP POLICY IF EXISTS "Public read logo"  ON storage.objects;
DROP POLICY IF EXISTS "Auth upload logo"  ON storage.objects;
DROP POLICY IF EXISTS "Auth update logo"  ON storage.objects;
DROP POLICY IF EXISTS "Auth delete logo"  ON storage.objects;

CREATE POLICY "Public read logo"  ON storage.objects FOR SELECT USING (bucket_id = 'logo-images');
CREATE POLICY "Auth upload logo"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logo-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update logo"  ON storage.objects FOR UPDATE USING (bucket_id = 'logo-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete logo"  ON storage.objects FOR DELETE USING (bucket_id = 'logo-images' AND auth.role() = 'authenticated');

-- ============================================================
-- MIGRATION v5 — Logo size + Messages table
-- ============================================================

-- 1. Tambah setting logo_height
INSERT INTO settings (key, value) VALUES
  ('logo_height', '36')
ON CONFLICT (key) DO NOTHING;

-- 2. Tabel pesan masuk dari form kontak
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  need       TEXT,
  message    TEXT,
  status     TEXT DEFAULT 'unread' CHECK (status IN ('unread','read','replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Publik bisa INSERT (kirim pesan)
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT WITH CHECK (true);

-- Hanya authenticated yang bisa baca & update
CREATE POLICY "Auth read messages"
  ON messages FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Auth update messages"
  ON messages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete messages"
  ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- Verifikasi
SELECT 'logo_height setting' AS check_item,
  CASE WHEN EXISTS (SELECT 1 FROM settings WHERE key='logo_height')
  THEN '✅ OK' ELSE '❌ MISSING' END AS status
UNION ALL
SELECT 'messages table',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='messages')
  THEN '✅ OK' ELSE '❌ MISSING' END;
