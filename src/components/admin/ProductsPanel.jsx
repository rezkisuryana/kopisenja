import { useState } from 'react'
import { Plus, Search, Image } from 'lucide-react'
import { fmtPrice } from '../../lib/utils'
import { BUCKETS } from '../../lib/storage'
import ImageUploader from './ImageUploader'
import { Panel, PanelHeader, BtnPrimary, BtnEdit, BtnDanger, Badge, Modal, FormGroup, Input, Textarea, Select } from './AdminUI'

const EMPTY = {
  name: '', description: '', price: '', orig_price: '',
  icon: '📦', badge: '', category_id: '', status: 'active', image_url: ''
}

export default function ProductsPanel({ products, categories, onAdd, onUpdate, onDelete }) {
  const [query, setQuery]   = useState('')
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const visible = products.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase())
  )

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true) }

  function openEdit(p) {
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      orig_price: p.orig_price || '', icon: p.icon || '📦',
      badge: p.badge || '', category_id: p.category_id || '',
      status: p.status, image_url: p.image_url || ''
    })
    setEditId(p.id); setModal(true)
  }

  async function handleSave() {
    if (!form.name || !form.price) return
    setSaving(true)
    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       Number(form.price),
      orig_price:  Number(form.orig_price) || 0,
      icon:        form.icon || '📦',
      badge:       form.badge,
      category_id: form.category_id ? Number(form.category_id) : null,
      status:      form.status,
      image_url:   form.image_url || null,
    }
    if (editId) await onUpdate(editId, payload)
    else        await onAdd(payload)
    setSaving(false)
    setModal(false)
  }

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  return (
    <div>
      <Panel>
        <PanelHeader
          title={`Produk (${products.length})`}
          action={<BtnPrimary onClick={openAdd}><Plus size={15} /> Tambah Produk</BtnPrimary>}
        />

        {/* Search */}
        <div className="px-6 py-3 border-b border-cream-100">
          <div className="flex items-center gap-2 bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2 w-72">
            <Search size={15} className="text-espresso-400" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="bg-transparent outline-none text-sm text-espresso-800 placeholder-espresso-400 w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100">
                {['Foto', 'Nama Produk', 'Kategori', 'Harga', 'Badge', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-50">
              {visible.map(p => (
                <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                  {/* Thumbnail */}
                  <td className="px-5 py-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-caramel-100 to-caramel-50 flex items-center justify-center flex-shrink-0">
                      {p.image_url
                        ? <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-xl">{p.icon || '📦'}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-espresso-800">{p.name}</p>
                    <p className="text-xs text-espresso-400 mt-0.5 line-clamp-1">{p.description}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-cream-500 whitespace-nowrap">{p.categories?.name || '—'}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-espresso-800">{fmtPrice(p.price)}</span>
                    {p.orig_price > 0 && <span className="text-xs text-espresso-400 line-through ml-2">{fmtPrice(p.orig_price)}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {p.badge
                      ? <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-caramel-100 text-caramel-700">{p.badge}</span>
                      : <span className="text-espresso-300 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3"><Badge status={p.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <BtnEdit onClick={() => openEdit(p)} />
                      <BtnDanger onClick={() => { if (confirm('Hapus produk ini?')) onDelete(p.id) }}>Hapus</BtnDanger>
                    </div>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-espresso-400 text-sm">Tidak ada produk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Modal */}
      {modal && (
        <Modal
          title={editId ? 'Edit Produk' : 'Tambah Produk'}
          onClose={() => setModal(false)}
          footer={<>
            <button onClick={() => setModal(false)} className="text-sm font-medium text-cream-500 hover:text-espresso-800 px-4 py-2">Batal</button>
            <BtnPrimary onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </BtnPrimary>
          </>}>

          {/* Image uploader */}
          <ImageUploader
            label="Foto Produk"
            hint="JPG, PNG, WebP — maks. 5MB. Rasio 4:3 disarankan."
            bucket={BUCKETS.products}
            folder={editId ? `product-${editId}` : 'new'}
            currentUrl={form.image_url || null}
            aspectRatio="video"
            onUploaded={url => set('image_url', url)}
            onDeleted={() => set('image_url', '')}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Nama Produk *">
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Kompor gas 4 tungku..." />
            </FormGroup>
            <FormGroup label="Kategori">
              <Select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">Pilih kategori...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </Select>
            </FormGroup>
          </div>

          <FormGroup label="Deskripsi">
            <Textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Kondisi mulus, bekas pakai ringan..." />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Harga (Rp) *">
              <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="1500000" />
            </FormGroup>
            <FormGroup label="Harga Coret (Rp)">
              <Input type="number" value={form.orig_price} onChange={e => set('orig_price', e.target.value)} placeholder="2000000" />
            </FormGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormGroup label="Emoji / Icon">
              <Input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🔥" />
            </FormGroup>
            <FormGroup label="Badge">
              <Select value={form.badge} onChange={e => set('badge', e.target.value)}>
                <option value="">Tidak ada</option>
                <option value="sale">SALE</option>
                <option value="new">NEW</option>
                <option value="hot">HOT</option>
              </Select>
            </FormGroup>
            <FormGroup label="Status">
              <Select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Aktif</option>
                <option value="draft">Draft</option>
              </Select>
            </FormGroup>
          </div>

          <p className="text-xs text-espresso-400 bg-cream-50 border border-cream-200 rounded-xl p-3">
            💡 <strong>Tip:</strong> Jika foto diupload, icon emoji tidak akan ditampilkan di website. Foto prioritas lebih tinggi dari icon.
          </p>
        </Modal>
      )}
    </div>
  )
}
