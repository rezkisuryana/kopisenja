import { openWA } from '../../lib/utils'

export default function HeroSection({ settings }) {
  let heroImages = []
  try { heroImages = JSON.parse(settings?.hero_images || '[]') } catch { }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const tagline = settings?.tagline || 'Temukan Rumah Kedua Anda'

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-espresso-800 via-espresso-700 to-espresso-600" />
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")" }} />
      {/* Warm light blob */}
      <div className="absolute top-0 right-0 w-[60%] h-[70%] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #E8902A 0%, transparent 65%)', transform: 'translate(20%, -20%)' }} />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #C97820 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-16">

        {/* Left: Copy */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-caramel-400/20 border border-caramel-400/30 text-caramel-200 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel-400 block" />
            Kafe & Restoran · Buka Setiap Hari
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 leading-[1.08] mb-6">
            {tagline.split(' ').slice(0, -2).join(' ')}{' '}
            <em className="not-italic text-caramel-400 block">
              {tagline.split(' ').slice(-2).join(' ')}
            </em>
          </h1>

          <p className="text-cream-300 text-lg leading-relaxed max-w-lg mb-10">
            Setiap tegukan membawa kehangatan, setiap suapan menceritakan cinta dapur kami.
            Tempat di mana waktu terasa lebih lambat dan rasa selalu terkenang.
          </p>

          <div className="flex flex-row flex-wrap gap-3 sm:gap-4">
            <button onClick={() => scrollTo('products')}
              className="flex-1 sm:flex-initial bg-caramel-400 hover:bg-caramel-300 text-espresso-900 font-semibold
                         px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-full transition-all hover:-translate-y-0.5
                         text-sm sm:text-sm shadow-lg text-center whitespace-nowrap">
              Lihat Menu
            </button>
            <button
              onClick={() => openWA(settings?.whatsapp, 'Halo Kopi Senja, saya ingin reservasi meja. Apakah tersedia?')}
              className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 border border-white/25 text-cream-100 font-semibold
                         px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-full transition-colors
                         text-sm sm:text-sm backdrop-blur-sm text-center whitespace-nowrap">
              Reservasi Meja →
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14 pt-8 border-t border-white/10">
            {[
              { num: '50+', label: 'Menu Pilihan' },
              { num: '4.9★', label: 'Rating Google' },
              { num: '5 Th', label: 'Melayani' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-cream-50 leading-none">{s.num}</div>
                <div className="text-xs text-cream-400 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Photo grid */}
        <div className="hidden lg:grid grid-cols-2 gap-4 h-[580px]">
          <div className="row-span-2 rounded-3xl overflow-hidden bg-espresso-600/40 border border-white/10">
            {heroImages[0]
              ? <img src={heroImages[0]} alt="Suasana kafe" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-40">
                <span className="text-7xl">☕</span>
                <span className="text-cream-300 text-sm">Foto Suasana</span>
              </div>}
          </div>
          <div className="rounded-3xl overflow-hidden bg-espresso-600/40 border border-white/10">
            {heroImages[1]
              ? <img src={heroImages[1]} alt="Menu kopi" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
                <span className="text-5xl">🍰</span>
                <span className="text-cream-300 text-xs">Menu Makanan</span>
              </div>}
          </div>
          <div className="rounded-3xl overflow-hidden bg-espresso-600/40 border border-white/10">
            {heroImages[2]
              ? <img src={heroImages[2]} alt="Detail kopi" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
                <span className="text-5xl">🌿</span>
                <span className="text-cream-300 text-xs">Suasana Nyaman</span>
              </div>}
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream-400 opacity-60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-cream-400 animate-pulse" />
      </div>
    </section>
  )
}
