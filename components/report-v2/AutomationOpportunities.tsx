import type { ReportV2, Tier1Card, Tier2Card, Tier3Card, QuestionsCallCard } from '@/app/report/_engine/types-v2'

export default function AutomationOpportunities({ data }: { data: ReportV2 }) {
  const { tier1, tier2Cards, tier3, questionsCall } = data.opportunities
  const ctasUnlocked = data.readiness?.ctasUnlocked ?? true
  const tier2CountShown = data.readiness?.tier2CountShown ?? tier2Cards.length
  const showTier1 = data.readiness?.tier1 ?? !!tier1
  const showTier3 = data.readiness?.tier3 ?? !!tier3

  return (
    <section className="py-6 sm:py-8 border-b border-slate-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">Section 4 &mdash; Your Automation Opportunities</p>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Where we&rsquo;d start, in order of impact</h2>

      <div className="space-y-5">
        {showTier1 && tier1 && <Tier1CardView card={tier1} ctasUnlocked={ctasUnlocked} />}

        {tier2Cards.slice(0, tier2CountShown).map((card) => (
          <Tier2CardView key={card.id} card={card} ctasUnlocked={ctasUnlocked} />
        ))}

        {showTier3 && tier3 && <Tier3CardView card={tier3} ctasUnlocked={ctasUnlocked} />}

        <QuestionsCallView card={questionsCall} ctasUnlocked={ctasUnlocked} />
      </div>

      {!ctasUnlocked && (
        <p className="mt-5 text-xs text-slate-500 italic">
          Purchase and booking buttons unlock once you add your email on the last question.
        </p>
      )}
    </section>
  )
}

