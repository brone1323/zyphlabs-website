import Link from 'next/link'
import PortfolioCard from '@/components/PortfolioCard'
import { portfolioByNiche, nichePortfolioMeta } from '@/lib/portfolioData'

const niches = ['contractors', 'ecommerce', 'real-estate', 'law-firms'] as const

export const metadata = {
  title: 'Portfolio — Example Sites | Zyph Labs',
  description:
    'Browse example websites built by Zyph Labs for contractors, e-commerce brands, realtors, and law firms.',
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(108,92,231,0.15) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            Our Work
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Example Sites<br />
            <span className="gradient-text">We've Built</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse realistic mockups of the websites we build for each niche. Every site is custom-designed,
            hosted, and maintained by our team — no templates, no disappearing freelancers.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {niches.map((n) => {
              const meta = nichePortfolioMeta[n]
              return (
                <a
                  key={n}
                  href={`#${n}`}
                  className="text-sm px-4 py-2 rounded-full border transition-all hover:-translate-y-0.5"
                  style={{
                    color: meta.color,
                    borderColor: `${meta.color}40`,
                    background: `${meta.color}10`,
                  }}
                >
                  {meta.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Niche sections */}
      {niches.map((nicheKey, idx) => {
        const meta = nichePortfolioMeta[nicheKey]
        const items = portfolioByNiche[nicheKey]
        return (
          <div key={nicheKey}>
            {idx > 0 && <div className="section-divider" />}
            <section id={nicheKey} className={`py-24 px-4 sm:px-6 ${idx % 2 === 1 ? 'bg-[#0f0f1a]' : ''}`}>
              <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-widest mb-2"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </p>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-white"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {meta.tagline}
                    </h2>
                  </div>
                  <Link
                    href={meta.serviceHref}
                    className="btn-primary text-sm px-6 py-3 whitespace-nowrap flex-shrink-0 inline-block"
                  >
                    Get This For Your Business →
                  </Link>
                </div>

                {/* Portfolio grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {items.map((item) => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                  <p className="text-[#8888aa] text-sm mb-4">
                    Like what you see? We build sites like these starting from{' '}
                    {nicheKey === 'contractors' && <span className="text-white font-medium">$149</span>}
                    {nicheKey === 'ecommerce' && <span className="text-white font-medium">$199</span>}
                    {nicheKey === 'real-estate' && <span className="text-white font-medium">$179</span>}
                    {nicheKey === 'law-firms' && <span className="text-white font-medium">$199</span>}
                    , fully deployed and hosted.
                  </p>
                  <Link
                    href={`${meta.serviceHref}#pricing`}
                    className="btn-secondary text-sm px-8 py-3 inline-block"
                  >
                    View Pricing & Packages →
                  </Link>
                </div>
              </div>
            </section>
          </div>
        )
      })}

      {/* Bottom CTA */}
      <div className="section-divider" />
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to get a site like this?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Pick your niche, choose a package, and we'll build your site in 7–14 days.
            Fully live, managed, and maintained.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {niches.map((n) => {
              const meta = nichePortfolioMeta[n]
              return (
                <Link
                  key={n}
                  href={meta.serviceHref}
                  className="glass p-4 text-center hover:-translate-y-1 transition-all rounded-xl border"
                  style={{ borderColor: `${meta.color}30` }}
                >
                  <p className="text-xs font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {meta.label}
                  </p>
                </Link>
              )
            })}
          </div>
          <p className="text-[#444466] text-sm">
            Questions?{' '}
            <a href="mailto:hello@zyphlabs.com" className="text-[#a29bfe] hover:underline">
              Email hello@zyphlabs.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
