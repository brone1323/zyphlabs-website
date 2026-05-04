import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('[project-runner waitlist] no RESEND_API_KEY — skipping Resend call, email:', email)
      return NextResponse.json({ ok: true })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const audienceId = process.env.RESEND_AUDIENCE_ID_PROJECT_RUNNER
    if (!audienceId) {
      console.warn('[project-runner waitlist] RESEND_AUDIENCE_ID_PROJECT_RUNNER not set — contact added without audience')
    }

    await resend.contacts.create({
      email,
      ...(audienceId ? { audienceId } : {}),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[project-runner waitlist] error:', err)
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
