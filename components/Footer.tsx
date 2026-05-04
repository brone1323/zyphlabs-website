import Link from 'next/link'

const products = [
  { href: '/project-runner', label: 'Project Runner' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/how-it-works', label: 'How It Works' },
]

const tools = [
  { href: '/tools/proposal-drafter', label: 'Proposal Drafter (Free)' },
]

const company = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/questionnaire', label: 'Free Assessment' },
  { href: 'mailto:contact@zyphlabs.com', label: 'Contact' },
]

const legal: { href: string; label: string }[] = []

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0f]">
      <div className="section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Brand */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Z</span>
            </div>
            <span className="font-bold text-lg tracking-wide text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ZYPH <span className="gradient-text">LABS</span>
            </span>
          </div>
          <p className="text-[#8888aa] text-sm leading-relaxed max-w-sm mb-4">
            AI executive teams for SMB owners — email, CRM, projects, strategy — so you spend your day making decisions instead of putting out fires.
          </p>
          <div className="flex items-center gap-3 text-xs text-[#8888aa]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00cec9] inline-block" />
              Secure checkout via PayPal
            </span>
            <span>·</span>
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Products
            </h3>
            <ul className="space-y-2.5">
              {products.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-[#8888aa] hover:text-[#a29bfe] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Tools
            </h3>
            <ul className="space-y-2.5">
              {tools.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="text-sm text-[#8888aa] hover:text-[#a29bfe] transition-colors">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Company
            </h3>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-[#8888aa] hover:text-[#a29bfe] transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Legal
            </h3>
            {legal.length > 0 ? (
              <ul className="space-y-2.5">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#8888aa] hover:text-[#a29bfe] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#555577]">
          <p>© {new Date().getFullYear()} Zyph Labs. All rights reserved.</p>
          <p>Built with Next.js · Hosted on Vercel · Payments by PayPal</p>
        </div>
      </div>
    </footer>
  )
}
