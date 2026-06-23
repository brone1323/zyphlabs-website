import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout Complete | Zyph Labs',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LeadsCheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center bg-slate-50 px-5 py-16 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight">
          Checkout complete
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Your subscription is set up. Complete the onboarding form so Zyph Labs
          can prepare your website, lead capture, local search, and advertising
          setup.
        </p>
        <Link
          href="/onboarding"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-base font-black text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/30"
        >
          Complete Onboarding
        </Link>
      </section>
    </div>
  )
}
