import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import { Panel, PanelHeader, BtnPrimary, FormGroup, Input, Textarea } from './AdminUI'
import toast from 'react-hot-toast'

const DEFAULT_STEPS = [
  { icon: '💬', title: 'Konsultasi Kebutuhan',  desc: 'Ceritakan kebutuhan peralatan dan anggaran Anda.' },
  { icon: '🔍', title: 'Pilih Barang',          desc: 'Pilih produk dari katalog atau minta kami carikan.' },
  { icon: '📹', title: 'Video Kondisi Barang',  desc: 'Kami kirimkan video kondisi barang sebelum transaksi.' },
  { icon: '💳', title: 'Pembayaran',            desc: 'Transfer bank atau COD. Konfirmasi sebelum pengiriman.' },
  { icon: '🚚', title: 'Pengiriman',            desc: 'Dikemas aman, dikirim ke seluruh Indonesia.' },
]

export default function ProcessPanel({ settings, onSaveMany }) {
  const [title,    setTitle]    = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [steps,    setSteps]    = useState([])
  const [saving,   setSaving]   = useState(false)

  // Init dari settings
  useEffect(() => {
    setTitle(settings?.process_title || 'Proses Pembelian')
    setSubtitle(settings?.process_subtitle || 'Mudah, transparan, dan terpercaya — dari konsultasi hingga barang tiba di tangan Anda.')
    try {
      const parsed = JSON.parse(settings?.process_steps || '[]')
      setSteps(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_STEPS)
    } catch {
      setSteps(DEFAULT_STEPS)
    }
  }, [settings])

  async function handleSave() {
    if (steps.some(s => !s.title.trim())) {
      toast.error('Semua judul langkah wajib diisi!')
      return
    }
    setSaving(true)
    const ok = await onSaveMany({
      process_title:    title,
      process_subtitle: subtitle,
      process_steps:    JSON.stringify(steps),
    })
    setSaving(false)
    if (ok) toast.success('Proses pembelian disimpan!')
  }

  function updateStep(idx, key, value) {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
  }

  function addStep() {
    setSteps(prev => [...prev, { icon: '⭐', title: 'Langkah Baru', desc: 'Deskripsi langkah ini...' }])
  }

  function removeStep(idx) {
    if (steps.length <= 2) { toast.error('Minimal 2 langkah.'); return }
    setSteps(prev => prev.filter((_, i) => i !== idx))
  }

  function moveStep(idx, dir) {
    const next = [...steps]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setSteps(next)
  }

  return (
    <div className="space-y-5">

      {/* Section title & subtitle */}
      <Panel>
        <PanelHeader
          title="Judul Section"
          action={
            <BtnPrimary onClick={handleSave} disabled={saving}>
              <Save size={15} />
              {saving ? 'Menyimpan...' : 'Simpan'}
            </BtnPrimary>
          }
        />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Judul Section">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Proses Pembelian"
            />
          </FormGroup>
          <FormGroup label="Subjudul / Deskripsi">
            <Input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Mudah, transparan, dan terpercaya..."
            />
          </FormGroup>
        </div>
      </Panel>

      {/* Steps */}
      <Panel>
        <PanelHeader
          title={`Langkah-Langkah (${steps.length})`}
          action={
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 text-sm font-semibold text-copper-600 hover:text-copper-500 transition-colors">
              <Plus size={15} /> Tambah Langkah
            </button>
          }
        />

        <div className="divide-y divide-charcoal-100">
          {steps.map((step, i) => (
            <div key={i} className="p-5 flex gap-4 items-start group hover:bg-charcoal-50/40 transition-colors">

              {/* Step number */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                <div className="w-7 h-7 rounded-full bg-copper-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </div>
                {/* Move up/down */}
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveStep(i, -1)} disabled={i === 0}
                    className="text-charcoal-400 hover:text-charcoal-700 disabled:opacity-25 transition-colors p-0.5">
                    <ChevronUp size={13} />
                  </button>
                  <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1}
                    className="text-charcoal-400 hover:text-charcoal-700 disabled:opacity-25 transition-colors p-0.5">
                    <ChevronDown size={13} />
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[80px_1fr_2fr] gap-3 items-start">
                <FormGroup label="Icon">
                  <Input
                    value={step.icon}
                    onChange={e => updateStep(i, 'icon', e.target.value)}
                    placeholder="💬"
                    className="text-center text-xl"
                  />
                </FormGroup>
                <FormGroup label="Judul *">
                  <Input
                    value={step.title}
                    onChange={e => updateStep(i, 'title', e.target.value)}
                    placeholder="Nama langkah..."
                  />
                </FormGroup>
                <FormGroup label="Deskripsi">
                  <Textarea
                    rows={2}
                    value={step.desc}
                    onChange={e => updateStep(i, 'desc', e.target.value)}
                    placeholder="Penjelasan singkat langkah ini..."
                  />
                </FormGroup>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeStep(i)}
                className="flex-shrink-0 mt-6 p-1.5 rounded-lg text-charcoal-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Preview mini */}
        <div className="border-t border-charcoal-100 p-5 bg-charcoal-50/50">
          <p className="text-xs font-semibold text-charcoal-400 mb-3 uppercase tracking-wider">Preview</p>
          <div className="flex flex-wrap gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-charcoal-200 rounded-xl px-3 py-2 shadow-sm">
                <span className="w-6 h-6 rounded-full bg-copper-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-lg">{step.icon}</span>
                <span className="text-xs font-semibold text-charcoal-700 whitespace-nowrap">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed">
        <strong>Tips:</strong> Gunakan emoji yang relevan untuk setiap langkah agar lebih menarik.
        Urutkan langkah sesuai alur pembelian yang natural. Minimal 2 langkah, maksimal tidak dibatasi.
      </div>
    </div>
  )
}
