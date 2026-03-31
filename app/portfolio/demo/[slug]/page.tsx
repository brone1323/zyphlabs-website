import { notFound } from 'next/navigation'
import Link from 'next/link'
import { portfolioItems } from '@/lib/portfolioData'
import type { PortfolioItem } from '@/lib/portfolioData'

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.demoSlug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = portfolioItems.find((i) => i.demoSlug === params.slug)
  if (!item) return {}
  return {
    title: `${item.businessName} — Portfolio Demo | Zyph Labs`,
    description: `Demo site for ${item.businessName}. Built by Zyph Labs.`,
    robots: 'noindex',
  }
}

// ─── Shared banner ────────────────────────────────────────────────────────────

function DemoBanner({ item }: { item: PortfolioItem }) {
  const nicheLabel = {
    contractors: 'contractors',
    ecommerce: 'e-commerce',
    'real-estate': 'real-estate',
    'law-firms': 'law-firms',
  }[item.niche]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#5b3fd6] text-white text-center py-2 px-4 text-sm font-medium">
      <span className="opacity-80">Portfolio demo by </span>
      <span className="font-bold">Zyph Labs</span>
      <span className="opacity-80"> — </span>
      <Link
        href={`/services/${item.niche}`}
        className="underline hover:no-underline font-semibold"
      >
        Get a site like this for your {nicheLabel} business&nbsp;→
      </Link>
    </div>
  )
}

// ─── Contractors demo ─────────────────────────────────────────────────────────

