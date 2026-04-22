import Link from 'next/link'
import { getOffering } from '@/app/report/_engine/offerings'
import type { Industry } from '@/app/report/_engine/types'
import Tier2CheckoutClient from './Tier2CheckoutClient'

export const dynamic = 'force-dynamic'

const ALLOWED: Industry[] = [
  'project-based', 'appointment-based', 'retail', 'ecommerce',
  'professional-services', 'b2b-saas', 'trades', 'creative',
]

function parseBand(band: string): { low: number; high: number } {
  const nums = Array.from(band.matchAll(/\$([\d.]+)k?/gi)).map((m) => {
    const n = parseFloat(m[1])
    return band.toLowerCase().includes('k') ? n * 1000 : n
  })
  const low = nums[0] ?? 2500
  const high = nums[1] ?? low + 1000
  return { low, high }
}

export default function Tier2CheckoutPage({
  searchParams,
}: {
  searchParams: { industry?: string }
}) {
  const ind = (searchParams.industry || '') as Industry
  if (!ALLOWED.includes(ind)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xl font-bold mb-4">Z</div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">No industry specified</h1>
          <p className="text-slate-600 text-sm mb-4">
            To buy a Tier 2 automation, come through the link in your Business Intelligence Report, or
            take the free assessment first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link href="/assessment" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Take the assessment</Link>
            <a href="mailto:alex@zyphlabs.com" className="inline-block text-[#6c5ce7] border border-[#6c5ce7]/30 rounded-lg px-5 py-3 text-sm font-medium">Email us</a>
          </div>
        </div>
      </div>
    )
  }

  const offering = getOffering(ind)
  const { low, high } = parseBand(offering.tier2.priceBand)

  return <Tier2CheckoutClient industry={ind} tier2={offering.tier2} priceLow={low} priceHigh={high} />
}
