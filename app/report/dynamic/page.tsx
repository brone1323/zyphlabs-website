import Link from 'next/link'
import { generateReport } from '@/app/report/_engine/matcher'
import { decodeAnswers } from '@/app/report/_engine/encoding'
import type { AssessmentAnswers } from '@/app/report/_engine/types'
import SnapshotHeader from '@/components/report/SnapshotHeader'
import TierNav from '@/components/report/TierNav'
import TierSection from '@/components/report/TierSection'
import StartingPoint from '@/components/report/StartingPoint'
import PrintButton from '@/components/report/PrintButton'

export const dynamic = 'force-dynamic'

function Fallback({
  title,
  detail,
  answers,
}: {
  title: string
  detail?: string
  answers?: AssessmentAnswers | null
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xl font-bold mb-4">Z</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">{title}</h1>
        {detail && <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{detail}</p>}
        {answers && (
          <p className="text-slate-500 text-xs mb-6">
            We received the submission from <strong>{answers.ownerName || 'the caller'}</strong>
            {answers.company ? ` at ${answers.company}` : ''}. Our team will review and follow up within 24 hours.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link href="/" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Back to homepage</Link>
          <a href="mailto:alex@zyphlabs.com" className="inline-block text-[#6c5ce7] border border-[#6c5ce7]/30 rounded-lg px-5 py-3 text-sm font-medium hover:bg-[#6c5ce7]/5">Email us</a>
        </div>
      </div>
    </div>
  )
}

export default function DynamicReportPage({ searchParams }: { searchParams: { data?: string } }) {
  const encoded = searchParams.data
  if (!encoded) return <Fallback title="No report data in URL" detail="This page needs a ?data= parameter with the encoded answers." />

  const answers = decodeAnswers(encoded)
  if (!answers) return <Fallback title="Could not decode report data" detail="The ?data= parameter didn't parse as valid assessment answers." />

  let data
  try {
    data = generateReport(answers)
  } catch (err) {
    console.error('[report/dynamic] generateReport failed', err)
    return (
      <Fallback
        title="We got your submission"
        detail="Some of the answers were incomplete, so we couldn't auto-generate the full report preview. Our team will review your submission manually and reach out within 24 hours."
        answers={answers}
      />
    )
  }

  const tier1Recs = data.recommendations.filter((r) => r.tier === 1)
  const tier2Recs = data.recommendations.filter((r) => r.tier === 2)

  return (
    <>
      <header className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-[Space_Grotesk] font-bold text-slate-900 group-hover:text-[#6c5ce7] transition-colors">Zyph Labs</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <PrintButton />
            <a href="#book-strategy" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">Book a call</a>
          </div>
        </div>
      </header>

      <SnapshotHeader data={data} />
      <TierNav />
      <TierSection tier={1} recs={data.recommendations} startIndex={1} />
      <TierSection tier={2} recs={data.recommendations} startIndex={1 + tier1Recs.length} />
      <TierSection tier={3} recs={data.recommendations} startIndex={1 + tier1Recs.length + tier2Recs.length} />
      <StartingPoint data={data} />

      <footer className="report-footer bg-slate-950 text-slate-400 py-10 print:hidden">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xs font-bold">Z</div>
            <span>Zyph Labs · zyphlabs.com</span>
          </div>
          <p className="text-xs">This report is a private deliverable prepared for {data.company}.</p>
        </div>
      </footer>
    </>
  )
}
