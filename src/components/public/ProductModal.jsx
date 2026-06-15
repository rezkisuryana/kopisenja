import { useEffect } from 'react'
import { X } from 'lucide-react'
import { fmtPrice, openWA } from '../../lib/utils'

const BADGE_STYLES = {
  sale: 'bg-red-500 text-white',
  new:  'bg-caramel-400 text-espresso-900',
  hot:  'bg-espresso-700 text-cream-100',
  best: 'bg-sage-500 text-white',
}

export default function ProductModal({ product, waNumber, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  function handleWA() {
    openWA(waNumber, `Halo Kopi Senja! Saya ingin memesan *${product.name}*. Apakah tersedia sekarang?`)
  }

  const catName  = product.categories?.name || ''
  const imageUrl = product.image_url || null

  return (
    <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-[fadeUp_.25s_ease]">

        {/* Image */}
        <div className="h-60 relative overflow-hidden">
          {imageUrl
            ? <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-8xl">
                {product.icon || '☕'}
              </div>}

          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur
                       flex items-center justify-center hover:bg-white transition-colors shadow">
            <X size={18} className="text-espresso-700" />
          </button>

          {product.badge && (
            <span className={`absolute top-4 left-4 text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow
              ${BADGE_STYLES[product.badge] || BADGE_STYLES.new}`}>
              {product.badge}
            </span>
          )}

          {/* Gradient bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Body */}
        <div className="px-6 pb-6 -mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-caramel-500 mb-1">{catName}</p>
          <h2 className="font-display text-2xl font-bold text-espresso-800 mb-2">{product.name}</h2>
          <p className="text-espresso-500 text-sm leading-relaxed mb-5">{product.description}</p>

          <div className="flex items-end gap-3 mb-6">
            <span className="font-display text-3xl font-bold text-espresso-800">{fmtPrice(product.price)}</span>
            {product.orig_price > 0 && (
              <span className="text-espresso-300 text-sm line-through pb-1">{fmtPrice(product.orig_price)}</span>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleWA}
              className="flex-1 bg-[#25D366] hover:bg-[#1EBD5A] text-white font-semibold py-3.5 rounded-2xl
                         flex items-center justify-center gap-2 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Pesan via WhatsApp
            </button>
            <button onClick={onClose}
              className="bg-cream-100 border border-cream-200 text-espresso-700 font-semibold py-3.5 px-5
                         rounded-2xl hover:bg-cream-200 transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
