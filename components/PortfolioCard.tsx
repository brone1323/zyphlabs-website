import Link from 'next/link'
import type { PortfolioItem } from '@/lib/portfolioData'

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link href={`/services/${item.niche}#pricing`} className="group block">
      {/* Browser window */}
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_8px_40px_rgba(108,92,231,0.2)] group-hover:-translate-y-1.5">
        {/* Chrome bar */}
        <div className="bg-[#232333] px-3 py-2.5 flex items-center gap-2 border-b border-white/5">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 min-w-0 mx-2 bg-[#14141e] rounded px-2 py-0.5 text-[10px] text-[#555577] truncate font-mono">
            www.{item.domain}.com
          </div>
        </div>

        {/* Site mockup */}
        <div style={{ background: item.heroGradient }}>
          {/* Fake nav */}
          <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div
              className="text-[10px] font-bold text-white tracking-wide"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {item.businessName}
            </div>
            <div className="flex gap-3">
              {['About', 'Services', 'Contact'].map((l) => (
                <span key={l} className="text-[8px] text-white/50">
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Hero content */}
          <div className="px-4 pt-5 pb-4">
            <div
              className="text-[13px] font-bold text-white leading-tight mb-1"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {item.businessName}
            </div>
            <div className="text-[10px] text-white/60 mb-3 leading-relaxed">{item.tagline}</div>
            <div
              className="inline-block text-[9px] font-semibold text-white px-3 py-1.5 rounded-md"
              style={{ background: item.accentColor }}
            >
              {item.ctaLabel}
            </div>
          </div>

          {/* Services row */}
          <div className="px-4 py-2.5 flex flex-wrap gap-1.5" style={{ background: 'rgba(0,0,0,0.25)' }}>
            {item.services.map((s) => (
              <span
                key={s}
                className="text-[8px] text-white/60 px-2 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Footer strip */}
          <div
            className="px-4 py-2 flex items-center gap-2"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[8px]" style={{ color: item.accentColor }}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-[8px] text-white/40">5.0 · 48 reviews</span>
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="mt-4 px-1">
        <h3
          className="text-base font-semibold text-white group-hover:text-[#a29bfe] transition-colors"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {item.businessName}
        </h3>
        <p className="text-sm text-[#8888aa] leading-relaxed mt-1 mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.features.map((f) => (
            <span
              key={f}
              className="text-[10px] text-[#a29bfe] px-2 py-0.5 rounded-full border"
              style={{ background: 'rgba(108,92,231,0.08)', borderColor: 'rgba(108,92,231,0.25)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
