import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getLeadsPlan } from '@/lib/leads-plans'
import { getStripe } from '@/lib/stripe'

function getBaseUrl(origin: string | null) {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    origin ||
    'https://www.zyphlabs.com'
  ).replace(/\/$/, '')
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const planId = url.searchParams.get('plan')

  if (!planId) {
    return NextResponse.redirect(new URL('/leads#plans', request.url))
  }

  const plan = getLeadsPlan(planId)

  if (!plan) {
    return NextResponse.redirect(new URL('/leads#plans', request.url))
  }

  const requestHeaders = headers()
  const baseUrl = getBaseUrl(requestHeaders.get('origin'))

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: plan.amount,
            recurring: {
              interval: 'month',
            },
            product_data: {
              name: `Zyph Labs ${plan.name}`,
              description: plan.description,
              metadata: {
                plan: plan.id,
                product: 'leads',
              },
            },
          },
        },
      ],
      metadata: {
        plan: plan.id,
        planName: plan.name,
        product: 'leads',
      },
      subscription_data: {
        metadata: {
          plan: plan.id,
          planName: plan.name,
          product: 'leads',
        },
      },
      success_url: `${baseUrl}/leads/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/leads#plans`,
    })

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL.')
    }

    return NextResponse.redirect(session.url, 303)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const type =
      typeof error === 'object' && error !== null && 'type' in error
        ? String(error.type)
        : 'unknown'

    console.error('Leads Stripe checkout failed', {
      type,
      message,
      plan: plan.id,
    })

    return NextResponse.redirect(
      new URL('/leads/checkout-error?reason=checkout', request.url)
    )
  }
}
