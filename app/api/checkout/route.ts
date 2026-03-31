import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { buildPriceId, hostingPriceId, niche, tier, hostingPlan } = await req.json()

    if (!buildPriceId || !hostingPriceId) {
      return NextResponse.json(
        { error: 'Missing required price IDs' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Stripe Checkout with:
    // - Build fee (one-time price) + Hosting (recurring price) as separate line items
    // - mode: 'subscription' allows mixing one-time and recurring line items
    // - The one-time build fee is charged immediately on the first invoice
    // - The recurring hosting subscription starts with a 30-day trial
    // NOTE: In your Stripe dashboard, buildPriceId must be a one-time price and
    //       hostingPriceId must be a recurring (monthly) price.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: buildPriceId,  // one-time price for the build fee
          quantity: 1,
        },
        {
          price: hostingPriceId, // recurring monthly hosting plan
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          niche,
          tier,
          hostingPlan,
        },
      },
      metadata: {
        niche,
        tier,
        hostingPlan,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${baseUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
