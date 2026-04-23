import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ALL_DEMOS, getDemoBySlug } from '@/lib/demos/registry'
import { INDUSTRY_LABELS } from '@/lib/demos/businesses'
import DemoPlayer from '@/components/demos/DemoPlayer'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return ALL_DEMOS.map((d) => ({ slug: d.slug }))
}

export function generateMetadata({ params }: PageProps) {
  const demo = getDemoBySlug(params.slug)
  if (!demo) return { title: 'Demo not found — Zyph Labs' }
  return {
    title: `${demo.title} (live demo) — Zyph Labs`,
    description: demo.description,
  }
}

export default function DemoDetail({ params }: PageProps) {
  const demo = getDemoBySlug(params.slug)
  if (!demo) notFound()

  const industryMeta = INDUSTRY_LABELS[demo.industry]
  const related = ALL_DEMOS.filter((d) => d.industry === demo.industry && d.slug !== demo.slug).slice(0, 3)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 120px' }}>
      <Link
        href="/demos"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        ← All demos
      </Link>

      {/* Header */}
      <header style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: industryMeta.color,
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: industryMeta.color,
              fontWeight: 700,
            }}
          >
            {industryMeta.label}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            · Demo business: <strong style={{ color: 'var(--text-primary)' }}>{demo.business.name}</strong>
          </span>
        </div>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 14,
            letterSpacing: -0.5,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {demo.title}
        </h1>
        <p
          style={{
            fontSize: 19,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            maxWidth: 820,
            marginBottom: 20,
          }}
        >
          {demo.description}
        </p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13 }}>
          <Stat label="Price" value={demo.tier2Price} highlight />
          <Stat label="Build time" value={demo.buildTime} />
          <Stat label="Subtitle" value={demo.subtitle} long />
        </div>
      </header>

      {/* About the fictional business */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: 18,
          marginBottom: 30,
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 220px' }}>
          <div style={labelSm}>About {demo.business.ownerName.split(' ')[0]}</div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
            {demo.business.ownerName}, {demo.business.name}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
            {demo.business.tagline}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>
            📍 {demo.business.city}
          </div>
        </div>
        <div style={{ flex: '2 1 360px' }}>
          <div style={labelSm}>Voice / tone</div>
          <div style={{ color: 'var(--text-primary)', fontSize: 14, marginTop: 4, lineHeight: 1.6 }}>
            {demo.business.ownerVoice}
          </div>
        </div>
      </div>

      {/* Player */}
      <DemoPlayer demoSlug={demo.slug} />

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 72 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 18,
              color: 'var(--text-primary)',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            Other demos for {industryMeta.label.toLowerCase()}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/demos/${r.slug}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 16,
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.subtitle}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Next step CTA */}
      <div
        style={{
          marginTop: 72,
          padding: 32,
          background: 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.08))',
          border: '1px solid var(--border-glow)',
          borderRadius: 14,
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: 22, marginBottom: 8, color: 'var(--text-primary)' }}>
          See if this would work in your business
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 15 }}>
          5-minute AI assessment. Gets you a tier-2 recommendation with real numbers.
        </p>
        <Link
          href="/assessment"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg,#6c5ce7,#00cec9)',
            color: 'white',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          Take the free assessment →
        </Link>
      </div>
    </main>
  )
}

function Stat({ label, value, highlight, long }: { label: string; value: string; highlight?: boolean; long?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '8px 14px',
        flex: long ? '1 1 320px' : undefined,
      }}
    >
      <div style={labelSm}>{label}</div>
      <div
        style={{
          color: highlight ? 'var(--teal)' : 'var(--text-primary)',
          fontSize: 14,
          fontWeight: highlight ? 700 : 500,
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  )
}

const labelSm: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  fontWeight