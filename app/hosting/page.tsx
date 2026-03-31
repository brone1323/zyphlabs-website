import type { Metadata } from 'next'
import Link from 'next/link'
import { HOSTING_PLANS } from '@/lib/prices'

export const metadata: Metadata = {
  title: 'Managed Web Hosting | Zyph Labs — Hosting That Just Works',
  description:
    'Managed web hosting for small businesses starting at $29/mo. SSL, CDN, uptime monitoring, and content updates included. We host and maintain your site.',
}

const allFeatures = [
  { label: 'Managed hosting infrastructure', starter: true, pro: true, biz: true },
  { label: 'SSL certificate (HTTPS)', starter: true, pro: true, biz: true },
  { label: 'Custom domain setup & configuration', starter: true, pro: true, biz: true },
  { label: 'Global CDN (fast loading worldwide)', starter: true, pro: true, biz: true },
  { label: '99.9% uptime monitoring', starter: true, pro: true, biz: true },
  { label: 'Security updates & patches', starter: true, pro: true, biz: true },
  { label: 'Monthly backups', starter: true, pro: true, biz: true },
  { label: 'Email support', starter: true, pro: true, biz: true },
  { label: 'Content updates per month', starter: '—', pro: 'Up to 2', biz: 'Up to 5' },
  { label: 'Priority support (24hr response)', starter: false, pro: true, biz: true },
  { label: 'Dedicated point of contact', starter: false, pro: true, biz: true },
  { label: 'Monthly performance report', starter: false, pro: false, biz: true },
  { label: 'Basic SEO monitoring', starter: false, pro: false, biz: true },
  { label: 'Quarterly strategy call', starter: false, pro: false, biz: true },
]

const faq = [
  {
    q: 'What exactly does "managed hosting" mean?',
    a: "Managed hosting means you never have to think about the technical side of keeping your website online. We handle the server infrastructure, security updates, SSL certificate renewals, backups, and uptime monitoring. If something breaks, we fix it — you just email us.",
  },
  {
    q: 'Can I use Zyph Labs hosting for a site you didn\'t build?',
    a: "Not currently — our hosting is for sites we built for you. This lets us guarantee quality and maintain the site effectively. We're exploring standalone hosting for third-party sites in the future.",
  },
  {
    q: 'What happens if I cancel my hosting?',
    a: "You can cancel anytime. We give you 30 days notice, deliver your website files so you can host them elsewhere, and there are no cancellation fees. We believe you should stay because we're valuable, not because you're trapped.",
  },
  {
    q: 'Is there a long-term contract?',
    a: "No contracts. Hosting is month-to-month. You can upgrade, downgrade, or cancel anytime from your client portal.",
  },
  {
    q: 'What\'s the uptime guarantee?',
    a: "We target 99.9% uptime. We use enterprise-grade infrastructure (Vercel/Netlify edge network) with automatic failover and global CDN distribution.",
  },
  {
    q: 'What counts as a "content update"?',
    a: "Content updates include changes to text, photos, phone numbers, hours, pricing, or other existing content. Adding entirely new pages or features is a major change — available at a discounted hourly rate for hosting clients.",
  },
  {
    q: 'Do you handle domain renewals?',
    a: "If you registered the domain yourself, you handle renewal (we'll remind you). If we registered it for you, we handle renewal and add the cost to your hosting invoice transparently.",
  },
]

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true)
    return <span className="text-[#00cec9] text-lg">✓</span>
  if (value === false)
    return <span className="text-[#333355]">—</span>
  return <span className="text-[#a29bfe] text-sm font-medium">{value}</span>
}

export default function HostingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(0,206,201,0.10) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#00cec9] text-sm font-semibold uppercase tracking-widest mb-3">
            Managed Hosting
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Hosting that<br />
            <span className="gradient-text">just works.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mx-auto">
            Every Zyph Labs site comes with managed hosting — SSL, CDN, backups, security, and content
            updates all handled for you. Starting at $29/mo.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOSTING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glass p-8 flex flex-col relative card-glow ${
                  plan.recommended ? 'popular-card' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white text-xs font-semibold px-5 py-1.5 rounded-full shadow-[0_0_20px_rgba(108,92,231,0.5)]">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    ${plan.price}
                  </span>
                  <span className="text-[#8888aa] text-sm">/mo</span>
                </div>
                <p className="text-xs text-[#555577] mb-6">
                  ${(plan.price * 12 * 0.85).toFixed(0)}/yr if paid annually (save ~15%)
                </p>
                <ul className="space-y-2.5 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#bbbbcc]">
                      <span className="text-[#00cec9] flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services/contractors#pricing"
                  className="btn-primary w-full text-center text-sm py-3 block"
                >
                  Get Started →
                </Link>
                <p className="text-center text-[10px] text-[#444466] mt-3">
                  30-day free trial · Cancel anytime
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Full comparison table */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              What's included in each plan
            </h2>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 bg-white/4 px-6 py-4 text-xs text-[#8888aa] uppercase tracking-widest border-b border-white/8">
              <span className="col-span-1">Feature</span>
              <span className="text-center">Starter</span>
              <span className="text-center text-[#a29bfe]">Professional</span>
              <span className="text-center">Business</span>
            </div>
            {allFeatures.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-4 px-6 py-4 text-sm items-center ${
                  i < allFeatures.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <span className="text-[#ccccdd] col-span-1">{row.label}</span>
                <span className="text-center"><FeatureCell value={row.starter} /></span>
                <span className="text-center"><FeatureCell value={row.pro} /></span>
                <span className="text-center"><FeatureCell value={row.biz} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* What "managed" means */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              What "managed" actually means
            </h2>
            <p className="text-[#8888aa]">
              Most "hosting" means you get server space — then figure out the rest yourself. We do it differently.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: '🔒', title: 'SSL Always On', desc: 'Your HTTPS certificate never expires — we renew it automatically. Visitors see the padlock, Google trusts your site.' },
              { icon: '🌎', title: 'Global CDN', desc: "Your site loads from servers closest to your visitor — fast loading whether they're in Toronto or Tokyo." },
              { icon: '💾', title: 'Monthly Backups', desc: 'A clean backup of your site is stored monthly. If anything ever goes wrong, we restore it — no data lost.' },
              { icon: '🔧', title: 'Security Monitoring', desc: 'We monitor for vulnerabilities, apply security patches, and keep your stack up to date. No surprise hacks.' },
              { icon: '📊', title: 'Uptime Monitoring', desc: "We're alerted instantly if your site goes down — before you or your customers notice. We fix it, you hear nothing." },
              { icon: '📝', title: 'Content Updates', desc: "Need to change your phone number or add a new photo? Email us. Professional and Business plans include monthly updates." },
            ].map((card) => (
              <div key={card.title} className="glass p-6 card-glow flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">{card.icon}</div>
                <div>
                  <h3
                    className="text-base font-semibold text-white mb-1.5"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#8888aa] leading-relaxed">{card.desc}</p>
                </div>
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
              Hosting FAQ
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
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

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Hosting is included when you build with us.
          </h2>
          <p className="text-[#8888aa] mb-10 text-lg">
            Pick your niche service, choose your build package, and select your hosting plan at checkout.
            The 30-day free hosting trial starts immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/contractors" className="btn-primary text-base px-10 py-4 inline-block">
              See Build Packages
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-base px-10 py-4 inline-block">
              How It Works →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
