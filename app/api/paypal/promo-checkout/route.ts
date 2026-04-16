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
    const { items, returnUrl, cancelUrl } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = items
      .reduce((sum: number, item: { price: number }) => sum + item.price, 0)
      .toFixed(2)

    const paypalItems = items.map((item: { name: string; price: number }) => ({
      name: item.name,
      quantity: '1',
      unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
    }))

    const accessToken = await getAccessToken()

    const orderPayload: Record<string, unknown> = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: JSON.stringify({ source: 'spring-promo', items: items.map((i: { name: string }) => i.name) }),
          description: 'Zyph Labs — Spring 2026 Promo',
          amount: {
            currency_code: 'USD',
            value: total,
            breakdown: {
              item_total: { currency_code: 'USD', value: total },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        brand_name: 'Zyph Labs',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: returnUrl || 'https://www.zyphlabs.com/promotions?status=success',
        cancel_url: cancelUrl || 'https://www.zyphlabs.com/promotions?status=cancelled',
      },
    }

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('PayPal promo create-order error:', errText)
      return NextResponse.json(
        { error: 'Could not start checkout. Please try again.' },
        { status: 500 }
      )
    }

    const data = await res.json()

    // Find the approval link
    const approvalUrl = data.links?.find(
      (link: { rel: string; href: string }) => link.rel === 'approve'
    )?.href

    return NextResponse.json({ orderID: data.id, approvalUrl })
  } catch (e) {
    console.error('PayPal promo checkout error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}
