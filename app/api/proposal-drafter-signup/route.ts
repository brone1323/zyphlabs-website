import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body as { email?: string }

    if (!email || !/.+@.+\..+/.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    console.log('[proposal-drafter-signup]', { email: email.trim(), ts: new Date().toISOString() })

    // TODO: wire to Mailchimp early-access list
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[proposal-drafter-signup] error:', err)
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}
