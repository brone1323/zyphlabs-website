'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PayPalTier2Button from '@/components/PayPalTier2Button'
import type { Industry } from '@/app/report/_engine/types'

export default function Tier2CheckoutClient({
  industry,
  tier2,
  priceLow,
  priceHigh,
}: {
  industry: Industry
  tier2: {
    title: string
    pitch: string
    whatItDoes: string[]
    integratesWith: string[]
    priceBand: string
    timeToLive: string
    expectedImpact: string
  }
  priceLow: number
  priceHigh: number
}) {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const onSuccess = (orderID: string) => {
    const qs = new URLSearchParams({ orderID, industry, email })
    router.push(`/checkout/tier-2/thank-you?${qs.toString()}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zyph Labs</span>
          </Link>
          <span className="text-xs text-slate-500">Secure checkout · PayPal</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#00a8a4] mb-2">Quick Win · Tier 2</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Here's exactly what you're getting
        </h1>
        <p className="text-slate-600 text-base mb-8">
          One Zyph-built AI agent, scoped for your business, live in 1–2 weeks. Review the scope, tap PayPal, and we'll email you a kickoff link within minutes.
        </p>

        <div className="bg-white rounded-2xl border-2 border-[#00cec9]/40 p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{tier2.title}</h2>
          <p className="text-slate-700 leading-relaxed mb-5">{tier2.pitch}</p>

          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">What it does</p>
            <ul className="space-y-1.5">
              {tier2.whatItDoes.map((line, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-[#00cec9] mt-0.5">✓</span>{line}</li>
              ))}
            </ul>
          </div>

          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Integrates with</p>
            <p className="text-sm text-slate-700">{tier2.integratesWith.join(' · ')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Today's charge</p>
              <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>${priceLow.toLocaleString()} <span className="text-sm font-normal text-slate-500">CAD</span></p>
              {priceHigh > priceLow && <p className="text-xs text-slate-500">Full scope: {tier2.priceBand} — final reconciled at kickoff</p>}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Time to live</p>
              <p className="text-base font-semibold text-slate-900">{tier2.timeToLive}</p>
              <p className="text-xs text-slate-500">{tier2.expectedImpact}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h3 className="text-base font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Our guarantee</h3>
          <p className="text-sm text-slate-700 mb-2">If it's not live in 2 weeks, you don't pay.</p>
          <p className="text-sm text-slate-700">If it doesn't do what we said it would, we fix it or refund you.</p>
          <p className="text-xs text-slate-500 mt-4 italic">Retainer (optional — $100–300/mo for tuning, monitoring, and feature additions) begins month 2. Cancel anytime.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">Your email (for kickoff)</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7]"
          />
          <p className="text-xs text-slate-500 mt-2">We'll send your kickoff booking link here within minutes of payment.</p>
        </div>

        <PayPalTier2Button industry={industry} customerEmail={email} onSuccess={onSuccess} />

        <p className="text-xs text-slate-500 text-center mt-6">
          Payments by PayPal · CAD · Refund guarantee · <a href="mailto:alex@zyphlabs.com" className="underline">alex@zyphlabs.com</a>
        </p>
      </main>
    </div>
  )
}
