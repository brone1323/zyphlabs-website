import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Tier1SetupPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xl font-bold mb-4">Z</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Setup Help &mdash; $100/hr</h1>
        <p className="text-slate-600 text-sm mb-4">
          Tell us what you need set up and we&apos;ll send back a PayPal prepay link plus a calendar hold. 1-hour minimum, 30-minute increments after that.
        </p>
        <p className="text-slate-600 text-sm mb-6">
          Email <a className="underline" href="mailto:alex@zyphlabs.com?subject=Setup%20Help%20%E2%80%94%20%24100%2Fhr">alex@zyphlabs.com</a> with a one-line scope (e.g. &quot;get me running on Jobber&quot;) and we&apos;ll reply within 4 business hours.
        </p>
        <Link href="/assessment" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Back to the assessment</Link>
      </div>
    </div>
  )
}
