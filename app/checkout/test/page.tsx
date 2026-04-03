import type { Metadata } from 'next'
import CheckoutClient from '../CheckoutClient'

export const metadata: Metadata = {
  title: 'Test Checkout | Zyph Labs',
  robots: { index: false, follow: false },
}

export default function TestCheckoutPage() {
  return (
    <CheckoutClient
      niche="contractors"
      nicheName="$1 Test Order"
      tier="test"
      tierName="PayPal Integration Test"
      buildFee={0.5}
      hostingPlan="starter"
      hostingName="Test"
      hostingFee={0.5}
      serviceHref="/checkout"
    />
  )
}
