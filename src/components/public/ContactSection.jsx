import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { openWA } from '../../lib/utils'
import { supabase } from '../../lib/supabase'

export default function ContactSection({ settings }) {
  const INIT = { name: '', phone: '', need: '', message: '' }
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Nama dan nomor WhatsApp wajib diisi.')
      return
    }
    setError('')
    setLoading(true)

    // Simpan ke Supabase
    const { error: dbError } = await supabase
      .from('messages')
      .insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        need: form.need || null,
        message: form.message.trim() || null,
        status: 'unread',
      })

    setLoading(false)

    if (dbError) {
      console.error('Save message error:', dbError)
      // Jika tabel belum ada, tetap lanjut ke WA
      if (dbError.message?.includes('relation "messages" does not exist')) {
        setError('Database belum siap. Jalankan MIGRATION_FIX.sql dulu. Pesan dikirim via WhatsApp saja.')
      } else {
        setError('Gagal menyimpan pesan. Silakan hubungi via WhatsApp langsung.')
      }
    } else {
      setSuccess(true)
    }

    // Tetap buka WA setelah simpan (WA + DB = double channel)
    const text = `Halo Kopi Senja! 👋\n\nNama: ${form.name}\nNo. WA: ${form.phone}\nKeperluan: ${form.need || '-'}\n\n${form.message || 'Saya ingin bertanya lebih lanjut.'}`
    openWA(settings?.whatsapp, text)

    if (!dbError) {
      setForm(INIT)
      // Reset success state setelah 5 detik
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  const contactItems = [
    { icon: <MapPin size={18} />, label: 'Lokasi', value: settings?.address || '—' },
    { icon: <Phone size={18} />, label: 'WhatsApp / Telp', value: settings?.phone_display || '—' },
    { icon: <Mail size={18} />, label: 'Email', value: settings?.email || '—' },
    { icon: <Clock size={18} />, label: 'Jam Buka', value: settings?.hours || '—' },
  ]

  return (
    <section id="contact" className="bg-cream-50 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-caramel-500 mb-3">Hubungi Kami</p>
          <h2 className="font-display text-4xl font-bold text-espresso-800 mb-5 leading-tight">
            Kami Senang<br />Mendengar Anda
          </h2>
          <p className="text-espresso-500 mb-8 leading-relaxed">
            Untuk reservasi meja, catering acara, pertanyaan menu, atau sekadar menyapa — kami selalu siap melayani dengan hangat.
          </p>
          <div className="space-y-5">
            {contactItems.map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-espresso-100 rounded-xl flex items-center justify-center text-caramel-500 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-espresso-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-espresso-800 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm">
          <h3 className="font-display text-xl font-bold text-espresso-800 mb-1">Kirim Pesan</h3>
          <p className="text-xs text-espresso-400 mb-6">
            Pesan Anda akan tersimpan & tim kami akan menghubungi via WhatsApp.
          </p>

          {/* Success state */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3 mb-5">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">Pesan berhasil terkirim! ☕</p>
                <p className="text-xs text-green-700 mt-1">
                  Pesan Anda sudah tersimpan dan WhatsApp sudah terbuka. Tim kami akan segera menghubungi Anda.
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 mb-4 leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-700 mb-1.5">Nama Lengkap *</label>
                <input type="text" placeholder="Budi Santoso" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  disabled={loading}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-4 py-2.5 text-sm
                             outline-none focus:border-caramel-400 transition-colors text-espresso-800
                             disabled:opacity-60" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-espresso-700 mb-1.5">Nomor WhatsApp *</label>
                <input type="text" placeholder="08123456789" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  disabled={loading}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-4 py-2.5 text-sm
                             outline-none focus:border-caramel-400 transition-colors text-espresso-800
                             disabled:opacity-60" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-espresso-700 mb-1.5">Keperluan</label>
              <select value={form.need} onChange={e => setForm(p => ({ ...p, need: e.target.value }))}
                disabled={loading}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-4 py-2.5 text-sm
                           outline-none focus:border-caramel-400 transition-colors text-espresso-800
                           disabled:opacity-60">
                <option value="">Pilih keperluan...</option>
                <option>Reservasi Meja</option>
                <option>Catering Acara</option>
                <option>Pertanyaan Menu</option>
                <option>Kerjasama / Partnership</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-espresso-700 mb-1.5">Pesan</label>
              <textarea placeholder="Ceritakan keperluan Anda..." value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={4} disabled={loading}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-4 py-2.5 text-sm
                           outline-none focus:border-caramel-400 transition-colors resize-none text-espresso-800
                           disabled:opacity-60" />
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-espresso-700 hover:bg-espresso-600 disabled:opacity-60
                         text-cream-50 font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-sm
                         flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
                : <>Kirim & Chat WhatsApp </>}
            </button>

            <p className="text-center text-xs text-espresso-400">
              Pesan tersimpan di database kami + WhatsApp akan terbuka otomatis
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
