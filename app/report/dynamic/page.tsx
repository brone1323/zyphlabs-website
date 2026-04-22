import Link from 'next/link'
import { generateReportV2 } from '@/app/report/_engine/matcher-v2'
import { decodeAnswers } from '@/app/report/_engine/encoding'
import type { AssessmentAnswers } from '@/app/report/_engine/types'
import ReportLayout from '@/components/report-v2/ReportLayout'

export const dynamic = 'force-dynamic'

function Fallback({ title, detail, answers }: { title: string; detail?: string; answers?: AssessmentAnswers | null }) {
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
  if (!answers) return <Fallback title="Could not decode report data" detail="The link may be damaged. Our team will still receive your answers." />

  let data
  try {
    data = generateReportV2(answers)
  } catch (err) {
    console.error('[report/dynamic] generateReportV2 failed', err)
    return (
      <Fallback
        title="We got your submission"
        detail="Some answers were incomplete, so we couldn't auto-generate the full preview. Our team will review manually and reach out within 24 hours."
        answers={answers}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 print:hidden sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold text-slate-900 group-hover:text-[#6c5ce7] transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zyph Labs</span>
          </Link>
          <a href="/book/strategy" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">Book a call</a>
        </div>
      </header>
      <ReportLayout data={data} />
      <footer className="bg-slate-900 text-slate-400 py-8 print:hidden mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-[10px] font-bold">Z</div>
            <span>Zyph Labs · zyphlabs.com</span>
          </div>
          <p className="text-slate-500">Private deliverable for {data.company}</p>
        </div>
      </footer>
    </div>
  )
}
