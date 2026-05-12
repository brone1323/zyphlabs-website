import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources — Zero Payroll by Zyph Labs',
  description:
    'Free AI tools, guides, and community for service business owners — from Zero Payroll by Zyph Labs.',
  openGraph: {
    title: 'Resources — Zero Payroll by Zyph Labs',
    description:
      'Free AI tools, guides, and community for service business owners.',
  },
}

const resources = [
  {
    eyebrow: 'Newsletter',
    title: 'Read Zero Payroll',
    desc: 'AI tools and systems for service businesses — every Tuesday. Free forever.',
    cta: 'Subscribe on Substack →',
    href: 'https://zeropayroll.substack.com',
    external: true,
    color: 'var(--accent)',
    icon: '✉',
  },
  {
    eyebrow: 'Free Download',
    title: '$0 AI Starter Kit',
    desc: 'Ten free AI tools for service operators. One sentence each. Download the PDF and start today.',
    cta: 'Get the Starter Kit →',
    href: '/starter-kit',
    external: false,
    color: '#57A148',
    icon: '📄',
  },
  {
    eyebrow: 'Self-Assessment',
    title: 'Find Your AI Level',
    desc: 'Ten questions. Instant result. Know exactly where you stand and what to do next.',
    cta: 'Take the Assessment →',
    href: '/level-assessment',
    external: false,
    color: '#C69A36',
    icon: '🎯',
  },
  {
    eyebrow: 'High-Touch',
    title: 'Book a Level 4 Conversation',
    desc: 'No pitch. Just a real look at what your operation could run like with a full AI team behind it.',
    cta: 'Book a Call →',
    href: '/book',
    external: false,
    color: '#4F46E5',
    icon: '📅',
  },
  {
    eyebrow: 'Community',
    title: 'Join the Community',
    desc: 'Service business owners figuring out AI — together. Real questions, real answers, no pitches.',
    cta: 'Open Facebook group →',
    href: 'https://www.facebook.com/groups/25740721172271075/',
    external: true,
    color: '#1877F2',
    icon: '🤝',
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(176,74,40,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">Zero Payroll</p>
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
            Everything free,
            <br />
            <span className="gradient-text">in one place.</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Tools, guides, community, and conversations — for service business owners who want to
            run leaner without burning out.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Resource cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-5" data-reveal-group>
          {resources.map((r) => {
            const cardContent = (
              <div
                className="group flex items-start gap-6 p-7 rounded-2xl card-glow transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `${r.color === 'var(--accent)' || r.color === 'var(--text-muted)' ? 'var(--accent-subtle)' : r.color + '15'}`,
                    border: `1px solid ${r.color === 'var(--accent)' || r.color === 'var(--text-muted)' ? 'rgba(176,74,40,0.18)' : r.color + '30'}`,
                  }}
                >
                  <span aria-hidden="true">{r.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: r.color === 'var(--text-muted)' ? 'var(--text-muted)' : r.color }}
                  >
                    {r.eyebrow}
                  </p>
                  <h2
                    className="text-xl font-semibold mb-2"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-heading)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {r.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                    {r.desc}
                  </p>
                  {r.href ? (
                    <span
                      className="text-sm font-semibold group-hover:underline"
                      style={{ color: r.color === 'var(--text-muted)' ? 'var(--text-muted)' : r.color }}
                    >
                      {r.cta}
                    </span>
                  ) : (
                    <span
                      className="text-sm font-semibold italic"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {r.cta}
                    </span>
                  )}
                </div>
              </div>
            )

            if (!r.href) {
              return (
                <div key={r.title} data-reveal>
                  {cardContent}
                </div>
              )
            }

            if (r.external) {
              return (
                <a
                  key={r.title}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  {cardContent}
                </a>
              )
            }

            return (
              <Link key={r.title} href={r.href} data-reveal style={{ display: 'block' }}>
                {cardContent}
              </Link>
            )
          })}
        </div>
      </section>

      <div className="section-divider" />

      {/* Newsletter CTA */}
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
            Start with the newsletter.
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Free, every Tuesday. No noise — just one AI tool, system, or shortcut for service
            business owners.
          </p>
          <a
            href="https://zeropayroll.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-8 py-3.5 inline-block"
          >
            Subscribe to Zero Payroll →
          </a>
        </div>
      </section>
    </div>
  )
}
