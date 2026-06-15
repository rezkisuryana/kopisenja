import { useState } from 'react'
import { Save, Image, LayoutTemplate, BookOpen, Megaphone } from 'lucide-react'
import ImageUploader from './ImageUploader'
import { BUCKETS, deleteImage } from '../../lib/storage'
import { BtnPrimary, Panel, PanelHeader } from './AdminUI'
import toast from 'react-hot-toast'

/**
 * MediaPanel — kelola semua gambar section:
 *  - Hero Section: 3 foto grid
 *  - About Section: 3 foto (1 besar + 2 kecil)
 *  - CTA Cover: 1 foto background
 */
export default function MediaPanel({ settings, onSaveMany }) {
  // Hero images — stored as JSON array in settings.hero_images
  const [heroImages, setHeroImages] = useState(() => {
    try { return JSON.parse(settings?.hero_images || '[]') } catch { return [] }
  })

  // About images — stored as JSON array in settings.about_images
  const [aboutImages, setAboutImages] = useState(() => {
    try { return JSON.parse(settings?.about_images || '[]') } catch { return [] }
  })

  // CTA cover — single URL
  const [ctaCover, setCtaCover] = useState(settings?.cta_cover_url || '')

  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const ok = await onSaveMany({
      hero_images:   JSON.stringify(heroImages),
      about_images:  JSON.stringify(aboutImages),
      cta_cover_url: ctaCover,
    })
    setSaving(false)
    if (ok) toast.success('Foto berhasil disimpan!')
  }

  return (
    <div className="space-y-6">
      {/* Save button */}
      <div className="flex justify-end">
        <BtnPrimary onClick={handleSave} disabled={saving}>
          <Save size={15} />
          {saving ? 'Menyimpan...' : 'Simpan Semua Foto'}
        </BtnPrimary>
      </div>

      {/* ── Hero Section ─────────────────────────── */}
      <Panel>
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              <LayoutTemplate size={16} className="text-copper-500" />
              Foto Hero Section
            </span>
          }
        />
        <div className="p-6 space-y-4">
          <p className="text-sm text-charcoal-500 leading-relaxed">
            Upload 3 foto untuk ditampilkan di grid kanan hero section. Foto pertama akan lebih besar (tall card).
            Jika tidak ada foto, akan tampil icon emoji sebagai fallback.
          </p>

          <MultiImageUploader
            images={heroImages}
            bucket={BUCKETS.hero}
            folder="hero"
            maxImages={3}
            label="Grid Foto Hero (3 slot)"
            onUpdate={setHeroImages}
          />

          {/* Preview mini */}
          <div className="bg-charcoal-800 rounded-2xl p-4">
            <p className="text-xs text-white/50 mb-3 font-medium">Preview Layout Hero</p>
            <div className="grid grid-cols-2 gap-2 h-40">
              <div className="row-span-2 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                {heroImages[0]
                  ? <img src={heroImages[0]} alt="" className="w-full h-full object-cover" />
                  : <span className="text-3xl opacity-40">🫕</span>}
              </div>
              <div className="rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                {heroImages[1]
                  ? <img src={heroImages[1]} alt="" className="w-full h-full object-cover" />
                  : <span className="text-2xl opacity-40">🔥</span>}
              </div>
              <div className="rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                {heroImages[2]
                  ? <img src={heroImages[2]} alt="" className="w-full h-full object-cover" />
                  : <span className="text-2xl opacity-40">🍽️</span>}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-xs leading-relaxed">
            <strong>Tips foto Hero:</strong> Gunakan foto landscape peralatan restoran, dapur, atau suasana resto.
            Resolusi minimal 800×800px. Rasio 1:1 paling optimal.
          </div>
        </div>
      </Panel>

      {/* ── About Section ────────────────────────── */}
      <Panel>
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              <BookOpen size={16} className="text-caramel-500" />
              Foto Section Tentang Kami
            </span>
          }
        />
        <div className="p-6 space-y-4">
          <p className="text-sm text-espresso-500 leading-relaxed">
            Upload <strong>1 foto</strong> untuk ditampilkan di section Tentang Kami.
            Foto akan tampil dalam proporsi portrait dengan quote tagline di atasnya.
            Jika belum ada foto, akan tampil card dekoratif sebagai fallback.
          </p>

          <ImageUploader
            label="Foto Tentang Kami (1 foto)"
            hint="Foto suasana kafe, barista, atau interior. Rasio portrait (4:5) paling optimal. Maks. 5MB."
            bucket={BUCKETS.about}
            folder="about"
            currentUrl={aboutImages[0] || null}
            aspectRatio="video"
            onUploaded={url => setAboutImages([url])}
            onDeleted={() => setAboutImages([])}
          />

          {/* Preview */}
          {aboutImages[0] && (
            <div className="relative rounded-2xl overflow-hidden h-48 shadow-sm">
              <img src={aboutImages[0]} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs font-display italic text-espresso-700 leading-relaxed line-clamp-2">
                  "Setiap cangkir adalah undangan untuk sejenak berhenti..."
                </p>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-xs leading-relaxed">
            <strong>Tips foto About:</strong> Gunakan foto suasana kafe yang hangat, barista sedang menyeduh,
            atau interior yang cozy. Foto portrait/vertikal akan terlihat lebih baik.
          </div>
        </div>
      </Panel>

      {/* ── CTA Banner ───────────────────────────── */}
      <Panel>
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              <Megaphone size={16} className="text-copper-500" />
              Foto Cover CTA Banner
            </span>
          }
        />
        <div className="p-6 space-y-4">
          <p className="text-sm text-charcoal-500 leading-relaxed">
            Upload foto background untuk CTA banner (section ajakan hubungi kami).
            Foto akan di-overlay dengan warna gelap agar teks tetap terbaca.
            Jika tidak diisi, akan tampil background gradasi gelap.
          </p>

          <ImageUploader
            label="Foto Background CTA"
            hint="JPG, PNG, WebP — maks. 5MB. Landscape/widescreen disarankan."
            bucket={BUCKETS.cta}
            folder="cta"
            currentUrl={ctaCover || null}
            aspectRatio="wide"
            onUploaded={url => setCtaCover(url)}
            onDeleted={() => setCtaCover('')}
          />

          {/* Preview CTA */}
          {ctaCover && (
            <div className="relative rounded-2xl overflow-hidden h-32">
              <img src={ctaCover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-charcoal-900/65" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-copper-400 mb-1">Preview CTA</p>
                <p className="font-display text-lg font-bold">Siap Upgrade <span className="text-copper-400">Dapur Restoran</span> Anda?</p>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-xs leading-relaxed">
            <strong>Tips foto CTA:</strong> Gunakan foto suasana restoran yang ramai, dapur yang bersih, atau peralatan yang tertata rapi.
            Resolusi minimal 1200×600px. Foto akan otomatis di-dimming agar teks terbaca.
          </div>
        </div>
      </Panel>

      {/* Save floating */}
      <div className="flex justify-end pt-2 pb-6">
        <BtnPrimary onClick={handleSave} disabled={saving} className="px-8 py-3">
          <Save size={15} />
          {saving ? 'Menyimpan...' : 'Simpan Semua Foto'}
        </BtnPrimary>
      </div>
    </div>
  )
}
