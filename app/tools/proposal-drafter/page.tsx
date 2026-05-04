'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProposalDrafterPage() {
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
      const res = await fetch('/api/waitlist/proposal-drafter', {
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
      <section className="relative pt-28 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(0,206,201,0.1) 0%, transparent 65%)',
          }}
        />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="mb-6">
            <Link href="/" className="text-[#8888aa] text-sm hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>

          {/* Launch badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00cec9]/10 border border-[#00cec9]/30 text-[#00cec9] text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00cec9] animate-pulse" />
            Launching this week
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            AI Proposal Drafter
            <br />
            <span className="gradient-text">for Contractors</span>
            <span className="text-[#00cec9]"> — Free</span>
          </h1>

          <p className="text-lg text-[#8888aa] max-w-xl mx-auto mb-12 leading-relaxed">
            Five fields in. A polished, branded proposal out. 30 seconds.
            Built for service contractors who hate typing.
          </p>

          {/* Email capture */}
          <div className="glass rounded-2xl p-8 max-w-lg mx-auto border border-[#00cec9]/20">
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">🎉</div>
                <h3
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  You&apos;re on the list!
                </h3>
                <p className="text-[#8888aa] text-sm">
                  We&apos;ll email you the moment it&apos;s live. First to know, first to use it.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-white font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Get notified when it&apos;s live →
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
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
                    {loading ? 'Saving...' : 'Notify Me'}
                  </button>
                </div>
                {error && (
                  <p className="text-red-400 text-xs mt-3">{error}</p>
                )}
                <p className="text-xs text-[#555577] mt-3">No spam. One email when it launches.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How it works preview */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Five fields. Thirty seconds. Done.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Fill 5 Fields', desc: 'Client name, project type, scope summary, your company name, timeline. That\'s it.' },
              { step: '02', icon: '⚡', title: 'AI Drafts It', desc: 'Our AI generates a polished, professional proposal in 30 seconds. Formatted, branded, ready to send.' },
              { step: '03', icon: '📤', title: 'Send & Win', desc: 'Download as PDF or copy to your email. No more blank-page paralysis on every new job.' },
            ].map((item) => (
              <div key={item.step} className="glass p-7 text-center">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-[#6c5ce7] mb-2">{item.step}</div>
                <h3
                  className="text-base font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Connection to Project Runner */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-8 border border-[#6c5ce7]/20">
            <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">Want More?</p>
            <h3
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              This is just the preview of Project Runner.
            </h3>
            <p className="text-[#8888aa] leading-relaxed mb-6">
              The free Proposal Drafter is the 30-second teaser. Project Runner is the full AI COO —
              proposals, active projects, billing, change orders, and an inbox that updates your jobs automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/project-runner" className="btn-primary text-sm px-7 py-3 inline-block">
                See Project Runner →
              </Link>
              <Link href="/pricing" className="btn-secondary text-sm px-7 py-3 inline-block">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
