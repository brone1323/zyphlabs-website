import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — AI Executive Team Tiers | Zyph Labs',
  description:
    'Four tiers from Project Runner Starter to OpenClaw Command. Pick the AI executive team that fits your business. Pricing finalized soon.',
}

const tiers = [
  {
    name: 'Project Runner Starter',
    tagline: 'Bring your own Claude Desktop. Best for solo operators who want to dip their toes in.',
    price: 'Contact for pricing',
    priceNote: '[BRIAN-CONFIRM] Pricing locked at 8 AM strategy session',
    cta: 'Join Waitlist',
    ctaHref: '/questionnaire',
    highlight: false,
    badge: null,
    includes: [
      'AI proposal drafting',
      'Active project dashboard',
      'Crew & supplier directory',
      'Automated change orders',
      'BYO Claude Desktop (Pro/Max)',
      'Email support',
    ],
  },
  {
    name: 'Project Runner Pro',
    tagline: 'Hosted, ready to go. Best for owners running 5–20 active projects.',
    price: 'Contact for pricing',
    priceNote: '[BRIAN-CONFIRM] Pricing locked at 8 AM strategy session',
    cta: 'Join Waitlist',
    ctaHref: '/questionnaire',
    highlight: true,
    badge: 'Most Popular',
    includes: [
      'Everything in Starter',
      'Zyph-hosted (no BYO required)',
      'AI inbox monitoring',
      'Gmail + Outlook connector',
      'QuickBooks integration',
      'Google Drive / OneDrive',
    ],
  },
  {
    name: 'OpenClaw Operator',
    tagline: 'Project Runner + Email Officer + CRM Operator + a vertical template tuned to your industry.',
    price: 'Contact for pricing',
    priceNote: '[BRIAN-CONFIRM] Pricing locked at 8 AM strategy session',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire',
    highlight: false,
    badge: null,
    includes: [
      'Everything in Pro',
      'Email Officer (reads, drafts, replies)',
      'CRM Operator (tracks every relationship)',
      'Industry vertical template',
      'White-glove onboarding',
      'Priority support',
    ],
  },
  {
    name: 'OpenClaw Command',
    tagline: 'The full executive team — Email, CRM, Project Runner, Strategist, + custom agents fine-tuned to your business.',
    price: 'Contact for pricing',
    priceNote: '[BRIAN-CONFIRM] Pricing locked at 8 AM strategy session',
    cta: 'Apply',
    ctaHref: '/questionnaire',
    highlight: false,
    badge: 'Flagship',
    includes: [
      'Everything in Operator',
      'Strategist (pricing, positioning, deal review)',
      'Content Creator (multi-platform publishing)',
      'Bespoke custom agent (your use case)',
      'Fine-tuned to your business',
      'Dedicated success manager',
    ],
  },
]

const comparisonRows: { feature: string; starter: boolean | string; pro: boolean | string; operator: boolean | string; command: boolean | string }[] = [
  { feature: 'AI Proposal Drafting', starter: true, pro: true, operator: true, command: true },
  { feature: 'Project Dashboard', starter: true, pro: true, operator: true, command: true },
  { feature: 'Change Order Automation', starter: true, pro: true, operator: true, command: true },
  { feature: 'Zyph-Hosted (no BYO AI)', starter: false, pro: true, operator: true, command: true },
  { feature: 'AI Inbox Monitoring', starter: false, pro: true, operator: true, command: true },
  { feature: 'Email Officer', starter: false, pro: false, operator: true, command: true },
  { feature: 'CRM Operator', starter: false, pro: false, operator: true, command: true },
  { feature: 'Strategist', starter: false, pro: false, operator: false, command: true },
  { feature: 'Content Creator', starter: false, pro: false, operator: false, command: true },
  { feature: 'Bespoke Custom Agent', starter: false, pro: false, operator: false, command: true },
  { feature: 'White-Glove Onboarding', starter: false, pro: false, operator: true, command: true },
]

function Check({ val }: { val: boolean | string }) {
  if (val === true) return <span className="text-[#00cec9] text-lg">✓</span>
  if (val === false) return <span className="text-[#333355]">—</span>
  return <span className="text-[#8888aa] text-sm">{val}</span>
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(108,92,231,0.1) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Pick your team.<br />
            <span className="gradient-text">Scale as you grow.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mx-auto mb-4">
            Four tiers from solo operator to full AI executive suite. Pricing finalized at our 8 AM strategy session today — join the waitlist to be first to know.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f39c12]/10 border border-[#f39c12]/30 text-[#f39c12] text-sm">
            <span className="w-2 h-2 rounded-full bg-[#f39c12] animate-pulse" />
            Pricing announcement coming today
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass p-7 flex flex-col relative ${
                  tier.highlight
                    ? 'border-[#6c5ce7]/50 shadow-[0_0_40px_rgba(108,92,231,0.2)]'
                    : ''
                }`}
              >
                {tier.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap ${
                      tier.badge === 'Most Popular'
                        ? 'bg-gradient-to-r from-[#6c5ce7] to-[#0984e3]'
                        : 'bg-gradient-to-r from-[#f39c12] to-[#e67e22]'
                    }`}
                  >
                    {tier.badge}
                  </div>
                )}

                <h2
                  className="text-base font-bold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {tier.name}
                </h2>
                <p className="text-xs text-[#8888aa] leading-relaxed mb-6">{tier.tagline}</p>

                <div className="mb-6">
                  <p className="text-lg font-bold text-[#a29bfe]">{tier.price}</p>
                  <p className="text-xs text-[#555577] mt-1">{tier.priceNote}</p>
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#8888aa]">
                      <span className="text-[#00cec9] mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className={`text-center py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
                    tier.highlight
                      ? 'btn-primary'
                      : 'border border-[#6c5ce7]/40 text-[#a29bfe] hover:border-[#6c5ce7] hover:bg-[#6c5ce7]/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Side-by-side comparison
            </h2>
          </div>

          <div className="glass rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-6 py-4 text-[#8888aa] font-medium uppercase tracking-wide text-xs">Feature</th>
                  {['Starter', 'Pro', 'Operator', 'Command'].map((t) => (
                    <th key={t} className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wide">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i < comparisonRows.length - 1 ? 'border-b border-white/5' : ''}>
                    <td className="px-6 py-3 text-[#ccccdd]">{row.feature}</td>
                    <td className="px-4 py-3 text-center"><Check val={row.starter} /></td>
                    <td className="px-4 py-3 text-center"><Check val={row.pro} /></td>
                    <td className="px-4 py-3 text-center"><Check val={row.operator} /></td>
                    <td className="px-4 py-3 text-center"><Check val={row.command} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Not sure which tier is right?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Start with a free assessment. We&apos;ll map your business to the right tier — no pressure, no pitch, just a clear recommendation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/questionnaire" className="btn-primary text-base px-10 py-4 inline-block">
              Start My Free Assessment
            </Link>
            <Link href="/project-runner" className="btn-secondary text-base px-10 py-4 inline-block">
              See Project Runner →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
