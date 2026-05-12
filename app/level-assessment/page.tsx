'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export default function LevelAssessmentPage() {
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
          <p className="eyebrow mb-4">Zero Payroll · Level Assessment</p>
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
            Find your AI level.
            <br />
            <span className="gradient-text">Start exactly where you are.</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Not every business is at the same starting point with AI. This 10-question assessment
            places you at Level 1–4 — then points you to the exact tools, content, and next step
            that match where you are right now.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Takes about 3 minutes. Results are instant.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Levels overview */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 500,
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
              }}
            >
              Four levels. One clear path.
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Where you land tells us what you need next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" data-reveal-group>
            {[
              {
                level: 'Level 1',
                label: 'AI Curious',
                desc: 'You\'ve heard the hype but haven\'t committed. We\'ll give you 10 free tools that work today — no tech skills needed.',
                outcome: '$0 Starter Kit + community invite',
                color: '#57A148',
              },
              {
                level: 'Level 2',
                label: 'AI Experimenter',
                desc: 'You\'ve tried a tool or two. Now you need a system. Level 2 content shows you how to wire them together.',
                outcome: 'Level 2 guide + workflow templates',
                color: '#C69A36',
              },
              {
                level: 'Level 3',
                label: 'AI Operator',
                desc: 'You\'re running AI in your business already. We\'ll show you where to go deeper — and introduce what Zyph Labs can build for you.',
                outcome: 'Level 3 content + soft Zyph Labs intro',
                color: 'var(--accent)',
              },
              {
                level: 'Level 4',
                label: 'AI-Native',
                desc: 'You\'re ready for a fully AI-run operation. Let\'s talk about what your business looks like when the AI team takes the wheel.',
                outcome: 'Book a Level 4 Conversation',
                color: '#4F46E5',
              },
            ].map((item) => (
              <div
                key={item.level}
                className="p-7 rounded-2xl card-glow"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                      border: `1px solid ${item.color}30`,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {item.level}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-body)' }}
                  >
                    {item.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: item.color }}
                >
                  → {item.outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Assessment placeholder + email capture */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
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
            <div className="relative">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{
                  background: 'var(--accent-subtle)',
                  border: '1px solid rgba(176,74,40,0.25)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Assessment — Coming Soon
              </div>

              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 500,
                  color: 'var(--text-heading)',
                  letterSpacing: '-0.01em',
                }}
              >
                The full assessment is almost ready.
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Ten questions, instant level result, matched resources. Drop your email and we&apos;ll
                send you the link the moment it goes live — plus your free Level 1 starter kit in
                the meantime.
              </p>

              {status === 'success' ? (
                <div
                  className="py-4 px-6 rounded-xl text-sm font-medium"
                  style={{
                    background: 'rgba(87,161,72,0.10)',
                    border: '1px solid rgba(87,161,72,0.25)',
                    color: '#3A7A32',
                  }}
                >
                  You&apos;re on the list. We&apos;ll email you the moment it&apos;s live.
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
                    {status === 'loading' ? 'Saving…' : 'Notify Me'}
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

          <p className="mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Already know you&apos;re at Level 4?{' '}
            <Link href="/book" className="link-accent underline underline-offset-2">
              Skip the assessment and book a call →
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
