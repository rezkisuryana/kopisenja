-- ============================================================
-- KOPI SENJA — Full seed data migration
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Reset & update settings
INSERT INTO settings (key, value) VALUES
  ('store_name',        'Kopi Senja'),
  ('logo_emoji',        '☕'),
  ('logo_text',         'Kopi Senja'),
  ('logo_url',          ''),
  ('whatsapp',          '6281234567890'),
  ('tagline',           'Temukan Rumah Kedua Anda'),
  ('about_p1',          'Kopi Senja lahir dari kerinduan akan tempat yang terasa seperti rumah — di mana aroma kopi menyambut, musik mengalun pelan, dan waktu seakan tidak terburu-buru.'),
  ('about_p2',          'Kami percaya bahwa kafe terbaik adalah yang membuat Anda ingin kembali lagi — bukan karena trendnya, tapi karena rasanya seperti pulang ke rumah.'),
  ('about_tagline',     'Setiap cangkir adalah undangan untuk sejenak berhenti, menikmati, dan merasakan.'),
  ('address',           'Jl. Sunset No. 17, Cipete, Jakarta Selatan'),
  ('email',             'hello@kopisenja.id'),
  ('phone_display',     '+62 812-3456-7890'),
  ('hours',             'Setiap Hari, 08.00 – 22.00 WIB'),
  ('cta_desc',          'Reservasi meja sekarang dan dapatkan pengalaman kafe yang tak terlupakan. Tersedia untuk makan di tempat, takeaway, dan catering acara.'),
  ('hero_images',       '[]'),
  ('about_images',      '[]'),
  ('cta_cover_url',     ''),
  ('process_title',     'Cara Memesan'),
  ('process_subtitle',  'Proses yang mudah dan menyenangkan — dari reservasi hingga hidangan tersaji di meja Anda.'),
  ('process_steps',     '[{"icon":"📞","title":"Reservasi","desc":"Hubungi kami via WhatsApp atau telepon untuk reservasi meja, paket acara, atau pertanyaan menu."},{"icon":"📋","title":"Pilih Paket","desc":"Pilih dari menu reguler, paket spesial, atau custom catering untuk acara Anda."},{"icon":"✅","title":"Konfirmasi","desc":"Tim kami akan konfirmasi ketersediaan dan detail pesanan dalam waktu singkat."},{"icon":"🍽️","title":"Nikmati Sajian","desc":"Datang dan nikmati sajian hangat kami, atau tunggu pengiriman ke lokasi Anda."},{"icon":"⭐","title":"Beri Ulasan","desc":"Ceritakan pengalaman Anda. Masukan Anda membantu kami terus berkembang."}]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Reset categories
TRUNCATE categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, icon, sort_order) VALUES
  ('Kopi & Espresso',  '☕', 1),
  ('Non-Kopi',         '🍵', 2),
  ('Makanan Berat',    '🍽️', 3),
  ('Camilan & Snack',  '🥪', 4),
  ('Dessert & Kue',    '🍰', 5),
  ('Paket Spesial',    '🎁', 6);

-- 3. Reset products
TRUNCATE products RESTART IDENTITY;

