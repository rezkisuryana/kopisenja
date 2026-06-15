import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// ── Settings ──────────────────────────────────────────────
export function useSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('settings').select('*')
    if (data) {
      const map = {}
      data.forEach(r => { map[r.key] = r.value })
      setSettings(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function update(key, value) {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })
    if (error) { toast.error('Gagal menyimpan'); return false }
    setSettings(prev => ({ ...prev, [key]: value }))
    return true
  }

  async function updateMany(pairs) {
    const rows = Object.entries(pairs).map(([key, value]) => ({ key, value }))
    const { error } = await supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' })
    if (error) { toast.error('Gagal menyimpan pengaturan'); return false }
    setSettings(prev => ({ ...prev, ...pairs }))
    return true
  }

  return { settings, loading, update, updateMany, refetch: fetch }
}

// ── Categories ────────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function add(payload) {
    const { data, error } = await supabase
      .from('categories').insert(payload).select().single()
    if (error) { toast.error('Gagal menambah kategori'); return null }
    setCategories(prev => [...prev, data])
    toast.success('Kategori ditambahkan')
    return data
  }

  async function update(id, payload) {
    const { data, error } = await supabase
      .from('categories').update(payload).eq('id', id).select().single()
    if (error) { toast.error('Gagal memperbarui kategori'); return null }
    setCategories(prev => prev.map(c => c.id === id ? data : c))
    toast.success('Kategori diperbarui')
    return data
  }

  async function remove(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus kategori'); return false }
    setCategories(prev => prev.filter(c => c.id !== id))
    toast.success('Kategori dihapus')
    return true
  }

  return { categories, loading, add, update, remove, refetch: fetch }
}

// ── Products ──────────────────────────────────────────────
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(id, name, icon)')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function add(payload) {
    // Bersihkan field yang mungkin null/undefined agar tidak trigger error DB
    const clean = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    )
    const { data, error } = await supabase
      .from('products').insert(clean).select('*, categories(id,name,icon)').single()
    if (error) {
      console.error('Add product error:', error)
      const msg = error.message?.includes('image_url')
        ? 'Kolom image_url belum ada. Jalankan MIGRATION_FIX.sql di Supabase!'
        : error.message || 'Gagal menambah produk'
      toast.error(msg)
      return null
    }
    setProducts(prev => [data, ...prev])
    toast.success('Produk ditambahkan')
    return data
  }

  async function update(id, payload) {
    const clean = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    )
    const { data, error } = await supabase
      .from('products').update(clean).eq('id', id).select('*, categories(id,name,icon)').single()
    if (error) {
      console.error('Update product error:', error)
      const msg = error.message?.includes('image_url')
        ? 'Kolom image_url belum ada. Jalankan MIGRATION_FIX.sql di Supabase!'
        : error.message || 'Gagal memperbarui produk'
      toast.error(msg)
      return null
    }
    setProducts(prev => prev.map(p => p.id === id ? data : p))
    toast.success('Produk diperbarui')
    return data
  }

  async function remove(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus produk'); return false }
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Produk dihapus')
    return true
  }

  return { products, loading, add, update, remove, refetch: fetch }
}

// ── FAQs ──────────────────────────────────────────────────
export function useFaqs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order')
    setFaqs(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function add(payload) {
    const { data, error } = await supabase.from('faqs').insert(payload).select().single()
    if (error) { toast.error('Gagal menambah FAQ'); return null }
    setFaqs(prev => [...prev, data])
    toast.success('FAQ ditambahkan')
    return data
  }

  async function update(id, payload) {
    const { data, error } = await supabase.from('faqs').update(payload).eq('id', id).select().single()
    if (error) { toast.error('Gagal memperbarui FAQ'); return null }
    setFaqs(prev => prev.map(f => f.id === id ? data : f))
    toast.success('FAQ diperbarui')
    return data
  }

  async function remove(id) {
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus FAQ'); return false }
    setFaqs(prev => prev.filter(f => f.id !== id))
    toast.success('FAQ dihapus')
    return true
  }

  return { faqs, loading, add, update, remove, refetch: fetch }
}

// ── Messages ──────────────────────────────────────────────
export function useMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function send(payload) {
    const { data, error } = await supabase
      .from('messages')
      .insert(payload)
      .select()
      .single()
    if (error) {
      console.error('Send message error:', error)
      return { data: null, error }
    }
    return { data, error: null }
  }

  async function markRead(id) {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('id', id)
    if (!error) setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m))
  }

  async function markReplied(id) {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'replied' })
      .eq('id', id)
    if (!error) setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'replied' } : m))
  }

  async function remove(id) {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id))
      toast.success('Pesan dihapus')
    }
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length

  return { messages, loading, unreadCount, send, markRead, markReplied, remove, refetch: fetch }
}
