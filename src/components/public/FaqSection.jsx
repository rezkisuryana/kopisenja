import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function FaqSection({ faqs }) {
  const [openId, setOpenId] = useState(null)
  const toggle = id => setOpenId(prev => prev === id ? null : id)

  const half = Math.ceil(faqs.length / 2)
  const cols  = [faqs.slice(0, half), faqs.slice(half)]

  return (
    <section id="faq" className="bg-espresso-800 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-caramel-400 mb-3">FAQ</p>
          <h2 className="font-display text-4xl font-bold text-cream-50 mb-4">Pertanyaan Umum</h2>
          <p className="text-cream-400 max-w-md mx-auto">Semua yang perlu Anda ketahui sebelum berkunjung</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {cols.map((col, ci) => (
            <div key={ci} className="divide-y divide-white/10">
              {col.map(f => (
                <div key={f.id} className="py-5">
                  <button className="flex items-start justify-between w-full gap-4 text-left"
                    onClick={() => toggle(f.id)}>
                    <span className="font-semibold text-sm text-cream-100 leading-snug">{f.question}</span>
                    <span className={`w-7 h-7 flex-shrink-0 rounded-full border flex items-center justify-center transition-all
                      ${openId === f.id
                        ? 'bg-caramel-400 border-caramel-400 text-espresso-900'
                        : 'border-white/20 text-cream-400'}`}>
                      {openId === f.id ? <Minus size={12} /> : <Plus size={12} />}
                    </span>
                  </button>
                  <div className={`faq-answer text-sm text-cream-400 leading-relaxed ${openId === f.id ? 'open' : ''}`}>
                    <p className="pt-3">{f.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
