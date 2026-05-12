'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BookPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/level-assessment-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(176,74,40,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">Level 4 · High-Touch</p>
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 500,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            See what Level 4 looks like
            <br />
            <span className="gradient-text">for your business.</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            No sales pitch. No demo deck. Just a real, honest conversation about what your operation
            could look like when an AI team runs the back office.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* What to expect */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontWeight: 500,
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
              }}
            >
              What happens on the call.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" data-reveal-group>
            {[
              {
                step: '01',
                title: 'You describe your operation.',
                desc: 'What you run, how many people, what eats your week. We listen — we don\'t interrupt with features.',
              },
              {
                step: '02',
                title: 'We map the AI opportunity.',
                desc: 'Where agents can absorb the manual work. Which roles are worth building first. What\'s possible in 30 days.',
              },
              {
                step: '03',
                title: 'You decide.',
                desc: 'If it\'s a fit, we talk about what building it looks like. If it\'s not — we\'ll tell you honestly and point you to what is.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-7 rounded-2xl card-glow"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p
                  className="text-3xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.35 }}
                >
                  {item.step}
                </p>
                <h3
                  className="font-semibold text-base mb-3"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Calendly placeholder */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
            style={{
              background: 'var(--bg-warm)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(176,74,40,0.07) 0%, transparent 60%)',
              }}
            />
            <div className="relative text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{
                  background: 'var(--accent-subtle)',
                  border: '1px solid rgba(176,74,40,0.25)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Booking · Coming Soon
              </div>

              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(20px, 2.5vw, 28px)',
                  fontWeight: 500,
                  color: 'var(--text-heading)',
                  letterSpacing: '-0.01em',
                }}
              >
                Calendly booking widget loading here shortly.
              </h2>
              <p className="leading-relaxed mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                While we wire up the calendar, drop your email below. We&apos;ll reach out within
                one business day to get something on the calendar.
              </p>

              {/* Placeholder visual for Calendly embed */}
              <div
                className="rounded-xl mb-8 flex items-center justify-center"
                style={{
                  height: '120px',
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                [ Calendly embed — coming soon ]
              </div>

              {status === 'success' ? (
                <div
                  className="py-4 px-6 rounded-xl text-sm font-medium"
                  style={{
                    background: 'rgba(87,161,72,0.10)',
                    border: '1px solid rgba(87,161,72,0.25)',
                    color: '#3A7A32',
                  }}
                >
                  Got it. Expect an email from us within one business day.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-body)',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary text-sm px-7 py-3 whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Sending…' : 'Book a Call →'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="mt-3 text-sm" style={{ color: 'var(--accent)' }}>
                  {errorMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Not ready yet section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 500,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            Not sure you&apos;re at Level 4 yet?
          </h2>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Take the 3-minute assessment. It places you at the right level and points you to the
            right next step — whether that&apos;s a free tool or this conversation.
          </p>
          <Link href="/level-assessment" className="btn-secondary text-sm px-8 py-3.5 inline-block">
            Take the Level Assessment →
          </Link>
        </div>
      </section>
    </div>
  )
}
