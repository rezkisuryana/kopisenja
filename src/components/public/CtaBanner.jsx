import { openWA } from '../../lib/utils'

export default function CtaBanner({ settings }) {
  const ctaCover = settings?.cta_cover_url || null

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="cta" className="relative overflow-hidden py-28 px-8 md:px-16">
      {/* Background */}
      {ctaCover ? (
        <>
          <img src={ctaCover} alt="CTA" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-espresso-900/75" />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(232,144,42,.2) 0%, transparent 65%)' }} />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-white" />
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-caramel-100 opacity-60" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-espresso-100 opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cream-200 opacity-30" />
        </>
      )}

      <div className={`relative max-w-3xl mx-auto text-center z-10 ${!ctaCover ? '' : ''}`}>
        <span className={`text-xs font-semibold uppercase tracking-widest mb-4 block
          ${ctaCover ? 'text-caramel-400' : 'text-caramel-500'}`}>
          Kunjungi Kami
        </span>

        <h2 className={`font-display text-4xl md:text-5xl font-bold mb-5 leading-tight
          ${ctaCover ? 'text-cream-50' : 'text-espresso-800'}`}>
          {ctaCover ? (
            <>Rasakan Kehangatan <span className="text-caramel-400">Kopi Senja</span></>
          ) : (
            <>Rasakan Kehangatan <em className="not-italic text-caramel-500">Kopi Senja</em></>
          )}
        </h2>

        <p className={`text-lg mb-10 max-w-xl mx-auto leading-relaxed
          ${ctaCover ? 'text-cream-300' : 'text-espresso-500'}`}>
          {settings?.cta_desc || 'Reservasi meja sekarang dan dapatkan pengalaman kafe yang tak terlupakan. Tersedia untuk makan di tempat, takeaway, dan catering acara.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openWA(settings?.whatsapp, 'Halo Kopi Senja! Saya ingin reservasi meja. Apakah tersedia?')}
            className="bg-espresso-700 hover:bg-espresso-600 text-cream-50 font-semibold px-8 py-4
                       rounded-full transition-all hover:-translate-y-0.5 text-sm shadow-lg">
            ☕ Reservasi via WhatsApp
          </button>
          <button onClick={() => scrollTo('products')}
            className={`font-semibold px-8 py-4 rounded-full transition-colors text-sm border
              ${ctaCover
                ? 'bg-white/10 hover:bg-white/20 border-white/25 text-white backdrop-blur-sm'
                : 'bg-white hover:bg-cream-100 border-cream-200 text-espresso-700 shadow-sm'}`}>
            Lihat Menu Lengkap →
          </button>
        </div>
      </div>
    </section>
  )
}
