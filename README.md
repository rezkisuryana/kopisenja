# KopiSenja — Website Company Profile + Dashboard Admin
**Stack:** Vite + React 18 + Tailwind CSS + Supabase (Database + Auth + Storage)

---

## 🚀 CARA SETUP (Step by Step)

### STEP 1 — Buat Project Supabase
1. Buka https://supabase.com → login / daftar (gratis)
2. Klik **"New Project"**
3. Nama: `restogear`, Region: `Southeast Asia (Singapore)`
4. Buat password database → klik **"Create new project"**
5. Tunggu ~2 menit sampai project siap

---

### STEP 2 — Jalankan Schema SQL (Database + Storage)
1. Supabase Dashboard → **"SQL Editor"** → **"New Query"**
2. Buka file `src/lib/supabase.js` di project ini
3. Copy **semua teks SQL** di dalam komentar `/* ... */`
4. Paste ke SQL Editor → klik **"Run"** (Ctrl+Enter)
5. Pastikan semua query sukses ✅

> Schema ini membuat: tabel settings/categories/products/faqs, RLS policies, trigger updated_at, **dan 4 Storage buckets** untuk foto.

---

### STEP 3 — Verifikasi Storage Buckets
1. Supabase Dashboard → **"Storage"**
2. Pastikan 4 bucket ini sudah ada:
   - `hero-images` — foto grid hero section
   - `product-images` — foto produk
   - `about-images` — foto section tentang kami
   - `cta-images` — foto cover CTA banner
3. Jika belum ada, buat manual: klik **"New Bucket"** → isi nama → centang **"Public bucket"**

---

### STEP 4 — Buat User Admin
1. Supabase Dashboard → **"Authentication"** → **"Users"**
2. Klik **"Add user"** → **"Create new user"**
3. Isi email dan password untuk akun admin
4. Klik **"Create user"**

---

### STEP 5 — Ambil API Keys
1. Supabase Dashboard → **"Project Settings"** (⚙️) → **"API"**
2. Copy:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon / public key**: `eyJxxx...`

---

### STEP 6 — Setup & Jalankan Project
```bash
# Masuk ke folder
cd restogear

# Install dependencies
npm install

# Buat .env dari template
cp .env.example .env

# Edit .env — isi URL dan Key dari Step 5
nano .env   # atau buka dengan VS Code

# Jalankan dev server
npm run dev
```
Buka browser → **http://localhost:5173**

Login admin → **http://localhost:5173/admin**

---

## 📁 STRUKTUR PROJECT

```
restogear/
├── src/
│   ├── components/
│   │   ├── public/
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx       ← support 3 foto grid
│   │   │   ├── AboutSection.jsx      ← support 3 foto grid
│   │   │   ├── CategoriesSection.jsx
│   │   │   ├── ProductsSection.jsx
│   │   │   ├── ProductCard.jsx       ← support image_url + fallback icon
│   │   │   ├── ProductModal.jsx      ← support image_url
│   │   │   ├── FaqSection.jsx
│   │   │   ├── CtaBanner.jsx         ← support foto background
│   │   │   ├── ContactSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── FloatingWA.jsx
│   │   └── admin/
│   │       ├── AdminSidebar.jsx
│   │       ├── AdminUI.jsx
│   │       ├── ImageUploader.jsx     ← NEW: upload tunggal + multi-image
│   │       ├── MediaPanel.jsx        ← NEW: kelola foto Hero/About/CTA
│   │       ├── OverviewPanel.jsx
│   │       ├── ProductsPanel.jsx     ← update: tambah upload foto produk
│   │       ├── CategoriesPanel.jsx
│   │       ├── FaqsPanel.jsx
│   │       ├── SettingsPanel.jsx
│   │       └── ProtectedRoute.jsx
│   ├── context/AuthContext.jsx
│   ├── hooks/useData.js
│   ├── lib/
│   │   ├── supabase.js               ← schema SQL + storage SQL
│   │   ├── storage.js                ← NEW: upload/delete helper
│   │   └── utils.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AdminPage.jsx             ← update: tambah panel Media
│   │   └── LoginPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ✨ FITUR FOTO (Baru)

### Dashboard Admin → "Kelola Foto"
| Section | Fitur |
|---|---|
| **Hero Section** | Upload 3 foto untuk grid kanan hero. Fallback ke icon emoji jika kosong. |
| **Tentang Kami** | Upload 3 foto (1 besar + 2 kecil). Fallback ke card quote jika kosong. |
| **CTA Banner** | Upload 1 foto background. Otomatis di-overlay gelap agar teks terbaca. |

### Dashboard Admin → "Produk" → Edit/Tambah Produk
| Fitur | Keterangan |
|---|---|
| Upload foto produk | Drag & drop atau klik untuk pilih foto |
| Preview langsung | Foto terlihat di form sebelum disimpan |
| Ganti foto | Hover foto → tombol "Ganti" |
| Hapus foto | Hover foto → tombol "Hapus" (terhapus dari Storage) |
| Fallback icon | Jika belum ada foto, tampil icon emoji |

### Komponen ImageUploader
- ✅ Drag & drop support
- ✅ Preview real-time
- ✅ Validasi tipe file (hanya gambar)
- ✅ Validasi ukuran (maks 5MB)
- ✅ Upload ke Supabase Storage
- ✅ Auto-delete dari Storage saat diganti/dihapus
- ✅ Loading indicator saat upload
- ✅ Error message jika gagal

---

## 🌐 DEPLOY

### Vercel (Disarankan)
```bash
npm i -g vercel && vercel
# Tambahkan env vars di Vercel Dashboard
```

### Netlify
```bash
npm run build
# Upload folder dist/ ke Netlify
```

⚠️ **Wajib:** tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di environment variables hosting.

---

*Made with ❤️ — KopiSenja Company Profile*
