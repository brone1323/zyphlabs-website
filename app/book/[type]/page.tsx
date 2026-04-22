import Link from 'next/link'
import BookingClient from './BookingClient'

export const dynamic = 'force-dynamic'

type BookingType = 'setup' | 'strategy' | 'questions'

const TYPES: Record<BookingType, { label: string; duration: number; price: string; invoice: boolean; blurb: string }> = {
  setup:     { label: 'Setup Help',               duration: 60, price: '$100/hr, 1-hour minimum', invoice: true,  blurb: "We'll get on a 1-hour screen share and set up the off-the-shelf tool we recommended. We invoice after the call; pay anytime within 14 days." },
  strategy:  { label: '30-min Strategy Session',  duration: 30, price: 'Free',                      invoice: false, blurb: "Walk through your report, scope the right automation, and leave with a clear build plan." },
  questions: { label: '15-min Questions Call',    duration: 15, price: 'Free',                      invoice: false, blurb: "Quick, no-pitch conversation to answer whatever's on your mind. Bring anything." },
}

export default function BookingPage({ params }: { params: { type: string } }) {
  const type = (params.type as BookingType)
  const cfg = TYPES[type]
  if (!cfg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Unknown booking type</h1>
          <p className="text-slate-600 text-sm mb-4">Try one of these:</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book/strategy" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Strategy call</Link>
            <Link href="/book/questions" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Questions call</Link>
            <Link href="/book/setup" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Setup help</Link>
          </div>
        </div>
      </div>
    )
  }

  return <BookingClient type={type} cfg={cfg} />
}
