import type { ReportV2 } from '@/app/report/_engine/types-v2'
import BusinessProfile from './BusinessProfile'
import WhereYouStand from './WhereYouStand'
import WhatsEatingYourWeek from './WhatsEatingYourWeek'
import AutomationOpportunities from './AutomationOpportunities'
import WhatHappensNext from './WhatHappensNext'

export default function ReportLayout({ data }: { data: ReportV2 }) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 bg-white">
      <header className="py-6 border-b border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-widest">Zyph Labs · Business Intelligence Report</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{data.company}</h1>
        <p className="text-sm text-slate-500 mt-1">Prepared {new Date(data.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </header>
      <BusinessProfile data={data} />
      <WhereYouStand data={data} />
      <WhatsEatingYourWeek data={data} />
      <AutomationOpportunities data={data} />
      <WhatHappensNext data={data} />
    </article>
  )
}
