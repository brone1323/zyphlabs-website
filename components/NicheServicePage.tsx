import Link from 'next/link'
import PricingCard from '@/components/PricingCard'
import { NICHE_PRICES, NicheKey } from '@/lib/prices'

interface FAQ {
  q: string
  a: string
}

interface NicheServicePageProps {
  nicheKey: NicheKey
}

export default function NicheServicePage({ nicheKey }: NicheServicePageProps) {
  const niche = NICHE_PRICES[nicheKey]
  const tiers = Object.entries(niche.tiers) as [string, any][]

  const comparisonRows = [
    ['What you get', 'Website files (zip)', 'Fully deployed, live website'],
    ['Hosting', 'Not included — figure it out', 'Managed, included ✓'],
    ['SSL/Security', 'Not included', 'Included & maintained ✓'],
    ['Domain setup', 'Not included', 'We configure it for you ✓'],
    ['Ongoing support', 'None after delivery', 'Included in monthly plan ✓'],
    ['Updates/changes', 'Buy another gig', 'Minor updates included ✓'],
    ['Total cost (Year 1)', 'Build + ~$150–300/yr hidden costs', 'Build + one clear monthly fee ✓'],
  ]

  const processSteps = [
    { icon: '🛒', title: 'You Order', desc: 'Pick your tier and hosting plan. One checkout — secure PayPal payment.' },
    { icon: '📋', title: 'Onboarding Questionnaire', desc: 'Fill out a short form with your brand, content, and goals. No calls — just a quick questionnaire.' },
    { icon: '⚙️', title: 'We Build & Review', desc: 'Custom design built for your niche. You approve a preview before launch.' },
    { icon: '🚀', title: 'Go Live', desc: 'We deploy to your domain, configure SSL, and your site is live.' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${niche.color || '#6c5ce7'}18 0%, transparent 65%)`,
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6">
            <Link href="/" className="text-[#8888aa] text-sm hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: niche.color || '#6c5ce7' }}>
            {niche.name}
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {niche.headline}
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mb-10 leading-relaxed">
            {niche.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#pricing" className="btn-primary inline-block text-base px-8 py-4">
              See Pricing & Packages
            </a>
            <Link href="/how-it-works" className="btn-secondary inline-block text-base px-8 py-4">
              How It Works →
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-10 rounded-2xl border-l-4" style={{ borderLeftColor: niche.color || '#6c5ce7' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#8888aa] mb-4">The Problem</p>
            <p className="text-xl text-white leading-relaxed">
              {niche.problem}
            </p>
            <p className="text-[#8888aa] mt-4 leading-relaxed">
              You shouldn't have to think about hosting, SSL certificates, slow load times, or why your contact form
              broke. That's our job. You focus on your business — we'll handle the website.
            </p>
          </div>
        </div>
      </section>

      {/* See Examples */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="glass rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ borderColor: `${niche.color}30`, borderWidth: '1px' }}
          >
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: niche.color }}
              >
                See It In Action
              </p>
              <h3
                className="text-xl font-bold text-white mb-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Browse example {niche.name.toLowerCase()} sites we've built
              </h3>
              <p className="text-sm text-[#8888aa]">
                See realistic mockups of the exact type of site you'd get — before you buy.
              </p>
            </div>
            <Link
              href={`/portfolio/${niche.slug}`}
              className="btn-secondary text-sm px-7 py-3 whitespace-nowrap flex-shrink-0 inline-block"
              style={{ borderColor: `${niche.color}50`, color: niche.color }}
            >
              View Example Sites →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              Transparent Pricing
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              One-time build fee.<br />
              <span className="gradient-text">Simple monthly hosting.</span>
            </h2>
            <p className="text-[#8888aa] max-w-xl mx-auto">
              Choose your build tier below, then select your hosting plan inside the card.
              First month hosting included at checkout. Month-to-month after that — cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {tiers.map(([tierKey, tier]) => (
              <PricingCard
                key={tierKey}
                tierKey={tierKey}
                name={tier.name}
                price={tier.price}
                features={tier.features}
                popular={tier.popular}
                nicheSlug={niche.slug}
              />
            ))}
          </div>

          <p className="text-center text-[#555577] text-sm mt-8">
            All prices in USD. Build fees are one-time. Hosting is month-to-month, cancel anytime.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              What happens after you order
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.title} className="glass p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/20 border border-[#6c5ce7]/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xs font-bold text-[#a29bfe]">0{i + 1}</span>
                </div>
                <div className="text-2xl mb-3">{step.icon}</div>
                <h3
                  className="text-base font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-[#8888aa] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Fiverr Comparison */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Zyph Labs vs. a typical freelancer
            </h2>
            <p className="text-[#8888aa]">
              Most web designers deliver files and disappear. We deliver a live, maintained website — permanently.
            </p>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 gap-0 bg-white/4 px-6 py-4 text-xs text-[#8888aa] uppercase tracking-widest border-b border-white/8">
              <span>Feature</span>
              <span className="text-center">Typical Freelancer</span>
              <span className="text-center text-[#a29bfe]">Zyph Labs</span>
            </div>
            {comparisonRows.map(([feature, bad, good], i) => (
              <div
                key={feature}
                className={`grid grid-cols-3 gap-0 px-6 py-4 text-sm items-center ${
                  i < comparisonRows.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <span className="text-[#ccccdd]">{feature}</span>
                <span className="text-center text-[#555577]">{bad}</span>
                <span className="text-center text-[#00cec9] font-medium text-xs">{good}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {(niche.faq as unknown as FAQ[]).map((item) => (
              <div key={item.q} className="glass p-6 rounded-xl">
                <h3
                  className="text-base font-semibold text-white mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {item.q}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to get your {niche.name.toLowerCase()} website?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Scroll up to pick your package, or contact us for a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="btn-primary text-base px-10 py-4 inline-block">
              Choose a Package →
            </a>
            <Link href="/how-it-works" className="btn-secondary text-base px-10 py-4 inline-block">
              Learn How It Works
            </Link>
          </div>
          <p className="text-[#444466] text-sm mt-8">
            Need something custom?{' '}
            <span className="text-[#a29bfe]">Email contact@zyphlabs.com</span>
          </p>
        </div>
      </section>
    </div>
  )
}
