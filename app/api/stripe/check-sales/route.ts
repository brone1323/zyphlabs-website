import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Auth: require CRON_SECRET if set
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const token =
      req.nextUrl.searchParams.get('token') ??
      req.headers.get('authorization')?.replace('Bearer ', '')
    if (token !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const stripe = getStripe()
    const threeHoursAgo = Math.floor(Date.now() / 1000) - 3 * 60 * 60

    const charges = await stripe.charges.list({
      created: { gte: threeHoursAgo },
      limit: 100,
    })

    const successful = charges.data.filter((c) => c.status === 'succeeded')

    const totalRevenue = successful.reduce((sum, c) => sum + c.amount, 0)

    const recentCharges = successful.map((c) => ({
      id: c.id,
      amount: c.amount,
      amountFormatted: `$${(c.amount / 100).toFixed(2)} ${c.currency.toUpperCase()}`,
      customerEmail: c.billing_details?.email ?? c.receipt_email ?? null,
      description: c.description ?? null,
      timestamp: new Date(c.created * 1000).toISOString(),
    }))

    return NextResponse.json({
      since: new Date(threeHoursAgo * 1000).toISOString(),
      totalSales: successful.length,
      totalRevenue,
      totalRevenueFormatted: `$${(totalRevenue / 100).toFixed(2)}`,
      charges: recentCharges,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('check-sales error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