INSERT INTO products (name, description, price, orig_price, icon, badge, category_id, status) VALUES
  ('Signature Espresso',      'Espresso blend spesial kami, bold dengan aftertaste manis dan aroma karamel yang khas.',                           28000, 0,     '☕', 'best', 1, 'active'),
  ('Kopi Senja Latte',        'Susu steamed lembut bertemu espresso single origin. Rasa yang seimbang, cocok sepanjang hari.',                    35000, 0,     '☕', 'new',  1, 'active'),
  ('Caramel Macchiato',       'Espresso, susu, vanilla, dan drizzle karamel homemade. Manis, creamy, dan memanjakan.',                            38000, 45000, '☕', 'sale', 1, 'active'),
  ('Cold Brew Float',         'Cold brew 12 jam dengan ice cream vanilla premium. Definisi sempurna minuman sore hari.',                          42000, 0,     '☕', '',    1, 'active'),
  ('Matcha Latte',            'Matcha ceremonial grade dari Jepang, paduan susu oat yang creamy. Untuk Anda yang tidak minum kopi.',              33000, 0,     '🍵', 'new',  2, 'active'),
  ('Coklat Panas Belgia',     'Dark chocolate 70% Belgium dengan susu segar. Hangat, kaya, dan menenangkan.',                                     30000, 0,     '🍫', '',    2, 'active'),
  ('Es Teh Kembang',          'Teh bunga butterfly pea local dengan lemon dan madu. Cantik dan menyegarkan.',                                     25000, 0,     '🌸', '',    2, 'active'),
  ('Nasi Goreng Senja',       'Nasi goreng kecap manis dengan ayam kampung, telur ceplok, dan acar. Comfort food terbaik kami.',                  55000, 0,     '🍳', 'best', 3, 'active'),
  ('Pasta Aglio e Olio',      'Spaghetti dengan bawang putih, cabai, dan olive oil extra virgin. Simple tapi tidak pernah gagal.',                65000, 75000, '🍝', 'sale', 3, 'active'),
  ('Sandwich Deli Club',      'Triple decker dengan daging asap, keju cheddar, selada segar, dan saus mustard honey.',                            58000, 0,     '🥪', '',    4, 'active'),
  ('Croissant Butter',        'Croissant flaky mentega dari Perancis, dipanggang fresh setiap pagi. Best seller pagi hari.',                      28000, 0,     '🥐', 'hot',  4, 'active'),
  ('Tiramisu Klasik',         'Resep autentik Italia — ladyfinger, mascarpone, espresso, dan taburan coklat bubuk premium.',                      45000, 0,     '🍰', 'best', 5, 'active'),
  ('Burnt Cheesecake',        'Basque-style burnt cheesecake dengan tekstur creamy di dalam, sedikit gosong di luar. Sempurna.',                   42000, 48000, '🎂', 'sale', 5, 'active'),
  ('Paket Kerja Santai',      'Kopi pilihan + 1 camilan + colokan & WiFi kencang untuk 4 jam. Cocok untuk WFH warriors.',                         85000, 100000,'💻', 'sale', 6, 'active'),
  ('Paket Ngobrol Sore',      '2 minuman pilihan + 1 dessert sharing + snack board. Sempurna untuk quality time berdua.',                         120000, 0,    '👫', 'new',  6, 'active');

-- 4. Reset FAQ
TRUNCATE faqs RESTART IDENTITY;

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Apakah perlu reservasi untuk makan di tempat?',        'Tidak wajib untuk kunjungan biasa, namun kami sangat menyarankan reservasi untuk akhir pekan dan hari libur agar mendapatkan tempat terbaik.',             1),
  ('Apakah ada fasilitas WiFi dan colokan?',               'Ya! Semua area kafe dilengkapi WiFi berkecepatan tinggi dan colokan di setiap meja. Nikmati sesi kerja atau belajar Anda bersama kopi favorit.',           2),
  ('Apakah Kopi Senja menerima pesanan catering?',         'Tentu! Kami melayani catering untuk acara kantor, arisan, ulang tahun, hingga pernikahan. Hubungi kami minimal 3 hari sebelum acara untuk konsultasi.',    3),
  ('Apakah tersedia menu untuk vegetarian?',               'Ada banyak pilihan untuk vegetarian, termasuk Matcha Latte, sandwich sayur, dan beberapa menu makanan berat. Tanyakan pada staff kami saat berkunjung.',   4),
  ('Jam berapa Kopi Senja buka?',                          'Kami buka setiap hari dari pukul 08.00 hingga 22.00 WIB, termasuk hari libur nasional. Kami tutup hanya pada hari raya besar.',                           5),
  ('Apakah tersedia layanan takeaway dan delivery?',        'Ya, tersedia takeaway langsung di kasir. Untuk delivery, kami tersedia di GoFood dan GrabFood. Minimal order delivery Rp 50.000.',                         6);

-- 5. Verifikasi
SELECT 'settings count' AS info, COUNT(*) AS total FROM settings
UNION ALL
SELECT 'categories count', COUNT(*) FROM categories
UNION ALL
SELECT 'products count',   COUNT(*) FROM products
UNION ALL
SELECT 'faqs count',       COUNT(*) FROM faqs;
