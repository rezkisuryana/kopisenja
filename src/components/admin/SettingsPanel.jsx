import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { BtnPrimary, FormGroup, Input, Textarea, Panel, PanelHeader } from './AdminUI'

const FIELDS = [
  { key: 'store_name',    label: 'Nama Toko',                  type: 'input',    placeholder: 'RestoGear' },
  { key: 'whatsapp',      label: 'Nomor WhatsApp (62xxx)',      type: 'input',    placeholder: '6281234567890' },
  { key: 'tagline',       label: 'Tagline Hero',                type: 'input',    placeholder: 'Peralatan Restoran Second...' },
  { key: 'about_tagline', label: 'Quote About',                 type: 'input',    placeholder: '"Kualitas terjamin..."' },
  { key: 'about_p1',      label: 'Deskripsi About (Paragraf 1)',type: 'textarea', placeholder: '' },
  { key: 'about_p2',      label: 'Deskripsi About (Paragraf 2)',type: 'textarea', placeholder: '' },
  { key: 'address',       label: 'Alamat',                      type: 'input',    placeholder: 'Jl. ...' },
  { key: 'phone_display', label: 'Nomor Tampil di Website',     type: 'input',    placeholder: '+62 812-...' },
  { key: 'email',         label: 'Email',                       type: 'input',    placeholder: 'info@...' },
  { key: 'hours',         label: 'Jam Operasional',             type: 'input',    placeholder: 'Senin–Sabtu, 08.00–17.00 WIB' },
  { key: 'cta_desc',      label: 'Teks CTA Banner',             type: 'textarea', placeholder: 'Konsultasikan kebutuhan...' },
]

export default function SettingsPanel({ settings, onSaveMany }) {
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm({ ...settings }) }, [settings])

  async function handleSave() {
    setSaving(true)
    await onSaveMany(form)
    setSaving(false)
  }

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  return (
    <Panel>
      <PanelHeader
        title="Pengaturan Website"
        action={
          <BtnPrimary onClick={handleSave} disabled={saving}>
            <Save size={15} />
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </BtnPrimary>
        }
      />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {FIELDS.map(f => (
          <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
            <FormGroup label={f.label}>
              {f.type === 'textarea' ? (
                <Textarea rows={3} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              ) : (
                <Input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              )}
            </FormGroup>
          </div>
        ))}
      </div>
    </Panel>
  )
}
