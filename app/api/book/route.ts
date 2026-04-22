// POST /api/book — creates a booking on Brian's Google Calendar via an Apps Script webhook.
//
// Body:
//   { type: 'setup'|'strategy'|'questions', date: 'YYYY-MM-DD', time: 'HH:mm',
//     durationMin: number, name: string, email: string, phone?: string, notes?: string }
//
// Env:
//   CALENDAR_WEBHOOK_URL — deployed Apps Script URL that creates the event on Brian's calendar
//   RESEND_API_KEY       — used to email the attendee a confirmation
//
// No availability check. Whatever the user picks, we create the event and invite them.

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TYPE_LABEL: Record<string, string> = {
  setup:     'Zyph Labs — Setup Help',
  strategy:  'Zyph Labs — 30-min Strategy Session',
  questions: 'Zyph Labs — 15-min Questions Call',
}

// Mountain Time offset. MDT (UTC-6) April–early Nov; MST (UTC-7) rest of year.
// Simple rule: second Sunday of March through first Sunday of November = MDT.
function mountainOffsetMinutes(dateISO: string): number {
  const d = new Date(dateISO + 'T12:00:00Z')
  const y = d.getUTCFullYear()
  // Second Sunday of March
  const mar1 = new Date(Date.UTC(y, 2, 1))
  const marSunday2 = 8 + ((7 - mar1.getUTCDay()) % 7)
  // First Sunday of November
  const nov1 = new Date(Date.UTC(y, 10, 1))
  const novSunday1 = 1 + ((7 - nov1.getUTCDay()) % 7)
  const start = Date.UTC(y, 2, marSunday2, 9, 0)  // 2am MST transitions at 3am MDT locally; 9:00Z is safe
  const end = Date.UTC(y, 10, novSunday1, 8, 0)
  const t = d.getTime()
  const isMDT = t >= start && t < end
  return isMDT ? -360 : -420  // MDT=UTC-6, MST=UTC-7
}

// Build an ISO UTC datetime string for a local MT date+time and a duration.
function buildUTCRange(date: string, time: string, durationMin: number) {
  const offset = mountainOffsetMinutes(date) // minutes vs UTC, negative
  const [hh, mm] = time.split(':').map(Number)
  // MT local wall time → UTC: subtract offset minutes.
  const local = new Date(`${date}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00Z`)
  const startUTCms = local.getTime() - offset * 60_000
  const endUTCms = startUTCms + durationMin * 60_000
  return {
    startISO: new Date(startUTCms).toISOString(),
    endISO: new Date(endUTCms).toISOString(),
    offsetMin: offset,
  }
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }) }

  const { type, date, time, durationMin, name, email, phone, notes } = body || {}
  if (!type || !date || !time || !durationMin || !name || !email) {
    return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
  }
  const title = TYPE_LABEL[type] || 'Zyph Labs \u2014 Booking'
  const { startISO, endISO } = buildUTCRange(date, time, durationMin)

  const description = [
    `Booked by ${name} <${email}>`,
    phone ? `Phone: ${phone}` : '',
    '',
    notes ? `Notes:\n${notes}` : 'No notes',
    '',
    `Type: ${type}. Duration: ${durationMin}min.`,
    `Booked via zyphlabs.com/book/${type}.`,
  ].filter(Boolean).join('\n')

  const calendarWebhook = process.env.CALENDAR_WEBHOOK_URL
  let calendarResult: any = { skipped: 'no CALENDAR_WEBHOOK_URL' }
  if (calendarWebhook) {
    try {
      const res = await fetch(calendarWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          startISO,
          endISO,
          description,
          attendeeEmail: email,
          attendeeName: name,
        }),
      })
      calendarResult = await res.json().catch(() => ({ ok: res.ok }))
      if (!res.ok) {
        console.error('[book] calendar webhook failed', res.status, calendarResult)
      }
    } catch (e: any) {
      console.error('[book] calendar webhook error', e)
      calendarResult = { error: String(e).slice(0, 200) }
    }
  }

  // Confirmation email to the attendee
  let emailResult: any = { skipped: 'no RESEND_API_KEY' }
  const RESEND_KEY = process.env.RESEND_API_KEY
  const FROM = process.env.RESEND_FROM || 'Zyph Labs <reports@zyphlabs.com>'
  if (RESEND_KEY) {
    try {
      const resend = new Resend(RESEND_KEY)
      const prettyDate = new Date(startISO).toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'full', timeStyle: 'short' })
      emailResult = await resend.emails.send({
        from: FROM,
        to: email,
        subject: `${title} \u2014 ${prettyDate} MT`,
        text:
`Hi ${name.split(' ')[0]},

You're booked for a ${title.replace('Zyph Labs \u2014 ', '')} with Alex at Zyph Labs.

When: ${prettyDate} Mountain
Duration: ${durationMin} minutes

${type === 'setup' ? "We'll send an invoice after the call. Pay within 14 days; cancel or reschedule anytime at alex@zyphlabs.com." : "No pitch, no payment \u2014 just the conversation."}

If anything comes up, email alex@zyphlabs.com and we'll reschedule.

Talk soon.
Alex, Zyph Labs`,
      })
    } catch (e: any) {
      emailResult = { error: String(e).slice(0, 200) }
    }
  }

  // Internal notification
  let notifyResult: any = { skipped: 'no RESEND_API_KEY' }
  const INTERNAL = process.env.INTERNAL_NOTIFY_TO || 'alex@zyphlabs.com'
  if (RESEND_KEY) {
    try {
      const resend = new Resend(RESEND_KEY)
      const prettyDate = new Date(startISO).toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'full', timeStyle: 'short' })
      notifyResult = await resend.emails.send({
        from: FROM,
        to: INTERNAL,
        subject: `[Zyph] Booked: ${type} with ${name} \u2014 ${prettyDate}`,
        text: `${description}\n\nStart (UTC): ${startISO}\nEnd (UTC): ${endISO}\n\nCalendar webhook result: ${JSON.stringify(calendarResult).slice(0,300)}`,
      })
    } catch (e: any) {
      notifyResult = { error: String(e).slice(0, 200) }
    }
  }

  return NextResponse.json({ ok: true, startISO, endISO, calendarResult, emailResult, notifyResult })
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'book', version: 1, note: 'POST { type,date,time,durationMin,name,email,phone?,notes? }' })
}
