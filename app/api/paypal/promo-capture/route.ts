import { NextRequest, NextResponse } from 'next/server'

const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId =
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured.')
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
      const errText = await res.text()
      console.error('PayPal promo capture error:', errText)
      return NextResponse.json(
        { error: 'Payment could not be processed.' },
        { status: 500 }
      )
    }

    const data = await res.json()

    return NextResponse.json({
      success: true,
      orderID: data.id,
      payerEmail: data.payer?.email_address,
    })
  } catch (e) {
    console.error('PayPal promo capture error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to capture payment' },
      { status: 500 }
    )
  }
}
