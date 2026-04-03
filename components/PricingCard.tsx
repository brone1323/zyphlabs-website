'use client'

import { useState } from 'react'
import { HOSTING_PLANS } from '@/lib/prices'

interface PricingCardProps {
  tierKey: string
  name: string
  price: number
  features: readonly string[]
  popular?: boolean
  nicheSlug: string
}

export default function PricingCard({
  tierKey,
  name,
  price,
  features,
  popular,
  nicheSlug,
}: PricingCardProps) {
  const [selectedHosting, setSelectedHosting] = useState('professional')
  const [loading, setLoading] = useState(false)

  const selectedPlan = HOSTING_PLANS.find((p) => p.id === selectedHosting)!

  const handleCheckout = () => {
    setLoading(true)
    window.location.href = `/checkout?niche=${encodeURIComponent(nicheSlug)}&tier=${encodeURIComponent(tierKey)}&hosting=${encodeURIComponent(selectedHosting)}`
  }

  return (
    <div
      className={`glass card-glow p-8 flex flex-col relative h-full ${
        popular ? 'popular-card' : ''
      }`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white text-xs font-semibold px-5 py-1.5 rounded-full shadow-[0_0_20px_rgba(108,92,231,0.5)]">
            Most Popular
          </span>
        </div>
      )}

      {/* Tier header */}
      <div className="mb-6">
        <p className="text-xs text-[#6c5ce7] uppercase tracking-widest font-semibold mb-2">
          {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
        </p>
        <h3
          className="text-xl font-semibold text-white mb-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            ${price.toLocaleString()}
          </span>
          <span className="text-[#8888aa] text-sm">one-time build fee</span>
        </div>
        <p className="text-xs text-[#555577] mt-1.5">
          + monthly hosting (choose below)
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#bbbbcc]">
            <span className="text-[#00cec9] flex-shrink-0 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* Hosting plan selector */}
      <div className="mb-5">
        <p className="text-[10px] text-[#666688] uppercase tracking-widest mb-3 font-semibold">
          Select Hosting Plan
        </p>
        <div className="space-y-2">
          {HOSTING_PLANS.map((plan) => (
            <label
              key={plan.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedHosting === plan.id
                  ? 'border-[#6c5ce7] bg-[rgba(108,92,231,0.12)]'
                  : 'border-white/8 hover:border-white/20 bg-white/2'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name={`hosting-${tierKey}-${nicheSlug}`}
                  value={plan.id}
                  checked={selectedHosting === plan.id}
                  onChange={() => setSelectedHosting(plan.id)}
                  className="accent-[#6c5ce7] w-4 h-4"
                />
                <div>
                  <span className="text-sm font-medium text-white">{plan.name}</span>
                  {plan.recommended && (
                    <span className="ml-2 text-[10px] text-[#00cec9] font-semibold uppercase tracking-wide">
                      Recommended
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-[#a29bfe]">
                ${plan.price}/mo
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/4 rounded-xl p-4 mb-6 border border-white/6">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-[#8888aa]">Build fee (one-time)</span>
          <span className="text-white font-medium">${price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#8888aa]">Hosting ({selectedPlan.name})</span>
          <span className="text-white font-medium">${selectedPlan.price}/mo</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/8">
          <span className="text-[#00cec9] text-xs">✓</span>
          <span className="text-[10px] text-[#666688]">
            30-day free hosting trial — no charge until your site is live
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`btn-primary w-full font-semibold text-base py-4 ${
          loading ? 'opacity-60 cursor-not-allowed transform-none' : ''
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading checkout...
          </span>
        ) : (
          'Get Started →'
        )}
      </button>

      <p className="text-center text-[10px] text-[#444466] mt-3">
        Secure checkout powered by PayPal
      </p>
    </div>
  )
}
