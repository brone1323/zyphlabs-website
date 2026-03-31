import Link from 'next/link'

const services = [
  { href: '/services/contractors', label: 'Contractors & Trades' },
  { href: '/services/ecommerce', label: 'E-Commerce Stores' },
  { href: '/services/real-estate', label: 'Realtors & Real Estate' },
  { href: '/services/law-firms', label: 'Law Firms & Attorneys' },
]

const company = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/hosting', label: 'Managed Hosting' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: 'mailto:hello@zyphlabs.com', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0f]">
      {/* Top gradient line */}
      <div className="section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Z</span>
              </div>
              <span className="font-bold text-lg tracking-wide text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                ZYPH <span className="gradient-text">LABS</span>
              </span>
            </div>
            <p className="text-[#8888aa] text-sm leading-relaxed max-w-sm mb-6">
              We build it. We host it. We maintain it. Professional websites for growing businesses —
              from first click to fully live, with zero technical headaches.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#8888aa]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00cec9] inline-block" />
                Secure checkout via Stripe
              </span>
              <span>·</span>
              <span>30-day hosting trial</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-[#8888aa] hover:text-[#a29bfe] transition-colors">
                    {s.label}
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
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#555577]">
          <p>© {new Date().getFullYear()} Zyph Labs. All rights reserved.</p>
          <p>Built with Next.js · Hosted on Vercel · Payments by Stripe</p>
        </div>
      </div>
    </footer>
  )
}
