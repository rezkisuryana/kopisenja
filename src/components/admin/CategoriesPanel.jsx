import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Panel, PanelHeader, BtnPrimary, BtnEdit, BtnDanger, Modal, FormGroup, Input } from './AdminUI'

const EMPTY = { name: '', icon: '' }

export default function CategoriesPanel({ categories, products, onAdd, onUpdate, onDelete }) {
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true) }
  function openEdit(c) { setForm({ name: c.name, icon: c.icon }); setEditId(c.id); setModal(true) }

  async function handleSave() {
    if (!form.name || !form.icon) return
    setSaving(true)
    if (editId) await onUpdate(editId, form)
    else await onAdd({ ...form, sort_order: categories.length + 1 })
    setSaving(false); setModal(false)
  }

  return (
    <div>
      <Panel>
        <PanelHeader
          title={`Kategori (${categories.length})`}
          action={<BtnPrimary onClick={openAdd}><Plus size={15} /> Tambah Kategori</BtnPrimary>}
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100">
                {['Icon', 'Nama Kategori', 'Jumlah Produk', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-50">
              {categories.map(c => {
                const count = products.filter(p => p.category_id === c.id).length
                return (
                  <tr key={c.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4 text-2xl">{c.icon}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-espresso-800">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-cream-500">{count} produk</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <BtnEdit onClick={() => openEdit(c)} />
                        <BtnDanger onClick={() => { if (confirm('Hapus kategori ini?')) onDelete(c.id) }}>Hapus</BtnDanger>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!categories.length && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-espresso-400 text-sm">Belum ada kategori.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {modal && (
        <Modal
          title={editId ? 'Edit Kategori' : 'Tambah Kategori'}
          onClose={() => setModal(false)}
          footer={<>
            <button onClick={() => setModal(false)} className="text-sm font-medium text-cream-500 px-4 py-2">Batal</button>
            <BtnPrimary onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </BtnPrimary>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Nama Kategori *">
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Alat Masak..." />
            </FormGroup>
            <FormGroup label="Emoji Icon *">
              <Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="🍳" />
            </FormGroup>
          </div>
        </Modal>
      )}
    </div>
  )
}
