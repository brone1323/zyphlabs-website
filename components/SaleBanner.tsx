'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SALE_END = new Date('2026-04-07T04:00:00Z') // end of day Monday April 6 (midnight EDT)

function getTimeLeft() {
  const diff = SALE_END.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function SaleBanner() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissed(localStorage.getItem('sale-banner-dismissed') === 'true')
    }
    setTimeLeft(getTimeLeft())
    setMounted(true)

    const timer = setInterval(() => {
      const t = getTimeLeft()
      setTimeLeft(t)
      if (!t) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted || dismissed || !timeLeft) return null

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('sale-banner-dismissed', 'true')
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(135deg, #2d1b69 0%, #0f3460 50%, #0a1628 100%)',
        borderBottom: '1px solid rgba(108, 92, 231, 0.4)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Shimmer overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(162,155,254,0.07) 50%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 48px 10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        {/* Badge */}
        <span
          style={{
            background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
            color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Long Weekend Sale
        </span>

        {/* Main offer text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              background: 'linear-gradient(135deg, #a29bfe 0%, #00cec9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
            }}
          >
            25% OFF
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#c8c8e0',
              whiteSpace: 'nowrap',
            }}
          >
            all packages —
          </span>

          {/* Crossed-out pricing examples */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#8888aa',
              whiteSpace: 'nowrap',
            }}
          >
            sites from{' '}
            <span
              style={{
                textDecoration: 'line-through',
                color: '#666680',
              }}
            >
              $149
            </span>{' '}
            <span style={{ color: '#a29bfe', fontWeight: 600 }}>$112</span>
            {' · '}
            <span
              style={{
                textDecoration: 'line-through',
                color: '#666680',
              }}
            >
              $399
            </span>{' '}
            <span style={{ color: '#a29bfe', fontWeight: 600 }}>$299</span>
          </span>
        </div>

        {/* Countdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              color: '#8888aa',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Ends in
          </span>
          {[
            { val: timeLeft.days, label: 'd' },
            { val: timeLeft.hours, label: 'h' },
            { val: timeLeft.minutes, label: 'm' },
            { val: timeLeft.seconds, label: 's' },
          ].map(({ val, label }, i) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {i > 0 && (
                <span style={{ color: 'rgba(162,155,254,0.4)', fontSize: '12px', margin: '0 1px' }}>
                  :
                </span>
              )}
              <span
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(108,92,231,0.3)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontFamily: "'Space Grotesk', monospace",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#f0f0ff',
                  minWidth: '28px',
                  textAlign: 'center',
                  display: 'inline-block',
                }}
              >
                {pad(val)}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: '#8888aa',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/#packages"
          style={{
            background: 'linear-gradient(135deg, #6c5ce7 0%, #0984e3 100%)',
            color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '12px',
            padding: '6px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            letterSpacing: '0.02em',
            transition: 'opacity 0.2s',
          }}
        >
          Claim Offer →
        </Link>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss sale banner"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#666680',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
          padding: '4px',
        }}
      >
        ×
      </button>
    </div>
  )
}