// ─── Tier 1 ──────────────────────────────────────────────────────────
function Tier1CardView({ card, ctasUnlocked }: { card: Tier1Card; ctasUnlocked: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Tier 1 &middot; Start Free</span>
        {card.free.isFree && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Free tool</span>}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Try {card.free.toolName} yourself
      </h3>
      <p className="text-sm text-slate-700 mb-2"><strong>What it is:</strong> {card.free.oneLiner}</p>
      <p className="text-sm text-slate-700 mb-3"><strong>Why we&rsquo;d start here:</strong> {card.free.why}</p>
      {card.free.toolUrl && (
        <a href={card.free.toolUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#6c5ce7] hover:underline inline-block mb-4">
          Open {card.free.toolName} &rarr;
        </a>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-900 mb-2">Or &mdash; we&apos;ll set it up for you</p>
        <p className="text-xs text-slate-600 mb-2">{card.paid.rate}. Examples of what we set up:</p>
        <ul className="text-xs text-slate-700 space-y-1 mb-3 list-disc list-inside">
          {card.paid.tasks.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
        <CtaButton href={card.paidCta.href} enabled={ctasUnlocked} variant="secondary">
          {card.paidCta.label}
        </CtaButton>
      </div>
    </div>
  )
}

// ─── Tier 2 ──────────────────────────────────────────────────────────
function Tier2CardView({ card, ctasUnlocked }: { card: Tier2Card; ctasUnlocked: boolean }) {
  return (
    <div className="rounded-2xl border border-[#6c5ce7]/30 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] px-2 py-0.5 rounded-full">Tier 2 &middot; Single Automation</span>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{card.title}</h3>
      <p className="text-sm text-slate-700 mb-4">{card.pitch}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div>
          <p className="text-slate-500 uppercase tracking-wide text-[10px] mb-1">Price</p>
          <p className="font-semibold text-slate-900 text-sm">{card.priceBand}</p>
        </div>
        <div>
          <p className="text-slate-500 uppercase tracking-wide text-[10px] mb-1">Time to live</p>
          <p className="font-semibold text-slate-900 text-sm">{card.timeToLive}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1">What it does</p>
        <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
          {card.whatItDoes.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>

      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1">Integrates with</p>
        <div className="flex flex-wrap gap-1.5">
          {card.integratesWith.map((t, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-700 mb-4"><strong>Expected impact:</strong> {card.expectedImpact}</p>

      <div className="flex flex-wrap items-center gap-3">
        <CtaButton href={card.cta.href} enabled={ctasUnlocked} variant="primary">
          {card.cta.label}
        </CtaButton>
        {card.demoUrl && (
          <a
            href={card.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6c5ce7] hover:underline"
          >
            <span aria-hidden="true">&#9655;</span> See how it works
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Tier 3 ──────────────────────────────────────────────────────────
function Tier3CardView({ card, ctasUnlocked }: { card: Tier3Card; ctasUnlocked: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-[#0f172a] bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-white px-2 py-0.5 rounded-full">Tier 3 &middot; Full System + Brain</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{card.title}</h3>
      <p className="text-sm text-slate-200 mb-4">{card.pitch}</p>

      {card.bundleMath && (
        <div className="rounded-xl bg-white/10 border border-white/20 p-4 mb-4">
          <p className="text-[10px] uppercase tracking-wide text-[#00cec9] font-semibold mb-1">Bundle math</p>
          <p className="text-sm text-white leading-relaxed">{card.bundleMath.narrative}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div>
          <p className="text-slate-400 uppercase tracking-wide text-[10px] mb-1">Price</p>
          <p className="font-semibold text-white text-sm">{card.priceBand}</p>
        </div>
        <div>
          <p className="text-slate-400 uppercase tracking-wide text-[10px] mb-1">Time to live</p>
          <p className="font-semibold text-white text-sm">{card.timeToLive}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-1">The pipeline</p>
        <ul className="text-sm text-slate-200 space-y-1 list-disc list-inside">
          {card.pipeline.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>

      <div className="mb-4 pt-3 border-t border-white/10">
        <p className="text-[10px] uppercase tracking-wide text-[#00cec9] font-semibold mb-1">The Brain &mdash; your un-copyable edge</p>
        <p className="text-sm text-slate-200 mb-2">{card.brain.summary}</p>
        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-1">Weekly briefing examples</p>
        <ul className="text-xs text-slate-300 space-y-1 italic">
          {card.brain.examples.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>

      <p className="text-sm text-slate-200 mb-4"><strong className="text-white">Expected impact:</strong> {card.expectedImpact}</p>

      <div className="flex flex-wrap items-center gap-3">
        <CtaButton href={card.cta.href} enabled={ctasUnlocked} variant="tier3">
          {card.cta.label}
        </CtaButton>
        {card.demoUrl && (
          <a
            href={card.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00cec9] hover:underline"
          >
            <span aria-hidden="true">&#9655;</span> See how the Brain works
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Questions Call ──────────────────────────────────────────────────
function QuestionsCallView({ card, ctasUnlocked }: { card: QuestionsCallCard; ctasUnlocked: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 sm:p-6">
      <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{card.title}</h3>
      <p className="text-sm text-slate-700 mb-4">{card.pitch}</p>
      <CtaButton href={card.cta.href} enabled={ctasUnlocked} variant="secondary">
        {card.cta.label}
      </CtaButton>
    </div>
  )
}

// ─── Shared CTA button ───────────────────────────────────────────────
function CtaButton({ href, enabled, variant, children }: { href: string; enabled: boolean; variant: 'primary' | 'secondary' | 'tier3'; children: React.ReactNode }) {
  const base = 'inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition-all'
  const variantClass =
    variant === 'primary' ? 'bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white hover:scale-[1.02] active:scale-[0.98]' :
    variant === 'tier3'   ? 'bg-white text-slate-900 hover:bg-slate-100' :
                            'bg-slate-900 text-white hover:bg-slate-800'
  const disabledClass = 'bg-slate-200 text-slate-500 cursor-not-allowed'

  if (!enabled) {
    return <button disabled className={`${base} ${disabledClass}`}>{children}</button>
  }
  return <a href={href} className={`${base} ${variantClass}`}>{children}</a>
}
