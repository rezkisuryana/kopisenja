import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

const PER_PAGE = 8

export default function ProductsSection({ products, activeCategory, waNumber }) {
  const [query,    setQuery]    = useState('')
  const [page,     setPage]     = useState(1)
  const [selected, setSelected] = useState(null)

  useEffect(() => { setPage(1) }, [activeCategory, query])

  const filtered = products.filter(p => {
    if (p.status !== 'active') return false
    if (activeCategory !== 'all' && p.category_id !== activeCategory) return false
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) &&
        !p.description?.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function pageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (safePage <= 4)        return [1,2,3,4,5,'…',totalPages]
    if (safePage >= totalPages-3) return [1,'…',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages]
    return [1,'…',safePage-1,safePage,safePage+1,'…',totalPages]
  }

  function goTo(p) {
    setPage(p)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="products" className="bg-cream-50 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-caramel-500 mb-3">Menu Kami</p>
          <h2 className="font-display text-4xl font-bold text-espresso-800 mb-4">Produk Pilihan</h2>
          <p className="text-espresso-400 max-w-md mx-auto">
            Dibuat dengan bahan pilihan, disajikan dengan cinta
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-full px-4 py-2.5 w-full sm:w-72 shadow-sm">
            <Search size={15} className="text-espresso-300 flex-shrink-0" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Cari menu..."
              className="bg-transparent outline-none text-sm text-espresso-700 placeholder-espresso-300 w-full" />
          </div>
          <span className="text-sm text-espresso-400 whitespace-nowrap">
            {filtered.length > 0
              ? `${(safePage-1)*PER_PAGE+1}–${Math.min(safePage*PER_PAGE,filtered.length)} dari ${filtered.length} menu`
              : '0 menu ditemukan'}
          </span>
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-20 text-espresso-300">
            <div className="text-5xl mb-4">☕</div>
            <p className="font-medium text-espresso-500">Menu tidak ditemukan.</p>
            {query && (
              <button onClick={() => setQuery('')}
                className="mt-3 text-sm text-caramel-500 hover:underline">
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginated.map(p => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} onOpenModal={setSelected} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button onClick={() => goTo(safePage-1)} disabled={safePage===1}
                className="w-9 h-9 rounded-full border border-cream-300 flex items-center justify-center
                           text-espresso-500 hover:border-caramel-400 hover:text-caramel-500
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>

              {pageNumbers().map((p, i) =>
                p === '…'
                  ? <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-espresso-300 text-sm">···</span>
                  : <button key={p} onClick={() => goTo(p)}
                      className={`w-9 h-9 rounded-full border text-sm font-semibold transition-all
                        ${safePage===p
                          ? 'bg-espresso-700 border-espresso-700 text-cream-50 shadow-sm'
                          : 'border-cream-300 text-espresso-500 hover:border-caramel-400 hover:text-caramel-500'}`}>
                      {p}
                    </button>
              )}

              <button onClick={() => goTo(safePage+1)} disabled={safePage===totalPages}
                className="w-9 h-9 rounded-full border border-cream-300 flex items-center justify-center
                           text-espresso-500 hover:border-caramel-400 hover:text-caramel-500
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
            <p className="text-xs text-espresso-400">Halaman {safePage} dari {totalPages}</p>
          </div>
        )}
      </div>

      {selected && (
        <ProductModal product={selected} waNumber={waNumber} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
