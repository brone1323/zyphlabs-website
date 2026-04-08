'use client'

import { Component, type ReactNode, useState } from 'react'
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
            href="mailto:alex@zyphlabs.com"
            className="text-[#00cec9] hover:underline text-sm mt-1"
          >
            Email alex@zyphlabs.com
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (isPending) {
    return (
      <div className="min-h-[120px] flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
        <p className="text-[#8888aa] text-sm">Loading PayPalâ¦</p>
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
          href="mailto:alex@zyphlabs.com"
          className="text-[#00cec9] hover:underline text-sm mt-1"
        >
          Email alex@zyphlabs.com
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="rounded-xl bg-red-500/15 border border-red-500/40 p-4 flex flex-col gap-2 animate-in fade-in">
          <p className="text-red-300 text-sm font-medium">{errorMsg}</p>
          <p className="text-red-300/70 text-xs">
            If the problem persists, contact us at{' '}
            <a
              href="mailto:alex@zyphlabs.com"
              className="text-[#00cec9] hover:underline"
            >
              alex@zyphlabs.com
            </a>
          </p>
          <button
            onClick={() => setErrorMsg(null)}
            className="self-start text-xs text-white/50 hover:text-white transition-colors mt-1"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="rounded-xl bg-white p-4">
        <PayPalButtons
          style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
          createOrder={async () => {
            setErrorMsg(null)
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
            setErrorMsg(null)
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID }),
            })
            const data = await res.json()
            if (!res.ok) {
              setErrorMsg(data.error || 'Payment could not be processed. Please try again.')
              return
            }
            onSuccess(orderID)
          }}
          onError={(err) => {
            console.error('PayPal error:', err)
            setErrorMsg('Something went wrong with PayPal. Please try again.')
          }}
        />
      </div>
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
          currency: 'CAD',
          intent: 'capture',
          components: 'buttons',
        }}
      >
        <PayPalButtonsWrapper {...props} />
      </PayPalScriptProvider>
    </PayPalErrorBoundary>
  )
}
