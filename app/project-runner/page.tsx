'use client'

import { useState } from 'react'
import Link from 'next/link'

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
    a: "Buildertrend, Jobber, Procore want you to log in. Project Runner doesn't. They sell software you operate. We sell a COO that operates it for you — drafts the proposal, follows up with the client, flags the schedule slip before the GC notices, runs the Friday review while you're with your kid.",
  },
  {
    q: 'Do I need to bring my own AI subscription?',
    a: 'Tier-dependent. Starter is BYO Claude Desktop. Pro and above are Zyph-hosted.',
  },
  {
    q: 'How long is onboarding?',
    a: 'Starter: same day. Pro: a few days. Operator/Command: 2–4 weeks of fine-tuning to your business.',
  },
  {
    q: 'What integrations do you support today?',
    a: 'Gmail, QuickBooks Online, Google Drive/Calendar are the priority lane. HubSpot free tier next. More on request.',
  },
]

export default function ProjectRunnerPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist/project-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Try again or email us.')
      }
    } catch {
      setError('Network error. Try again or email contact@zyphlabs.com')
    } finally {
      setLoading(false)
    }
  }

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

          {/* Waitlist form */}
          <div className="max-w-md mb-6">
            {submitted ? (
              <div className="glass rounded-xl p-6 border border-[#00cec9]/30 text-center">
                <div className="text-3xl mb-3">🎉</div>
                <p className="text-white font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  You&apos;re on the list!
                </p>
                <p className="text-[#8888aa] text-sm mt-1">We&apos;ll reach out when you&apos;re up.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#8888aa] text-sm focus:outline-none focus:border-[#00cec9]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-sm px-6 py-3 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            )}
            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          </div>

          <Link href="/pricing" className="btn-secondary inline-block text-base px-8 py-4">
            See Pricing →
          </Link>
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
            Start solo or go fully hosted. Upgrade when your project load grows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="glass p-8 text-left">
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project Runner Starter
              </h3>
              <p className="text-sm text-[#8888aa] mb-1">Bring your own Claude Desktop. Best for solo operators.</p>
              <p className="text-xs text-[#555577] mb-4 italic">Requires Claude Pro or Max (~$100–200/mo, billed by Anthropic).</p>
              <p className="text-[#a29bfe] font-bold text-xl mb-1">$129<span className="text-sm font-normal">/mo</span></p>
              <p className="text-xs text-[#555577] mb-6">$0 setup</p>
              <Link href="/questionnaire" className="btn-secondary text-sm px-6 py-3 inline-block w-full text-center">
                Get Started
              </Link>
            </div>
            <div className="glass p-8 text-left border-[#6c5ce7]/50 shadow-[0_0_30px_rgba(108,92,231,0.15)]">
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project Runner Pro
              </h3>
              <p className="text-sm text-[#8888aa] mb-4">Hosted, ready to go. Best for owners running 5–20 active projects.</p>
              <p className="text-[#a29bfe] font-bold text-xl mb-1">$449<span className="text-sm font-normal">/mo</span></p>
              <p className="text-xs text-[#555577] mb-6">$499 setup</p>
              <Link href="/questionnaire" className="btn-primary text-sm px-6 py-3 inline-block w-full text-center">
                Get Started
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
