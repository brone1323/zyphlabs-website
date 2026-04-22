'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

const clientId = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').trim()

function Inner({
  industry,
  offeringId,
  customerEmail,
  onSuccess,
}: {
  industry: string
  offeringId?: string
  customerEmail?: string
  onSuccess: (orderID: string) => void
}) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (isPending) {
    return (
      <div className="min-h-[90px] flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
        <p className="text-slate-500 text-sm">Loading PayPal&hellip;</p>
      </div>
    )
  }
  if (isRejected) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-amber-900 text-sm">PayPal didn&apos;t load. Email <a href="mailto:alex@zyphlabs.com" className="underline">alex@zyphlabs.com</a> and we&apos;ll invoice you directly.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {errorMsg}
          <button onClick={() => setErrorMsg(null)} className="ml-2 underline text-xs">dismiss</button>
        </div>
      )}
      <div className="rounded-xl bg-white border border-slate-200 p-4">
        <PayPalButtons
          style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
          createOrder={async () => {
            setErrorMsg(null)
            const res = await fetch('/api/paypal/tier-2-create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ industry, offeringId, customerEmail }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Could not start checkout')
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
            console.error('PayPal error', err)
            setErrorMsg('Something went wrong with PayPal. Try again or email us.')
          }}
        />
      </div>
    </div>
  )
}

export default function PayPalTier2Button(props: {
  industry: string
  offeringId?: string
  customerEmail?: string
  onSuccess: (orderID: string) => void
}) {
  if (!clientId) {
    return (
      <div className="rounded-xl p-4 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        PayPal isn&apos;t configured yet. Email <a href="mailto:alex@zyphlabs.com" className="underline">alex@zyphlabs.com</a> and we&apos;ll invoice you directly.
      </div>
    )
  }
  return (
    <PayPalScriptProvider options={{ clientId, currency: 'CAD', intent: 'capture', components: 'buttons' }}>
      <Inner {...props} />
    </PayPalScriptProvider>
  )
}
