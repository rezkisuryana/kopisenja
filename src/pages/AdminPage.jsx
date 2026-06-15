import { useState } from 'react'
import AdminSidebar    from '../components/admin/AdminSidebar'
import OverviewPanel   from '../components/admin/OverviewPanel'
import MessagesPanel   from '../components/admin/MessagesPanel'
import ProductsPanel   from '../components/admin/ProductsPanel'
import CategoriesPanel from '../components/admin/CategoriesPanel'
import FaqsPanel       from '../components/admin/FaqsPanel'
import ProcessPanel    from '../components/admin/ProcessPanel'
import MediaPanel      from '../components/admin/MediaPanel'
import LogoPanel       from '../components/admin/LogoPanel'
import SettingsPanel   from '../components/admin/SettingsPanel'
import { useSettings, useCategories, useProducts, useFaqs, useMessages } from '../hooks/useData'
import toast from 'react-hot-toast'

const PANEL_TITLES = {
  overview:   'Overview',
  messages:   'Pesan Masuk',
  products:   'Menu & Produk',
  categories: 'Kategori',
  faqs:       'FAQ',
  process:    'Cara Memesan',
  media:      'Kelola Foto & Gambar',
  logo:       'Logo & Branding',
  settings:   'Pengaturan Website',
}

export default function AdminPage() {
  const [panel, setPanel] = useState('overview')

  const { settings,   loading: sLoad,  updateMany             } = useSettings()
  const { categories, add: addCat,     update: updCat,   remove: delCat  } = useCategories()
  const { products,   add: addProd,    update: updProd,  remove: delProd } = useProducts()
  const { faqs,       add: addFaq,     update: updFaq,   remove: delFaq  } = useFaqs()
  const {
    messages, loading: mLoad, unreadCount,
    markRead, markReplied, remove: delMsg, refetch: refetchMsgs
  } = useMessages()

  async function handleSaveSettings(data) {
    const ok = await updateMany(data)
    if (ok) toast.success('Disimpan!')
    return ok
  }

  return (
    <div className="min-h-screen bg-cream-100 flex">
      <AdminSidebar active={panel} onNavigate={setPanel} unreadCount={unreadCount} />

      <main className="ml-60 flex-1 p-6 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-espresso-800 flex items-center gap-2">
              {PANEL_TITLES[panel]}
              {panel === 'messages' && unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </h1>
            <p className="text-xs text-espresso-400 mt-0.5">
              {new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </div>
        </div>

        {panel === 'overview'   && <OverviewPanel products={products} categories={categories} faqs={faqs} />}
        {panel === 'messages'   && (
          <MessagesPanel
            messages={messages}
            loading={mLoad}
            unreadCount={unreadCount}
            onMarkRead={markRead}
            onMarkReplied={markReplied}
            onDelete={delMsg}
            onRefetch={refetchMsgs}
          />
        )}
        {panel === 'products'   && <ProductsPanel   products={products}   categories={categories} onAdd={addProd} onUpdate={updProd} onDelete={delProd} />}
        {panel === 'categories' && <CategoriesPanel categories={categories} products={products}   onAdd={addCat}  onUpdate={updCat}  onDelete={delCat}  />}
        {panel === 'faqs'       && <FaqsPanel       faqs={faqs}           onAdd={addFaq}  onUpdate={updFaq}  onDelete={delFaq}  />}
        {panel === 'process'    && !sLoad && <ProcessPanel  settings={settings} onSaveMany={handleSaveSettings} />}
        {panel === 'media'      && !sLoad && <MediaPanel    settings={settings} onSaveMany={handleSaveSettings} />}
        {panel === 'logo'       && !sLoad && <LogoPanel     settings={settings} onSaveMany={handleSaveSettings} />}
        {panel === 'settings'   && !sLoad && <SettingsPanel settings={settings} onSaveMany={handleSaveSettings} />}
      </main>
    </div>
  )
}
