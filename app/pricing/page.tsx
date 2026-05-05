import type { Metadata } from 'next'
import OpenContactButton from '@/components/OpenContactButton'
import OpenChatButton from '@/components/OpenChatButton'

export const metadata: Metadata = {
  title: 'Pricing — AI Executive Team Tiers | Zyph Labs',
  description:
    'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  openGraph: {
    title: 'Pricing — AI Executive Team Tiers | Zyph Labs',
    description:
      'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  },
}

interface Tier {
  name: string
  tierId: string
  tagline: string
  monthly: string
  setup: string
  disclosure?: string
  bullets: string[]
  highlight: boolean
  badge: string | null
}

const tiers: Tier[] = [
  {
    name: 'Project Runner Starter',
    tierId: 'starter',
    tagline: 'Bring your own Claude Desktop. Best for solo operators.',
    monthly: '$129/mo',
    setup: '$0 setup',
    disclosure: 'Requires Claude Pro or Max subscription (~$100–200/mo, billed by Anthropic).',
    bullets: [
      '1 agent role.',
      'Runs in your Claude Desktop. You install it, you log in, you launch it.',
      'No hosting, no integrations wired by us. Agent talks to you; you copy/paste into your tools.',
    ],
    highlight: false,
    badge: null,
  },
  {
    name: 'Project Runner Pro',
    tierId: 'pro',
    tagline: 'Hosted, ready to go. Best for owners running 5–20 active projects.',
    monthly: '$449/mo',
    setup: '$499 setup',
    bullets: [
      'Up to 3 agent roles.',
      'We host them. They run on our infra, reachable on web/Telegram/whatever surface.',
      'Basic integrations wired (calendar, email read, file access). No fine-tuning. Shared base prompts.',
    ],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'OpenClaw Operator',
    tierId: 'operator',
    tagline: 'Project Runner + Email + CRM + a vertical template tuned to your industry.',
    monthly: '$1,799/mo',
    setup: '$2,500 setup',
    bullets: [
      '4 execs + Email + CRM = 6 roles.',
      'Hosted by us. Vertical template applied (e.g., construction config for Project Runner).',
      'Email agent sends/receives on your domain. CRM agent reads/writes your CRM. Execs read the office agents\' output and report to you.',
      'Same base models, configured — not trained — on your business.',
    ],
    highlight: false,
    badge: null,
  },
  {
    name: 'OpenClaw Command',
    tierId: 'command',
    tagline: 'Your full AI Company — 4 execs + 5 office roles, fine-tuned to your business. White-glove onboarding.',
    monthly: '$5,500/mo',
    setup: '$7,500 setup',
    bullets: [
      'All 9 roles. Hosted by us.',
      'Fine-tuned on your data, docs, SOPs, voice.',
      'Office agents act in your tools (email, CRM, books, ATS, support inbox). Execs read across all of it and run weekly/daily ops loops.',
      'Custom integrations built per client.',
    ],
    highlight: false,
    badge: 'Flagship',
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
          <p className="text-lg text-[#8888aa] max-w-2xl mx-auto">
            Four tiers from solo operator to full AI executive suite. Starts at $129/mo.
          </p>
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
                <p className="text-xs text-[#8888aa] leading-relaxed mb-4">{tier.tagline}</p>

                {/* Price */}
                <div className="mb-2">
                  <p className="text-2xl font-bold text-[#a29bfe]">{tier.monthly}</p>
                  <p className="text-xs text-[#555577] mt-0.5">{tier.setup}</p>
                </div>

                {/* Starter disclosure */}
                {tier.disclosure && (
                  <p className="text-[10px] text-[#666688] leading-snug mb-4 italic">
                    {tier.disclosure}
                  </p>
                )}

                {/* Bullets — renders only when non-empty */}
                {tier.bullets.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-[#8888aa]">
                        <span className="text-[#00cec9] mt-0.5 flex-shrink-0">✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex-1" />

                <OpenChatButton
                  tier={tier.tierId}
                  className={`w-full text-center py-3 px-6 rounded-lg text-sm font-semibold transition-all mt-6 ${
                    tier.highlight
                      ? 'btn-primary'
                      : 'border border-[#6c5ce7]/40 text-[#a29bfe] hover:border-[#6c5ce7] hover:bg-[#6c5ce7]/10'
                  }`}
                >
                  Chat with Zyph
                </OpenChatButton>
                <p className="text-center text-xs text-[#555577] mt-3">
                  <OpenContactButton
                    className="text-[#a29bfe] hover:text-white transition-colors underline underline-offset-2 bg-transparent border-none cursor-pointer text-xs p-0"
                  >
                    or send us a note →
                  </OpenContactButton>
                </p>
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
            Pick a team. We&apos;ll spin it up this week.
          </h2>
          <p className="text-[#8888aa] mb-3">
            Starter and Pro are self-serve — sign up, we onboard, you&apos;re running.
          </p>
          <p className="text-[#8888aa] mb-10">
            Operator and Command are application-only because we tune them to your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenChatButton className="btn-primary text-base px-10 py-4">
              Chat with Zyph →
            </OpenChatButton>
            <OpenContactButton className="btn-secondary text-base px-10 py-4">
              Contact us →
            </OpenContactButton>
          </div>
        </div>
      </section>
    </div>
  )
}
