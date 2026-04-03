'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PayPalCheckout } from '@/components/PayPalCheckout'

const BUILD_FEE = 0.5
const HOSTING_FEE = 0.5
const TOTAL = BUILD_FEE + HOSTING_FEE

export default function TestCheckoutClient() {
  const router = useRouter()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#8888aa] hover:text-white transition-colors">
            ← Back
          </Link>
          <h1
            className="text-3xl font-bold text-white mt-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            PayPal Integration Test
          </h1>
          <p className="text-[#8888aa] mt-1">$1 end-to-end test — not for production use</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-8 h-fit">
            <h2
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">Test build fee</span>
                <span className="text-sm font-semibold text-white">${BUILD_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/8 pt-4">
                <span className="text-sm text-white">Test hosting fee</span>
                <span className="text-sm font-semibold text-white">${HOSTING_FEE.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-white/4 rounded-xl p-4 border border-white/6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#8888aa]">Total due today</span>
                <span className="text-xl font-bold text-white">${TOTAL.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Payment
            </h2>
            <PayPalCheckout
              buildFee={BUILD_FEE}
              hostingFee={HOSTING_FEE}
              niche="test"
              tier="test"
              hostingPlan="test"
              onSuccess={(orderID) => router.push(`/welcome?order_id=${orderID}`)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
