import { useState, useEffect } from 'react'
import { Save, Type, Image, ZoomIn, ZoomOut } from 'lucide-react'
import ImageUploader from './ImageUploader'
import { Panel, PanelHeader, BtnPrimary, FormGroup, Input } from './AdminUI'
import { BUCKETS, deleteImage } from '../../lib/storage'
import LogoDisplay from '../public/LogoDisplay'
import toast from 'react-hot-toast'

const MIN_H = 20
const MAX_H = 80

export default function LogoPanel({ settings, onSaveMany }) {
  const [logoUrl,    setLogoUrl]    = useState('')
  const [logoText,   setLogoText]   = useState('')
  const [logoEmoji,  setLogoEmoji]  = useState('')
  const [storeName,  setStoreName]  = useState('')
  const [logoHeight, setLogoHeight] = useState(36)
  const [tab,        setTab]        = useState('image')
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    setLogoUrl(settings?.logo_url     || '')
    setLogoText(settings?.logo_text   || 'Kopi Senja')
    setLogoEmoji(settings?.logo_emoji || '☕')
    setStoreName(settings?.store_name || 'Kopi Senja')
    setLogoHeight(parseInt(settings?.logo_height || '36', 10))
    if (!settings?.logo_url) setTab('text')
    else setTab('image')
  }, [settings])

  async function handleSave() {
    setSaving(true)
    const ok = await onSaveMany({
      logo_url:    logoUrl,
      logo_text:   logoText,
      logo_emoji:  logoEmoji,
      store_name:  storeName,
      logo_height: String(logoHeight),
    })
    setSaving(false)
    if (ok) toast.success('Logo disimpan!')
  }

  async function handleDeleteLogo() {
    if (logoUrl) await deleteImage(logoUrl, BUCKETS.logo)
    setLogoUrl('')
    setTab('text')
  }

  const previewSettings = {
    logo_url:    tab === 'image' ? logoUrl : '',
    logo_text:   logoText,
    logo_emoji:  logoEmoji,
    store_name:  storeName,
    logo_height: String(logoHeight),
  }

  return (
    <div className="space-y-5">

      {/* ── Live Preview ──────────────────────────── */}
      <Panel>
        <PanelHeader title="Preview Logo" />
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light bg */}
            <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 flex flex-col gap-3">
              <p className="text-xs text-espresso-400 font-medium">Navbar (background terang)</p>
              <div className="bg-white/80 backdrop-blur border border-cream-200 rounded-xl px-5 py-3 flex items-center">
                <LogoDisplay settings={previewSettings} dark={false} />
              </div>
            </div>
            {/* Dark bg */}
            <div className="bg-espresso-900 rounded-2xl p-6 flex flex-col gap-3">
              <p className="text-xs text-cream-500 font-medium">Footer & Sidebar (background gelap)</p>
              <div className="flex items-center px-1">
                <LogoDisplay settings={previewSettings} dark />
              </div>
            </div>
          </div>

          {/* ── Resize Slider ── (hanya muncul jika ada logo gambar) */}
          {logoUrl && tab === 'image' && (
            <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-espresso-700">Ukuran Logo</p>
                <span className="text-xs font-bold text-caramel-500 bg-caramel-50 border border-caramel-200 px-2.5 py-1 rounded-full">
                  {logoHeight}px
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLogoHeight(h => Math.max(MIN_H, h - 2))}
                  className="w-8 h-8 rounded-full bg-white border border-cream-300 flex items-center justify-center
                             text-espresso-500 hover:border-caramel-400 hover:text-caramel-500 transition-colors flex-shrink-0">
                  <ZoomOut size={14} />
                </button>

                <input
                  type="range"
                  min={MIN_H}
                  max={MAX_H}
                  value={logoHeight}
                  onChange={e => setLogoHeight(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer
                             bg-cream-300 accent-caramel-400"
                />

                <button
                  onClick={() => setLogoHeight(h => Math.min(MAX_H, h + 2))}
                  className="w-8 h-8 rounded-full bg-white border border-cream-300 flex items-center justify-center
                             text-espresso-500 hover:border-caramel-400 hover:text-caramel-500 transition-colors flex-shrink-0">
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* Size presets */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'XS', val: 24 },
                  { label: 'S',  val: 30 },
                  { label: 'M',  val: 36 },
                  { label: 'L',  val: 48 },
                  { label: 'XL', val: 60 },
                  { label: 'XXL',val: 72 },
                ].map(p => (
                  <button key={p.label} onClick={() => setLogoHeight(p.val)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                      ${logoHeight === p.val
                        ? 'bg-espresso-700 border-espresso-700 text-cream-50'
                        : 'bg-white border-cream-300 text-espresso-600 hover:border-caramel-400'}`}>
                    {p.label} ({p.val}px)
                  </button>
                ))}
              </div>

              {/* Live size preview */}
              <div className="bg-white border border-cream-200 rounded-xl p-4 flex items-center justify-center min-h-[70px]">
                <img
                  src={logoUrl}
                  alt="logo preview"
                  style={{ height: `${logoHeight}px`, width: 'auto' }}
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* ── Logo type tabs ─────────────────────────── */}
      <Panel>
        <PanelHeader
          title="Pengaturan Logo"
          action={
            <BtnPrimary onClick={handleSave} disabled={saving}>
              <Save size={15} />
              {saving ? 'Menyimpan...' : 'Simpan Logo'}
            </BtnPrimary>
          }
        />

        {/* Tab switcher */}
        <div className="px-6 pt-5">
          <div className="flex gap-2 bg-cream-100 p-1 rounded-xl w-fit">
            {[
              { key: 'image', label: 'Upload Gambar', Icon: Image },
              { key: 'text',  label: 'Logo Teks',     Icon: Type  },
            ].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${tab === key
                    ? 'bg-white text-espresso-800 shadow-sm'
                    : 'text-espresso-500 hover:text-espresso-700'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 pt-5">
          {tab === 'image' ? (
            <div className="space-y-4">
              <ImageUploader
                label="File Logo (PNG transparan / SVG disarankan)"
                hint="PNG dengan background transparan atau SVG. Maks. 2MB. Ukuran bisa diatur dengan slider di atas."
                bucket={BUCKETS.logo}
                folder="logo"
                currentUrl={logoUrl || null}
                aspectRatio="auto"
                onUploaded={url => { setLogoUrl(url); setTab('image') }}
                onDeleted={handleDeleteLogo}
              />

              {logoUrl && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 flex items-start gap-2">
                  <span className="flex-shrink-0">✅</span>
                  <span>Logo gambar aktif. Gunakan <strong>slider di atas</strong> untuk mengatur ukuran, lalu klik <strong>Simpan Logo</strong>.</span>
                </div>
              )}

              {!logoUrl && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 leading-relaxed">
                  <strong>Tips:</strong> Gunakan PNG transparan agar logo terlihat baik di navbar terang maupun footer gelap. Resolusi minimal 200px tinggi.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormGroup label="Emoji / Icon">
                  <Input
                    value={logoEmoji}
                    onChange={e => setLogoEmoji(e.target.value)}
                    placeholder="☕"
                    className="text-center text-xl"
                  />
                </FormGroup>
                <FormGroup label="Nama Toko">
                  <Input
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder="Kopi Senja"
                  />
                </FormGroup>
                <FormGroup label="Teks Logo">
                  <Input
                    value={logoText}
                    onChange={e => setLogoText(e.target.value)}
                    placeholder="Kopi Senja"
                  />
                </FormGroup>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <strong>Info:</strong> Kata terakhir nama toko akan berwarna caramel/emas secara otomatis.
                Nama toko juga digunakan di footer copyright.
              </div>
            </div>
          )}
        </div>
      </Panel>
    </div>
  )
}
