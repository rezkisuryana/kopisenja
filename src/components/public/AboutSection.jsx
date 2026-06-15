const VALUES = [
  { icon: '🌱', label: 'Bahan Segar Lokal',   desc: 'Dipilih dari petani dan produsen lokal terbaik setiap hari' },
  { icon: '🤝', label: 'Pelayanan Hangat',     desc: 'Setiap tamu disambut seperti teman lama yang pulang' },
  { icon: '☕', label: 'Kopi Specialty',        desc: 'Single origin Nusantara, diseduh dengan presisi' },
  { icon: '🏡', label: 'Suasana Nyaman',        desc: 'Didesain sebagai ruang ketiga yang bikin betah' },
]

export default function AboutSection({ settings }) {
  let aboutImages = []
  try { aboutImages = JSON.parse(settings?.about_images || '[]') } catch {}

  // Hanya ambil 1 gambar pertama
  const mainImage = aboutImages[0] || null

  return (
    <section id="about" className="bg-cream-50 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Visual — 1 foto saja */}
        <div className="relative order-2 lg:order-1">
          {mainImage ? (
            /* Foto tunggal dengan aspect ratio 4:5 portrait — cocok untuk kafe */
            <div className="relative rounded-3xl overflow-hidden h-[520px] shadow-2xl shadow-espresso-200/40">
              <img
                src={mainImage}
                alt="Suasana Kopi Senja"
                className="w-full h-full object-cover"
              />
              {/* Warm gradient overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/40 via-transparent to-transparent" />

              {/* Floating quote card di atas foto */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm
                              rounded-2xl p-5 shadow-lg">
                <p className="font-display text-sm italic text-espresso-700 leading-relaxed">
                  "{settings?.about_tagline || 'Setiap cangkir adalah undangan untuk sejenak berhenti, menikmati, dan merasakan.'}"
                </p>
              </div>
            </div>
          ) : (
            /* Fallback: card dekoratif jika belum ada foto */
            <div className="bg-gradient-to-br from-espresso-700 to-espresso-800 rounded-3xl p-10
                            min-h-[420px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 bottom-0 text-[12rem] opacity-10 leading-none select-none">☕</div>
              <div className="flex flex-wrap gap-2">
                {['🌱 Bahan Lokal','☕ Specialty Coffee','🤝 Hangat & Ramah','🏡 Cozy Vibes'].map(t => (
                  <span key={t} className="bg-white/10 text-cream-200 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15">
                    {t}
                  </span>
                ))}
              </div>
              <blockquote className="font-display text-2xl font-semibold text-cream-100 leading-snug">
                "{settings?.about_tagline || 'Setiap cangkir adalah undangan untuk sejenak berhenti, menikmati, dan merasakan.'}"
              </blockquote>
            </div>
          )}

          {/* Floating badge pojok kanan atas */}
          <div className="absolute -top-4 -right-4 bg-caramel-400 text-espresso-900 rounded-2xl px-4 py-3 shadow-xl">
            <strong className="block text-sm font-bold leading-none">Buka Setiap Hari</strong>
            <span className="text-xs opacity-80 mt-0.5 block">08.00 – 22.00 WIB</span>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-caramel-500 mb-3">Cerita Kami</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-espresso-800 leading-tight mb-6">
            Lebih dari Sekadar<br />
            <em className="not-italic text-caramel-500">Secangkir Kopi</em>
          </h2>
          <p className="text-espresso-500 mb-5 leading-relaxed text-[15px]">
            {settings?.about_p1 || 'Kopi Senja lahir dari kerinduan akan tempat yang terasa seperti rumah — di mana aroma kopi menyambut, musik mengalun pelan, dan waktu seakan tidak terburu-buru.'}
          </p>
          <p className="text-espresso-500 mb-8 leading-relaxed text-[15px]">
            {settings?.about_p2 || 'Kami percaya bahwa kafe terbaik adalah yang membuat Anda ingin kembali lagi — bukan karena trendnya, tapi karena rasanya seperti pulang ke rumah.'}
          </p>

          {/* Value grid */}
          <div className="grid grid-cols-2 gap-3">
            {VALUES.map(v => (
              <div key={v.label} className="bg-cream-100 border border-cream-200 rounded-2xl p-4">
                <span className="text-2xl mb-2 block">{v.icon}</span>
                <p className="text-sm font-semibold text-espresso-700 mb-1">{v.label}</p>
                <p className="text-xs text-espresso-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
