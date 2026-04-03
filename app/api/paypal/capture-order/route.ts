import { NextRequest, NextResponse } from 'next/server'
import { sendNewSaleAlert, sendWelcomeEmail } from '@/lib/email'

const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId =
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal credentials not configured. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to env vars.'
    )
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal auth failed: ${err}`)
  }

  const data = await res.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json()

    if (!orderID) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    const accessToken = await getAccessToken()

    const res = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: '{}',
      }
    )

    if (!res.ok) {
      const err = await res.text()
      const hint =
        res.status === 404 || res.status === 422
          ? ' Ensure PAYPAL_MODE matches your credentials (live vs sandbox).'
          : ''
      return NextResponse.json(
        { error: `PayPal capture failed: ${err}${hint}` },
        { status: 500 }
      )
    }

    const data = await res.json()

    // Extract order metadata for notifications
    const unit = data.purchase_units?.[0]
    const customerEmail = data.payer?.email_address
    let niche: string | undefined
    let tier: string | undefined
    let hostingPlan: string | undefined
    let amountTotal: number | null = null

    try {
      const meta = JSON.parse(unit?.custom_id || '{}')
      niche = meta.niche
      tier = meta.tier
      hostingPlan = meta.hostingPlan
      amountTotal = Math.round(
        parseFloat(unit?.amount?.value || '0') * 100
      ) || null
    } catch (_) {}

    await Promise.allSettled([
      sendNewSaleAlert({ customerEmail, niche, tier, hostingPlan, amountTotal }),
      customerEmail
        ? sendWelcomeEmail({ to: customerEmail, niche, tier, hostingPlan })
        : Promise.resolve(),
    ])

    return NextResponse.json({
      success: true,
      orderID: data.id,
      payerID: data.payer?.payer_id,
    })
  } catch (e) {
    console.error('PayPal capture error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to capture payment' },
      { status: 500 }
    )
  }
}
