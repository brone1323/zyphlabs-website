'use client'

import { useState } from 'react'
import { Recommendation } from '@/app/report/_data/sample-miller'

const tierStyles = {
  1: {
    badge: 'bg-emerald-100 text-emerald-800',
    accent: 'border-emerald-200',
    cta: 'bg-emerald-600 hover:bg-emerald-700',
    icon: '⚡',
    label: 'Tier 1 · DIY',
  },
  2: {
    badge: 'bg-blue-100 text-blue-800',
    accent: 'border-blue-200',
    cta: 'bg-blue-600 hover:bg-blue-700',
    icon: '🔧',
    label: 'Tier 2 · We set it up',
  },
  3: {
    badge: 'bg-[#ede9fe] text-[#6c5ce7]',
    accent: 'border-[#ddd6fe]',
    cta: 'bg-[#6c5ce7] hover:bg-[#5849d6]',
    icon: '🏗️',
    label: 'Tier 3 · We build it',
  },
}

export default function ReportCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [showGuide, setShowGuide] = useState(false)
  const styles = tierStyles[rec.tier]

  return (
    <article className={`bg-white border ${styles.accent} rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow`}>
      {/* Header row */}
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles.badge}`}>
          {styles.label}
        </span>
        <span className="text-xs text-slate-500 ml-auto">
          #{String(index).padStart(2, '0')} · {rec.effort} effort
        </span>
      </div>

      {/* Title + pitch */}
      <h3 className="font-[Space_Grotesk] text-2xl font-bold text-slate-900 leading-tight mb-2">
        {rec.title}
      </h3>
      <p className="text-slate-600 text-base mb-5">{rec.pitch}</p>

      {/* Fixes — quote-back */}
      <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r-lg pl-4 pr-3 py-3 mb-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1 font-medium">Fixes:</p>
        <p className="text-slate-700 text-sm leading-relaxed">{rec.fixes}</p>
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Spec label="Setup time" value={rec.setupHours} />
        <Spec label="Cost" value={rec.cost} />
        <Spec label="Effort" value={rec.effort} highlight />
      </div>

      {/* ROI block */}
      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 mb-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Expected win</p>
        <div className="flex flex-wrap gap-6 mb-3">
          {rec.roi.dollarsPerMonth ? (
            <div>
              <p className="font-[Space_Grotesk] text-3xl font-bold text-slate-900 leading-none">
                +${(rec.roi.dollarsPerMonth / 1000).toFixed(rec.roi.dollarsPerMonth >= 10000 ? 0 : 1)}k
              </p>
              <p className="text-xs text-slate-500 mt-1">per month</p>
            </div>
          ) : null}
          {rec.roi.hoursPerWeek ? (
            <div>
              <p className="font-[Space_Grotesk] text-3xl font-bold text-slate-900 leading-none">
                +{rec.roi.hoursPerWeek}h
              </p>
              <p className="text-xs text-slate-500 mt-1">per week</p>
            </div>
          ) : null}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{rec.roi.summary}</p>
      </div>

      {/* Tier 3 — price anchor */}
      {rec.priceAnchor && (
        <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-lg px-4 py-3 mb-6 text-sm">
          <span className="font-medium text-amber-900">Price anchor: </span>
          <span className="text-amber-800">{rec.priceAnchor}</span>
        </div>
      )}

      {/* Tier 2/3 — what you get */}
      {rec.whatYouGet && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">What you get</p>
          <ul className="space-y-2">
            {rec.whatYouGet.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="text-slate-400 flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tier 1 — DIY guide */}
      {rec.diyGuide && (
        <div className="border-t border-slate-200 pt-6">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center justify-between w-full text-left group"
          >
            <span className="text-sm font-medium text-emerald-700 group-hover:text-emerald-800">
              {showGuide ? 'Hide' : 'Show'} step-by-step setup guide
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`w-4 h-4 text-emerald-700 transition-transform ${showGuide ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {showGuide && (
            <div className="mt-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Tools you&apos;ll use</p>
                <div className="flex flex-wrap gap-2">
                  {rec.diyGuide.tools.map((tool, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <ol className="space-y-3">
                {rec.diyGuide.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-slate-500 italic mt-4">
                Stuck? Reply to the email this report came in and we&apos;ll walk you through it — free.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tier 2/3 — CTA */}
      {rec.cta && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <a
            href={rec.cta === 'calendly-strategy' ? '#book-strategy' : '#book-scope'}
            className={`inline-flex items-center justify-center gap-2 ${styles.cta} text-white font-medium px-5 py-3 rounded-xl transition-colors w-full md:w-auto`}
          >
            {rec.cta === 'calendly-strategy' ? 'Book a strategy call' : 'Book a 20-min scoping call'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      )}
    </article>
  )
}

function Spec({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className={`text-sm ${highlight ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{value}</p>
    </div>
  )
}
