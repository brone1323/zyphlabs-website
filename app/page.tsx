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
  FileTextIcon,
  LayoutDashboardIcon,
  RefreshCwIcon,
  InboxIcon,
  LinkIcon,
  ZapIcon,
} from '@/components/icons'

const pricingTiers = [
  {
    name: 'Project Runner Starter',
    tagline: 'Bring your own Claude Desktop. Best for solo operators.',
    price: '$129',
    priceNote: '$0 setup',
    cta: 'Get Started',
    ctaHref: '/signup?tier=starter',
    selfServe: true,
    highlight: false,
  },
  {
    name: 'Project Runner Pro',
    tagline: 'Hosted, ready to go. Best for owners running 5–20 active projects.',
    price: '$449',
    priceNote: '$499 setup',
    cta: 'Get Started',
    ctaHref: '/signup?tier=pro',
    selfServe: true,
    highlight: false,
  },
  {
    name: 'OpenClaw Operator',
    tagline: 'Project Runner + Email + CRM + a vertical template tuned to your industry.',
    price: '$1,799',
    priceNote: '$2,500 setup',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire?tier=operator',
    selfServe: false,
    highlight: true,
  },
  {
    name: 'OpenClaw Command',
    tagline: 'Your full AI Company — 4 execs + 5 office roles, fine-tuned to your business.',
    price: '$5,500',
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
    title: 'Service-Business Ready.',
    desc: 'Vertical templates for construction first, with horizontal expansion to other service trades.',
  },
  {
    Icon: PhoneIcon,
    title: 'White-Glove Onboarding.',
    desc: 'We configure your AI team to your business, your clients, your workflow. Then we hand you the keys.',
  },
]

