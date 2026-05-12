import Link from 'next/link'
import Hero from '@/components/Hero'
import OrgChart from '@/components/OrgChart'
import OpenContactButton from '@/components/OpenContactButton'
import OpenChatButton from '@/components/OpenChatButton'
import NewsletterSection from '@/components/NewsletterSection'
import ProposalDrafterSignup from '@/components/ProposalDrafterSignup'
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
} from '@/components/icons'

const pricingTiers = [
  {
    name: 'Project Runner Starter',
    tierId: 'starter',
    tagline: 'Bring your own Claude Desktop. Best for solo operators.',
    price: '$129',
    priceNote: '$0 setup',
    bullets: [
      '1 agent role.',
      'Runs in your Claude Desktop. You install it, you log in, you launch it.',
      'No hosting, no integrations wired by us. Agent talks to you; you copy/paste into your tools.',
    ],
    highlight: false,
  },
  {
    name: 'Project Runner Pro',
    tierId: 'pro',
    tagline: 'Hosted, ready to go. Best for owners running 5–20 active projects.',
    price: '$449',
    priceNote: '$499 setup',
    bullets: [
      'Up to 3 agent roles.',
      'We host them. They run on our infra, reachable on web/Telegram/whatever surface.',
      'Basic integrations wired (calendar, email read, file access). No fine-tuning. Shared base prompts.',
    ],
    highlight: false,
  },
  {
    name: 'OpenClaw Operator',
    tierId: 'operator',
    tagline: 'Project Runner + Email + CRM + a vertical template tuned to your industry.',
    price: '$1,799',
    priceNote: '$2,500 setup',
    bullets: [
      '4 execs + Email + CRM = 6 roles.',
      'Hosted by us. Vertical template applied (e.g., construction config for Project Runner).',
      'Email agent sends/receives on your domain. CRM agent reads/writes your CRM. Execs read the office agents\' output and report to you.',
      'Same base models, configured — not trained — on your business.',
    ],
    highlight: true,
  },
  {
    name: 'OpenClaw Command',
    tierId: 'command',
    tagline: 'Your full AI Company — 4 execs + 5 office roles, fine-tuned to your business.',
    price: '$5,500',
    priceNote: '$7,500 setup',
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

const demoTiles = [
  {
    slug: 'field-staff',
    icon: '🔧',
    iconBg: 'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(245,158,11,0.10))',
    glow: 'rgba(251,191,36,0.20)',
    title: 'Field Staff',
    savings: '5–8 hrs/wk · for tech, PM & bookkeeper',
    beat: 'Tech finishes job, talks 30 seconds — service report, customer email, invoice, follow-up all done before they reach the truck.',
    length: '48s',
  },
  {
    slug: 'salesperson',
    icon: '💼',
    iconBg: 'linear-gradient(135deg, rgba(79,70,229,0.22), rgba(67,56,202,0.10))',
    glow: 'rgba(79,70,229,0.20)',
    title: 'Salesperson',
    savings: '8–12 hrs/wk · for sales, manager & owner',
    beat: 'Lead arrives 11pm Saturday. Agent qualifies, books Monday 9am — before the rep wakes up.',
    length: '50s',
  },
  {
    slug: 'bookkeeping',
    icon: '📊',
    iconBg: 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(5,150,105,0.10))',
    glow: 'rgba(16,185,129,0.20)',
    title: 'Bookkeeping',
    savings: '8–12 hrs/wk · for field, books & owner',
    beat: 'Field tech voice update → agent detects billing milestone → invoice queued for bookkeeper approval. Cash in motion same-day.',
    length: '50s',
  },
  {
    slug: 'marketer',
    icon: '📣',
    iconBg: 'linear-gradient(135deg, rgba(236,72,153,0.22), rgba(190,24,93,0.10))',
    glow: 'rgba(236,72,153,0.20)',
    title: 'Marketer',
    savings: '10–15 hrs/wk · for marketing, owner & sales',
    beat: 'Owner records 2-min memo. Agent returns 5 social posts (with images), email blast, and blog draft — all in their voice.',
    length: '50s',
  },
  {
    slug: 'project-manager',
    icon: '📋',
    iconBg: 'linear-gradient(135deg, rgba(30,64,175,0.22), rgba(29,78,216,0.10))',
    glow: 'rgba(30,64,175,0.20)',
    title: 'Project Manager',
    savings: '10–15 hrs/wk · for PM, GC & owner',
    beat: 'Foreman reports a slip. Agent reschedules trades, drafts client update, prevents the cascade.',
    length: '52s',
  },
  {
    slug: 'ceo',
    icon: '👔',
    iconBg: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(124,58,237,0.10))',
    glow: 'rgba(139,92,246,0.20)',
    title: 'CEO / Owner',
    savings: '10–15 hrs/wk · for CEO, EA & ops mgr',
    beat: 'Tom asks "what matters today?" Agent replies in chat with the brief + tappable chips for cash, projects, and 12-wk forecast.',
    length: '55s',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <Hero />

      {/* See It In Action — Live Role Demos */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden" data-reveal id="demos">
        {/* Ambient backdrop glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(199,101,72,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(79,70,229,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(16,185,129,0.06) 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs uppercase mb-3 inline-flex items-center gap-2"
              style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.18em' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: 'var(--accent)', boxShadow: '0 0 8px currentColor' }}
              />
              See it in action
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 46px)',
                fontWeight: 500,
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Six roles. Six 50-second demos.
              <br className="hidden sm:block" />
              <span style={{ color: 'var(--accent)' }}>No edit cuts. Real workflows.</span>
            </h2>
            <p
              className="text-base max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Tap any role to watch an agent run that part of the business — voice memos, generated
              content, dashboards, approvals. Audio is muted by default; tap the speaker to unmute.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-group>
            {demoTiles.map((d) => (
              <a
                key={d.slug}
                href={`https://agentic-demo-gamma.vercel.app/${d.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl p-6 transition-all duration-300 overflow-hidden hover:-translate-y-1 card-glow flex flex-col"
                data-reveal
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {/* hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${d.glow} 0%, transparent 70%)`,
                  }}
                />
                <div className="relative flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                      style={{
                        background: d.iconBg,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span aria-hidden="true">{d.icon}</span>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                      style={{
                        background: 'rgba(34,197,94,0.10)',
                        color: '#16A34A',
                        border: '1px solid rgba(34,197,94,0.25)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{
                          background: '#22C55E',
                          boxShadow: '0 0 6px #22C55E',
                        }}
                      />
                      Live demo
                    </span>
                  </div>

                  <h3
                    className="text-xl font-semibold mb-1.5"
                    style={{ color: 'var(--text-heading)', letterSpacing: '-0.01em' }}
                  >
                    {d.title}
                  </h3>
                  <p
                    className="text-xs font-bold mb-3 uppercase"
                    style={{ color: '#16A34A', letterSpacing: '0.04em' }}
                  >
                    {d.savings}
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-6 flex-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {d.beat}
                  </p>

                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <span
                      className="inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span aria-hidden="true">▶</span>
                      Watch {d.length} demo
                    </span>
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <p className="text-center mt-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            Like one of these?{' '}
            <Link href="/project-runner" className="link-accent underline underline-offset-2">
              Wire it up for your business →
            </Link>
          </p>
        </div>
      </section>

      <div className="section-divider" />

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
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  {tier.tagline}
                </p>
                <div className="mb-4">
                  <p
                    className="font-bold"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--text-heading)' }}
                  >
                    {tier.price}
                    <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{tier.priceNote}</p>
                </div>
                {tier.bullets && tier.bullets.length > 0 && (
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {tier.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>·</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex-1" />
                <OpenChatButton
                  tier={tier.tierId}
                  className={tier.highlight ? 'btn-primary text-center w-full py-3 px-6 rounded-lg text-sm font-semibold' : 'tier-outline-btn w-full'}
                >
                  Chat with Zyph
                </OpenChatButton>
                <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  <OpenContactButton
                    className="underline underline-offset-2 transition-colors bg-transparent border-none cursor-pointer p-0 text-xs"
                    style={{ color: 'var(--accent)' }}
                  >
                    or send us a note →
                  </OpenContactButton>
                </p>
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

      {/* Newsletter — Zero Payroll */}
      <NewsletterSection />

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

      {/* AI Proposal Drafter — Early Access Form */}
      <ProposalDrafterSignup />

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
            <OpenChatButton className="btn-primary text-base px-10 py-4">
              Chat with Zyph →
            </OpenChatButton>
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
