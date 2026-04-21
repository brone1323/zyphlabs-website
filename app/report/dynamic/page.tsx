import { notFound } from 'next/navigation'
import Link from 'next/link'
import { generateReport } from '@/app/report/_engine/matcher'
import { decodeAnswers } from '@/app/report/_engine/encoding'
import SnapshotHeader from '@/components/report/SnapshotHeader'
import TierNav from '@/components/report/TierNav'
import TierSection from '@/components/report/TierSection'
import StartingPoint from '@/components/report/StartingPoint'
import PrintButton from '@/components/report/PrintButton'

// Stateless dynamic report — reads ?data=<base64url(AssessmentAnswers)> and renders.
// This is the URL Retell posts by email after an assessment call completes.

export const dynamic = 'force-dynamic'

export default function DynamicReportPage({
  searchParams,
}: {
  searchParams: { data?: string }
}) {
  const encoded = searchParams.data
  if (!encoded) notFound()

  const answers = decodeAnswers(encoded)
  if (!answers) notFound()

  const data = generateReport(answers)

  const tier1Recs = data.recommendations.filter((r) => r.tier === 1)
  const tier2Recs = data.recommendations.filter((r) => r.tier === 2)

  return (
    <>
      <header className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">
              Z
            </div>
            <span className="font-[Space_Grotesk] font-bold text-slate-900 group-hover:text-[#6c5ce7] transition-colors">
              Zyph Labs
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <PrintButton />
            <a
              href="#book-strategy"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Book a call
            </a>
          </div>
        </div>
      </header>

      <SnapshotHeader data={data} />
      <TierNav />
      <TierSection tier={1} recs={data.recommendations} startIndex={1} />
      <TierSection
        tier={2}
        recs={data.recommendations}
        startIndex={1 + tier1Recs.length}
      />
      <TierSection
        tier={3}
        recs={data.recommendations}
        startIndex={1 + tier1Recs.length + tier2Recs.length}
      />
      <StartingPoint data={data} />

      <footer className="report-footer bg-slate-950 text-slate-400 py-10 print:hidden">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xs font-bold">
              Z
            </div>
            <span>Zyph Labs · zyphlabs.com</span>
          </div>
          <p className="text-xs">This report is a private deliverable prepared for {data.company}.</p>
        </div>
      </footer>
    </>
  )
}
