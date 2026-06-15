import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { uploadImage, deleteImage } from '../../lib/storage'
import { cls } from '../../lib/utils'

/**
 * ImageUploader — komponen upload gambar reusable
 *
 * Props:
 *  currentUrl   — URL gambar aktif (string|null)
 *  bucket       — nama Supabase Storage bucket
 *  folder       — subfolder opsional
 *  onUploaded   — callback(url) setelah upload sukses
 *  onDeleted    — callback() setelah foto dihapus
 *  aspectRatio  — 'video' | 'square' | 'wide' | 'auto'
 *  label        — label di atas
 *  hint         — hint text kecil
 *  disabled     — boolean
 */
export default function ImageUploader({
  currentUrl,
  bucket,
  folder = '',
  onUploaded,
  onDeleted,
  aspectRatio = 'video',
  label,
  hint = 'JPG, PNG, WebP — maks. 5MB',
  disabled = false,
}) {
  const inputRef             = useRef(null)
  const [loading, setLoading] = useState(false)
  const [drag, setDrag]       = useState(false)
  const [error, setError]     = useState(null)

  const ASPECT = {
    video:  'aspect-video',
    square: 'aspect-square',
    wide:   'aspect-[21/9]',
    auto:   'min-h-[160px]',
  }

  async function handleFile(file) {
    if (!file || disabled) return
    setError(null)
    setLoading(true)
    const { url, error: err } = await uploadImage(file, bucket, folder)
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    onUploaded?.(url)
  }

  function onInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // reset input agar file yang sama bisa dipilih ulang
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  async function handleDelete() {
    if (!currentUrl || disabled) return
    if (!confirm('Hapus gambar ini?')) return
    await deleteImage(currentUrl, bucket)
    onDeleted?.()
  }

  const isEmpty = !currentUrl

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold text-charcoal-700">{label}</p>}

      <div
        className={cls(
          'relative rounded-2xl overflow-hidden border-2 transition-all',
          ASPECT[aspectRatio] || ASPECT.video,
          isEmpty
            ? drag
              ? 'border-copper-400 bg-copper-50 border-dashed'
              : 'border-dashed border-charcoal-300 bg-charcoal-50 hover:border-copper-400 hover:bg-copper-50/50 cursor-pointer'
            : 'border-charcoal-200',
          disabled && 'opacity-60 pointer-events-none'
        )}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => isEmpty && !loading && inputRef.current?.click()}
      >
        {/* Foto preview */}
        {!isEmpty && (
          <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 gap-2">
            <Loader2 className="animate-spin text-white" size={28} />
            <p className="text-white text-xs font-medium">Mengupload...</p>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 pointer-events-none">
            <div className={cls(
              'w-12 h-12 rounded-2xl flex items-center justify-center',
              drag ? 'bg-copper-100' : 'bg-charcoal-100'
            )}>
              <Upload size={20} className={drag ? 'text-copper-600' : 'text-charcoal-400'} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-charcoal-600">
                {drag ? 'Lepas untuk upload' : 'Klik atau drag & drop'}
              </p>
              <p className="text-xs text-charcoal-400 mt-0.5">{hint}</p>
            </div>
          </div>
        )}

        {/* Hover actions saat ada foto */}
        {!isEmpty && !loading && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/45 transition-all flex items-center justify-center gap-3 opacity-0 hover:opacity-100 z-10">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
              className="bg-white text-charcoal-800 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-copper-500 hover:text-white transition-colors shadow-lg">
              <Upload size={13} /> Ganti Foto
            </button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleDelete() }}
              className="bg-white text-red-600 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors shadow-lg">
              <X size={13} /> Hapus
            </button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">{error}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onInputChange}
        disabled={disabled || loading}
      />
    </div>
  )
}

/**
 * MultiImageUploader — grid 3 slot foto (hero / about)
 */
export function MultiImageUploader({
  images = [],
  bucket,
  folder = '',
  onUpdate,
  maxImages = 3,
  label,
}) {
  const inputRef              = useRef(null)
  const [loadingIdx, setLoadingIdx] = useState(null)
  const [errors, setErrors]   = useState({})
  const [activeSlot, setActiveSlot] = useState(null)

  const slots = Array.from({ length: maxImages }, (_, i) => images[i] || null)

  function openPicker(idx) {
    setActiveSlot(idx)
    inputRef.current?.click()
  }

  async function handleChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || activeSlot === null) return

    setLoadingIdx(activeSlot)
    setErrors(prev => ({ ...prev, [activeSlot]: null }))

    const { url, error } = await uploadImage(file, bucket, folder)
    setLoadingIdx(null)

    if (error) {
      setErrors(prev => ({ ...prev, [activeSlot]: error }))
      return
    }

    const next = [...slots]
    next[activeSlot] = url
    onUpdate?.(next)
    setActiveSlot(null)
  }

  async function removeSlot(idx) {
    if (!confirm('Hapus foto ini?')) return
    const url = slots[idx]
    if (url) await deleteImage(url, bucket)
    const next = [...slots]
    next[idx] = null
    onUpdate?.(next)
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold text-charcoal-700">{label}</p>}

      <div className="grid grid-cols-3 gap-3">
        {slots.map((url, i) => (
          <div key={i} className="space-y-1">
            <div
              className={cls(
                'relative aspect-square rounded-xl overflow-hidden border-2 transition-all',
                url
                  ? 'border-charcoal-200'
                  : 'border-dashed border-charcoal-300 bg-charcoal-50 hover:border-copper-400 hover:bg-copper-50/50 cursor-pointer'
              )}
              onClick={() => !url && openPicker(i)}
            >
              {url ? (
                <>
                  <img src={url} alt={`slot ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/45 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); openPicker(i) }}
                      className="bg-white text-charcoal-800 p-2 rounded-lg hover:bg-copper-500 hover:text-white transition-colors shadow">
                      <Upload size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); removeSlot(i) }}
                      className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow">
                      <X size={13} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                  <ImageIcon size={20} className="text-charcoal-300" />
                  <span className="text-xs text-charcoal-400 font-medium">Foto {i + 1}</span>
                </div>
              )}

              {/* Loading overlay */}
              {loadingIdx === i && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-white" size={20} />
                </div>
              )}
            </div>

            {/* Per-slot error */}
            {errors[i] && (
              <p className="text-[10px] text-red-600 leading-tight">{errors[i]}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-charcoal-400">
        Klik slot kosong untuk upload. Rasio 1:1 (square) disarankan. Maks. 5MB/foto.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
