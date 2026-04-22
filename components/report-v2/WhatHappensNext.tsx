import type { ReportV2 } from '@/app/report/_engine/types-v2'

export default function WhatHappensNext({ data }: { data: ReportV2 }) {
  return (
    <section className="py-6 sm:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">Section 5 — What Happens Next</p>
      <p className="text-slate-700 leading-relaxed text-[15px] sm:text-base mb-4">{data.whatHappensNext.paragraph}</p>
      <p className="text-slate-600 text-sm font-semibold italic">{data.whatHappensNext.signoff}</p>
    </section>
  )
}
