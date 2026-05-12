'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ZapIcon } from '@/components/icons'

export default function ProposalDrafterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/proposal-drafter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Try again.')
      setStatus('error')
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6" data-reveal>
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
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
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-heading)',
                }}
              >
                AI Proposal Drafter for Contractors
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Five fields in. A polished, branded proposal out. 30 seconds. Get early access when it launches.
              </p>

              {status === 'success' ? (
                <div
                  className="py-3 px-5 rounded-lg text-sm font-medium"
                  style={{
                    background: 'rgba(87,161,72,0.10)',
                    border: '1px solid rgba(87,161,72,0.25)',
                    color: '#3A7A32',
                  }}
                >
                  You&apos;re on the early access list. We&apos;ll email you the moment it&apos;s live.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                    style={{
                      background: 'var(--bg-warm)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-body)',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary text-sm px-6 py-2.5 whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Saving…' : 'Get Early Access →'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>
                  {errorMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
