import type { ReportV2 } from '@/app/report/_engine/types-v2'

export default function WhereYouStand({ data }: { data: ReportV2 }) {
  if (!data.whereYouStand || data.whereYouStand.length === 0) return null
  return (
    <section className="py-6 sm:py-8 border-b border-slate-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">Section 2 &mdash; What We&apos;re Picking Up</p>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live signal from your answers</h2>
      <div className="space-y-4">
        {data.whereYouStand.map((line, i) => {
          const accent = line.tone === 'win' ? '#00cec9' : line.tone === 'gap' ? '#e17055' : '#6c5ce7'
          return (
            <div key={i} className="border-l-4 pl-4 py-1" style={{ borderColor: accent }}>
              <p className="text-sm text-slate-600">{line.label}</p>
              <p className="text-lg font-semibold text-slate-900 mt-0.5">{line.value}</p>
              {line.youAre && <p className="text-sm text-slate-700 mt-1">{line.youAre}</p>}
              {line.gap && <p className="text-sm font-medium mt-1" style={{ color: accent }}>{line.gap}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
