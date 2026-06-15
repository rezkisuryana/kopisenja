import LogoDisplay from './LogoDisplay'

export default function Footer({ settings }) {
  function scrollTo(id) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const socials = [
    {
      title: 'Instagram',
      href: settings?.instagram_url || '#',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'Facebook',
      href: settings?.facebook_url || '#',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      title: 'Google Maps',
      href: settings?.maps_url || '#',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-espresso-900 text-cream-100">
      <div className="max-w-7xl mx-auto px-8 md:px-16 pt-14 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3"><LogoDisplay settings={settings} dark size="md" /></div>
            <p className="text-cream-500 text-sm leading-relaxed">
              Kafe & restoran dengan suasana hangat, menu berkualitas, dan pelayanan penuh hati.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map(s => (
                <a key={s.title}
                  href={s.href}
                  target="_blank" rel="noopener noreferrer"
                  title={s.title}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                             text-cream-400 hover:bg-caramel-400/30 hover:text-caramel-400
                             transition-colors cursor-pointer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Menu', links: [['Kopi & Minuman', '#products'], ['Makanan Berat', '#products'], ['Camilan & Dessert', '#products'], ['Paket Spesial', '#products']] },
            { title: 'Layanan', links: [['Makan di Tempat', '#about'], ['Takeaway', '#about'], ['Catering Acara', '#contact'], ['Reservasi', '#contact']] },
            { title: 'Info', links: [['Tentang Kami', '#about'], ['Cara Memesan', '#process'], ['FAQ', '#faq'], ['Kontak', '#contact']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-cream-100 mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} onClick={e => { e.preventDefault(); scrollTo(href) }}
                      className="text-cream-500 hover:text-caramel-400 text-sm transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-cream-600 text-xs">
          <span>© 2026 {settings?.store_name || 'Kopi Senja'}. Hak cipta dilindungi.</span>
          <span>Dibuat dengan ☕ & ❤️</span>
        </div>
      </div>
    </footer>
  )
}
