import type { ReportV2, QuickWinCard, FullSystemCard, QuestionsCallCard } from '@/app/report/_engine/types-v2'

export default function AutomationOpportunities({ data }: { data: ReportV2 }) {
  const { quickWin, fullSystem, questionsCall } = data.opportunities
  return (
    <section className="py-6 sm:py-8 border-b border-slate-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">Section 4 — Your Automation Opportunities</p>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ordered by biggest-impact-first</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <QuickWinCardView card={quickWin} />
        <FullSystemCardView card={fullSystem} />
      </div>
      <QuestionsCardView card={questionsCall} />
    </section>
  )
}

function QuickWinCardView({ card }: { card: QuickWinCard }) {
  return (
    <div className="rounded-2xl border-2 border-[#00cec9]/40 bg-white p-5 sm:p-6 flex flex-col">
      <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00cec9]/12 text-[#00a8a4] text-[11px] font-semibold uppercase tracking-wider mb-3">
        Quick Win · Tier 2
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{card.title}</h3>
      <p className="text-slate-700 text-sm leading-relaxed mb-4">{card.pitch}</p>
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">What it does</p>
        <ul className="space-y-1.5">
          {card.whatItDoes.map((line, i) => (
            <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-[#00cec9] mt-0.5">✓</span>{line}</li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs mb-4 mt-auto pt-3 border-t border-slate-100">
        <div><div className="text-slate-500">Price</div><div className="font-semibold text-slate-900 text-sm">{card.priceBand}</div></div>
        <div><div className="text-slate-500">Time to live</div><div className="font-semibold text-slate-900 text-sm">{card.timeToLive}</div></div>
      </div>
      <p className="text-xs text-slate-600 mb-4 italic">{card.expectedImpact}</p>
      <a href={card.cta.href} className="block text-center bg-gradient-to-r from-[#00cec9] to-[#0984e3] text-white font-semibold rounded-xl py-3 px-5 hover:shadow-lg transition-all">
        {card.cta.label} →
      </a>
    </div>
  )
}

function FullSystemCardView({ card }: { card: FullSystemCard }) {
  return (
    <div className="rounded-2xl border-2 border-[#6c5ce7]/40 bg-gradient-to-br from-[#6c5ce7]/5 to-transparent p-5 sm:p-6 flex flex-col">
      <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6c5ce7]/12 text-[#5a4ad0] text-[11px] font-semibold uppercase tracking-wider mb-3">
        Full System · Tier 3 · Brain included
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{card.title}</h3>
      <p className="text-slate-700 text-sm leading-relaxed mb-4">{card.pitch}</p>
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">The pipeline</p>
        <ol className="space-y-1.5">
          {card.pipeline.map((step, i) => (
            <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-[#6c5ce7] font-bold">{i + 1}.</span>{step}</li>
          ))}
        </ol>
      </div>
      <div className="rounded-xl bg-slate-900 text-slate-100 p-4 mb-4">
        <p className="text-[10px] uppercase tracking-wider text-[#a29bfe] mb-1 font-semibold">The Brain — persistent memory layer</p>
        <p className="text-xs leading-relaxed mb-3 text-slate-300">{card.brain.summary}</p>
        <div className="space-y-1.5">
          {card.brain.examples.map((ex, i) => (
            <p key={i} className="text-xs text-slate-400 italic leading-snug">{ex}</p>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs mb-4 mt-auto pt-3 border-t border-slate-200">
        <div><div className="text-slate-500">Price</div><div className="font-semibold text-slate-900 text-sm">{card.priceBand}</div></div>
        <div><div className="text-slate-500">Time to live</div><div className="font-semibold text-slate-900 text-sm">{card.timeToLive}</div></div>
      </div>
      <p className="text-xs text-slate-700 mb-4 italic">{card.expectedImpact}</p>
      <a href={card.cta.href} className="block text-center bg-slate-900 text-white font-semibold rounded-xl py-3 px-5 hover:bg-slate-800 transition-all">
        {card.cta.label} →
      </a>
    </div>
  )
}

function QuestionsCardView({ card }: { card: QuestionsCallCard }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{card.title}</h3>
        <p className="text-sm text-slate-600">{card.pitch}</p>
      </div>
      <a href={card.cta.href} className="shrink-0 inline-block text-center border-2 border-slate-900 text-slate-900 font-semibold rounded-xl py-2.5 px-5 text-sm hover:bg-slate-900 hover:text-white transition-all">
        {card.cta.label} →
      </a>
    </div>
  )
}
