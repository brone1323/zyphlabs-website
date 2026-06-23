import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout Issue | Zyph Labs',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LeadsCheckoutErrorPage() {
  return (
    <div className="flex min-h-screen items-center bg-slate-50 px-5 py-16 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <AlertCircle className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight">
          Checkout could not start
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Stripe Checkout was not available for this request. Please return to
          the plans and try again.
        </p>
        <Link
          href="/leads#plans"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-base font-black text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/30"
        >
          View Plans
        </Link>
      </section>
    </div>
  )
}
