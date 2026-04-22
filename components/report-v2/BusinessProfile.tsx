import type { ReportV2 } from '@/app/report/_engine/types-v2'

export default function BusinessProfile({ data }: { data: ReportV2 }) {
  return (
    <section className="py-6 sm:py-8 border-b border-slate-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">Section 1 — Business Profile</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{data.company}</h2>
      <p className="text-slate-700 leading-relaxed text-[15px] sm:text-base mb-5">{data.businessProfile.paragraph}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.businessProfile.stats.map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
