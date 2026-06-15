import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import LogoDisplay from './LogoDisplay'

const links = [
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Menu', href: '#categories' },
  { label: 'Proses', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontak', href: '#contact' },
]

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function scrollTo(e, href) {
    e.preventDefault(); setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-cream-200'
        : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" onClick={e => scrollTo(e, '#home')}>
          <LogoDisplay settings={settings} size="md" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)}
              className="text-sm font-medium text-espresso-500 hover:text-caramel-500 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/admin"
            className="text-sm font-semibold bg-espresso-700 text-cream-300 px-4 py-2 rounded-full hover:bg-caramel-500 transition-colors">
            Dashboard ↗
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-cream-200 text-espresso-700"
          onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-6 py-5 flex flex-col gap-4 shadow-md">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)}
              className="text-sm font-medium text-espresso-600 hover:text-caramel-500">
              {l.label}
            </a>
          ))}
          <Link to="/admin" className="text-sm font-semibold text-caramel-500">Dashboard Admin →</Link>
        </div>
      )}
    </nav>
  )
}
