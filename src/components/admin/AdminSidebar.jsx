import { Link } from 'react-router-dom'
import { LayoutDashboard, Package, Grid3X3, HelpCircle, Settings,
         LogOut, ArrowLeft, ImagePlus, ShoppingCart, Layers, Inbox } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cls } from '../../lib/utils'

const NAV = [
  { id:'overview',   label:'Overview',        icon:LayoutDashboard },
  { id:'messages',   label:'Pesan Masuk',     icon:Inbox           },
  { id:'products',   label:'Menu & Produk',   icon:Package         },
  { id:'categories', label:'Kategori',        icon:Grid3X3         },
  { id:'faqs',       label:'FAQ',             icon:HelpCircle      },
  { id:'process',    label:'Cara Memesan',    icon:ShoppingCart    },
  { id:'media',      label:'Kelola Foto',     icon:ImagePlus       },
  { id:'logo',       label:'Logo & Branding', icon:Layers          },
  { id:'settings',   label:'Pengaturan',      icon:Settings        },
]

export default function AdminSidebar({ active, onNavigate, unreadCount = 0 }) {
  const { signOut } = useAuth()
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-espresso-900 flex flex-col z-30">
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <div className="font-display text-lg font-bold text-cream-50 flex items-center gap-2">
          <span className="text-caramel-400">☕</span> Kopi <span className="text-caramel-400">Senja</span>
        </div>
        <p className="text-xs text-cream-600 mt-0.5 font-medium">Dashboard Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const Icon    = item.icon
          const isMsg   = item.id === 'messages'
          const hasNew  = isMsg && unreadCount > 0
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={cls('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active === item.id
                  ? 'bg-caramel-400/20 text-caramel-400'
                  : 'text-cream-500 hover:bg-white/6 hover:text-cream-200')}>
              <Icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              {hasNew && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
        <Link to="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cream-600 hover:text-cream-200 hover:bg-white/5 transition-all">
          <ArrowLeft size={17} /> Kembali ke Website
        </Link>
        <button onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cream-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={17} /> Keluar
        </button>
      </div>
    </aside>
  )
}
