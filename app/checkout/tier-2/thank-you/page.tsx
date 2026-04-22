import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Tier2ThankYouPage({
  searchParams,
}: {
  searchParams: { orderID?: string; industry?: string; email?: string }
}) {
  const { orderID, email } = searchParams

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zyph Labs</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-2xl mb-6">
          ✓
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Payment received — let's build.
        </h1>
        <p className="text-slate-700 text-base leading-relaxed mb-6">
          Thanks for the trust. Your order is confirmed and we've received payment. A kickoff booking link
          {email ? <> is on its way to <strong>{email}</strong></> : <> will land in your PayPal receipt email</>}.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>What happens next</h2>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span className="font-bold text-[#6c5ce7]">1.</span><div><strong>Within a few hours</strong> — we send you a 30-min kickoff call booking link.</div></li>
            <li className="flex gap-3"><span className="font-bold text-[#6c5ce7]">2.</span><div><strong>Kickoff call</strong> — we scope the exact build with you and collect the logins + context we need.</div></li>
            <li className="flex gap-3"><span className="font-bold text-[#6c5ce7]">3.</span><div><strong>1–2 weeks</strong> — we build, wire it in, and test.</div></li>
            <li className="flex gap-3"><span className="font-bold text-[#6c5ce7]">4.</span><div><strong>Go live</strong> — you approve, we flip the switch, 30-day tuning window begins.</div></li>
          </ol>
        </div>

        {orderID && (
          <p className="text-xs text-slate-500 mb-6">Order ID: <code className="bg-slate-100 px-2 py-0.5 rounded">{orderID}</code></p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="inline-block text-center bg-slate-900 text-white rounded-xl px-5 py-3 text-sm font-medium flex-1">Back to homepage</Link>
          <a href="mailto:alex@zyphlabs.com" className="inline-block text-center border border-slate-300 text-slate-900 rounded-xl px-5 py-3 text-sm font-medium flex-1">Email us</a>
        </div>
      </main>
    </div>
  )
}
