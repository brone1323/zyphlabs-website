import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

// App Router route handlers receive raw body via req.text() — no config needed
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  console.log(`Received Stripe webhook: ${event.type}`)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { niche, tier, hostingPlan } = session.metadata || {}
      const customerEmail = session.customer_details?.email

      console.log('New order completed:', {
        sessionId: session.id,
        niche,
        tier,
        hostingPlan,
        customerEmail,
        amountTotal: session.amount_total,
      })

      // TODO: Send onboarding email to client (via Resend or SendGrid)
      // await sendWelcomeEmail({ to: customerEmail, niche, tier, hostingPlan })

      // TODO: Send notification to Brian
      // await sendNewOrderAlert({ niche, tier, hostingPlan, customerEmail })

      // TODO: Create client record (Airtable, Notion, or DB)
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Invoice paid:', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amountPaid: invoice.amount_paid,
      })

      // TODO: Send monthly hosting receipt to client
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Invoice payment failed:', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        attemptCount: invoice.attempt_count,
      })

      // TODO: Send payment failure notification
      // Stripe's dunning management handles automatic retries, but you can send
      // a custom email with a link to update payment info
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription cancelled:', {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        niche: subscription.metadata?.niche,
      })

      // TODO: Trigger offboarding flow
      // - Send 30-day notice email
      // - Schedule site file delivery
      // - Update client record
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription updated:', subscription.id, subscription.status)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
