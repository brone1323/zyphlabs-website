// POST /api/paypal/tier-2-create-order
// Creates a PayPal order for a Tier 2 (Single Automation) purchase.
// Body: { industry: Industry, customerEmail?: string }
// Price comes from the LOW end of the offering's priceBand.

import { NextRequest, NextResponse } from 'next/server'
import { getOffering } from '@/app/report/_engine/offerings'
import type { Industry } from '@/app/report/_engine/types'

const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('PayPal credentials not configured')

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('PayPal auth failed')
  const data = await res.json()
  return data.access_token
}

// Parse "$3k–$4k" → { low: 3000, high: 4000 }
function parseBand(band: string): { low: number; high: number } {
  const nums = Array.from(band.matchAll(/\$([\d.]+)k?/gi)).map((m) => {
    const n = parseFloat(m[1])
    return band.toLowerCase().includes('k') ? n * 1000 : n
  })
  const low = nums[0] ?? 2500
  const high = nums[1] ?? low + 1000
  return { low, high }
}

export async function POST(request: NextRequest) {
  try {
    const { industry, customerEmail } = await request.json()
    if (!industry) return NextResponse.json({ error: 'missing industry' }, { status: 400 })

    const offering = getOffering(industry as Industry)
    const tier2 = offering.tier2
    const { low } = parseBand(tier2.priceBand)
    const amount = low.toFixed(2)

    const accessToken = await getAccessToken()

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: JSON.stringify({ kind: 'zyph-tier-2', industry, customerEmail: customerEmail || null }),
          description: `Zyph Labs — ${tier2.title} (Tier 2 Automation)`,
          amount: {
            currency_code: 'CAD',
            value: amount,
            breakdown: {
              item_total: { currency_code: 'CAD', value: amount },
            },
          },
          items: [
            {
              name: tier2.title.slice(0, 127),
              quantity: '1',
              unit_amount: { currency_code: 'CAD', value: amount },
              description: (tier2.pitch || '').slice(0, 127),
            },
          ],
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        brand_name: 'Zyph Labs',
      },
    }

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(orderPayload),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[tier-2-create-order] PayPal error', err)
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ orderID: data.id, amount, currency: 'CAD' })
  } catch (e) {
    console.error('[tier-2-create-order] error', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create order' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'tier-2-create-order' })
}
