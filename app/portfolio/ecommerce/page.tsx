import Link from 'next/link'
import PortfolioCard from '@/components/PortfolioCard'
import EcommerceDemo from '@/components/demos/EcommerceDemo'
import { portfolioByNiche, nichePortfolioMeta } from '@/lib/portfolioData'

export const metadata = {
  title: 'E-Commerce Store Examples | Zyph Labs Portfolio',
  description:
    "See example Shopify stores we've built for skincare brands, pet supplies, artisan candles, and fitness gear.",
}

export default function EcommercePortfolioPage() {
  const items = portfolioByNiche.ecommerce
  const meta = nichePortfolioMeta.ecommerce

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        {/* Teal gradient sweep */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 70% 40%, ${meta.color}20 0%, transparent 60%),
                         radial-gradient(ellipse at 20% 80%, #6c5ce720 0%, transparent 50%)`,
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8888aa]">
            <Link href="/portfolio" className="hover:text-white transition-colors">
              ← Portfolio
            </Link>
            <span>/</span>
            <span style={{ color: meta.color }}>E-Commerce</span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: meta.color }}>
            E-Commerce Store Websites
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Shopify stores built<br />
            <span className="gradient-text">to convert.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mb-8 leading-relaxed">
            From product setup to checkout flow, we build Shopify stores with custom themes,
            optimized pages, and the integrations your brand needs to scale.
          </p>

          {/* Floating product tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Custom Shopify Theme', 'Product Catalog Setup', 'Checkout Optimization', 'Email Capture', 'Mobile-First', 'App Integrations'].map(tag => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full border font-medium"
                style={{ borderColor: `${meta.color}30`, color: meta.color, background: `${meta.color}08` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link href="/services/ecommerce#pricing" className="btn-primary inline-block text-base px-8 py-4">
            Get a Store Built →
          </Link>
        </div>
      </section>

      {/* Interactive Store Demo */}
      <EcommerceDemo />

      <div className="section-divider" />

      {/* Portfolio Grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: meta.color }}>
              Real Client Examples
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Stores built to grow brands
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* What's included */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              What every e-commerce store includes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🎨', title: 'Custom Shopify Theme', desc: 'On-brand design that matches your products and speaks to your audience.' },
              { icon: '📦', title: 'Product Setup', desc: 'We configure your product catalog, variants, pricing, and collections.' },
              { icon: '💳', title: 'Checkout Optimization', desc: 'Reduced friction checkout flow built to maximize completed purchases.' },
              { icon: '📧', title: 'Email Capture', desc: 'Pop-ups and landing pages that grow your list from day one.' },
              { icon: '📱', title: 'Mobile-First Design', desc: 'Most shoppers are on mobile. Your store is built for that first.' },
              { icon: '🔒', title: 'SSL & Hosting Included', desc: "Fully managed on Shopify's infrastructure. Always fast, always secure." },
            ].map((item) => (
              <div key={item.title} className="glass p-6 flex gap-4">
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3
                    className="text-base font-semibold text-white mb-1"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#8888aa] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to launch your store?
          </h2>
          <p className="text-[#8888aa] mb-10">
            E-commerce stores start at $199. Live in 7–14 days. Fully set up and managed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/ecommerce#pricing" className="btn-primary text-base px-10 py-4 inline-block">
              View Pricing & Packages →
            </Link>
            <Link href="/portfolio" className="btn-secondary text-base px-10 py-4 inline-block">
              ← Browse All Niches
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
