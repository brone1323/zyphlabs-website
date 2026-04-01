import Link from 'next/link'
import PortfolioCard from '@/components/PortfolioCard'
import ContractorDemo from '@/components/demos/ContractorDemo'
import { portfolioByNiche, nichePortfolioMeta } from '@/lib/portfolioData'

export const metadata = {
  title: 'Contractor Website Examples | Zyph Labs Portfolio',
  description:
    "See example websites we've built for roofing companies, HVAC contractors, plumbers, and electricians.",
}

export default function ContractorsPortfolioPage() {
  const items = portfolioByNiche.contractors
  const meta = nichePortfolioMeta.contractors

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
        {/* Decorative grid lines — construction aesthetic */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${meta.color} 0px, ${meta.color} 1px, transparent 1px, transparent 60px),
                              repeating-linear-gradient(90deg, ${meta.color} 0px, ${meta.color} 1px, transparent 1px, transparent 60px)`,
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8888aa]">
            <Link href="/portfolio" className="hover:text-white transition-colors">
              ← Portfolio
            </Link>
            <span>/</span>
            <span style={{ color: meta.color }}>Contractors</span>
          </div>

          <div className="flex items-start gap-6 flex-col sm:flex-row">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: meta.color }}>
                Contractor & Trades Websites
              </p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Websites that generate<br />
                <span className="gradient-text">contractor leads.</span>
              </h1>
              <p className="text-lg text-[#8888aa] max-w-2xl mb-10 leading-relaxed">
                Every site is purpose-built for your trade — with lead forms, service area pages,
                and trust signals that convert visitors into phone calls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services/contractors#pricing" className="btn-primary inline-block text-base px-8 py-4">
                  Get One For Your Business →
                </Link>
                <div className="flex items-center gap-3 text-sm text-[#8888aa]">
                  <span style={{ color: meta.color }}>✓</span> 7-day delivery
                  <span style={{ color: meta.color }}>✓</span> Fully managed
                  <span style={{ color: meta.color }}>✓</span> SSL included
                </div>
              </div>
            </div>

            {/* Hero stat block */}
            <div className="flex-shrink-0 hidden lg:grid grid-cols-2 gap-3 w-64">
              {[
                { n: '847+', l: 'Leads generated' },
                { n: '4.9★', l: 'Average rating' },
                { n: '< 2hr', l: 'Response time' },
                { n: '$149', l: 'Starting price' },
              ].map(s => (
                <div
                  key={s.l}
                  className="glass rounded-xl p-4 text-center border"
                  style={{ borderColor: `${meta.color}20` }}
                >
                  <div className="text-lg font-bold" style={{ color: meta.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {s.n}
                  </div>
                  <div className="text-xs text-[#8888aa] mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3D Demo Section */}
      <ContractorDemo />

      <div className="section-divider" />

      {/* Portfolio Grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: meta.color }}>
              Real Client Examples
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Sites built for trades businesses like yours
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
              What every contractor site includes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📞', title: 'Click-to-Call Header', desc: 'Your phone number front and center — on mobile, one tap calls you directly.' },
              { icon: '📝', title: 'Lead Capture Form', desc: 'Simple estimate request form tied to your email. Every lead lands in your inbox.' },
              { icon: '📸', title: 'Project Gallery', desc: 'Before/after photo sections that build trust and show off your best work.' },
              { icon: '📍', title: 'Service Area Pages', desc: 'Individual pages for each city/town you serve — great for local SEO.' },
              { icon: '⭐', title: 'Google Review Feed', desc: 'Pull in your Google reviews automatically to show social proof on every page.' },
              { icon: '🔒', title: 'SSL & Hosting Included', desc: 'Fully managed. Secure. Fast. No server headaches, ever.' },
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
            Ready to get more leads from your website?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Contractor sites start at $149. Live in 7–14 days. Fully managed and hosted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/contractors#pricing" className="btn-primary text-base px-10 py-4 inline-block">
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
