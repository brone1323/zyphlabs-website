import Link from 'next/link'
import { ALL_DEMOS } from '@/lib/demos/registry'
import { INDUSTRY_LABELS } from '@/lib/demos/businesses'
import DemosBrowser from './DemosBrowser'

export const metadata = {
  title: 'Live AI Automation Demos — Zyph Labs',
  description:
    'Every automation we build, demonstrated live with a fictional business in your industry. Click run, see exactly what your customers would receive.',
}

export default function DemosIndex() {
  const byIndustry = Object.keys(INDUSTRY_LABELS).map((ind) => ({
    industry: ind,
    label: INDUSTRY_LABELS[ind].label,
    color: INDUSTRY_LABELS[ind].color,
    demos: ALL_DEMOS.filter((d) => d.industry === ind),
  }))

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 120px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: 11,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--teal)',
            fontWeight: 700,
            background: 'rgba(0,206,201,0.1)',
            padding: '6px 14px',
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          Live demos · {ALL_DEMOS.length} automations
        </div>
        <h1
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.05,
            background: 'linear-gradient(135deg, #f0f0ff 0%, #a29bfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 18,
            letterSpacing: -1,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          See the AI. Not a video.
        </h1>
        <p
          style={{
            fontSize: 18,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          Every automation we&apos;ve built is live on this page. Click one, try it with sample data,
          and we&apos;ll send the actual output to a real email inbox — so you can see exactly what
          your customers would receive.
        </p>
      </div>

      <DemosBrowser
        industries={byIndustry.map((i) => ({
          industry: i.industry,
          label: i.label,
          color: i.color,
          demos: i.demos.map((d) => ({
            slug: d.slug,
            title: d.title,
            subtitle: d.subtitle,
            category: d.category,
            industry: d.industry,
            businessName: d.business.name,
            tier2Price: d.tier2Price,
            buildTime: d.buildTime,
            brainHook: !!d.brainHook,
          })),
        }))}
      />

      <div
        style={{
          marginTop: 96,
          padding: 40,
          background: 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.08))',
          border: '1px solid var(--border-glow)',
          borderRadius: 18,
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 28, marginBottom: 10, color: 'var(--text-primary)' }}>
          Want one of these running in your business?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 620, margin: '0 auto 24px' }}>
          Take the 5-minute AI Assessment and we&apos;ll tell you which automations would make the
          biggest difference, with actual numbers.
        </p>
        <Link
          href="/assessment"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg,#6c5ce7,#00cec9)',
            color: 'white',
            borderRadius: 10,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: 15,
            letterSpacing: 0.3,
          }}
        >
          Start the free assessment →
        </Link>
      </div>
    </main>
  )
}
