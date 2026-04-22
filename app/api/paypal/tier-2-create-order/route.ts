// POST /api/paypal/tier-2-create-order
// Creates a PayPal order for a Tier 2 (Single Automation) purchase.
// Body: { industry?: Industry, offeringId?: string, customerEmail?: string }
// Price = offer.price from offerings.ts (the specific automation picked).

import { NextRequest, NextResponse } from 'next/server'
import { OFFERINGS } from '@/app/report/_engine/offerings'
import type { Tier2Offer } from '@/app/report/_engine/offerings'
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

function findOfferById(id: string): { offer: Tier2Offer; industry: Industry } | null {
  for (const [industry, offering] of Object.entries(OFFERINGS)) {
    const offer = offering.tier2Menu.find((o) => o.id === id)
    if (offer) return { offer, industry: industry as Industry }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { industry, offeringId, customerEmail } = await request.json()

    let offer: Tier2Offer | null = null
    let resolvedIndustry: Industry | null = null

    if (offeringId) {
      const hit = findOfferById(offeringId)
      if (hit) { offer = hit.offer; resolvedIndustry = hit.industry }
    } else if (industry && OFFERINGS[industry as Industry]) {
      // Legacy: pick first offer in the industry menu
      resolvedIndustry = industry as Industry
      offer = OFFERINGS[resolvedIndustry].tier2Menu[0] ?? null
    }

    if (!offer || !resolvedIndustry) {
      return NextResponse.json({ error: 'missing or unknown offering' }, { status: 400 })
    }

    const amount = offer.price.toFixed(2)

    const accessToken = await getAccessToken()

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: JSON.stringify({ kind: 'zyph-tier-2', industry: resolvedIndustry, offeringId: offer.id, customerEmail: customerEmail || null }),
          description: `Zyph Labs \u2014 ${offer.title} (Tier 2 Automation)`,
          amount: {
            currency_code: 'CAD',
            value: amount,
            breakdown: {
              item_total: { currency_code: 'CAD', value: amount },
            },
          },
          items: [
            {
              name: offer.title.slice(0, 127),
              quantity: '1',
              unit_amount: { currency_code: 'CAD', value: amount },
              description: (offer.pitch || '').slice(0, 127),
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
    return NextResponse.json({ orderID: data.id, amount, currency: 'CAD', offeringId: offer.id })
  } catch (e) {
    console.error('[tier-2-create-order] error', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create order' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'tier-2-create-order', version: 2 })
}
