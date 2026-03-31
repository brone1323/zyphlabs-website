import Link from 'next/link'
import Hero from '@/components/Hero'
import PortfolioCard from '@/components/PortfolioCard'
import { portfolioItems } from '@/lib/portfolioData'

const niches = [
  {
    name: 'Contractors & Trades',
    slug: 'contractors',
    icon: '🔨',
    desc: 'Lead-generating websites for roofers, HVAC, plumbers, electricians, builders, and more.',
    from: 149,
    color: '#f39c12',
  },
  {
    name: 'E-Commerce Stores',
    slug: 'ecommerce',
    icon: '🛍️',
    desc: 'Shopify stores that sell — set up, launched, and maintained so you can focus on your products.',
    from: 199,
    color: '#00cec9',
  },
  {
    name: 'Realtors & Real Estate',
    slug: 'real-estate',
    icon: '🏠',
    desc: 'Professional real estate sites that capture buyers and sellers on autopilot.',
    from: 179,
    color: '#6c5ce7',
  },
  {
    name: 'Law Firms & Attorneys',
    slug: 'law-firms',
    icon: '⚖️',
    desc: 'Authoritative law firm websites that establish credibility and fill your consultation calendar.',
    from: 199,
    color: '#0984e3',
  },
]

const steps = [
  {
    num: '01',
    title: 'You Order',
    desc: 'Pick your niche, build tier, and hosting plan. One checkout — no back-and-forth quoting.',
    icon: '🛒',
  },
  {
    num: '02',
    title: 'We Onboard You',
    desc: 'Quick 30-min call or questionnaire to gather your brand assets, content, and goals.',
    icon: '📋',
  },
  {
    num: '03',
    title: 'We Build It',
    desc: 'Custom design and development. You review a preview and approve before anything goes live.',
    icon: '⚙️',
  },
  {
    num: '04',
    title: 'We Deploy & Host',
    desc: 'We configure your domain, SSL, and hosting. Your site goes live — we handle everything.',
    icon: '🚀',
  },
  {
    num: '05',
    title: 'We Maintain It',
    desc: "Ongoing hosting, security, backups, and content updates. We're your web team, permanently.",
    icon: '🛡️',
  },
]

const whyCards = [
  {
    icon: '⚡',
    title: 'Live in 7–14 Days',
    desc: 'From order to live site in under two weeks. No lengthy discovery phases or endless revision cycles.',
  },
  {
    icon: '🔒',
    title: 'Zero Technical Headaches',
    desc: 'We handle hosting, SSL, DNS, domain setup, and maintenance. You never touch a cPanel or server.',
  },
  {
    icon: '♻️',
    title: 'Recurring Revenue Model',
    desc: "Your site keeps working for you month after month. We keep it running — you focus on your business.",
  },
  {
    icon: '💳',
    title: 'One Simple Checkout',
    desc: 'Build fee + hosting plan in a single Stripe checkout. Cards, Apple Pay, Google Pay accepted.',
  },
  {
    icon: '🎯',
    title: 'Built for Your Niche',
    desc: 'Not a generic template. Every site is tailored to the specific needs of your industry.',
  },
  {
    icon: '📞',
    title: 'Real Support',
    desc: 'Email support included. Priority plans get 24hr response time and a dedicated point of contact.',
  },
]

