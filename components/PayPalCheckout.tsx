'use client'

import { Component, type ReactNode } from 'react'
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'

const clientId = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').trim()

class PayPalErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[120px] flex flex-col items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 p-4 gap-2">
          <p className="text-amber-200 text-sm font-medium">PayPal could not load</p>
          <p className="text-amber-200/80 text-xs text-center">
            Check your connection or try again. You can also contact us to complete
            your order.
          </p>
          <a
            href="mailto:contact@zyphlabs.com"
            className="text-[#00cec9] hover:underline text-sm mt-1"
          >
            Email contact@zyphlabs.com
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

interface PayPalCheckoutProps {
  buildFee: number
  hostingFee: number
  niche: string
  tier: string
  hostingPlan: string
  onSuccess: (orderID: string) => void
}

function PayPalButtonsWrapper({
  buildFee,
  hostingFee,
  niche,
  tier,
  hostingPlan,
  onSuccess,
}: PayPalCheckoutProps) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer()

  if (isPending) {
    return (
      <div className="min-h-[120px] flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
        <p className="text-[#8888aa] text-sm">Loading PayPal…</p>
      </div>
    )
  }

  if (isRejected) {
    return (
      <div className="min-h-[120px] flex flex-col items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 p-4 gap-2">
        <p className="text-amber-200 text-sm font-medium">PayPal could not load</p>
        <p className="text-amber-200/80 text-xs text-center">
          Check your connection or try again. You can also contact us to complete
          your order.
        </p>
        <a
          href="mailto:contact@zyphlabs.com"
          className="text-[#00cec9] hover:underline text-sm mt-1"
        >
          Email contact@zyphlabs.com
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-4">
      <PayPalButtons
        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
        createOrder={async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ buildFee, hostingFee, niche, tier, hostingPlan }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to create order')
          return data.orderID
        }}
        onApprove={async ({ orderID }) => {
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID }),
          })
          const data = await res.json()
          if (!res.ok) {
            alert(data.error || 'Payment failed. Please try again.')
            return
          }
          onSuccess(orderID)
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
          alert('Payment failed. Please try again.')
        }}
      />
    </div>
  )
}

export function PayPalCheckout(props: PayPalCheckoutProps) {
  if (!clientId) {
    return (
      <div className="rounded-xl p-4 bg-amber-500/20 border border-amber-500/50">
        <p className="text-amber-200 text-sm">
          Add{' '}
          <code className="bg-black/20 px-1 rounded">
            NEXT_PUBLIC_PAYPAL_CLIENT_ID
          </code>{' '}
          to your env vars to enable PayPal checkout.
        </p>
      </div>
    )
  }

  return (
    <PayPalErrorBoundary>
      <PayPalScriptProvider
        options={{
          clientId,
          currency: 'USD',
          intent: 'capture',
          components: 'buttons',
        }}
      >
        <PayPalButtonsWrapper {...props} />
      </PayPalScriptProvider>
    </PayPalErrorBoundary>
  )
}
