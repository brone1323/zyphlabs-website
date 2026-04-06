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
      const errText = await res.text()
      console.error('PayPal capture raw error:', errText)

      // Parse the PayPal error and return a user-friendly message
      let userMessage = 'Payment could not be processed. Please try again.'
      let errorCode = 'PAYMENT_FAILED'

      try {
        const errJson = JSON.parse(errText)
        const issue = errJson.details?.[0]?.issue

        switch (issue) {
          case 'INSTRUMENT_DECLINED':
            userMessage = 'Your payment method was declined. Please try a different card or payment method.'
            errorCode = 'DECLINED'
            break
          case 'PAYER_ACTION_REQUIRED':
            userMessage = 'Additional action is required to complete payment. Please try again.'
            errorCode = 'ACTION_REQUIRED'
            break
          case 'ORDER_NOT_APPROVED':
            userMessage = 'The payment was not approved. Please try again.'
            errorCode = 'NOT_APPROVED'
            break
          case 'DUPLICATE_INVOICE_ID':
            userMessage = 'This order has already been processed.'
            errorCode = 'DUPLICATE'
            break
          case 'MAX_NUMBER_OF_PAYMENT_ATTEMPTS_EXCEEDED':
            userMessage = 'Too many payment attempts. Please wait a few minutes and try again.'
            errorCode = 'TOO_MANY_ATTEMPTS'
            break
          default:
            if (res.status === 404 || res.status === 422) {
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