const featureItems = [
  { Icon: FileTextIcon, label: 'AI Proposal Drafting' },
  { Icon: LayoutDashboardIcon, label: 'Project Dashboard' },
  { Icon: RefreshCwIcon, label: 'Change Order Automation' },
  { Icon: InboxIcon, label: 'AI Inbox Monitoring' },
  { Icon: UsersIcon, label: 'Crew & Supplier Directory' },
  { Icon: LinkIcon, label: 'Gmail, QuickBooks, Drive' },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <Hero />

      {/* Meet Your AI Company */}
      <section data-reveal>
        <OrgChart />
      </section>

      <div className="section-divider" />

      {/* Product Mock — Monday morning brief (standalone warm version) */}
      <section className="py-20 px-4 sm:px-6" data-reveal>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center text-sm mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            This is what your COO sends you on Monday morning.
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Email chrome */}
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: '#E5534B', opacity: 0.7 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#C69A36', opacity: 0.7 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#57A148', opacity: 0.7 }} />
              </div>
              <div className="space-y-1 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>From: </span>
                  <span style={{ color: 'var(--accent)' }}>Project Runner (COO)</span>
                  <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}> &lt;coo@yourcompany.ai&gt;</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>To: </span>
                  <span style={{ color: 'var(--text-body)' }}>Brian</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Subject: </span>
                  <span style={{ color: 'var(--text-heading)', fontWeight: 500 }}>Monday morning brief — Apr 27</span>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div
              className="px-6 py-8 text-sm leading-7"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-body)' }}
            >
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Good morning. Three things on your desk today.</p>

              <div className="space-y-6">
                <div>
                  <p style={{ color: 'var(--text-heading)', fontWeight: 500 }} className="mb-1">
                    1. Henderson reno — framing crew is 1 day behind.
                  </p>
                  <p
                    className="text-xs leading-6"
                    style={{
                      color: 'var(--text-muted)',
                      borderLeft: '2px solid var(--accent)',
                      paddingLeft: '12px',
                    }}
                  >
                    Cause: lumber delivery slipped Friday. I rebooked<br />
                    for Tuesday 7am and pushed drywall to next Monday.<br />
                    No client-facing slip. Updated the schedule.
                  </p>
                </div>

                <div>
                  <p style={{ color: 'var(--text-heading)', fontWeight: 500 }} className="mb-1">
                    2. Patel kitchen — invoice #2103 is 14 days overdue.
                  </p>
                  <p
                    className="text-xs leading-6"
                    style={{
                      color: 'var(--text-muted)',
                      borderLeft: '2px solid var(--accent)',
                      paddingLeft: '12px',
                    }}
                  >
                    Bookkeeper sent reminder #2 on Friday. If no reply<br />
                    by EOD I&apos;ll escalate to a phone call from you.<br />
                    Draft talking points attached.
                  </p>
                </div>

                <div>
                  <p style={{ color: 'var(--text-heading)', fontWeight: 500 }} className="mb-1">
                    3. New lead — Sarah K., bathroom remodel, Westside.
                  </p>
                  <p
                    className="text-xs leading-6"
                    style={{
                      color: 'var(--text-muted)',
                      borderLeft: '2px solid var(--accent)',
                      paddingLeft: '12px',
                    }}
                  >
                    CRM scored her at 78 (qualified). Recruiter pulled<br />
                    her last contractor&apos;s reviews — three complaints<br />
                    about communication. We win on that. Strategist<br />
                    drafted the pitch angle. On your CRM dashboard.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-xs" style={{ color: 'var(--text-muted)' }}>
                Nothing else needs you today. I&apos;m running the rest.
              </p>
              <p className="mt-4 text-xs" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                — Project Runner
              </p>
            </div>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Project Runner is doing the work.{' '}
            <Link href="/project-runner" className="link-accent underline underline-offset-2">
              You&apos;re running the company.
            </Link>
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Project Runner Feature Callout */}
      <section className="py-20 px-4 sm:px-6" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{
              background: 'var(--bg-warm)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Warm glow inside callout */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 20% 50%, rgba(199,101,72,0.08) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 3vw, 38px)',
                    fontWeight: 500,
                    color: 'var(--text-heading)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Quit typing and run these projects.
                </h2>
                <p className="leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                  Project Runner is the AI-powered project, proposal, and financial command center for service contractors.
                  Your inbox fills it; your projects run themselves.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/project-runner" className="btn-primary text-sm px-7 py-3.5 inline-block">
                    See Project Runner →
                  </Link>
                  <Link href="/pricing" className="btn-secondary text-sm px-7 py-3.5 inline-block">
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3" data-reveal-group>
                {featureItems.map((feature) => (
                  <div
                    key={feature.label}
                    className="p-4 rounded-xl flex items-center gap-3 card-glow"
                    data-reveal
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <feature.Icon size={18} color="var(--accent)" />
                    <span className="text-sm" style={{ color: 'var(--text-body)' }}>{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing Teaser */}
      <section className="py-24 px-4 sm:px-6" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">Pricing</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--text-heading)',
              }}
            >
              Pick your team.<br />
              <span className="gradient-text">Scale as you grow.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '44ch', margin: '0 auto' }}>
              Four tiers from solo operator to full AI executive suite. Starts at $129/mo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-reveal-group>
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-7 rounded-2xl flex flex-col relative card-glow ${tier.highlight ? 'popular-card' : ''}`}
                data-reveal
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${tier.highlight ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {tier.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap"
                    style={{ background: 'var(--accent)' }}
                  >
                    Most Popular
                  </div>
                )}
                {tier.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap"
                    style={{ background: '#8C6F47' }}
                  >
                    {tier.badge}
                  </div>
                )}
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-heading)' }}
                >
                  {tier.name}
                </h3>
                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
                  {tier.tagline}
                </p>
                <div className="mb-6">
                  <p
                    className="font-bold"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--text-heading)' }}
                  >
                    {tier.price}
                    <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{tier.priceNote}</p>
                </div>
                <Link
                  href={tier.ctaHref}
                  className={tier.highlight ? 'btn-primary text-center py-3 px-6 rounded-lg text-sm font-semibold' : 'tier-outline-btn'}
                >
                  {tier.cta}
                </Link>
                {tier.selfServe && (
                  <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                    Need help picking?{' '}
                    <Link
                      href="/questionnaire"
                      className="underline underline-offset-2 transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
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

      {/* Project Runner Status Mock — second product mock */}
      <section className="py-20 px-4 sm:px-6" data-reveal>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center text-sm mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            And while you were in that meeting — Project Runner was doing this.
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
            >
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-body)' }}
                >
                  Project Runner — Live Status
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                >
                  Mon Apr 28 · 4:32 PM · auto-updated
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(199,101,72,0.10)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                3 active
              </span>
            </div>

            {/* Project rows */}
            <div>
              {[
                {
                  status: 'ON TRACK',
                  statusColor: '#57A148',
                  statusBg: 'rgba(87,161,72,0.08)',
                  indicator: '●',
                  name: 'Henderson Renovation',
                  detail: 'Framing · Crew: 4 · 73% complete · No blockers',
                },
                {
                  status: 'ATTENTION',
                  statusColor: '#C69A36',
                  statusBg: 'rgba(198,154,54,0.08)',
                  indicator: '▲',
                  name: 'Patel Kitchen',
                  detail: 'Invoice #2103 · 14 days overdue · Reminder sent',
                },
                {
                  status: 'COMPLETE',
                  statusColor: '#7A7268',
                  statusBg: 'rgba(122,114,104,0.08)',
                  indicator: '✓',
                  name: 'Martinez Office Reno',
                  detail: 'Final inspection passed · Invoice sent · Awaiting payment',
                },
              ].map((project, i) => (
                <div
                  key={project.name}
                  className="px-6 py-5 flex items-start justify-between gap-4"
                  style={{
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className="mt-0.5 text-base flex-shrink-0"
                      style={{ color: project.statusColor }}
                    >
                      {project.indicator}
                    </span>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-heading)' }}>
                        {project.name}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                      >
                        {project.detail}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
                    style={{
                      background: project.statusBg,
                      color: project.statusColor,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div
              className="px-6 py-3 flex items-center gap-6"
              style={{
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-warm)',
              }}
            >
              {[
                { label: 'Under management', value: '$147,200' },
                { label: 'Overdue items', value: '1' },
                { label: 'Actions taken today', value: '6' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-heading)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Six actions. Zero interruptions.{' '}
            <Link href="/project-runner" className="link-accent underline underline-offset-2">
              Meet Project Runner →
            </Link>
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Zyph Labs */}
      <section className="py-24 px-4 sm:px-6" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">Why Zyph Labs</p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--text-heading)',
              }}
            >
              Built for business owners,<br />
              <span className="gradient-text">not developers.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-group>
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="p-7 rounded-2xl card-glow"
                data-reveal
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'var(--accent-subtle)',
                    border: '1px solid rgba(199,101,72,0.18)',
                  }}
                >
                  <card.Icon size={20} color="var(--accent)" />
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-heading)' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Free Tool Callout */}
      <section className="py-16 px-4 sm:px-6" data-reveal>
        <div className="max-w-3xl mx-auto">
          <Link href="/tools/proposal-drafter" className="block">
            <div
              className="rounded-2xl p-8 transition-all group card-glow"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(199,101,72,0.18)' }}
                >
                  <ZapIcon size={22} color="var(--accent)" />
                </div>
                <div className="flex-1">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                    style={{
                      background: 'var(--accent-subtle)',
                      border: '1px solid rgba(199,101,72,0.25)',
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Free Tool · Launching This Week
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2 transition-colors"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-heading)',
                    }}
                  >
                    AI Proposal Drafter for Contractors
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
      <section className="py-28 px-4 sm:px-6 relative overflow-hidden" data-reveal>
        <div className="absolute inset-0 radial-glow opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: 'var(--text-heading)',
            }}
          >
            Pick a team. We&apos;ll spin it up<br />this week.
          </h2>
          <p className="text-lg mb-3" style={{ color: 'var(--text-muted)' }}>
            Starter and Pro are self-serve — sign up, we onboard, you&apos;re running.
          </p>
          <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>
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
          <p className="text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
            Questions?{' '}
            <a href="mailto:contact@zyphlabs.com" className="link-accent underline underline-offset-2">
              contact@zyphlabs.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
