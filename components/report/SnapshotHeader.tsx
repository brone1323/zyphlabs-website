import { ReportData } from '@/app/report/_data/sample-miller'

export default function SnapshotHeader({ data }: { data: ReportData }) {
  return (
    <section className="pt-12 pb-16 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        {/* Report meta */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-slate-500 mb-6">
          <span className="bg-slate-900 text-white px-2.5 py-1 rounded-full">AI Opportunity Report</span>
          <span>Prepared by Zyph Labs · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Headline */}
        <h1 className="font-[Space_Grotesk] text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
          {data.ownerFirstName}, here&apos;s what we found at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c5ce7] to-[#00cec9]">{data.company}</span>.
        </h1>

        {/* What we heard */}
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl mb-10">
          {data.whatWeHeard}
        </p>

        {/* The hook — big number block */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a1a2e] rounded-3xl p-8 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#6c5ce7] opacity-20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#00cec9] opacity-10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <p className="text-sm uppercase tracking-widest text-[#a29bfe] mb-4">The headline number</p>
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-4">
              <div>
                <p className="font-[Space_Grotesk] text-5xl md:text-6xl font-bold text-white leading-none">{data.dollarsPerMonthRecoverable}</p>
                <p className="text-slate-300 mt-2">per month sitting on the table</p>
              </div>
              <div>
                <p className="font-[Space_Grotesk] text-5xl md:text-6xl font-bold text-white leading-none">{data.hoursPerWeekRecoverable} hrs</p>
                <p className="text-slate-300 mt-2">per week of recoverable time</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-6 max-w-2xl">
              Calculated from your answers on close rate, average ticket, and lead volume — cross-referenced with published construction industry benchmarks. Full breakdown in each recommendation below.
            </p>
          </div>
        </div>

        {/* Context strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Stat label="Trade" value={data.trade.split(' —')[0]} />
          <Stat label="Team size" value={data.crewSize} />
          <Stat label="Location" value={data.location.split('(')[0].trim()} />
          <Stat label="Years in business" value={`${data.yearsInBusiness} years`} />
          <Stat label="Tier mix" value="5 + 5 + 5" />
        </div>

        {/* Doing right */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="font-[Space_Grotesk] text-xl font-bold text-slate-900">What you&apos;re already doing right</h3>
              <p className="text-sm text-slate-600 mt-1">Your foundation is strong. These are the things we want to amplify, not replace.</p>
            </div>
          </div>
          <ul className="space-y-3 mt-5">
            {data.doingRight.map((item, i) => (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="text-emerald-600 font-bold mt-0.5">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-slate-200 pl-3">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
