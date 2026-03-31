import Link from 'next/link'
import PortfolioCard from '@/components/PortfolioCard'
import { portfolioByNiche, nichePortfolioMeta } from '@/lib/portfolioData'

export const metadata = {
  title: 'Real Estate Website Examples | Zyph Labs Portfolio',
  description:
    "See example websites we've built for luxury realtors, property managers, boutique agencies, and commercial real estate firms.",
}

export default function RealEstatePortfolioPage() {
  const items = portfolioByNiche['real-estate']
  const meta = nichePortfolioMeta['real-estate']

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${meta.color}18 0%, transparent 65%)`,
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8888aa]">
            <Link href="/portfolio" className="hover:text-white transition-colors">
              ← Portfolio
            </Link>
            <span>/</span>
            <span style={{ color: meta.color }}>Real Estate</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: meta.color }}>
            Real Estate Websites
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Sites that capture buyers<br />
            <span className="gradient-text">and sellers on autopilot.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mb-10 leading-relaxed">
            Professional real estate sites that build trust, showcase listings, and convert
            visitors into qualified leads — while you're out closing deals.
          </p>
          <Link href="/services/real-estate#pricing" className="btn-primary inline-block text-base px-8 py-4">
            Get a Real Estate Site →
          </Link>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
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
              What every real estate site includes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🏠', title: 'Listing Showcase', desc: 'Property cards and gallery sections to showcase your current and sold inventory.' },
              { icon: '📝', title: 'Lead Capture Forms', desc: 'Buyer and seller inquiry forms tailored to capture the most valuable leads.' },
              { icon: '📍', title: 'Neighborhood Pages', desc: 'Community guide pages that attract buyers researching specific areas.' },
              { icon: '🙋', title: 'Agent Bio Pages', desc: 'Professional profile pages that build trust and highlight your experience.' },
              { icon: '📊', title: 'Market Report CTA', desc: 'Home valuation and market report offers that turn visitors into warm leads.' },
              { icon: '🔒', title: 'SSL & Hosting Included', desc: 'Fully managed. Fast load times. No technical headaches.' },
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
            Ready for a professional real estate presence?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Real estate sites start at $179. Live in 7–14 days. Fully managed and maintained.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/real-estate#pricing" className="btn-primary text-base px-10 py-4 inline-block">
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
