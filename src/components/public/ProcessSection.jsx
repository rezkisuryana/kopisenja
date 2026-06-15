const DEFAULT_STEPS = [
  { icon:'📞', title:'Reservasi',        desc:'Hubungi kami via WhatsApp atau telepon untuk reservasi meja, paket acara, atau pertanyaan menu.' },
  { icon:'📋', title:'Pilih Paket',      desc:'Pilih dari menu reguler, paket spesial, atau custom catering untuk acara Anda.' },
  { icon:'✅', title:'Konfirmasi',        desc:'Tim kami akan konfirmasi ketersediaan dan detail pesanan dalam waktu singkat.' },
  { icon:'🍽️', title:'Nikmati Sajian',   desc:'Datang dan nikmati sajian hangat kami, atau tunggu pengiriman ke lokasi Anda.' },
  { icon:'⭐', title:'Beri Ulasan',       desc:'Ceritakan pengalaman Anda. Masukan Anda membantu kami terus berkembang.' },
]

export default function ProcessSection({ settings }) {
  let steps = DEFAULT_STEPS
  try {
    const parsed = JSON.parse(settings?.process_steps || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) steps = parsed
  } catch {}

  const title    = settings?.process_title    || 'Cara Memesan'
  const subtitle = settings?.process_subtitle || 'Proses yang mudah dan menyenangkan — dari reservasi hingga hidangan tersaji di meja Anda.'

  return (
    <section id="process" className="bg-white py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-caramel-500 mb-3">Mudah & Cepat</p>
          <h2 className="font-display text-4xl font-bold text-espresso-800 mb-4">{title}</h2>
          <p className="text-espresso-400 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cream-300 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                {/* Icon circle */}
                <div className="relative mb-5 z-10">
                  <div className="w-20 h-20 rounded-full bg-cream-100 border-2 border-cream-200
                                  flex items-center justify-center shadow-sm
                                  group-hover:border-caramel-400 group-hover:bg-caramel-50
                                  transition-all duration-300">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-espresso-700
                                   text-cream-50 text-xs font-bold flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-espresso-800 text-base mb-2">{step.title}</h3>
                <p className="text-espresso-400 text-xs leading-relaxed max-w-[180px]">{step.desc}</p>

                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-6 text-cream-300 text-2xl">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 bg-espresso-800 text-cream-100
                         rounded-2xl px-7 py-4 shadow-lg">
            <span className="text-2xl">☕</span>
            <p className="text-sm font-medium">
              Mulai dari WhatsApp — tim kami siap melayani Anda dengan hangat!
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
