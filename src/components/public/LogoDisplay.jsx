/**
 * LogoDisplay — tampilkan logo gambar jika ada, fallback ke teks+emoji
 *
 * Props:
 *  settings  — object settings dari Supabase
 *  dark      — true = teks putih (untuk dark bg)
 *  className — extra class
 *  size      — 'sm' | 'md' | 'lg' | null (pakai logo_height dari settings)
 *  forceHeight — angka px, override logo_height
 */
export default function LogoDisplay({ settings, dark = false, className = '', size = 'md', forceHeight }) {
  const logoUrl    = settings?.logo_url    || ''
  const storeName  = settings?.store_name  || 'Kopi Senja'
  const logoEmoji  = settings?.logo_emoji  || '☕'
  // logo_height dari settings (default 36px)
  const savedHeight = parseInt(settings?.logo_height || '36', 10)

  // Ukuran teks fallback
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }

  // Split nama: "Kopi " + "Senja"
  const words = storeName.trim().split(' ')
  const part1 = words.slice(0, -1).join(' ') + (words.length > 1 ? ' ' : '')
  const part2 = words.slice(-1)[0] || ''

  if (logoUrl) {
    // Tentukan tinggi: forceHeight > savedHeight > size preset
    const h = forceHeight || savedHeight
    return (
      <img
        src={logoUrl}
        alt={storeName}
        style={{ height: `${h}px`, width: 'auto' }}
        className={`object-contain block ${className}`}
      />
    )
  }

  // Text logo fallback — pakai size prop untuk konteks non-settings
  const textClass = textSizes[size] || textSizes.md

  return (
    <span className={`font-display ${textClass} font-bold flex items-center gap-2 leading-none ${className}`}>
      <span className="text-caramel-400 text-[1.15em]">{logoEmoji}</span>
      <span className={dark ? 'text-cream-100' : 'text-espresso-700'}>
        {part1}<span className="text-caramel-400">{part2}</span>
      </span>
    </span>
  )
}
