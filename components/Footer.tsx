'use client'

import Link from 'next/link'

const products = [
  { href: '/project-runner', label: 'Project Runner' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/tools/proposal-drafter', label: 'Proposal Drafter (Free)' },
]

const company = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/questionnaire', label: 'Free Assessment' },
  { href: 'mailto:contact@zyphlabs.com', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-dark)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Brand + tagline */}
        <div className="mb-14">
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>Z</span>
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-body)' }}>
              ZYPH <span style={{ color: 'var(--accent)' }}>LABS</span>
            </span>
          </div>
          <p
            className="mb-2 max-w-sm"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.3,
            }}
          >
            Run your business<br />
            on an AI Company.
          </p>
          <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Nine AI roles. One integrated team. Starts at $129/mo.
          </p>
        </div>

        {/* 3-column link grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {/* Products + Tools */}
          <div>
            <h3
              className="text-xs font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Products & Tools
            </h3>
            <ul className="space-y-2.5">
              {products.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-xs font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Company
            </h3>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get started */}
          <div>
            <h3
              className="text-xs font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Get Started
            </h3>
            <div className="space-y-3">
              <Link href="/signup?tier=starter" className="btn-primary text-sm block text-center px-5 py-2.5">
                Get Started →
              </Link>
              <Link
                href="/questionnaire"
                className="block text-center text-sm py-2.5 px-5 rounded-lg transition-all"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                Free Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.02em',
            }}
          >
            © {new Date().getFullYear()} Zyph Labs · contact@zyphlabs.com · privacy · terms
          </p>
          <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.20)', fontSize: '12px' }}>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'var(--accent)', opacity: 0.7 }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>Secure checkout via PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
