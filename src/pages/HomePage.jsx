import { useState } from 'react'
import Navbar            from '../components/public/Navbar'
import HeroSection       from '../components/public/HeroSection'
import AboutSection      from '../components/public/AboutSection'
import CategoriesSection from '../components/public/CategoriesSection'
import ProductsSection   from '../components/public/ProductsSection'
import ProcessSection    from '../components/public/ProcessSection'
import FaqSection        from '../components/public/FaqSection'
import CtaBanner         from '../components/public/CtaBanner'
import ContactSection    from '../components/public/ContactSection'
import Footer            from '../components/public/Footer'
import FloatingWA        from '../components/public/FloatingWA'
import { useSettings, useCategories, useProducts, useFaqs } from '../hooks/useData'

export default function HomePage() {
  const { settings, loading: sLoading } = useSettings()
  const { categories }                  = useCategories()
  const { products }                    = useProducts()
  const { faqs }                        = useFaqs()
  const [activeCategory, setActiveCategory] = useState('all')

  if (sLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-espresso-400">Memuat website...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar settings={settings} />
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <CategoriesSection
        categories={categories}
        products={products}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <ProductsSection
        products={products}
        activeCategory={activeCategory}
        waNumber={settings?.whatsapp}
      />
      <ProcessSection settings={settings} />
      <FaqSection faqs={faqs} />
      <CtaBanner settings={settings} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
      <FloatingWA waNumber={settings?.whatsapp} />
    </div>
  )
}
