import Link from 'next/link'
import PortfolioCard from '@/components/PortfolioCard'
import { portfolioByNiche, nichePortfolioMeta } from '@/lib/portfolioData'

export const metadata = {
  title: 'Law Firm Website Examples | Zyph Labs Portfolio',
  description:
    "See example websites we've built for personal injury firms, family law attorneys, criminal defense lawyers, and corporate law practices.",
}

export default function LawFirmsPortfolioPage() {
  const items = portfolioByNiche['law-firms']
  const meta = nichePortfolioMeta['law-firms']

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
            <span style={{ color: meta.color }}>Law Firms</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: meta.color }}>
            Law Firm Websites
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Websites that build authority<br />
            <span className="gradient-text">and fill consultations.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mb-10 leading-relaxed">
            Authoritative, trust-first law firm websites designed to establish credibility,
            showcase your practice areas, and convert visitors into consultation requests.
          </p>
          <Link href="/services/law-firms#pricing" className="btn-primary inline-block text-base px-8 py-4">
            Get a Law Firm Site →
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
              What every law firm site includes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '⚖️', title: 'Practice Area Pages', desc: 'Dedicated pages for each area of law that rank for relevant local keywords.' },
              { icon: '📋', title: 'Consultation Form', desc: 'A secure intake form that collects the case details you need to qualify leads.' },
              { icon: '🙋', title: 'Attorney Bio Pages', desc: 'Professional profiles with credentials, bar admissions, and case history.' },
              { icon: '⭐', title: 'Case Results Section', desc: 'Highlight notable verdicts and settlements that build immediate credibility.' },
              { icon: '📞', title: 'Emergency Call CTA', desc: 'Prominent phone CTAs and, for criminal/injury firms, 24/7 availability messaging.' },
              { icon: '🔒', title: 'SSL & Hosting Included', desc: 'Fully managed, HTTPS-secured, and always online. No IT headaches.' },
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
            Ready to elevate your firm's online presence?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Law firm sites start at $199. Live in 7–14 days. Fully managed, SSL included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/law-firms#pricing" className="btn-primary text-base px-10 py-4 inline-block">
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
