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
    const { buildFee, hostingFee, niche, tier, hostingPlan } =
      await request.json()

    if (buildFee == null || hostingFee == null) {
      return NextResponse.json(
        { error: 'Missing required fee amounts' },
        { status: 400 }
      )
    }

    const buildAmount = Number(buildFee).toFixed(2)
    const hostingAmount = Number(hostingFee).toFixed(2)
    const total = (Number(buildFee) + Number(hostingFee)).toFixed(2)
    const isSaaS = hostingPlan === 'none'

    const accessToken = await getAccessToken()

    const items = [
      {
        name: isSaaS
          ? `Solar AI Agent \u2014 ${tier === 'annual' ? 'Annual' : 'Monthly'} Plan`
          : `Website Build \u2014 ${tier} (${niche})`,
        quantity: '1',
        unit_amount: { currency_code: 'CAD', value: buildAmount },
      },
    ]

    // Only add hosting line item when there's actual hosting
    if (!isSaaS) {
      items.push({
        name: `Hosting \u2014 ${hostingPlan} (first month)`,
        quantity: '1',
        unit_amount: { currency_code: 'CAD', value: hostingAmount },
      })
    }

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: JSON.stringify({ niche, tier, hostingPlan }),
          description: isSaaS
            ? `Zyph Labs \u2013 Solar AI Agent ${tier === 'annual' ? 'Annual' : 'Monthly'} Plan`
            : `Zyph Labs \u2013 ${tier} build (${niche}) + ${hostingPlan} hosting`,
          amount: {
            currency_code: 'CAD',
            value: total,
            breakdown: {
              item_total: { currency_code: 'CAD', value: total },
            },
          },
          items,
        },
      ],
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
      console.error('PayPal create-order raw error:', errText)

      let userMessage = 'Could not start checkout. Please try again.'
      let errorCode = 'CREATE_FAILED'

      try {
        const errJson = JSON.parse(errText)
        const issue = errJson.details?.[0]?.issue

        switch (issue) {
          case 'CURRENCY_NOT_SUPPORTED':
            userMessage = 'This currency is not supported. Please contact support.'
            errorCode = 'CURRENCY_ERROR'
            break
          case 'DECIMAL_PRECISION':
            userMessage = 'There was a pricing error. Please contact support.'
            errorCode = 'PRECISION_ERROR'
            break
          default:
            if (res.status === 401 || res.status === 404) {
              userMessage = 'Payment service configuration error. Please contact support.'
              errorCode = 'CONFIG_ERROR'
            }
            break
        }
      } catch (_) {
        // Not JSON â use default message
      }

      return NextResponse.json(
        { error: userMessage, code: errorCode },
        { status: 500 }
      )
    }

    const data = await res.json()
    return NextResponse.json({ orderID: data.id })
  } catch (e) {
    console.error('PayPal create order error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}
