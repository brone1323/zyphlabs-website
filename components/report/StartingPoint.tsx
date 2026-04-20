import { ReportData } from '@/app/report/_data/sample-miller'

export default function StartingPoint({ data }: { data: ReportData }) {
  const topThree = data.topThreeIds
    .map((id) => data.recommendations.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => !!r)

  return (
    <section id="starting-point" className="bg-slate-900 text-white py-16 md:py-24 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-[#a29bfe] font-medium mb-3">Where to start</p>
          <h2 className="font-[Space_Grotesk] text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your top 3 moves, ranked by ROI ÷ effort
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Out of 15 recommendations, these are the three that move the needle hardest with the least friction. Do them in order.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {topThree.map((rec, i) => (
            <div
              key={rec.id}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center">
                <span className="font-[Space_Grotesk] text-2xl font-bold text-white">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    rec.tier === 1 ? 'bg-emerald-500/20 text-emerald-300' :
                    rec.tier === 2 ? 'bg-blue-500/20 text-blue-300' :
                    'bg-[#6c5ce7]/30 text-[#a29bfe]'
                  }`}>
                    Tier {rec.tier}
                  </span>
                  <span className="text-xs text-slate-400">{rec.setupHours} · {rec.cost.split(' ')[0]}{rec.cost.split(' ').length > 1 ? '…' : ''}</span>
                </div>
                <h3 className="font-[Space_Grotesk] text-xl md:text-2xl font-bold mb-2">{rec.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{rec.pitch}</p>
                <p className="text-emerald-400 text-sm font-medium">{rec.roi.summary}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof + CTA */}
        <div id="book-strategy" className="bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><path fill=%22%23ffffff%22 fill-opacity=%220.05%22 d=%22M20 0 L40 20 L20 40 L0 20 Z%22/></svg>')] opacity-30" />
          <div className="relative">
            <h2 className="font-[Space_Grotesk] text-3xl md:text-4xl font-bold mb-4">
              Ready to unlock the {data.dollarsPerMonthRecoverable}/month?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Book a 30-minute strategy call. We&apos;ll walk through which of these moves to make first, no sales pressure. If we&apos;re a fit, great. If not, you walk away with a sharper roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://calendly.com/zyphlabs/strategy"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-7 py-4 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Book your strategy call
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a
                href="mailto:hello@zyphlabs.com?subject=Question about my AI Opportunity Report"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/30"
              >
                Email us instead
              </a>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {data.reviews && data.reviews.length > 0 && (
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            {data.reviews.map((r, i) => (
              <blockquote key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-slate-200 text-sm leading-relaxed mb-4 italic">&ldquo;{r.quote}&rdquo;</p>
                <footer className="text-xs text-slate-400">
                  <strong className="text-white">{r.author}</strong> · {r.role}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
