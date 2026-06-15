import { useState } from 'react'
import { MessageSquare, Phone, CheckCheck, Trash2, RefreshCw, Eye, Filter } from 'lucide-react'
import { Panel, PanelHeader, BtnPrimary } from './AdminUI'
import { openWA } from '../../lib/utils'
import { cls } from '../../lib/utils'

const STATUS_CONFIG = {
  unread:  { label: 'Belum Dibaca', color: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-500'   },
  read:    { label: 'Sudah Dibaca', color: 'bg-cream-100 text-espresso-500 border-cream-300', dot: 'bg-espresso-400' },
  replied: { label: 'Dibalas',      color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500'  },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.read
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function MessagesPanel({ messages, loading, unreadCount, onMarkRead, onMarkReplied, onDelete, onRefetch }) {
  const [filter,   setFilter]   = useState('all')   // 'all' | 'unread' | 'read' | 'replied'
  const [expanded, setExpanded] = useState(null)

  const filtered = messages.filter(m => filter === 'all' ? true : m.status === filter)

  function toggleExpand(id, status) {
    setExpanded(prev => prev === id ? null : id)
    // Auto-mark as read when opening
    if (status === 'unread') onMarkRead(id)
  }

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pesan',    val: messages.length,                                  icon: '📬', color: 'text-espresso-700' },
          { label: 'Belum Dibaca',   val: messages.filter(m => m.status==='unread').length,  icon: '🔵', color: 'text-blue-600'    },
          { label: 'Sudah Dibaca',   val: messages.filter(m => m.status==='read').length,    icon: '👁️',  color: 'text-espresso-500' },
          { label: 'Dibalas',        val: messages.filter(m => m.status==='replied').length, icon: '✅', color: 'text-green-600'   },
        ].map(s => (
          <div key={s.label} className="bg-white border border-cream-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-espresso-400 font-medium">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <Panel>
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              Kotak Pesan
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </span>
          }
          action={
            <button onClick={onRefetch}
              className="flex items-center gap-1.5 text-sm font-medium text-espresso-500 hover:text-espresso-800 transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />

        {/* Filter tabs */}
        <div className="px-5 py-3 border-b border-cream-100 flex items-center gap-1.5 overflow-x-auto">
          <Filter size={13} className="text-espresso-400 flex-shrink-0 mr-1" />
          {[
            { key: 'all',     label: 'Semua', count: messages.length },
            { key: 'unread',  label: 'Belum Dibaca', count: messages.filter(m => m.status==='unread').length },
            { key: 'read',    label: 'Dibaca',        count: messages.filter(m => m.status==='read').length },
            { key: 'replied', label: 'Dibalas',       count: messages.filter(m => m.status==='replied').length },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={cls('flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                filter === f.key
                  ? 'bg-espresso-700 text-cream-50 shadow-sm'
                  : 'text-espresso-500 hover:bg-cream-100')}>
              {f.label}
              <span className={cls('text-[11px] px-1.5 py-0.5 rounded-full',
                filter === f.key ? 'bg-white/20' : 'bg-cream-200 text-espresso-500')}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Messages list */}
        {loading ? (
          <div className="p-10 text-center text-espresso-400 text-sm">Memuat pesan...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={40} className="text-cream-300 mx-auto mb-3" />
            <p className="text-espresso-400 text-sm font-medium">Tidak ada pesan.</p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {filtered.map(msg => (
              <div key={msg.id}
                className={cls('transition-colors', msg.status === 'unread' ? 'bg-blue-50/40' : 'hover:bg-cream-50/50')}>

                {/* Header row */}
                <div className="px-5 py-4 flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-espresso-100 flex items-center justify-center
                                  text-espresso-600 font-bold text-sm flex-shrink-0">
                    {msg.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-espresso-800">{msg.name}</span>
                      <StatusBadge status={msg.status} />
                      {msg.need && (
                        <span className="text-xs bg-caramel-50 text-caramel-700 border border-caramel-200 px-2 py-0.5 rounded-full">
                          {msg.need}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-espresso-400 mt-0.5">{msg.phone} · {fmtDate(msg.created_at)}</p>
                    {/* Preview pesan */}
                    {msg.message && expanded !== msg.id && (
                      <p className="text-xs text-espresso-500 mt-1.5 line-clamp-1">{msg.message}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleExpand(msg.id, msg.status)}
                      title="Lihat detail"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-espresso-400
                                 hover:bg-cream-200 hover:text-espresso-700 transition-colors">
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openWA(msg.phone, `Halo ${msg.name}, terima kasih sudah menghubungi Kopi Senja! ☕`)}
                      title="Balas via WhatsApp"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25D366]
                                 hover:bg-green-50 transition-colors">
                      <Phone size={14} />
                    </button>
                    {msg.status !== 'replied' && (
                      <button onClick={() => onMarkReplied(msg.id)}
                        title="Tandai sudah dibalas"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-espresso-400
                                   hover:bg-green-50 hover:text-green-600 transition-colors">
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button onClick={() => { if (confirm('Hapus pesan ini?')) onDelete(msg.id) }}
                      title="Hapus pesan"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-espresso-300
                                 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === msg.id && (
                  <div className="px-5 pb-4 ml-13">
                    <div className="ml-[52px] bg-white border border-cream-200 rounded-2xl p-4 space-y-3">
                      {msg.need && (
                        <div>
                          <p className="text-xs text-espresso-400 font-medium mb-0.5">Keperluan</p>
                          <p className="text-sm text-espresso-700 font-semibold">{msg.need}</p>
                        </div>
                      )}
                      {msg.message ? (
                        <div>
                          <p className="text-xs text-espresso-400 font-medium mb-0.5">Pesan</p>
                          <p className="text-sm text-espresso-700 leading-relaxed">{msg.message}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-espresso-400 italic">Tidak ada pesan tambahan.</p>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-cream-100">
                        <button
                          onClick={() => openWA(msg.phone, `Halo ${msg.name}! Terima kasih sudah menghubungi Kopi Senja ☕\n\nKami merespons pesan Anda mengenai "${msg.need || 'pertanyaan Anda'}". `)}
                          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBD5A] text-white
                                     text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          Balas via WhatsApp
                        </button>
                        {msg.status !== 'replied' && (
                          <button onClick={() => onMarkReplied(msg.id)}
                            className="flex items-center gap-1.5 bg-green-50 hover:bg-green-500 hover:text-white
                                       border border-green-200 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                            <CheckCheck size={13} /> Tandai Dibalas
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}
