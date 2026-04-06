import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { NICHE_PRICES, HOSTING_PLANS } from '@/lib/prices'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout | Zyph Labs',
  description: 'Complete your order to get your website built and launched.',
}

interface PageProps {
  searchParams: {
    niche?: string
    tier?: string
    hosting?: string
  }
}

type TierInfo = { name: string; price: number; priceId: string; features: readonly string[] }

export default function CheckoutPage({ searchParams }: PageProps) {
  const { niche, tier, hosting } = searchParams

  // Validate niche
  const nicheData = niche ? NICHE_PRICES[niche as keyof typeof NICHE_PRICES] : null
  if (!nicheData) redirect('/')

  // Validate tier — cast needed because as-const niches have non-overlapping tier keys
  const tiers = nicheData.tiers as Record<string, TierInfo>
  const tierData = tier ? tiers[tier] : null
  if (!tierData) redirect('/')

  // Validate hosting plan
  const hostingData = HOSTING_PLANS.find((p) => p.id === (hosting || 'professional'))
  if (!hostingData) redirect('/')

  return (
    <CheckoutClient
      niche={niche!}
      nicheName={nicheData.name}
      tier={tier!}
      tierName={tierData.name}
      buildFee={tierData.price}
      hostingPlan={hostingData.id}
      hostingName={hostingData.name}
      hostingFee={hostingData.price}
      serviceHref={`/services/${nicheData.slug}`}
    />
  )
}
