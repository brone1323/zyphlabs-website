import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName } = body as { email?: string; firstName?: string }

    if (!email || !/.+@.+\..+/.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    console.log('[starter-kit-signup]', {
      email: email.trim(),
      firstName: firstName?.trim() ?? '',
      ts: new Date().toISOString(),
    })

    // TODO: wire to Mailchimp / ConvertKit — send PDF download link
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[starter-kit-signup] error:', err)
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}
