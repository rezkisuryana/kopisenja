import { supabase } from './supabase'

export const BUCKETS = {
  hero:     'hero-images',
  products: 'product-images',
  about:    'about-images',
  cta:      'cta-images',
  logo:     'logo-images',
}

export async function uploadImage(file, bucket, folder = '') {
  if (!file) return { url: null, error: 'Tidak ada file dipilih.' }
  if (!file.type.startsWith('image/')) {
    return { url: null, error: 'File harus berupa gambar (JPG, PNG, WebP, SVG).' }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: 'Ukuran gambar maksimal 5MB.' }
  }

  const ext      = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const rand     = Math.random().toString(36).slice(2, 8)
  const filename = folder
    ? `${folder}/${Date.now()}-${rand}.${ext}`
    : `${Date.now()}-${rand}.${ext}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { upsert: true, cacheControl: '3600', contentType: file.type })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    if (uploadError.message?.includes('Bucket not found')) {
      return { url: null, error: `Bucket "${bucket}" tidak ditemukan. Jalankan MIGRATION_FIX.sql.` }
    }
    if (uploadError.statusCode === '403') {
      return { url: null, error: 'Akses ditolak. Pastikan Storage policy sudah diset.' }
    }
    return { url: null, error: uploadError.message || 'Upload gagal.' }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(uploadData?.path || filename)
  return { url: data.publicUrl, error: null }
}

export async function deleteImage(url, bucket) {
  if (!url || !bucket) return
  try {
    const marker = `/object/public/${bucket}/`
    const idx    = url.indexOf(marker)
    if (idx === -1) return
    const path = decodeURIComponent(url.slice(idx + marker.length).split('?')[0])
    await supabase.storage.from(bucket).remove([path])
  } catch (e) {
    console.warn('deleteImage error:', e)
  }
}
