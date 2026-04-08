'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PayPalCheckout } from '@/components/PayPalCheckout'

interface CheckoutClientProps {
  niche: string
  nicheName: string
  tier: string
  tierName: string
  buildFee: number
  hostingPlan: string
  hostingName: string
  hostingFee: number
  serviceHref: string
}

export default function CheckoutClient({
  niche,
  nicheName,
  tier,
  tierName,
  buildFee,
  hostingPlan,
  hostingName,
  hostingFee,
  serviceHref,
}: CheckoutClientProps) {
  const router = useRouter()
  const total = buildFee + hostingFee
  const isSaaS = hostingPlan === 'none'
  const isAnnual = tier === 'annual'

  const handleSuccess = (orderID: string) => {
    router.push(`/welcome?order_id=${orderID}`)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={serviceHref}
            className="text-sm text-[#8888aa] hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <h1
            className="text-3xl font-bold text-white mt-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Complete Your Order
          </h1>
          <p className="text-[#8888aa] mt-1">
            Secure checkout powered by PayPal
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order summary */}
          <div className="glass rounded-2xl p-8 h-fit">
            <h2
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-[#6c5ce7] uppercase tracking-widest font-semibold mb-1">
                  {nicheName}
                </p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-white">{tierName}</p>
                    <p className="text-xs text-[#8888aa]">
                      {isSaaS
                        ? isAnnual ? 'Annual subscription' : 'Monthly subscription'
                        : 'One-time build fee'}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    ${buildFee.toLocaleString()}{isSaaS && !isAnnual ? '/mo' : isSaaS && isAnnual ? '/yr' : ''}
                  </span>
                </div>
              </div>

              {!isSaaS && (
                <div className="border-t border-white/8 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {hostingName} Hosting
                      </p>
                      <p className="text-xs text-[#8888aa]">First month</p>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      ${hostingFee}/mo
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/4 rounded-xl p-4 border border-white/6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#8888aa]">Total due today</span>
                <span className="text-xl font-bold text-white">
                  ${total.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[#555577] mt-2">
                {isSaaS
                  ? `All prices in CAD. ${isAnnual ? 'Renews annually.' : 'Renews monthly.'} Cancel anytime.`
                  : `All prices in CAD. Includes build fee + first month hosting. Hosting renews monthly at $${hostingFee}/mo.`}
              </p>
            </div>

            <div className="space-y-2">
              {isSaaS ? (
                <>
                  <div className="flex items-center gap-2 text-xs text-[#666688]">
                    <span className="text-[#00cec9]">✓</span>
                    Onboarded and live within 48 hours
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#666688]">
                    <span className="text-[#00cec9]">✓</span>
                    Cancel anytime — no lock-in
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-[#666688]">
                    <span className="text-[#00cec9]">✓</span>
                    Site built and launched within 7–14 days
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#666688]">
                    <span className="text-[#00cec9]">✓</span>
                    Cancel hosting anytime — no long-term contract
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-xs text-[#666688]">
                <span className="text-[#00cec9]">✓</span>
                Buyer protection via PayPal
              </div>
            </div>
          </div>

          {/* PayPal payment */}
          <div>
            <div className="glass rounded-2xl p-8">
              <h2
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Payment
              </h2>
              <p className="text-sm text-[#8888aa] mb-6">
                Pay securely with your PayPal account or credit card.
              </p>

              <PayPalCheckout
                buildFee={buildFee}
                hostingFee={hostingFee}
                niche={niche}
                tier={tier}
                hostingPlan={hostingPlan}
                onSuccess={handleSuccess}
              />
            </div>

            <p className="text-center text-xs text-[#444466] mt-4">
              Questions?{' '}
              <a
                href="mailto:alex@zyphlabs.com"
                className="text-[#8888aa] hover:text-white transition-colors"
              >
                alex@zyphlabs.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
