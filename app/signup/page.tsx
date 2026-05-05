'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const tierLabels: Record<string, string> = {
  starter: 'Project Runner Starter — $129/mo',
  pro: 'Project Runner Pro — $449/mo',
}

function SignupForm() {
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') ?? 'starter'
  const tierLabel = tierLabels[tier] ?? 'Project Runner Starter — $129/mo'

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
        body: JSON.stringify({ email, tier }),
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00cec9]/20 to-[#6c5ce7]/20 border border-[#00cec9]/30 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl text-[#00cec9]">✓</span>
          </div>
          <p className="text-[#00cec9] text-sm font-semibold uppercase tracking-widest mb-3">You&apos;re in</p>
          <h1
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            We&apos;ll reach out within 24h.
          </h1>
          <p className="text-[#8888aa] mb-8">
            Checkout is coming this week. In the meantime, we&apos;ll get your onboarding started — keep an eye on your inbox.
          </p>
          <Link href="/" className="btn-secondary inline-block px-8 py-3">
            ← Back to Zyph Labs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(108,92,231,0.12) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-xl mx-auto text-center relative z-10">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            Get Started
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Checkout coming<br />
            <span className="gradient-text">this week.</span>
          </h1>
          <p className="text-[#8888aa] max-w-lg mx-auto mb-2">
            Drop your email and we&apos;ll reach out within 24h to onboard you.
          </p>
          <p className="text-[#a29bfe] text-sm font-medium">
            Selected tier: {tierLabel}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-8 pb-24 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="glass p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Your email address <span className="text-[#6c5ce7]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@yourbusiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Notify Me When Ready →'}
              </button>
            </form>

            <p className="text-center text-xs text-[#444466] mt-6">
              Questions?{' '}
              <a href="mailto:contact@zyphlabs.com" className="text-[#a29bfe] hover:text-white transition-colors">
                contact@zyphlabs.com
              </a>
            </p>
            <p className="text-center text-xs text-[#444466] mt-3">
              Want to discuss your needs first?{' '}
              <Link href="/questionnaire" className="text-[#a29bfe] hover:text-white transition-colors underline underline-offset-2">
                Talk to us
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-[#8888aa]">Loading...</p></div>}>
      <SignupForm />
    </Suspense>
  )
}
