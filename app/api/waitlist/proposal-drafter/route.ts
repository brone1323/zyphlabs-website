import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // Graceful degradation in dev/preview without key configured yet
      console.log('[proposal-drafter waitlist] no RESEND_API_KEY — skipping Resend call, email:', email)
      return NextResponse.json({ ok: true })
    }

    // Lazy import so Resend is never instantiated at build time
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const audienceId = process.env.RESEND_AUDIENCE_ID_PROPOSAL_DRAFTER
    if (!audienceId) {
      console.warn('[proposal-drafter waitlist] RESEND_AUDIENCE_ID_PROPOSAL_DRAFTER not set — contact added without audience')
    }

    await resend.contacts.create({
      email,
      ...(audienceId ? { audienceId } : {}),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[proposal-drafter waitlist] error:', err)
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
