import type { ReportV2 } from '@/app/report/_engine/types-v2'

export default function WhatsEatingYourWeek({ data }: { data: ReportV2 }) {
  return (
    <section className="py-6 sm:py-8 border-b border-slate-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">Section 3 — What&apos;s Eating Your Week</p>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>The leak we identified</h2>
      <div className="rounded-xl bg-gradient-to-br from-[#6c5ce7]/8 to-[#00cec9]/6 border border-[#6c5ce7]/15 p-5 mb-4">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Quantified leak</p>
        <p className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{data.whatsEatingYourWeek.quantifiedLeak}</p>
      </div>
      <p className="text-slate-700 leading-relaxed text-[15px] sm:text-base">{data.whatsEatingYourWeek.narrative}</p>
    </section>
  )
}
