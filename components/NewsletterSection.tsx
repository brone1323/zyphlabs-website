// Server component — newsletter subscribe links to Substack (no client state needed)
import Link from 'next/link'

export default function NewsletterSection() {
  return (
    <section className="py-20 px-4 sm:px-6" data-reveal>
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-3xl p-10 md:p-14 relative overflow-hidden text-center"
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
            <p className="eyebrow mb-4">Zero Payroll Newsletter</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 38px)',
                fontWeight: 500,
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              Get the weekly Zero Payroll newsletter
            </h2>
            <p
              className="text-base leading-relaxed max-w-xl mx-auto mb-8"
              style={{ color: 'var(--text-muted)' }}
            >
              AI tools and systems for service businesses — free, every Tuesday.
            </p>
            <a
              href="https://zeropayroll.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-8 py-3.5 inline-block"
            >
              Subscribe →
            </a>
            <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              Free. No spam. Unsubscribe any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
