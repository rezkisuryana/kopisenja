import { cls } from '../../lib/utils'

export default function CategoriesSection({ categories, activeCategory, onSelect, products }) {
  const activeCount = products.filter(p => p.status === 'active').length

  return (
    <section id="categories" className="bg-espresso-800 py-20 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-caramel-400 mb-3">Jelajahi</p>
          <h2 className="font-display text-4xl font-bold text-cream-50 mb-4">Kategori Menu</h2>
          <p className="text-cream-400 max-w-md mx-auto">Temukan menu favorit Anda dari pilihan kami</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {/* All */}
          <button onClick={() => onSelect('all')}
            className={cls(
              'flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-semibold transition-all',
              activeCategory === 'all'
                ? 'bg-caramel-400 border-caramel-400 text-espresso-900 shadow-lg shadow-caramel-400/25'
                : 'border-white/15 text-cream-300 hover:border-caramel-400/50 hover:text-cream-100 bg-white/5'
            )}>
            <span>🍽️</span> Semua
            <span className={cls('text-xs px-2 py-0.5 rounded-full font-medium',
              activeCategory === 'all' ? 'bg-espresso-900/20' : 'bg-white/10')}>
              {activeCount}
            </span>
          </button>

          {categories.map(cat => {
            const count  = products.filter(p => p.category_id === cat.id && p.status === 'active').length
            const isActive = activeCategory === cat.id
            return (
              <button key={cat.id} onClick={() => onSelect(cat.id)}
                className={cls(
                  'flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-caramel-400 border-caramel-400 text-espresso-900 shadow-lg shadow-caramel-400/25'
                    : 'border-white/15 text-cream-300 hover:border-caramel-400/50 hover:text-cream-100 bg-white/5'
                )}>
                <span>{cat.icon}</span>
                {cat.name}
                <span className={cls('text-xs px-2 py-0.5 rounded-full font-medium',
                  isActive ? 'bg-espresso-900/20' : 'bg-white/10')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
