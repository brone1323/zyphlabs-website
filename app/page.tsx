import Link from 'next/link'
import Hero from '@/components/Hero'
import OrgChart from '@/components/OrgChart'
import {
  ClockIcon,
  LayersIcon,
  UsersIcon,
  CreditCardIcon,
  BuildingIcon,
  PhoneIcon,
} from '@/components/icons'

const pricingTiers = [
  {
    name: 'Project Runner Starter',
    tagline: 'Bring your own Claude Desktop. Best for solo operators.',
    price: '$129/mo',
    priceNote: '$0 setup',
    cta: 'Get Started',
    ctaHref: '/signup?tier=starter',
    selfServe: true,
    highlight: false,
  },
  {
    name: 'Project Runner Pro',
    tagline: 'Hosted, ready to go. Best for owners running 5–20 active projects.',
    price: '$449/mo',
    priceNote: '$499 setup',
    cta: 'Get Started',
    ctaHref: '/signup?tier=pro',
    selfServe: true,
    highlight: false,
  },
  {
    name: 'OpenClaw Operator',
    tagline: 'Project Runner + Email + CRM + a vertical template tuned to your industry.',
    price: '$1,799/mo',
    priceNote: '$2,500 setup',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire?tier=operator',
    selfServe: false,
    highlight: true,
  },
  {
    name: 'OpenClaw Command',
    tagline: 'Your full AI Company — 4 execs + 5 office roles, fine-tuned to your business.',
    price: '$5,500/mo',
    priceNote: '$7,500 setup',
    cta: 'Apply',
    ctaHref: '/questionnaire?tier=command',
    selfServe: false,
    highlight: false,
    badge: 'Flagship',
  },
]

