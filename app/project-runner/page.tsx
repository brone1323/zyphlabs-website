import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Runner — AI Project, Proposal & Financial Command Center | Zyph Labs',
  description:
    'Project Runner is the AI-powered project, proposal, and financial command center for service contractors. Your inbox fills it; your projects run themselves.',
}

const features = [
  {
    icon: '📄',
    title: 'AI Proposal Drafting',
    desc: 'Generate polished, branded proposals from a quick description, file upload, or RFP parsing. Stop typing from scratch.',
  },
  {
    icon: '📊',
    title: 'Active Project Dashboard',
    desc: 'Every project at a glance — status, revenue, costs, outstanding items. Real numbers, updated automatically.',
  },
  {
    icon: '👥',
    title: 'Crew & Supplier Directory',
    desc: 'Your people and partners in one place. Assign crew to jobs, track supplier contacts and status, all linked to your projects.',
  },
  {
    icon: '🔄',
    title: 'Automated Change Order Requests',
    desc: 'Scope creep happens. Project Runner catches it and drafts change order requests before you even think to ask.',
  },
  {
    icon: '📥',
    title: 'AI-Monitored Inbox',
    desc: 'Your email feeds your projects. Project Runner reads incoming messages and updates project status, flags issues, and drafts replies.',
  },
  {
    icon: '🔗',
    title: 'Integrations Built In',
    desc: 'Gmail, Outlook, QuickBooks, Google Drive, OneDrive. Connects to the tools you already use — no new apps to learn.',
  },
]

const faq = [
  {
    q: 'How is this different from Buildertrend, Jobber, or Procore?',
    a: '[BRIAN-CONFIRM] — Kill-shot differentiator to be provided by Brian at the 8 AM strategy session. Short answer: Project Runner is AI-native and runs on your existing Claude + email workflow, not a bloated SaaS platform that requires retraining your whole team.',
  },
  {
    q: 'Do I need to bring my own AI subscription?',
    a: 'It depends on your tier. Project Runner Starter requires your own Claude Desktop (BYO). Project Runner Pro and above are Zyph-hosted — we handle the AI infrastructure, you just use the product.',
  },
  {
    q: 'How long is onboarding?',
    a: 'Most operators are running within one week. We configure the system to your business during a white-glove onboarding session — your projects, your workflow, your clients.',
  },
  {
    q: 'What integrations do you support today?',
    a: 'Gmail and Outlook for email, QuickBooks for financials, Google Drive and OneDrive for documents. Additional connectors on the roadmap — let us know what you need.',
  },
]

export default function ProjectRunnerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(0,206,201,0.12) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6">
            <Link href="/" className="text-[#8888aa] text-sm hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00cec9]/10 border border-[#00cec9]/30 text-[#00cec9] text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00cec9] animate-pulse" />
            Launching this week
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            quit typing and run<br />
            <span className="gradient-text">these projects.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mb-10 leading-relaxed">
            Project Runner is the AI-powered project, proposal, and financial command center
            for service contractors. Your inbox fills it; your projects run themselves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/questionnaire" className="btn-primary inline-block text-base px-8 py-4">
              Join Waitlist
            </Link>
            <Link href="/pricing" className="btn-secondary inline-block text-base px-8 py-4">
              See Pricing →
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Feature Blocks */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
              What It Does
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Everything your COO would do.
              <br />
              <span className="gradient-text">Running 24/7.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass card-glow p-7">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3
                  className="text-lg font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing Teaser */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Two tiers. BYO or hosted.
          </h2>
          <p className="text-[#8888aa] mb-12 max-w-xl mx-auto">
            Pricing is being finalized at our 8 AM strategy session today. Join the waitlist to be first to know.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="glass p-8 text-left">
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project Runner Starter
              </h3>
              <p className="text-sm text-[#8888aa] mb-4">Bring your own Claude Desktop. Best for solo operators.</p>
              <p className="text-[#a29bfe] font-bold mb-6">Contact for pricing</p>
              <Link href="/questionnaire" className="btn-secondary text-sm px-6 py-3 inline-block w-full text-center">
                Join Waitlist
              </Link>
            </div>
            <div className="glass p-8 text-left border-[#6c5ce7]/50 shadow-[0_0_30px_rgba(108,92,231,0.15)]">
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project Runner Pro
              </h3>
              <p className="text-sm text-[#8888aa] mb-4">Hosted, ready to go. Best for owners running 5–20 active projects.</p>
              <p className="text-[#a29bfe] font-bold mb-6">Contact for pricing</p>
              <Link href="/questionnaire" className="btn-primary text-sm px-6 py-3 inline-block w-full text-center">
                Join Waitlist
              </Link>
            </div>
          </div>

          <Link href="/pricing" className="text-sm text-[#a29bfe] hover:text-white transition-colors">
            See all four tiers including OpenClaw Operator & Command →
          </Link>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Frequently asked questions
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

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to run your projects on autopilot?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Join the waitlist. We&apos;re onboarding service contractors now — construction, electrical, residential, commercial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/questionnaire" className="btn-primary text-base px-10 py-4 inline-block">
              Join Waitlist →
            </Link>
            <Link href="/pricing" className="btn-secondary text-base px-10 py-4 inline-block">
              View Full Pricing
            </Link>
          </div>
          <p className="text-[#444466] text-sm mt-8">
            Questions? Email{' '}
            <span className="text-[#a29bfe]">contact@zyphlabs.com</span>
          </p>
        </div>
      </section>
    </div>
  )
}
