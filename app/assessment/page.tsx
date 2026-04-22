'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { QUESTIONS, toAssessmentAnswers } from './_components/questions'
import QuestionPane from './_components/QuestionPane'
import LiveReportPane from './_components/LiveReportPane'
import { generateReportV2 } from '@/app/report/_engine/matcher-v2'
import type { ReportV2 } from '@/app/report/_engine/types-v2'

export default function AssessmentPage() {
  const [raw, setRaw] = useState<Record<string, any>>({})
  const [index, setIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const total = QUESTIONS.length
  const currentQ = QUESTIONS[index]

  // Compute live report from whatever answers we have so far.
  // Gate: as soon as the business name is captured (Q1), start building —
  // readiness flags inside the report decide which sections LiveReportPane reveals.
  const liveReport: ReportV2 | null = useMemo(() => {
    const hasAnySignal = raw.businessNameAndTrade || raw.industry
    if (!hasAnySignal) return null
    const answers = toAssessmentAnswers(raw)
    try {
      return generateReportV2(answers)
    } catch {
      return null
    }
  }, [raw])

  async function handleSubmit(values: Record<string, any>) {
    const next = { ...raw, ...values }
    setRaw(next)

    // Last question — submit
    if (index + 1 >= total) {
      setSubmitted(true)
      try {
        const answers = toAssessmentAnswers(next)
        await fetch('/api/assessment-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, email: next.ownerEmail }),
        })
      } catch (err) {
        console.error('submit failed', err)
      }
      return
    }

    setIndex((i) => i + 1)
  }

  function handleBack() {
    if (index > 0) setIndex((i) => i - 1)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col lg:flex-row">
      {/* Top bar — Zyph brand + homepage link */}
      <header className="lg:hidden border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-xs">Z</div>
          <span className="text-sm font-semibold">Zyph Labs</span>
        </Link>
        <div className="text-[11px] text-[#8888aa]">Free AI Assessment</div>
      </header>

      {/* Left — Question pane (40% on desktop) */}
      <section className="lg:w-2/5 lg:min-h-screen lg:border-r border-white/10 flex flex-col relative">
        {/* Desktop brand */}
        <div className="hidden lg:flex items-center gap-2 px-10 py-6 absolute top-0 left-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zyph Labs</span>
          </Link>
        </div>

        {!submitted ? (
          <QuestionPane
            q={currentQ}
            index={index}
            total={total}
            onSubmit={handleSubmit}
            onBack={handleBack}
            canGoBack={index > 0}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-8">
            <div className="max-w-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xl mb-4">&#10003;</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>You&apos;re all set, {(raw.businessNameAndTrade || '').split(/[\s\u2014\u2013-]/)[0] || 'friend'}.</h2>
              <p className="text-[#ccccdd] leading-relaxed mb-6">Your report finished building on the right. A copy is on its way to your inbox, and our team will follow up within 24 hours.</p>
              <Link href="/" className="inline-block bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold rounded-2xl px-6 py-3 hover:scale-[1.02] active:scale-[0.98] transition-transform">Back to homepage</Link>
            </div>
          </div>
        )}
      </section>

      {/* Right — Live report pane (60% on desktop) */}
      <section className="lg:w-3/5 lg:min-h-screen lg:sticky lg:top-0 lg:h-screen">
        <LiveReportPane report={liveReport} finished={submitted} />
      </section>
    </div>
  )
}