const testimonials = [
  {
    quote:
      "I used to lose bids because clients checked my website and it looked old. Now they call me already sold. Zyph Labs built and launched it in 10 days — I didn't do a thing.",
    name: 'Marcus T.',
    role: 'Owner, Summit Roofing Co.',
  },
  {
    quote:
      "As a realtor I needed something professional but had no time to manage it. Zyph Labs built the site AND hosts it. When I need a photo changed I just email them. It's incredible.",
    name: 'Sarah M.',
    role: 'Realtor, Apex Property Group',
  },
  {
    quote:
      "Our old Shopify store was set up by a freelancer who disappeared. Zyph Labs rebuilt it, runs it, and handles all the technical stuff. Our conversion rate went up 40%.",
    name: 'Anika P.',
    role: 'Founder, Lumina Glow',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <Hero />

      {/* Who We Serve */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            Who We Serve
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Pick your industry.<br />
            <span className="gradient-text">We handle the rest.</span>
          </h2>
          <p className="text-[#8888aa] max-w-xl mx-auto">
            Niche-built websites with pricing designed for real small businesses — not agency budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {niches.map((niche) => (
            <Link
              key={niche.slug}
              href={`/services/${niche.slug}`}
              className="glass card-glow p-7 flex flex-col group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
                style={{ background: `${niche.color}20`, border: `1px solid ${niche.color}40` }}
              >
                {niche.icon}
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2 group-hover:text-[#a29bfe] transition-colors"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {niche.name}
              </h3>
              <p className="text-sm text-[#8888aa] leading-relaxed mb-5 flex-1">{niche.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">
                  From{' '}
                  <span className="font-semibold text-[#a29bfe]">${niche.from}</span>
                </span>
                <span className="text-[#6c5ce7] group-hover:translate-x-1 transition-transform text-lg">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Frictionless Promise */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: problem */}
            <div>
              <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
                The Problem
              </p>
              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Most freelancers deliver a zip file and disappear.
              </h2>
              <p className="text-[#8888aa] leading-relaxed mb-4">
                You hired someone on Fiverr, got your files, and then spent three weeks trying to figure
                out Bluehost, getting an SSL error, wondering why your site loads in 8 seconds on mobile,
                and emailing someone who never responds.
              </p>
              <p className="text-[#8888aa] leading-relaxed">
                That's friction. It's the norm in this industry — and it's exactly what we eliminate.
              </p>
            </div>

            {/* Right: comparison table */}
            <div className="glass p-6 rounded-2xl">
              <div className="grid grid-cols-3 gap-4 text-xs text-[#8888aa] uppercase tracking-wide mb-4 pb-3 border-b border-white/8">
                <span>Feature</span>
                <span className="text-center">Typical Freelancer</span>
                <span className="text-center text-[#a29bfe]">Zyph Labs</span>
              </div>
              {[
                ['What you get', 'Files (zip)', 'Live website'],
                ['Hosting', 'Figure it out', 'Managed ✓'],
                ['SSL/Security', 'Not included', 'Included ✓'],
                ['Domain setup', 'Not included', 'We do it ✓'],
                ['Ongoing support', 'None', 'Monthly plan ✓'],
                ['Updates/changes', 'Buy another gig', 'Included in plan ✓'],
              ].map(([feature, bad, good]) => (
                <div
                  key={feature}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-white/5 text-sm items-center"
                >
                  <span className="text-[#ccccdd]">{feature}</span>
                  <span className="text-center text-[#555577]">{bad}</span>
                  <span className="text-center text-[#00cec9] font-medium">{good}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              From order to live site —<br />
              <span className="gradient-text">we handle every step.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%_-_12px)] w-6 h-0.5 bg-gradient-to-r from-[#6c5ce7]/40 to-transparent z-10" />
                )}
                <div className="glass p-6 h-full">
                  <div className="text-2xl mb-4">{step.icon}</div>
                  <div
                    className="text-xs font-bold text-[#6c5ce7] mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="text-base font-semibold text-white mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#8888aa] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn-secondary inline-block px-8 py-3">
              Learn more about the process →
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* See Our Work */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              Our Work
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Example sites<br />
              <span className="gradient-text">we've built.</span>
            </h2>
            <p className="text-[#8888aa] max-w-xl mx-auto">
              Every site is custom-designed for its niche, fully deployed, and maintained by our team.
              No templates. No abandoned freelancers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              portfolioItems.find((i) => i.id === 'summit-roofing')!,
              portfolioItems.find((i) => i.id === 'lumina-glow')!,
              portfolioItems.find((i) => i.id === 'meridian-luxury')!,
              portfolioItems.find((i) => i.id === 'vega-law')!,
            ].map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portfolio" className="btn-primary inline-block px-10 py-4 text-base">
              Browse All Example Sites →
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Zyph Labs */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              Why Zyph Labs
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Built for business owners,<br />
              <span className="gradient-text">not developers.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <div key={card.title} className="glass card-glow p-7">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3
                  className="text-lg font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              Client Stories
            </p>
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              What our clients say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass p-8 flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#f39c12] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#ccccdd] text-sm leading-relaxed flex-1 mb-6 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {t.name}
                  </p>
                  <p className="text-[#8888aa] text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Final CTA */}
      <section className="py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-50" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to stop worrying about your website?
          </h2>
          <p className="text-[#8888aa] text-lg mb-10">
            Pick your niche, choose your tier, and check out in minutes.
            Your site will be live within two weeks — managed by us, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/contractors" className="btn-primary text-base px-10 py-4 inline-block">
              View All Packages
            </Link>
            <Link href="/hosting" className="btn-secondary text-base px-10 py-4 inline-block">
              Explore Hosting Plans
            </Link>
          </div>
          <p className="text-[#444466] text-sm mt-8">
            Questions? Email us at{' '}
            <span className="text-[#a29bfe]">contact@zyphlabs.com</span>
          </p>
        </div>
      </section>
    </div>
  )
}
