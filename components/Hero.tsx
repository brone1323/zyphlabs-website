'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const glow = glowRef.current
    if (!hero || !glow) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const noHover = window.matchMedia('(hover: none)')

    if (mq.matches) return

    if (noHover.matches) {
      // Auto-drift for touch: gentle sine/cosine loop, 12s cycle
      let angle = 0
      const id = setInterval(() => {
        angle += (2 * Math.PI) / 120 // 120 ticks × 100ms = 12s cycle
        const x = 50 + 18 * Math.cos(angle)
        const y = 35 + 12 * Math.sin(angle * 0.7)
        glow.style.background = `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(199,101,72,0.10) 0%, transparent 65%)`
      }, 100)
      return () => clearInterval(id)
    }

    const onMouse = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1)
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(199,101,72,0.10) 0%, transparent 65%)`
    }

    hero.addEventListener('mousemove', onMouse)
    return () => hero.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center"
      style={{ overflowX: 'clip' }}
    >
      {/* Cursor-aware warm glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(199,101,72,0.10) 0%, transparent 65%)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Subtle warm grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true" />

      {/* Content — asymmetric 2-column */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 lg:gap-16 items-center">

          {/* LEFT — headline + CTAs */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-8 animate-fadeIn"
              style={{
                borderColor: 'var(--border-accent)',
                background: 'var(--accent-subtle)',
                color: 'var(--accent)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              For SMB owners ready to stop running on chaos
            </div>

            {/* H1 */}
            <h1
              className="mb-6 animate-fadeInUp"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 6.5vw, 88px)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                lineHeight: 1.08,
                color: 'var(--text-heading)',
              }}
            >
              Run your business<br />
              on{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                an AI Company.
              </em>
            </h1>

            {/* Subhead */}
            <p
              className="mb-3 animate-fadeInUp delay-200"
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: 'var(--text-muted)',
                maxWidth: '54ch',
              }}
            >
              An executive team to decide. An office team to do the work.
              You run the company.
            </p>

            {/* Price — mono accent */}
            <p
              className="mb-10 animate-fadeInUp delay-200"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--accent)',
              }}
            >
              from $129/mo
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-300">
              <Link href="/questionnaire" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
                Start My Free Assessment
              </Link>
              <Link href="/project-runner" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
                See Project Runner →
              </Link>
              <Link
                href="/pricing"
                className="text-sm px-4 py-4 w-full sm:w-auto flex items-center justify-center sm:justify-start transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-heading)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                View Pricing →
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-12 animate-fadeInUp delay-400">
              {[
                'Always-on AI team',
                'Email · CRM · Projects · Strategy',
                'Fractional C-suite pricing',
                'Service-business ready',
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span style={{ color: 'var(--accent)', fontSize: '15px' }}>✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — morning brief card, bleeds 80px past container */}
          <div className="lg:-mr-20 animate-fadeIn delay-300">
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
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-warm)',
                }}
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
                    <span style={{ color: 'var(--border)', opacity: 0.6 }}> &lt;coo@yourcompany.ai&gt;</span>
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
                className="px-6 py-7 text-sm leading-7"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-body)' }}
              >
                <p className="mb-5" style={{ color: 'var(--text-muted)' }}>Good morning. Three things on your desk today.</p>

                <div className="space-y-5">
                  <div>
                    <p style={{ color: 'var(--text-heading)', fontWeight: 500 }} className="mb-1">
                      1. Henderson reno — framing crew is 1 day behind.
                    </p>
                    <p
                      className="pl-4 text-xs leading-6"
                      style={{
                        color: 'var(--text-muted)',
                        borderLeft: '2px solid var(--accent-subtle)',
                        borderLeftColor: 'var(--accent)',
                        borderLeftWidth: '2px',
                        paddingLeft: '12px',
                        opacity: 0.8,
                      }}
                    >
                      Lumber delivery slipped Friday. Rebooked Tuesday<br />
                      7am, drywall pushed to Monday. No client-facing slip.
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
                        opacity: 0.8,
                      }}
                    >
                      Reminder #2 sent Friday. No reply by EOD → phone<br />
                      call from you. Draft talking points attached.
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
                        opacity: 0.8,
                      }}
                    >
                      CRM scored 78 (qualified). Strategist drafted the<br />
                      pitch angle. On your dashboard.
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Nothing else needs you today. I&apos;m running the rest.
                </p>
                <p className="mt-3 text-xs" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                  — Project Runner
                </p>
              </div>
            </div>

            <p
              className="mt-3 text-xs text-center"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              Mon, Apr 27 · 7:04 AM · delivered while you slept
            </p>
          </div>

        </div>
      </div>

      {/* Bottom fade — matches warm bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
          zIndex: 2,
        }}
        aria-hidden="true"
      />
    </section>
  )
}
