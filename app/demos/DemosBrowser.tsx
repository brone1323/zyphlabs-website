'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DemoCard {
  slug: string
  title: string
  subtitle: string
  category: string
  industry: string
  businessName: string
  tier2Price: string
  buildTime: string
  brainHook: boolean
}

interface IndustryBucket {
  industry: string
  label: string
  color: string
  demos: DemoCard[]
}

interface Props {
  industries: IndustryBucket[]
}

export default function DemosBrowser({ industries }: Props) {
  const [activeIndustry, setActiveIndustry] = useState<string>('all')
  const visible =
    activeIndustry === 'all' ? industries : industries.filter((i) => i.industry === activeIndustry)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          marginBottom: 48,
        }}
      >
        <Chip
          active={activeIndustry === 'all'}
          onClick={() => setActiveIndustry('all')}
          color="var(--purple)"
        >
          All industries
        </Chip>
        {industries.map((i) => (
          <Chip
            key={i.industry}
            active={activeIndustry === i.industry}
            onClick={() => setActiveIndustry(i.industry)}
            color={i.color}
          >
            {i.label} ({i.demos.length})
          </Chip>
        ))}
      </div>

      {visible.map((bucket) => (
        <section key={bucket.industry} style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: bucket.color,
              }}
            />
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {bucket.label}
            </h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              · Demo business: {bucket.demos[0]?.businessName}
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}
          >
            {bucket.demos.map((d) => (
              <Link
                key={d.slug}
                href={`/demos/${d.slug}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 18,
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  display: 'block',
                  transition: 'all 0.2s',
                }}
                className="demo-card"
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: bucket.color,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {d.category.replace(/-/g, ' ')}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    marginBottom: 6,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: 14,
                  }}
                >
                  {d.subtitle}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 10,
                  }}
                >
                  <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{d.tier2Price.split(' ')[0]}</span>
                  <span>Run live →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <style jsx>{`
        .demo-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-glow);
          box-shadow: 0 10px 30px rgba(108, 92, 231, 0.15);
        }
      `}</style>
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? color : 'var(--border-subtle)'}`,
        background: active ? `${color}22` : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}
