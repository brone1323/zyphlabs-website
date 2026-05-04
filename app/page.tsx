import Link from 'next/link'
import Hero from '@/components/Hero'

const executiveTeam = [
  {
    icon: '🏗️',
    role: 'PROJECT RUNNER',
    title: 'Your COO.',
    desc: 'Runs proposals, projects, billing, change orders.',
    status: 'Launching this week',
    statusColor: '#00cec9',
    href: '/project-runner',
  },
  {
    icon: '📬',
    role: 'EMAIL OFFICER',
    title: 'Your Comms Director.',
    desc: 'Reads, classifies, drafts, replies.',
    status: 'Available now',
    statusColor: '#6c5ce7',
    href: null,
  },
  {
    icon: '🤝',
    role: 'CRM OPERATOR',
    title: 'Your Sales Lead.',
    desc: 'Tracks every relationship and follow-up.',
    status: 'Available now',
    statusColor: '#6c5ce7',
    href: null,
  },
  {
    icon: '🧠',
    role: 'STRATEGIST',
    title: 'Your Business Brain.',
    desc: 'Pricing, positioning, deal review, market scans.',
    status: 'Available now',
    statusColor: '#6c5ce7',
    href: null,
  },
  {
    icon: '📣',
    role: 'CONTENT CREATOR',
    title: 'Your Marketing Arm.',
    desc: 'Multi-platform publishing, on brand.',
    status: 'Available now',
    statusColor: '#6c5ce7',
    href: null,
  },
  {
    icon: '⚙️',
    role: 'BESPOKE AGENT',
    title: 'Built for Your Business.',
    desc: 'One specific job. Automated end-to-end.',
    status: 'Custom build',
    statusColor: '#f39c12',
    href: null,
  },
]

const pricingTiers = [
  {
    name: 'Project Runner Starter',
    tagline: 'Bring your own Claude Desktop. Best for solo operators.',
    price: 'Contact for pricing',
    cta: 'Join Waitlist',
    ctaHref: '/project-runner',
    highlight: false,
  },
  {
    name: 'Project Runner Pro',
    tagline: 'Hosted, ready to go. Best for owners running 5–20 active projects.',
    price: 'Contact for pricing',
    cta: 'Join Waitlist',
    ctaHref: '/project-runner',
    highlight: false,
  },
  {
    name: 'OpenClaw Operator',
    tagline: 'Project Runner + Email + CRM + a vertical template tuned to your industry.',
    price: 'Contact for pricing',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire',
    highlight: true,
  },
  {
    name: 'OpenClaw Command',
    tagline: 'The full executive team — Email, CRM, Project Runner, Strategist, + custom agents fine-tuned to your business.',
    price: 'Contact for pricing',
    cta: 'Apply',
    ctaHref: '/questionnaire',
    highlight: false,
    badge: 'Flagship',
  },
]

const whyCards = [
  {
    icon: '⚡',
    title: 'Always On. Never Tired.',
    desc: 'Your AI team works 24/7 — no sick days, no context-switching, no meetings.',
  },
  {
    icon: '🔒',
    title: 'One Stack. Zero Complexity.',
    desc: 'Everything runs on OpenClaw + Claude. No patchwork of SaaS tools to integrate and maintain.',
  },
  {
    icon: '♻️',
    title: 'Leverage Without Headcount.',
    desc: 'The work of 10 people. The payroll of zero. AI inverts the scaling equation.',
  },
  {
    icon: '💳',
    title: 'Fractional C-Suite Pricing.',
    desc: 'Less than the cost of a single hire. The executive team you could never afford — now you can.',
  },
  {
    icon: '🎯',
    title: 'Built for Construction First.',
    desc: 'Vertical-tuned for service contractors. General contractors, subs, residential and commercial.',
  },
  {
    icon: '📞',
    title: 'White-Glove Onboarding.',
    desc: 'We configure your AI team to your business, your clients, your workflow. Then we hand you the keys.',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <Hero />

      {/* Meet Your AI Executive Team */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            Your AI Executive Team
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Meet the team running<br />
            <span className="gradient-text">your business.</span>
          </h2>
          <p className="text-[#8888aa] max-w-xl mx-auto">
            Six specialized AI agents. Each one focused on a critical business function.
            All of them working together — so you don&apos;t have to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {executiveTeam.map((member) => {
            const card = (
              <div
                className="glass card-glow p-7 flex flex-col h-full group"
                style={member.href ? { cursor: 'pointer' } : {}}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0 bg-[#6c5ce7]/10 border border-[#6c5ce7]/30">
                  {member.icon}
                </div>
                <p className="text-xs font-bold text-[#6c5ce7] uppercase tracking-widest mb-1">
                  {member.role}
                </p>
                <h3
                  className="text-lg font-semibold text-white mb-2 group-hover:text-[#a29bfe] transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {member.title}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed flex-1">{member.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: member.statusColor }}
                  />
                  <span className="text-xs" style={{ color: member.statusColor }}>
                    {member.status}
                  </span>
                </div>
              </div>
            )

            return member.href ? (
              <Link key={member.role} href={member.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={member.role}>{card}</div>
            )
          })}
        </div>

        <p className="text-center text-xs text-[#555577] mt-6">
          [BRIAN-CONFIRM] Agent roster status — which are shippable today vs. roadmap needs a truth pass before go-live.
        </p>
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00cec9]/10 border border-[#00cec9]/30 text-[#00cec9] text-xs font-semibold mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00cec9] animate-pulse" />
                  Launching this week
                </div>
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
              Four tiers from solo operator to full AI executive suite.
              Pricing locked at our 8 AM strategy session — check back shortly.
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
                <p className="text-xs text-[#8888aa] leading-relaxed mb-6 flex-1">{tier.tagline}</p>
                <div className="mb-6">
                  <p className="text-lg font-bold text-[#a29bfe]">{tier.price}</p>
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
            Ready to build your AI executive team?
          </h2>
          <p className="text-[#8888aa] text-lg mb-10">
            Start with a free assessment. We&apos;ll map out the right team and tier for your business —
            no sales pressure, just a clear plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/questionnaire" className="btn-primary text-base px-10 py-4 inline-block">
              Start My Free Assessment
            </Link>
            <Link href="/project-runner" className="btn-secondary text-base px-10 py-4 inline-block">
              See Project Runner →
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
