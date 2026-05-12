'use client'

import { useState } from 'react'
import Link from 'next/link'

const tools = [
  {
    name: 'Fathom',
    url: 'https://fathom.video',
    desc: 'Auto-records and summarizes every meeting. Stops you from taking notes. Saves 30+ minutes per call.',
    saves: '~2 hrs/wk',
    free: true,
  },
  {
    name: 'ChatGPT (free)',
    url: 'https://chat.openai.com',
    desc: 'The Swiss Army knife. Write emails, draft proposals, answer questions, think through decisions. Free tier is plenty to start.',
    saves: '~3 hrs/wk',
    free: true,
  },
  {
    name: 'Calendly',
    url: 'https://calendly.com',
    desc: 'Kills the back-and-forth to book meetings. Share a link, they pick a time, it lands on your calendar.',
    saves: '~1 hr/wk',
    free: true,
  },
  {
    name: 'Loom',
    url: 'https://loom.com',
    desc: 'Record a quick video instead of writing a long email. Faster to make, faster to understand.',
    saves: '~1 hr/wk',
    free: true,
  },
  {
    name: 'Wave',
    url: 'https://waveapps.com',
    desc: 'Free invoicing and accounting for small service businesses. Sends invoices, tracks payments, does the basics.',
    saves: '~2 hrs/wk',
    free: true,
  },
  {
    name: 'Canva',
    url: 'https://canva.com',
    desc: 'Design anything without a designer. Proposals, social posts, flyers. Free tier covers 95% of use cases.',
    saves: '~1 hr/wk',
    free: true,
  },
  {
    name: 'Google Gemini',
    url: 'https://gemini.google.com',
    desc: 'Google\'s free AI assistant. Reads your Gmail, summarizes docs, answers business questions. Already in your Google account.',
    saves: '~2 hrs/wk',
    free: true,
  },
  {
    name: 'HubSpot CRM (free)',
    url: 'https://hubspot.com/crm',
    desc: 'Free CRM that tracks your leads, clients, and deals. Stops things from falling through the cracks.',
    saves: '~1 hr/wk',
    free: true,
  },
  {
    name: 'Otter.ai',
    url: 'https://otter.ai',
    desc: 'Transcribes meetings, phone calls, voice memos in real time. Free tier gives you 300 minutes/month.',
    saves: '~1 hr/wk',
    free: true,
  },
  {
    name: 'Grammarly',
    url: 'https://grammarly.com',
    desc: 'Makes every email, proposal, and message clearer and more professional. Works in Chrome, Word, Gmail — everywhere you write.',
    saves: '~30 min/wk',
    free: true,
  },
]

const PDF_URL = '/zero-payroll-starter-kit.pdf'

export default function StarterKitPage() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/starter-kit-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Try again.')
        setStatus('error')
      } else {
        setStatus('success')
        // Trigger download after successful DB capture
        const a = document.createElement('a')
        a.href = PDF_URL
        a.download = 'zero-payroll-starter-kit.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
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
          <p className="eyebrow mb-4">Zero Payroll · Free Resource</p>
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
            The $0 AI Starter Kit
            <br />
            <span className="gradient-text">for service businesses.</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Ten free AI tools that actually save time for contractors, consultants, and service
            operators. One sentence each. No fluff. No credit card required — for any of them.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Honest note: these are free tools, not magic. Each one does one job well. Together they buy back 10+ hours a week.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Email capture hero CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-12 relative overflow-hidden"
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
              <h2
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  fontWeight: 500,
                  color: 'var(--text-heading)',
                  letterSpacing: '-0.01em',
                }}
              >
                Get the PDF — it&apos;s free.
              </h2>
              <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Drop your name and email. We&apos;ll send you the clean, printable one-pager you can
                keep at your desk and start using today.
              </p>

              {status === 'success' ? (
                <div>
                  <div
                    className="py-4 px-6 rounded-xl text-sm font-medium mb-4"
                    style={{
                      background: 'rgba(87,161,72,0.10)',
                      border: '1px solid rgba(87,161,72,0.25)',
                      color: '#3A7A32',
                    }}
                  >
                    Download starting — check your downloads folder.
                  </div>
                  <a
                    href={PDF_URL}
                    download="zero-payroll-starter-kit.pdf"
                    className="btn-secondary w-full py-3 text-sm text-center inline-block"
                    style={{ textDecoration: 'none' }}
                  >
                    Download again →
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-body)',
                        fontFamily: 'var(--font-body)',
                      }}
                    />
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
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full py-3.5 text-sm"
                  >
                    {status === 'loading' ? 'Sending…' : 'Get the PDF →'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="mt-3 text-sm" style={{ color: 'var(--accent)' }}>
                  {errorMsg}
                </p>
              )}

              <p className="mt-5 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                Or{' '}
                <a
                  href={PDF_URL}
                  download="zero-payroll-starter-kit.pdf"
                  style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                >
                  download directly
                </a>{' '}
                — no email required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Tool list */}
      <section className="py-20 px-4 sm:px-6">
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
              The 10 tools.
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              All free. All proven. All worth 10 minutes to set up.
            </p>
          </div>

          <div className="space-y-4" data-reveal-group>
            {tools.map((tool, i) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-5 p-6 rounded-2xl card-glow transition-all"
                data-reveal
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                  textDecoration: 'none',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm"
                  style={{
                    background: 'var(--accent-subtle)',
                    border: '1px solid rgba(176,74,40,0.18)',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <h3
                      className="font-semibold text-base group-hover:text-[var(--accent)] transition-colors"
                      style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-body)' }}
                    >
                      {tool.name}
                    </h3>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{
                        background: 'rgba(87,161,72,0.10)',
                        color: '#3A7A32',
                        border: '1px solid rgba(87,161,72,0.20)',
                      }}
                    >
                      Free
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {tool.desc}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p
                    className="text-xs font-semibold whitespace-nowrap"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                  >
                    {tool.saves}
                  </p>
                  <span
                    className="text-sm group-hover:translate-x-1 transition-transform inline-block mt-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
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
            Ready to go deeper?
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Find out which level you&apos;re at — then get the tools, content, and next step that
            match exactly where you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/level-assessment" className="btn-primary text-sm px-8 py-3.5 inline-block">
              Take the Level Assessment →
            </Link>
            <Link href="/resources" className="btn-secondary text-sm px-8 py-3.5 inline-block">
              See All Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
