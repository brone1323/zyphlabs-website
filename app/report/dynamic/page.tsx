import Link from 'next/link'
import { generateReport } from '@/app/report/_engine/matcher'
import { decodeAnswers } from '@/app/report/_engine/encoding'
import type { AssessmentAnswers } from '@/app/report/_engine/types'
import SnapshotHeader from '@/components/report/SnapshotHeader'
import TierNav from '@/components/report/TierNav'
import TierSection from '@/components/report/TierSection'
import StartingPoint from '@/components/report/StartingPoint'
import PrintButton from '@/components/report/PrintButton'

// Stateless dynamic report — reads ?data=<base64url(AssessmentAnswers)> and renders.
// Guarded with try/catch so an under-specified payload degrades to a friendly
// fallback instead of a 500. (This is the URL our webhook hands out internally.)

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
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xl font-bold mb-4">
          Z
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">{title}</h1>
        {detail && (
          <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{detail}</p>
        )}
        {answers && (
          <p className="text-slate-500 text-xs mb-6">
            We received the submission from <strong>{answers.ownerName || 'the caller'}</strong>
            {answers.company ? ` at ${answers.company}` : ''}. Our team will review and follow up
            within 24 hours.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium"
          >
            Back to homepage
          </Link>
          <a
            href="mailto:alex@zyphlabs.com"
            className="inline-block text-[#6c5ce7] border border-[#6c5ce7]/30 rounded-lg px-5 py-3 text-sm font-medium hover:bg-[#6c5ce7]/5"
          >
            Email us
          </a>
        </div>
      </div>
    </div>
  )
}

export default function DynamicReportPage({
  searchParams,
}: {
  searchParams: { data?: string }
}) {
  const encoded = searchParams.data

  if (!encoded) {
    return (
      <Fallback
        title="No report data in URL"
        detail="This page needs a ?data= parameter with the encoded answers."
      />
    )
  }

  const answers = decodeAnswers(encoded)
  if (!answers) {
    return (
      <Fallback
        title="Could not decode report data"
        detail="The ?data= parameter didn't parse as valid assessment answers. The link may be damaged."
      />
    )
  }

  let data
  try {
    data = generateReport(answers)
  } catch (err) {
    console.error('[report/dynamic] generateReport failed', err)
    return (
      <Fallback
        title="We got your submission"
        detail="Some of the answers were incomplete, so we couldn't auto-generate the full repo