function ContractorDemo({ item }: { item: PortfolioItem }) {
  const serviceIcons: Record<string, string> = {
    'Roof Replacement': '🏠', 'Repairs': '🔨', 'Storm Damage': '⛈️', 'New Construction': '🏗️',
    'Gutters': '🌧️', 'Inspections': '🔍', 'AC Installation': '❄️', 'Heating Systems': '🔥',
    'Tune-Ups & Maintenance': '⚙️', '24/7 Emergency': '🚨', 'Ductwork': '🌀', 'Air Quality': '💨',
    'Drain Cleaning': '🚿', 'Leak Detection & Repair': '💧', 'Water Heaters': '♨️',
    'Bathroom Remodels': '🛁', 'Emergency Service': '🚨', 'Pipe Replacement': '🔧',
    'Panel Upgrades': '⚡', 'Full Rewires': '🔌', 'EV Chargers': '🔋',
    'Commercial Electrical': '🏢', 'Lighting Design': '💡', 'Safety Inspections': '✅',
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="bg-slate-800/90 backdrop-blur border-b border-slate-700 sticky top-10 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-white">{item.businessName}</div>
          <div className="hidden md:flex gap-8 text-sm text-slate-300">
            <span className="hover:text-white cursor-pointer transition-colors">Services</span>
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
            <span className="hover:text-white cursor-pointer transition-colors">Gallery</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
          <button
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
            style={{ backgroundColor: item.accentColor }}
          >
            {item.ctaLabel}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px)'
        }} />
        <div className="max-w-6xl mx-auto px-6 py-28 relative">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: item.accentColor }}>
              <span>✓ Licensed &amp; Insured</span>
              <span className="text-slate-600">·</span>
              <span>{item.location}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {item.heroHeadline}
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">{item.heroSubtext}</p>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: item.accentColor }}
              >
                {item.ctaLabel}
              </button>
              <a
                href={`tel:${item.phone}`}
                className="flex items-center gap-3 border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                {item.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="py-4" style={{ backgroundColor: item.accentColor }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-white font-semibold text-sm">
          <span>✓ Licensed &amp; Insured</span>
          <span>✓ Free Estimates</span>
          <span>✓ 5-Star Rated</span>
          <span>✓ Satisfaction Guaranteed</span>
          <span>✓ Local &amp; Family-Owned</span>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Our Services</h2>
          <p className="text-slate-400 text-lg">Professional work, every time — backed by our satisfaction guarantee.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {item.services.map((service) => (
            <div
              key={service}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-colors group cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl"
                style={{ backgroundColor: `${item.accentColor}20` }}
              >
                {serviceIcons[service] ?? '🔧'}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{service}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional {service.toLowerCase()} services with upfront pricing, licensed crews, and a workmanship guarantee on every job.
              </p>
              <div className="mt-4 text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: item.accentColor }}>
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About / Trust */}
      <div className="bg-slate-800 py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6">Why Homeowners Choose Us</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              We&apos;ve built our reputation one job at a time. Every project is handled with the same care we&apos;d give our own home — licensed technicians, premium materials, and zero shortcuts.
            </p>
            <div className="space-y-4">
              {[
                ['25+ Years Experience', 'Decades of expertise across thousands of successful projects'],
                ['Fully Licensed & Insured', 'All work is code-compliant and fully covered'],
                ['Transparent Pricing', 'Detailed written estimates — no hidden fees, ever'],
                ['Satisfaction Guarantee', "We don't consider a job done until you're happy"],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: item.accentColor }}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="text-white font-semibold">{title}</div>
                    <div className="text-slate-400 text-sm">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { stat: '500+', label: 'Projects Completed' },
              { stat: '5.0★', label: 'Average Rating' },
              { stat: '25+', label: 'Years in Business' },
              { stat: '98%', label: 'Customer Satisfaction' },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-slate-900 rounded-2xl p-6 text-center border border-slate-700">
                <div className="text-3xl font-bold mb-1" style={{ color: item.accentColor }}>{stat}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white mb-3">What Our Customers Say</h2>
        <p className="text-slate-400 text-lg mb-12">Real reviews from real customers in {item.location}.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {item.testimonials.map((t, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex gap-1 mb-4" style={{ color: item.accentColor }}>
                {'★★★★★'.split('').map((star, j) => <span key={j} className="text-lg">{star}</span>)}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
              <div>
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{t.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-24" style={{ background: `linear-gradient(135deg, ${item.accentColor}dd, ${item.accentColor}99)` }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 text-xl mb-10">Contact us today for your free estimate. No obligation, no pressure — just honest advice.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white font-bold text-lg px-10 py-4 rounded-xl transition-opacity hover:opacity-90" style={{ color: item.accentColor }}>
              {item.ctaLabel}
            </button>
            <a href={`tel:${item.phone}`} className="border-2 border-white text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-white/10 transition-colors">
              {item.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-white font-bold text-lg">{item.businessName}</div>
            <div className="text-slate-500 text-sm mt-1">{item.location} · {item.phone}</div>
          </div>
          <div className="text-slate-600 text-sm">
            © {new Date().getFullYear()} {item.businessName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── E-Commerce demo ──────────────────────────────────────────────────────────

function EcommerceDemo({ item }: { item: PortfolioItem }) {
  const productEmojis: Record<string, string> = {
    'Cleansers': '🧴', 'Serums': '💧', 'Moisturizers': '✨', 'Eye Care': '👁️', 'Bundles': '🎁', 'Gift Sets': '🎀',
    'Dog Food & Treats': '🐕', 'Cat Essentials': '🐈', 'Toys & Play': '🎾', 'Health & Wellness': '💊', 'Grooming': '✂️', 'Accessories': '🏷️',
    'Soy Candles': '🕯️', 'Wax Melts': '🫧', 'Reed Diffusers': '🌸', 'Gift Boxes': '🎁', 'Seasonal Collections': '🍂', 'Bulk Orders': '📦',
    'Performance Apparel': '👕', 'Training Equipment': '🏋️', 'Supplements': '💊', 'Recovery Gear': '🩹',
  }
  const mockPrices = [24.99, 38.00, 52.00, 19.99, 64.00, 45.50]

  return (
    <div className="bg-white min-h-screen text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Promo bar */}
      <div
        className="py-2 px-4 text-center text-sm font-medium text-white"
        style={{ backgroundColor: item.accentColor }}
      >
        Free shipping on orders over $50 · Use code <strong>WELCOME15</strong> for 15% off your first order
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-10 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-2xl text-gray-900">{item.businessName}</div>
          <div className="hidden md:flex gap-8 text-sm text-gray-600">
            {['Shop', 'About', 'Reviews', 'FAQ'].map((l) => (
              <span key={l} className="hover:text-gray-900 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Log in</button>
            <button
              className="px-5 py-2 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: item.accentColor }}
            >
              Cart (0)
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="py-20 px-6" style={{ background: `linear-gradient(135deg, ${item.accentColor}18 0%, ${item.accentColor}08 100%)` }}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 text-white" style={{ backgroundColor: item.accentColor }}>
              New Collection
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">{item.heroHeadline}</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10">{item.heroSubtext}</p>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-full font-bold text-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: item.accentColor }}
              >
                {item.ctaLabel}
              </button>
              <button className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-gray-400 text-gray-700 transition-colors">
                Learn Our Story
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <span>⭐ 4.9 / 5 average rating</span>
              <span>·</span>
              <span>12,000+ happy customers</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-3xl flex items-center justify-center text-5xl"
                style={{ backgroundColor: `${item.accentColor}${i % 2 === 0 ? '20' : '12'}` }}
              >
                <span className="opacity-60">{productEmojis[item.services[i]] ?? '🛍️'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop the Collection</h2>
            <p className="text-gray-500">Curated favorites — bestsellers and new arrivals</p>
          </div>
          <button className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: item.accentColor }}>
            View all <span>→</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {item.services.map((product, i) => (
            <div key={product} className="group cursor-pointer">
              <div
                className="aspect-square rounded-2xl mb-3 flex items-center justify-center text-4xl relative overflow-hidden transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${item.accentColor}15` }}
              >
                {productEmojis[product] ?? '🛍️'}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3"
                  style={{ background: `linear-gradient(transparent, ${item.accentColor}40)` }}
                >
                  <span className="text-white text-xs font-semibold bg-black/40 px-2 py-1 rounded-full">Quick add</span>
                </div>
              </div>
              <div className="text-gray-900 font-medium text-sm">{product}</div>
              <div className="font-bold text-gray-900 mt-0.5">${mockPrices[i % mockPrices.length].toFixed(2)}</div>
              <div className="text-xs text-gray-400 mt-0.5">★★★★★ (24)</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand story */}
      <div className="py-24" style={{ backgroundColor: `${item.accentColor}0a` }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            We started {item.businessName} because we couldn&apos;t find products that truly delivered on their promises. So we made our own. Every product is thoughtfully formulated, rigorously tested, and designed to earn a permanent spot in your routine.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Based in the USA. Cruelty-free. Independently owned. We reinvest in product quality first — always.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Loved by Customers</h2>
          <p className="text-gray-500">Real reviews. Unfiltered.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {item.testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-4 text-yellow-400">
                {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{t.text}"</p>
              <div>
                <div className="text-gray-900 font-semibold">{t.name}</div>
                <div className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                  <span style={{ color: item.accentColor }}>✓ Verified Purchase</span>
                  <span>· {t.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-20 px-6 text-white text-center" style={{ backgroundColor: item.accentColor }}>
        <h2 className="text-3xl font-bold mb-3">Get 15% Off Your First Order</h2>
        <p className="text-white/80 text-lg mb-8">Join our list for exclusive drops, restocks, and members-only discounts.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-5 py-3 rounded-full text-gray-900 text-sm outline-none"
          />
          <button className="bg-white px-6 py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-90" style={{ color: item.accentColor }}>
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-bold text-xl text-gray-900">{item.businessName}</div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-900 cursor-pointer">Terms</span>
            <span className="hover:text-gray-900 cursor-pointer">Shipping</span>
            <span className="hover:text-gray-900 cursor-pointer">Returns</span>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {item.businessName}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Real Estate demo ─────────────────────────────────────────────────────────

function RealEstateDemo({ item }: { item: PortfolioItem }) {
  const mockListings = [
    { beds: 4, baths: 3, sqft: '2,800', price: '$1,250,000', area: 'North End' },
    { beds: 3, baths: 2, sqft: '1,950', price: '$875,000', area: 'Westside' },
    { beds: 5, baths: 4, sqft: '4,100', price: '$2,400,000', area: 'Lakefront' },
  ]

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0c1445', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="border-b sticky top-10 z-40 backdrop-blur" style={{ backgroundColor: '#0c1445ee', borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl" style={{ color: item.accentColor }}>{item.businessName}</div>
          <div className="hidden md:flex gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {['Listings', 'Services', 'About', 'Contact'].map((l) => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <button
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: item.accentColor, color: '#0c1445' }}
          >
            {item.ctaLabel}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden py-32 px-6" style={{
        background: 'linear-gradient(135deg, #0c1445 0%, #0f1d5c 50%, #0c1445 100%)'
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 70% 50%, ${item.accentColor} 0%, transparent 60%)`
        }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: item.accentColor }}>
            {item.location} · Premier Real Estate
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            {item.heroHeadline}
          </h1>
          <p className="text-xl leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {item.heroSubtext}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: item.accentColor, color: '#0c1445' }}
            >
              {item.ctaLabel}
            </button>
            <a
              href={`tel:${item.phone}`}
              className="px-8 py-4 rounded-xl font-semibold text-lg border-2 text-white transition-colors hover:bg-white/10"
              style={{ borderColor: `${item.accentColor}60` }}
            >
              {item.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Listings</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Hand-selected properties in prime locations</p>
          </div>
          <button className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: item.accentColor }}>
            View all listings <span>→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockListings.map((listing, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border cursor-pointer group transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#0f1d5c', borderColor: `${item.accentColor}30` }}
            >
              <div
                className="h-44 flex items-center justify-center text-5xl"
                style={{ background: `linear-gradient(135deg, #0c1445, #1a2a7a)` }}
              >
                🏡
              </div>
              <div className="p-5">
                <div className="text-xl font-bold text-white mb-1" style={{ color: item.accentColor }}>
                  {listing.price}
                </div>
                <div className="text-white font-semibold mb-3">{listing.area} · {item.location}</div>
                <div className="flex gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span>{listing.beds} beds</span>
                  <span>·</span>
                  <span>{listing.baths} baths</span>
                  <span>·</span>
                  <span>{listing.sqft} sqft</span>
                </div>
                <button
                  className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-white/10"
                  style={{ borderColor: `${item.accentColor}40`, color: item.accentColor }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="py-24" style={{ backgroundColor: '#0f1d5c' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How We Can Help</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Full-service representation at every stage</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.services.map((service, i) => (
              <div
                key={service}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: '#0c1445', borderColor: `${item.accentColor}25` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm"
                  style={{ backgroundColor: `${item.accentColor}25`, color: item.accentColor }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{service}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Expert {service.toLowerCase()} guidance backed by deep local market knowledge and years of experience.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white mb-3">Client Experiences</h2>
        <p className="mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>What our clients say about working with us</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {item.testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl p-6 border" style={{ backgroundColor: '#0f1d5c', borderColor: `${item.accentColor}25` }}>
              <div className="flex gap-1 mb-4 text-lg" style={{ color: item.accentColor }}>
                {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}
              </div>
              <p className="leading-relaxed mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>"{t.text}"</p>
              <div>
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-6 text-center" style={{ background: `linear-gradient(135deg, ${item.accentColor}30, ${item.accentColor}15)` }}>
        <h2 className="text-4xl font-bold text-white mb-4">Let&apos;s Talk About Your Goals</h2>
        <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Whether you&apos;re buying, selling, or investing — schedule a no-pressure consultation today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="px-10 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: item.accentColor, color: '#0c1445' }}
          >
            Book a Consultation
          </button>
          <a
            href={`tel:${item.phone}`}
            className="border-2 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            style={{ borderColor: `${item.accentColor}60` }}
          >
            {item.phone}
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#080f33', borderColor: `${item.accentColor}20` }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-bold text-lg" style={{ color: item.accentColor }}>{item.businessName}</div>
            <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.location} · {item.phone}</div>
          </div>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} {item.businessName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Law Firm demo ────────────────────────────────────────────────────────────

function LawFirmDemo({ item }: { item: PortfolioItem }) {
  const practiceIcons: Record<string, string> = {
    'Car & Truck Accidents': '🚗', 'Slip & Fall': '⚠️', 'Workplace Injuries': '🦺',
    'Medical Malpractice': '🏥', 'Wrongful Death': '⚖️', 'Product Liability': '📦',
    'Divorce & Separation': '📋', 'Child Custody': '👨‍👩‍👧', 'Adoption': '🏠',
    'Prenuptial Agreements': '📝', 'Mediation': '🤝', 'Restraining Orders': '🛡️',
    'DUI & DWI': '🚓', 'Drug Charges': '⚖️', 'Assault & Battery': '🛡️',
    'Federal Crimes': '🏛️', 'Expungement': '📄', 'White Collar Crime': '💼',
    'Business Formation': '🏢', 'Contract Drafting & Review': '📝', 'Mergers & Acquisitions': '🤝',
    'IP Protection': '💡', 'Employment Law': '👥', 'Regulatory Compliance': '✅',
  }

  const isEmergency = item.niche === 'law-firms' && (item.demoSlug === 'ashford-drake' || item.demoSlug === 'ironclad-defense')

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#18181b', fontFamily: 'system-ui, sans-serif' }}>
      {/* Emergency bar for PI / criminal */}
      {isEmergency && (
        <div className="py-3 px-4 text-center text-sm font-semibold text-white" style={{ backgroundColor: item.accentColor }}>
          Available 24/7 for emergencies — Call now: {item.phone}
        </div>
      )}

      {/* Nav */}
      <nav className="border-b sticky top-10 z-40 backdrop-blur" style={{ backgroundColor: '#18181bee', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-white">{item.businessName}</div>
          <div className="hidden md:flex gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {['Practice Areas', 'Our Attorneys', 'Case Results', 'Contact'].map((l) => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <button
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: item.accentColor }}
          >
            Free Consultation
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative py-32 px-6 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)'
      }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(ellipse at 30% 50%, ${item.accentColor} 0%, transparent 60%)`
        }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ backgroundColor: item.accentColor }} />
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: item.accentColor }}>
                {item.location} · Established Law Firm
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              {item.heroHeadline}
            </h1>
            <p className="text-xl leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {item.heroSubtext}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: item.accentColor }}
              >
                {item.ctaLabel}
              </button>
              <a
                href={`tel:${item.phone}`}
                className="flex items-center gap-3 border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                {item.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="py-6 border-y" style={{ backgroundColor: '#27272a', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-10 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {[
            ['20+', 'Years Combined Experience'],
            ['$50M+', 'Recovered for Clients'],
            ['4.9★', 'Average Client Rating'],
            ['Free', 'Initial Consultation'],
          ].map(([stat, label]) => (
            <div key={label} className="text-center">
              <div className="font-bold text-2xl text-white">{stat}</div>
              <div className="text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Areas */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Practice Areas</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Experienced representation across a full spectrum of legal matters.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {item.services.map((area) => (
            <div
              key={area}
              className="rounded-2xl p-6 border cursor-pointer group transition-all hover:border-white/20"
              style={{ backgroundColor: '#27272a', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="text-2xl mb-4">{practiceIcons[area] ?? '⚖️'}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{area}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Experienced {area.toLowerCase()} representation with a proven track record and client-first approach.
              </p>
              <div className="mt-4 text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: item.accentColor }}>
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24" style={{ backgroundColor: '#27272a' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-3">Client Testimonials</h2>
          <p className="mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>What clients say about our representation</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {item.testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex gap-1 mb-4 text-lg" style={{ color: item.accentColor }}>
                  {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <p className="leading-relaxed mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>"{t.text}"</p>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-6 text-center" style={{ background: `linear-gradient(135deg, ${item.accentColor}25, ${item.accentColor}10)` }}>
        <h2 className="text-4xl font-bold text-white mb-4">Talk to an Attorney Today — For Free</h2>
        <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Your consultation is completely free and confidential. We&apos;ll review your situation and tell you exactly where you stand.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="px-10 py-4 rounded-xl font-bold text-lg text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: item.accentColor }}
          >
            {item.ctaLabel}
          </button>
          <a
            href={`tel:${item.phone}`}
            className="border-2 border-white/25 hover:border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            {item.phone}
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-bold text-lg text-white">{item.businessName}</div>
            <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.location} · {item.phone}</div>
          </div>
          <div className="text-xs text-center max-w-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            The information on this site is for informational purposes only and does not constitute legal advice.
          </div>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} {item.businessName}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default function DemoPage({ params }: { params: { slug: string } }) {
  const item = portfolioItems.find((i) => i.demoSlug === params.slug)
  if (!item) notFound()

  return (
    <>
      <DemoBanner item={item} />
      <div className="pt-9">
        {item.niche === 'contractors' && <ContractorDemo item={item} />}
        {item.niche === 'ecommerce' && <EcommerceDemo item={item} />}
        {item.niche === 'real-estate' && <RealEstateDemo item={item} />}
        {item.niche === 'law-firms' && <LawFirmDemo item={item} />}
      </div>
    </>
  )
}
