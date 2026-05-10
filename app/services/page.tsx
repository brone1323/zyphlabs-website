import Link from 'next/link'
import type { Metadata } from 'next'
import { MessageSquareIcon, GitBranchIcon, ZapIcon, WrenchIcon } from '@/components/icons'
import OpenChatButton from '@/components/OpenChatButton'
import OpenContactButton from '@/components/OpenContactButton'

export const metadata: Metadata = {
  title: 'Services — AI Executive Team Capabilities | Zyph Labs',
  description:
    'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  openGraph: {
    title: 'Services — AI Executive Team Capabilities | Zyph Labs',
    description:
      'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  },
}

const capabilities = [
  {
    Icon: MessageSquareIcon,
    name: 'AI Agents & Chatbots',
    eyebrow: '[BRIAN-FOLLOWUP]',
    h2: '[BRIAN-FOLLOWUP]',
    subhead: '[BRIAN-FOLLOWUP]',
    body: '[BRIAN-FOLLOWUP]',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire',
    role: 'The Communicators on your team.',
    desc: 'Your AI executive team communicates for you — inbound inquiries, client follow-ups, support triage. These agents handle the inbox so nothing falls through the cracks.',
    examples: ['Email Officer', 'CRM Operator', 'Lead qualifier', 'Support responder'],
    color: '#6c5ce7',
  },
  {
    Icon: GitBranchIcon,
    name: 'Workflow Automation',
    eyebrow: '[BRIAN-FOLLOWUP]',
    h2: '[BRIAN-FOLLOWUP]',
    subhead: '[BRIAN-FOLLOWUP]',
    body: '[BRIAN-FOLLOWUP]',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire',
    role: 'The Operations engine.',
    desc: 'The systems that keep your business running without you in the loop. From project handoffs to invoice generation to change orders — automated end-to-end.',
    examples: ['Project Runner', 'Proposal automation', 'Change order requests', 'QuickBooks sync'],
    color: '#0984e3',
  },
  {
    Icon: ZapIcon,
    name: 'Digital Workers',
    eyebrow: '[BRIAN-FOLLOWUP]',
    h2: '[BRIAN-FOLLOWUP]',
    subhead: '[BRIAN-FOLLOWUP]',
    body: '[BRIAN-FOLLOWUP]',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire',
    role: 'The always-on contributors.',
    desc: 'AI that takes on full job functions — not just answering questions, but doing the work. Content creation, research, scheduling, reporting — handled.',
    examples: ['Strategist', 'Market scanner', 'Report generator'],
    color: '#00cec9',
  },
  {
    Icon: WrenchIcon,
    name: 'Bespoke AI Tools',
    eyebrow: '[BRIAN-FOLLOWUP]',
    h2: '[BRIAN-FOLLOWUP]',
    subhead: '[BRIAN-FOLLOWUP]',
    body: '[BRIAN-FOLLOWUP]',
    cta: 'Talk to Us',
    ctaHref: '/questionnaire',
    role: 'Built for one specific job in your business.',
    desc: "Every business has a task that doesn't fit any off-the-shelf tool. We build it. One-off AI tools designed around your exact workflow, your data, your clients.",
    examples: ['Custom estimating tools', 'Industry-specific agents', 'Internal process bots', 'Data extraction pipelines'],
    color: '#a29bfe',
  },
]