const whyCards = [
  {
    Icon: ClockIcon,
    title: 'Always On. Never Tired.',
    desc: 'Your AI team works 24/7 — no sick days, no context-switching, no meetings.',
  },
  {
    Icon: LayersIcon,
    title: 'One Stack. Zero Complexity.',
    desc: 'Everything runs on OpenClaw + Claude. No patchwork of SaaS tools to integrate and maintain.',
  },
  {
    Icon: UsersIcon,
    title: 'Leverage Without Headcount.',
    desc: 'The work of 10 people. The payroll of zero. AI inverts the scaling equation.',
  },
  {
    Icon: CreditCardIcon,
    title: 'Fractional C-Suite Pricing.',
    desc: 'Less than the cost of a single hire. The executive team you could never afford — now you can.',
  },
  {
    Icon: BuildingIcon,
    title: 'Service-business ready.',
    desc: 'Vertical templates for construction first, with horizontal expansion to other service trades. General contractors, subs, residential and commercial — and growing.',
  },
  {
    Icon: PhoneIcon,
    title: 'White-Glove Onboarding.',
    desc: 'We configure your AI team to your business, your clients, your workflow. Then we hand you the keys.',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <Hero />

      {/* Meet Your AI Company — org chart with animations */}
      <OrgChart />

      <div className="section-divider" />

      {/* Product Mock — Monday morning brief */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[#8888aa] text-sm mb-8">
            This is what your COO sends you on Monday morning.
          </p>

          {/* Email mock */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,92,231,0.08)',
            }}
          >
            {/* Email chrome header */}
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="space-y-1 text-xs" style={{ fontFamily: 'ui-monospace, monospace' }}>
                <div>
                  <span className="text-[#555577]">From: </span>
                  <span className="text-[#a29bfe]">Project Runner (COO)</span>
                  <span className="text-[#333355]"> &lt;coo@yourcompany.ai&gt;</span>
                </div>
                <div>
                  <span className="text-[#555577]">To: </span>
                  <span className="text-[#ccccdd]">Brian</span>
                </div>
                <div>
                  <span className="text-[#555577]">Subject: </span>
                  <span className="text-white font-medium">Monday morning brief — Apr 27</span>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div
              className="px-6 py-8 text-sm leading-7 text-[#ccccdd]"
              style={{ fontFamily: 'ui-monospace, monospace' }}
            >
              <p className="mb-6">Good morning. Three things on your desk today.</p>

              <div className="space-y-6">
                <div>
                  <p className="text-white font-medium mb-1">1. Henderson reno — framing crew is 1 day behind.</p>
                  <p className="text-[#8888aa] pl-4 border-l border-[#6c5ce7]/30">
                    Cause: lumber delivery slipped Friday. I rebooked<br />
                    for Tuesday 7am and pushed drywall to next Monday.<br />
                    No client-facing slip. Updated the schedule.
                  </p>
                </div>

                <div>
                  <p className="text-white font-medium mb-1">2. Patel kitchen — invoice #2103 is 14 days overdue.</p>
                  <p className="text-[#8888aa] pl-4 border-l border-[#6c5ce7]/30">
                    Bookkeeper sent reminder #2 on Friday. If no reply<br />
                    by EOD I&apos;ll escalate to a phone call from you.<br />
                    Draft talking points attached.
                  </p>
                </div>

                <div>
                  <p className="text-white font-medium mb-1">3. New lead — Sarah K., bathroom remodel, Westside.</p>
                  <p className="text-[#8888aa] pl-4 border-l border-[#6c5ce7]/30">
                    CRM scored her at 78 (qualified). Recruiter pulled<br />
                    her last contractor&apos;s reviews — three complaints<br />
                    about communication. We win on that. Strategist<br />
                    drafted the pitch angle. On your CRM dashboard.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-[#6888aa]">Nothing else needs you today. I&apos;m running the rest.</p>
              <p className="mt-4 text-[#a29bfe]">— Project Runner</p>
            </div>
          </div>

          <p className="text-center mt-8 text-[#8888aa] text-sm">
            Project Runner is doing the work.{' '}
            <Link
              href="/project-runner"
              className="text-[#a29bfe] hover:text-white transition-colors underline underline-offset-2"
            >
              You&apos;re running the company.
            </Link>
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Project Runner Feature Callout */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden border border-[#6c5ce7]/20">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.12) 0%, transparent 60%)',
              }}
            />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  quit typing and run these projects.
                </h2>
                <p className="text-[#8888aa] leading-relaxed mb-8">
                  Project Runner is the AI-powered project, proposal, and financial command center for service contractors.
                  Your inbox fills it; your projects run themselves.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/project-runner" className="btn-primary text-base px-8 py-4 inline-block">
                    See Project Runner →
                  </Link>
                  <Link href="/pricing" className="btn-secondary text-base px-8 py-4 inline-block">
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '📄', label: 'AI Proposal Drafting' },
                  { icon: '📊', label: 'Project Dashboard' },
                  { icon: '🔄', label: 'Change Order Automation' },
                  { icon: '📥', label: 'AI Inbox Monitoring' },
                  { icon: '👥', label: 'Crew & Supplier Directory' },
                  { icon: '🔗', label: 'Gmail, QuickBooks, Drive' },
                ].map((feature) => (
                  <div key={feature.label} className="glass p-4 rounded-xl flex items-center gap-3">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm text-[#ccccdd]">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing Teaser */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Pick your team.<br />
              <span className="gradient-text">Scale as you grow.</span>
            </h2>
            <p className="text-[#8888aa] max-w-xl mx-auto">
              Four tiers from solo operator to full AI executive suite. Starts at $129/mo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass p-7 flex flex-col relative ${tier.highlight ? 'border-[#6c5ce7]/50 shadow-[0_0_30px_rgba(108,92,231,0.15)]' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#0984e3] text-white text-xs font-bold whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#f39c12] to-[#e67e22] text-white text-xs font-bold whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}
                <h3
                  className="text-base font-bold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {tier.name}
                </h3>
                <p className="text-xs text-[#8888aa] leading-relaxed mb-4 flex-1">{tier.tagline}</p>
                <div className="mb-6">
                  <p className="text-lg font-bold text-[#a29bfe]">{tier.price}</p>
                  <p className="text-xs text-[#555577] mt-0.5">{tier.priceNote}</p>
                </div>
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
                {tier.selfServe && (
                  <p className="text-center text-xs text-[#555577] mt-3">
                    Need help picking?{' '}
                    <Link href="/questionnaire" className="text-[#a29bfe] hover:text-white transition-colors underline underline-offset-2">
                      Talk to us
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="btn-secondary inline-block px-8 py-3">
              View Full Pricing Details →
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
                <div className="mb-4">
                  <card.Icon size={28} color="#6c5ce7" />
                </div>
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

      {/* Free Tool Callout */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/tools/proposal-drafter" className="block">
            <div className="glass rounded-2xl p-8 border border-[#00cec9]/20 hover:border-[#00cec9]/50 transition-all group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="text-4xl">📝</div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00cec9]/10 border border-[#00cec9]/30 text-[#00cec9] text-xs font-semibold mb-3">
                    Free Tool · Launching This Week
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-2 group-hover:text-[#a29bfe] transition-colors"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    AI Proposal Drafter for Contractors
                  </h3>
                  <p className="text-sm text-[#8888aa]">
                    Five fields in. A polished, branded proposal out. 30 seconds. Get early access →
                  </p>
                </div>
              </div>
            </div>
          </Link>
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
            Pick a team. We&apos;ll spin it up this week.
          </h2>
          <p className="text-[#8888aa] text-lg mb-4">
            Starter and Pro are self-serve — sign up, we onboard, you&apos;re running.
          </p>
          <p className="text-[#8888aa] text-lg mb-10">
            Operator and Command are application-only because we tune them to your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?tier=starter" className="btn-primary text-base px-10 py-4 inline-block">
              Get Started →
            </Link>
            <Link href="/pricing" className="btn-secondary text-base px-10 py-4 inline-block">
              View All Tiers
            </Link>
          </div>
          <p className="text-[#444466] text-sm mt-8">
            Questions?{' '}
            <a href="mailto:contact@zyphlabs.com" className="text-[#a29bfe] hover:text-white transition-colors">
              contact@zyphlabs.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
