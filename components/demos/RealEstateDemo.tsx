'use client'
import { useEffect, useRef, useState } from 'react'

interface StatDef {
  label: string
  target: number
  prefix: string
  suffix: string
  decimal?: boolean
}

const STATS: StatDef[] = [
  { label: 'Avg Sale Price',      target: 487000, prefix: '$', suffix: '',  decimal: false },
  { label: 'Active Listings',     target: 143,    prefix: '',  suffix: '',  decimal: false },
  { label: 'Days on Market',      target: 18,     prefix: '',  suffix: 'd', decimal: false },
  { label: 'Sale-to-List Ratio',  target: 98.2,   prefix: '',  suffix: '%', decimal: true  },
]

const PROPERTIES = [
  { name: '14 Cresthaven Lane',  beds: 4, baths: 3, sqft: 2840, price: '$624,000',  status: 'Active',  type: 'Single Family', change: '+12%' },
  { name: '8A Meridian Tower',   beds: 2, baths: 2, sqft: 1180, price: '$312,000',  status: 'Pending', type: 'Condo',         change: '+5%'  },
  { name: '302 Lakeside Drive',  beds: 5, baths: 4, sqft: 3600, price: '$985,000',  status: 'Sold',    type: 'Luxury Home',   change: '+18%' },
]

const STATUS_COLORS: Record<string, string> = {
  Active:  '#4ade80',
  Pending: '#fbbf24',
  Sold:    '#a29bfe',
}

// 24 data points representing monthly market activity (0–100 scale)
const CHART_Y = [38, 42, 40, 46, 50, 48, 53, 57, 52, 60, 64, 70, 66, 73, 78, 75, 82, 86, 80, 88, 85, 92, 96, 93]

function useCountUp(target: number, decimal = false) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true
        const steps = 60
        const duration = 1600
        const increment = target / steps
        let current = 0
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(interval)
          }
          setCount(current)
        }, duration / steps)
      }
    }, { threshold: 0.4 })
    if (nodeRef.current) observer.observe(nodeRef.current)
    return () => observer.disconnect()
  }, [target])

  const display = decimal
    ? count.toFixed(1)
    : target >= 100000
      ? Math.floor(count).toLocaleString()
      : Math.floor(count).toString()

  return { display, nodeRef }
}

function StatCard({ stat }: { stat: StatDef }) {
  const { display, nodeRef } = useCountUp(stat.target, stat.decimal)
  return (
    <div ref={nodeRef} className="rounded-xl border border-[#a29bfe]/10 bg-[#0f0f1a] p-5 text-center">
      <div
        className="text-2xl font-bold text-[#a29bfe]"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {stat.prefix}{display}{stat.suffix}
      </div>
      <div className="text-xs text-[#8888aa] mt-1">{stat.label}</div>
    </div>
  )
}

function MarketChart() {
  const lineRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  const W = 600
  const H = 110
  const pts = CHART_Y.map((y, i) => ({
    x: (i / (CHART_Y.length - 1)) * W,
    y: H - (y / 100) * H * 0.9 - 5,
  }))

  // Smooth curve using cubic bezier approximation
  const linePath = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = pts[i - 1]
      const cpx1 = prev.x + (p.x - prev.x) / 3
      const cpx2 = p.x - (p.x - prev.x) / 3
      return `C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')

  const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setAnimated(true)
    }, { threshold: 0.3 })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const pathLength = 10000

  return (
    <div ref={containerRef} className="rounded-xl border border-[#a29bfe]/10 bg-[#0f0f1a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-sm font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Market Activity — Last 24 Months
          </h3>
          <p className="text-xs text-[#8888aa] mt-0.5">Median sale price trend</p>
        </div>
        <span className="text-xs font-semibold text-[#4ade80] bg-[#4ade80]/10 px-2.5 py-1 rounded-full">
          ↑ +32.4% YoY
        </span>
      </div>

      {/* Month labels */}
      <div className="flex justify-between text-xs text-[#444466] mb-1 px-1">
        {['Jan', 'Apr', 'Jul', 'Oct', 'Jan', 'Apr', 'Jul', 'Oct'].map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: '110px' }}>
        <defs>
          <linearGradient id="reChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a29bfe" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a29bfe" stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#reChartGrad)" />
        <path
          ref={lineRef}
          d={linePath}
          fill="none"
          stroke="#a29bfe"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: animated ? 0 : pathLength,
            transition: animated ? 'stroke-dashoffset 2s ease-out' : 'none',
          }}
        />
        {/* Latest point */}
        <circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r="5"
          fill="#a29bfe"
          style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.4s 2s' }}
        />
        <circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r="9"
          fill="none"
          stroke="#a29bfe"
          strokeWidth="1.5"
          style={{ opacity: animated ? 0.4 : 0, transition: 'opacity 0.4s 2s' }}
        />
      </svg>
    </div>
  )
}

export default function RealEstateDemo() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#a29bfe] border border-[#a29bfe]/30 rounded-full px-4 py-1.5 mb-5">
            Live Market Dashboard
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Data-driven listings that close deals
          </h2>
          <p className="text-[#8888aa] mt-3 max-w-2xl mx-auto leading-relaxed">
            Every real estate site we build includes a live market dashboard — showing buyers
            and sellers exactly why now is the right time to act.
          </p>
        </div>

        <div className="rounded-2xl border border-[#a29bfe]/20 bg-[#0a0a0f] overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#a29bfe]/10 bg-[#0f0f1a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-4 bg-[#1a1a2e] rounded-md px-3 py-1 text-xs text-[#8888aa] font-mono">
              meridian-properties.com/dashboard
            </div>
            <span className="text-xs text-[#8888aa]">Live data</span>
            <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse ml-1" />
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(stat => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>

            {/* Chart */}
            <MarketChart />

            {/* Property listings */}
            <div>
              <h3
                className="text-sm font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Recent Listings
              </h3>
              <div className="space-y-3">
                {PROPERTIES.map(prop => (
                  <div
                    key={prop.name}
                    className="rounded-xl p-4 flex items-center justify-between gap-4 border border-[#1a1a2e] hover:border-[#a29bfe]/30 transition-colors bg-[#0f0f1a]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className="text-sm font-semibold text-white truncate"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {prop.name}
                        </h4>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            color: STATUS_COLORS[prop.status],
                            background: `${STATUS_COLORS[prop.status]}18`,
                          }}
                        >
                          {prop.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#8888aa]">
                        {prop.beds}bd · {prop.baths}ba · {prop.sqft.toLocaleString()} sqft · {prop.type}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-[#a29bfe]">{prop.price}</div>
                      <div className="text-xs text-[#4ade80] mt-0.5">{prop.change} YoY</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
