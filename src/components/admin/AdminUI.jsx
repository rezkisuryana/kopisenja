import { X } from 'lucide-react'
import { cls } from '../../lib/utils'

// ── Modal ──────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-[fadeUp_.2s_ease]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100 flex-shrink-0">
          <h3 className="font-semibold text-charcoal-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-charcoal-50 flex items-center justify-center hover:bg-charcoal-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-charcoal-100 flex-shrink-0">{footer}</div>
        )}
      </div>
    </div>
  )
}

// ── FormGroup ─────────────────────────────────────────────
export function FormGroup({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-charcoal-700">{label}</label>
      {children}
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────
export function Input({ className = '', ...props }) {
  return (
    <input
      className={cls('w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-copper-400 transition-colors', className)}
      {...props}
    />
  )
}

// ── Textarea ──────────────────────────────────────────────
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={cls('w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-copper-400 transition-colors resize-none', className)}
      {...props}
    />
  )
}

// ── Select ────────────────────────────────────────────────
export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={cls('w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-copper-400 transition-colors', className)}
      {...props}>
      {children}
    </select>
  )
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    active: 'bg-green-50 text-green-700 border border-green-200',
    draft:  'bg-charcoal-100 text-charcoal-500 border border-charcoal-200',
  }
  const labels = { active: 'Aktif', draft: 'Draft' }
  return (
    <span className={cls('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', map[status] || map.draft)}>
      <span className={cls('w-1.5 h-1.5 rounded-full', status === 'active' ? 'bg-green-500' : 'bg-charcoal-400')} />
      {labels[status] || status}
    </span>
  )
}

// ── Btn variants ──────────────────────────────────────────
export function BtnPrimary({ children, className = '', ...props }) {
  return (
    <button className={cls('bg-espresso-700 hover:bg-caramel-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2', className)} {...props}>
      {children}
    </button>
  )
}
export function BtnSecondary({ children, className = '', ...props }) {
  return (
    <button className={cls('bg-cream-50 border border-cream-200 hover:bg-charcoal-100 text-charcoal-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors', className)} {...props}>
      {children}
    </button>
  )
}
export function BtnDanger({ children, className = '', ...props }) {
  return (
    <button className={cls('bg-red-50 border border-red-200 text-red-600 hover:bg-red-500 hover:text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors', className)} {...props}>
      {children}
    </button>
  )
}
export function BtnEdit({ children = 'Edit', className = '', ...props }) {
  return (
    <button className={cls('bg-charcoal-100 border border-charcoal-200 hover:bg-copper-500 hover:text-white hover:border-copper-500 text-charcoal-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors', className)} {...props}>
      {children}
    </button>
  )
}

// ── Panel wrapper ─────────────────────────────────────────
export function Panel({ children, className = '' }) {
  return (
    <div className={cls('bg-white rounded-2xl shadow-sm border border-charcoal-100 overflow-hidden', className)}>
      {children}
    </div>
  )
}
export function PanelHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100">
      <h2 className="font-semibold text-charcoal-800">{title}</h2>
      {action}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────
export function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-charcoal-400">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="font-display text-3xl font-bold text-charcoal-800">{value}</p>
      {sub && <p className="text-xs text-caramel-500 font-medium mt-1">{sub}</p>}
    </div>
  )
}
