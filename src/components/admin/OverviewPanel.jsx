import { fmtPrice } from '../../lib/utils'
import { StatCard, Panel, PanelHeader, Badge } from './AdminUI'

export default function OverviewPanel({ products, categories, faqs }) {
  const active = products.filter(p => p.status === 'active')
  const prices = active.map(p => p.price)
  const minPrice = prices.length ? Math.min(...prices) : null
  const recent = [...products].slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Total Produk"  value={products.length}    sub={`${active.length} aktif`} />
        <StatCard icon="🗂️" label="Kategori"      value={categories.length}  sub="kategori produk" />
        <StatCard icon="❓" label="FAQ"            value={faqs.length}        sub="pertanyaan tersimpan" />
        <StatCard icon="💰" label="Harga Terendah" value={minPrice ? fmtPrice(minPrice) : '—'} sub="produk termurah" />
      </div>

      {/* Recent products */}
      <Panel>
        <PanelHeader title="Produk Terbaru" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100">
                {['', 'Nama', 'Kategori', 'Harga', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {recent.map(p => (
                <tr key={p.id} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="px-6 py-3 text-2xl">{p.icon}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-charcoal-800">{p.name}</td>
                  <td className="px-6 py-3 text-sm text-charcoal-500">{p.categories?.name || '—'}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-charcoal-800">{fmtPrice(p.price)}</td>
                  <td className="px-6 py-3"><Badge status={p.status} /></td>
                </tr>
              ))}
              {!products.length && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-charcoal-400 text-sm">Belum ada produk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
