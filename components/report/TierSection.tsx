import { Recommendation, Tier } from '@/app/report/_data/sample-miller'
import ReportCard from './ReportCard'

const tierMeta = {
  1: {
    sectionId: 'tier-1',
    label: 'Tier 1',
    title: 'Quick Wins — Start This Week',
    sub: 'DIY · Free or under $50/mo · 30 min to 2 hrs to set up',
    description:
      'These are real upgrades you can install yourself in an afternoon. No sales pitch — just step-by-step guides. Even if you never hire us, these 5 changes will pay for themselves within the month.',
    bgClass: 'bg-emerald-50/50',
    accentBar: 'bg-emerald-500',
  },
  2: {
    sectionId: 'tier-2',
    label: 'Tier 2',
    title: 'Medium Lifts — We Set It Up For You',
    sub: 'Configuration & integration · $500–$3k · 1–4 weeks',
    description:
      'Off-the-shelf tools we configure, integrate, and train you on. Fixed scope, fixed price. You own the tools when we\'re done.',
    bgClass: 'bg-blue-50/50',
    accentBar: 'bg-blue-500',
  },
  3: {
    sectionId: 'tier-3',
    label: 'Tier 3',
    title: 'Big Builds — Custom Systems We Build',
    sub: 'Bespoke · $5k–$25k+ · 1–3 months',
    description:
      'Custom systems built for Miller Remodeling specifically. Each comes price-anchored against typical agency cost so you can see exactly where the savings are.',
    bgClass: 'bg-[#faf5ff]/60',
    accentBar: 'bg-[#6c5ce7]',
  },
}

export default function TierSection({
  tier,
  recs,
  startIndex,
}: {
  tier: Tier
  recs: Recommendation[]
  startIndex: number
}) {
  const meta = tierMeta[tier]
  const tierRecs = recs.filter((r) => r.tier === tier)

  return (
    <section id={meta.sectionId} className={`${meta.bgClass} py-16 md:py-20 scroll-mt-20`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-1 w-16 rounded-full ${meta.accentBar}`} />
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">
            {meta.label} of 3
          </span>
        </div>
        <h2 className="font-[Space_Grotesk] text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
          {meta.title}
        </h2>
        <p className="text-sm text-slate-500 mb-4">{meta.sub}</p>
        <p className="text-base text-slate-600 max-w-3xl mb-12 leading-relaxed">
          {meta.description}
        </p>

        <div className="space-y-6">
          {tierRecs.map((rec, i) => (
            <ReportCard key={rec.id} rec={rec} index={startIndex + i} />
          ))}
        </div>
      </div>
    </section>
  )
}