const niches = [
  {
    name: 'Contractors & Trades',
    slug: 'contractors',
    icon: '🔨',
    desc: 'AI executive teams for GCs, electrical, plumbing, roofing, HVAC. Project Runner is the flagship product.',
    color: '#f39c12',
  },
  {
    name: 'E-Commerce',
    slug: 'ecommerce',
    icon: '🛍️',
    desc: 'Email, CRM, and content agents for online stores. Automate follow-ups, cart recovery, and publishing.',
    color: '#00cec9',
  },
  {
    name: 'Realtors & Real Estate',
    slug: 'real-estate',
    icon: '🏠',
    desc: 'Lead tracking, client communication, and content on autopilot for solo agents and teams.',
    color: '#6c5ce7',
  },
  {
    name: 'Law Firms & Attorneys',
    slug: 'law-firms',
    icon: '⚖️',
    desc: 'Intake automation, CRM, and document workflows for boutique law firms.',
    color: '#0984e3',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(108,92,231,0.1) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">Services</p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-heading)' }}
          >
            What your AI team<br />
            <span className="gradient-text">actually does.</span>
          </h1>
          <p className="text-lg text-[#5B5B7A] max-w-2xl mx-auto">
            Four capability pillars. All of them roles on your executive team.
            Not standalone products — an integrated team that runs your business.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Capability Pillars — Reframed */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">Capabilities</p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-heading)' }}
            >
              Four roles. One team.
            </h2>
          </div>

          <div className="space-y-16">
            {capabilities.map((cap) => (
              <div key={cap.name} className="glass card-glow p-10 rounded-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  {/* Left: icon + existing content */}
                  <div>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
                      style={{ background: `${cap.color}18`, border: `1px solid ${cap.color}40` }}
                    >
                      <cap.Icon size={24} color={cap.color} />
                    </div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-1"
                      style={{ color: cap.color }}
                    >
                      {cap.role}
                    </p>
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-heading)' }}
                    >
                      {cap.name}
                    </h3>
                    <p className="text-sm text-[#5B5B7A] leading-relaxed mb-6">{cap.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {cap.examples.map((ex) => (
                        <span
                          key={ex}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{
                            background: `${cap.color}12`,
                            border: `1px solid ${cap.color}30`,
                            color: cap.color,
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: reframe pattern — hidden until Brian fills placeholder copy */}
                  {/* TODO: Brian to fill before re-enable */}
                  {cap.h2 !== '[BRIAN-FOLLOWUP]' && (
                  <div className="border-l border-white/5 pl-10">
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: cap.color }}
                    >
                      {cap.eyebrow}
                    </p>
                    <h4
                      className="text-xl font-bold mb-2"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-heading)' }}
                    >
                      {cap.h2}
                    </h4>
                    <p className="text-sm text-[#5B5B7A] mb-4">{cap.subhead}</p>
                    <p className="text-sm text-[#5B5B7A] leading-relaxed mb-8">{cap.body}</p>
                    <OpenChatButton className="inline-block border border-[#6c5ce7]/40 text-[#a29bfe] hover:border-[#6c5ce7] hover:bg-[#6c5ce7]/10 py-2.5 px-6 rounded-lg text-sm font-semibold transition-all bg-transparent cursor-pointer">
                      Chat with Zyph
                    </OpenChatButton>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Industries */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">Industries</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Built for your industry.<br />
              <span className="gradient-text">Not generic software.</span>
            </h2>
            <p className="text-[#5B5B7A] max-w-xl mx-auto">
              Each vertical gets a team tuned to how that industry actually works — not a one-size-fits-all AI tool.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {niches.map((niche) => (
              <Link
                key={niche.slug}
                href={`/services/${niche.slug}`}
                className="glass card-glow p-7 flex flex-col group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
                  style={{ background: `${niche.color}20`, border: `1px solid ${niche.color}40` }}
                >
                  {niche.icon}
                </div>
                <h3
                  className="text-lg font-semibold text-white mb-2 group-hover:text-[#a29bfe] transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {niche.name}
                </h3>
                <p className="text-sm text-[#5B5B7A] leading-relaxed flex-1">{niche.desc}</p>
                <span className="text-[#6c5ce7] group-hover:translate-x-1 transition-transform text-lg mt-4">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-heading)' }}
          >
            Ready to build your team?
          </h2>
          <p className="text-[#5B5B7A] mb-10">
            Starter and Pro are self-serve — sign up and we&apos;ll have your team running this week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenChatButton className="btn-primary text-base px-10 py-4">
              Chat with Zyph
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
