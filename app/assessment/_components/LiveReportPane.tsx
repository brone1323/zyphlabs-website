'use client'

import { useEffect, useState, useRef } from 'react'
import type { ReportV2 } from '@/app/report/_engine/types-v2'
import BusinessProfile from '@/components/report-v2/BusinessProfile'
import WhereYouStand from '@/components/report-v2/WhereYouStand'
import WhatsEatingYourWeek from '@/components/report-v2/WhatsEatingYourWeek'
import AutomationOpportunities from '@/components/report-v2/AutomationOpportunities'
import WhatHappensNext from '@/components/report-v2/WhatHappensNext'

type SectionKey = 'businessProfile' | 'whereYouStand' | 'whatsEatingYourWeek' | 'opportunities' | 'whatHappensNext'

const SECTION_ORDER: SectionKey[] = ['businessProfile', 'whereYouStand', 'whatsEatingYourWeek', 'opportunities', 'whatHappensNext']

const SECTION_LABEL: Record<SectionKey, string> = {
  businessProfile: 'Building your business profile',
  whereYouStand: 'Reading the signal in your answers',
  whatsEatingYourWeek: 'Sizing the leak',
  opportunities: 'Matching automation opportunities',
  whatHappensNext: 'Finalizing your report',
}

export default function LiveReportPane({ report, finished }: { report: ReportV2 | null; finished: boolean }) {
  const [revealed, setRevealed] = useState<Set<SectionKey>>(new Set())
  const [analyzing, setAnalyzing] = useState<SectionKey | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reveal newly-ready sections one at a time
  useEffect(() => {
    if (!report?.readiness) return
    const ready = new Set<SectionKey>()
    for (const k of SECTION_ORDER) {
      if ((report.readiness as any)[k]) ready.add(k)
    }
    const toReveal = SECTION_ORDER.filter((k) => ready.has(k) && !revealed.has(k))
    if (toReveal.length === 0) return

    let cancelled = false
    ;(async () => {
      for (const k of toReveal) {
        if (cancelled) return
        setAnalyzing(k)
        await sleep(800 + Math.random() * 600)
        if (cancelled) return
        setRevealed((r) => { const n = new Set(r); n.add(k); return n })
        setAnalyzing(null)
        await sleep(200)
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report?.readiness?.businessProfile, report?.readiness?.whereYouStand, report?.readiness?.whatsEatingYourWeek, report?.readiness?.opportunities, report?.readiness?.whatHappensNext])

  // Auto-scroll to latest reveal during the build...
  useEffect(() => {
    if (finished) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [revealed, analyzing, finished])

  // ...but once submitted, snap to the top so user sees their report from the start.
  useEffect(() => {
    if (!finished) return
    const el = scrollRef.current
    if (!el) return
    // Small delay so the "ready" banner renders before we scroll.
    const t = setTimeout(() => { el.scrollTop = 0 }, 100)
    return () => clearTimeout(t)
  }, [finished])

  const showStaticPlaceholder = !report && revealed.size === 0 && !analyzing
  const showWarmup = !!report && revealed.size === 0 && !analyzing && !finished

  return (
    <div className="h-full bg-slate-50 overflow-y-auto" ref={scrollRef}>
      {finished && (
        <div className="bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white px-5 sm:px-8 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">&#10003;</div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-widest text-white/80">Report ready</p>
              <p className="text-base sm:text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your report is ready for viewing</p>
            </div>
          </div>
        </div>
      )}

      <header className={`bg-white border-b border-slate-200 px-5 sm:px-8 py-4 ${finished ? '' : 'sticky top-0 z-10'}`}>
        <p className="text-[11px] uppercase tracking-widest text-slate-500">Your Business Intelligence Report</p>
        <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{report?.company || 'Building in real time\u2026'}</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-12">
        {showStaticPlaceholder && (
          <div className="text-center py-20 text-slate-400">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#6c5ce7]/20 to-[#00cec9]/20 flex items-center justify-center mb-4">
              <div className="w-3 h-3 rounded-full bg-[#6c5ce7] animate-pulse" />
            </div>
            <p className="text-sm">Start answering to watch your report build in real time.</p>
          </div>
        )}

        {showWarmup && (
          <div className="py-12 px-4">
            <div className="flex items-center gap-3 text-slate-700 text-sm mb-4">
              <div className="flex gap-1">
                <Dot delay="0s" />
                <Dot delay="0.15s" />
                <Dot delay="0.3s" />
              </div>
              <span className="italic">Analyzing {report?.company || 'your business'}&hellip;</span>
            </div>
            <div className="text-xs text-slate-500 pl-9 space-y-1.5">
              <p>&bull; Parsing what you do</p>
              <p>&bull; Ready to pull industry benchmarks</p>
              <p>&bull; Ready to size the leak in your week</p>
            </div>
          </div>
        )}

        {report && revealed.has('businessProfile') && <SectionWrap><BusinessProfile data={report} /></SectionWrap>}
        {report && revealed.has('whereYouStand') && <SectionWrap><WhereYouStand data={report} /></SectionWrap>}
        {report && revealed.has('whatsEatingYourWeek') && <SectionWrap><WhatsEatingYourWeek data={report} /></SectionWrap>}
        {report && revealed.has('opportunities') && <SectionWrap><AutomationOpportunities data={report} /></SectionWrap>}
        {report && revealed.has('whatHappensNext') && <SectionWrap><WhatHappensNext data={report} /></SectionWrap>}

        {analyzing && !finished && (
          <div className="py-8 px-4 text-slate-500 flex items-center gap-3 text-sm">
            <div className="flex gap-1">
              <Dot delay="0s" />
              <Dot delay="0.15s" />
              <Dot delay="0.3s" />
            </div>
            <span className="italic">{SECTION_LABEL[analyzing]}&hellip;</span>
          </div>
        )}

        {finished && revealed.size >= SECTION_ORDER.length && (
          <div className="mt-8 rounded-2xl border-2 border-[#6c5ce7]/30 bg-white p-6 text-center">
            <p className="text-[11px] uppercase tracking-widest text-[#6c5ce7] mb-1">Everything&apos;s above</p>
            <p className="font-bold text-lg text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Scroll back to the top to read your report</p>
            <p className="text-sm text-slate-600">A copy just hit your inbox too. When you&apos;re ready, the purchase and booking buttons above are live.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionWrap({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl shadow-sm border border-slate-200 my-4 px-5 sm:px-6 animate-[fadeInUp_0.5s_ease]">{children}</div>
}

function Dot({ delay }: { delay: string }) {
  return <span className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]" style={{ animation: 'zyph-pulse 1.2s infinite ease-in-out', animationDelay: delay }} />
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)) }
