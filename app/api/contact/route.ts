import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'

const rateMap = new Map<string, number>()
const RATE_WINDOW_MS = 30_000

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const now = Date.now()
    const last = rateMap.get(ip) ?? 0
    if (now - last < RATE_WINDOW_MS) {
      return NextResponse.json(
        { error: 'Please wait 30 seconds before submitting again.' },
        { status: 429 }
      )
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const { name, email, subject, message, website } = body as {
      name?: string
      email?: string
      subject?: string
      message?: string
      website?: string
    }

    // Honeypot — silently accept so bots don't know they were caught
    if (website) {
      return NextResponse.json({ ok: true })
    }

    const nameTrimmed = name?.trim() ?? ''
    const emailTrimmed = email?.trim() ?? ''
    const subjectTrimmed = subject?.trim() ?? ''
    const messageTrimmed = message?.trim() ?? ''

    if (!nameTrimmed || !emailTrimmed || !messageTrimmed) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }
    if (messageTrimmed.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 }
      )
    }
    if (!/.+@.+\..+/.test(emailTrimmed)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    rateMap.set(ip, now)

    const text =
      `📨 New Zyph contact-form submission\n\n` +
      `From: ${escapeHtml(nameTrimmed)} &lt;${escapeHtml(emailTrimmed)}&gt;\n` +
      `Subject: ${escapeHtml(subjectTrimmed || '(none)')}\n\n` +
      `${escapeHtml(messageTrimmed)}`

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      const entry = {
        ts: new Date().toISOString(),
        name: nameTrimmed,
        email: emailTrimmed,
        subject: subjectTrimmed,
        message: messageTrimmed,
      }
      console.log('[contact] Telegram env vars not configured — logging submission:', entry)
      try {
        const tmpPath = '/tmp/contact-submissions.json'
        let existing: unknown[] = []
        try {
          const raw = await readFile(tmpPath, 'utf-8')
          existing = JSON.parse(raw)
        } catch {}
        existing.push(entry)
        await writeFile(tmpPath, JSON.stringify(existing, null, 2))
      } catch (writeErr) {
        console.log('[contact] /tmp write failed (expected on Vercel):', writeErr)
      }
      return NextResponse.json({ ok: true })
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })

    if (!tgRes.ok) {
      const tgErr = await tgRes.text()
      console.error('[contact] Telegram API error:', tgErr)
      return NextResponse.json(
        { error: 'Failed to deliver your message. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error. Please try again.' }, { status: 500 })
  }
}
