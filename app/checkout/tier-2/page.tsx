import Link from 'next/link'
import { OFFERINGS } from '@/app/report/_engine/offerings'
import type { Industry } from '@/app/report/_engine/types'
import type { Tier2Offer } from '@/app/report/_engine/offerings'
import Tier2CheckoutClient from './Tier2CheckoutClient'

export const dynamic = 'force-dynamic'

function findOfferingById(id: string): { offer: Tier2Offer; industry: Industry } | null {
  for (const [industry, offering] of Object.entries(OFFERINGS)) {
    const offer = offering.tier2Menu.find((o) => o.id === id)
    if (offer) return { offer, industry: industry as Industry }
  }
  return null
}

export default function Tier2CheckoutPage({
  searchParams,
}: {
  searchParams: { offeringId?: string; industry?: string }
}) {
  const offeringId = searchParams.offeringId || ''
  let offer: Tier2Offer | null = null
  let industry: Industry = 'project-based'

  if (offeringId) {
    const hit = findOfferingById(offeringId)
    if (hit) { offer = hit.offer; industry = hit.industry }
  } else if (searchParams.industry && OFFERINGS[searchParams.industry as Industry]) {
    // Legacy fallback: if only ?industry= was passed, take the first tier 2 offer
    industry = searchParams.industry as Industry
    offer = OFFERINGS[industry].tier2Menu[0] ?? null
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-xl font-bold mb-4">Z</div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">We need a specific automation to check out</h1>
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

  return <Tier2CheckoutClient industry={industry} offer={offer} />
}
