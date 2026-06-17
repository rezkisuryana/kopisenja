import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Panel, PanelHeader, BtnPrimary, BtnEdit, BtnDanger, Modal, FormGroup, Input, Textarea } from './AdminUI'

const EMPTY = { question: '', answer: '' }

export default function FaqsPanel({ faqs, onAdd, onUpdate, onDelete }) {
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true) }
  function openEdit(f) { setForm({ question: f.question, answer: f.answer }); setEditId(f.id); setModal(true) }

  async function handleSave() {
    if (!form.question || !form.answer) return
    setSaving(true)
    if (editId) await onUpdate(editId, form)
    else await onAdd({ ...form, sort_order: faqs.length + 1 })
    setSaving(false); setModal(false)
  }

  return (
    <div>
      <Panel>
        <PanelHeader
          title={`FAQ (${faqs.length})`}
          action={<BtnPrimary onClick={openAdd}><Plus size={15} /> Tambah FAQ</BtnPrimary>}
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100">
                {['#', 'Pertanyaan', 'Jawaban', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-50">
              {faqs.map((f, i) => (
                <tr key={f.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-espresso-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-espresso-800 max-w-xs">{f.question}</td>
                  <td className="px-6 py-4 text-sm text-cream-500 max-w-sm line-clamp-2">{f.answer}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <BtnEdit onClick={() => openEdit(f)} />
                      <BtnDanger onClick={() => { if (confirm('Hapus FAQ ini?')) onDelete(f.id) }}>Hapus</BtnDanger>
                    </div>
                  </td>
                </tr>
              ))}
              {!faqs.length && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-espresso-400 text-sm">Belum ada FAQ.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {modal && (
        <Modal
          title={editId ? 'Edit FAQ' : 'Tambah FAQ'}
          onClose={() => setModal(false)}
          footer={<>
            <button onClick={() => setModal(false)} className="text-sm font-medium text-cream-500 px-4 py-2">Batal</button>
            <BtnPrimary onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </BtnPrimary>
          </>}>
          <FormGroup label="Pertanyaan *">
            <Input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              placeholder="Apakah produk bisa dikirim ke luar kota?" />
          </FormGroup>
          <FormGroup label="Jawaban *">
            <Textarea rows={4} value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
              placeholder="Ya, kami melayani pengiriman..." />
          </FormGroup>
        </Modal>
      )}
    </div>
  )
}
