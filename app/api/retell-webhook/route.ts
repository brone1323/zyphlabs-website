// POST /api/retell-webhook — called by Retell when an assessment call ends.
//
// v3 behavior (2026-04-20):
// - Extracts AssessmentAnswers from transcript via Anthropic Claude Haiku
// - Sends INTERNAL notification to INTERNAL_NOTIFY_TO (no caller email)
// - Appends row to Google Sheet via SHEETS_WEBHOOK_URL (best-effort)
// - Returns the encoded report URL so we can preview what we'd send later
//
// The report URL is generated but NOT sent to the caller — follow-up is
// manual until we finalize the upsell flow.

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { AssessmentAnswers, Industry } from '@/app/report/_engine/types'
import { encodeAnswers } from '@/app/report/_engine/encoding'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RESEND_FROM = process.env.RESEND_FROM || 'Zyph Labs <onboarding@resend.dev>'
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zyphlabs.com'
const RESEND_KEY = process.env.RESEND_API_KEY
const INTERNAL_NOTIFY_TO = process.env.INTERNAL_NOTIFY_TO || 'alex@zyphlabs.com'
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL

// ════════════════════════════════════════════════════════════════
// Main handler
// ════════════════════════════════════════════════════════════════

export async function POST(req: Request) {
  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const event = payload?.event
  if (event !== 'call_analyzed' && event !== 'call_ended') {
    return NextResponse.json({ ignored: event }, { status: 200 })
  }

  const call = payload?.call ?? {}
  const transcript: string = call.transcript ?? ''
  if (!transcript) {
    console.warn('[retell-webhook] no transcript — skipping')
    return NextResponse.json({ skipped: 'no transcript' }, { status: 200 })
  }

  let answers: AssessmentAnswers
  try {
    answers = await extractAnswers(transcript, call)
  } catch (err) {
    console.error('[retell-webhook] extraction failed', err)
    return NextResponse.json(
      { error: 'extraction failed', detail: String(err).slice(0, 300) },
      { status: 500 },
    )
  }

  const encoded = encodeAnswers(answers)
  const reportUrl = `${SITE_URL}/report/dynamic?data=${encoded}`
  const callerEmail = extractEmailFromTranscript(transcript)

  // Internal notification — fire & don't fail on error.
  const notifyResult = await notifyInternal({
    source: 'retell',
    answers,
    callerEmail,
    reportUrl,
    callId: call.call_id,
    callDurationSec: call.duration_ms ? Math.round(call.duration_ms / 1000) : null,
  }).catch((err) => {
    console.error('[retell-webhook] notify failed', err)
    return { error: String(err).slice(0, 200) }
  })

  // Google Sheet append — fire & don't fail on error.
  const sheetResult = await appendToSheet({
    source: 'retell',
    answers,
    callerEmail,
    reportUrl,
  }).catch((err) => {
    console.error('[retell-webhook] sheet append failed', err)
    return { error: String(err).slice(0, 200) }
  })

  return NextResponse.json({
    ok: true,
    reportUrl,
    callerEmail,
    notifyResult,
    sheetResult,
  })
}

// ════════════════════════════════════════════════════════════════
// Extraction via Anthropic Claude Haiku
// ════════════════════════════════════════════════════════════════

async function extractAnswers(transcript: string, call: any): Promise<AssessmentAnswers> {
  if (!ANTHROPIC_KEY) throw new Error('ANTHROPIC_API_KEY not set')

  const systemPrompt =
    'You are a precise data extraction engine. Output strictly valid JSON matching the requested schema. No markdown, no commentary outside the JSON.'

  const userPrompt = `Read the assessment transcript below (a recorded call between a Zyph Labs agent and a business owner) and produce a single JSON object conforming EXACTLY to the AssessmentAnswers schema.

RULES:
- Output ONLY valid JSON. No markdown, no commentary.
- Every field in REQUIRED is mandatory. Use your best inference if not explicitly stated.
- For OPTIONAL fields, omit the field entirely if there's no evidence.
- Classify industry to one of: project-based, appointment-based, retail, ecommerce, professional-services, b2b-saas, trades, creative.
- Generate a URL-safe reportId like "firstname-lastname-yyyymmdd".

SCHEMA:
type Industry = 'project-based' | 'appointment-based' | 'retail' | 'ecommerce' | 'professional-services' | 'b2b-saas' | 'trades' | 'creative'
type CustomerType = 'consumer' | 'business' | 'both'
type RevenueModel = 'per-project' | 'per-visit' | 'subscription' | 'transactional' | 'hourly'

REQUIRED:
  reportId, ownerName, ownerFirstName, company, trade, industry, customerType, revenueModel, yearsInBusiness (number), teamSize (number), location, topPain

OPTIONAL (include only if stated):
  leadSources, primaryIntake, afterHoursHandling, leadsLostAfterHoursPerMonth, leadResponseTime, leadsPerMonth, closeRate, avgTicket
  quotingTool, quotingSpeedDays, quoteFollowUp, jobMgmtTool, changeOrderProcess, clientCommsStyle
  accountingTool, invoiceDelayDays, chasingPayments, chasingPaymentsAmount, officeSize
  hasWebsite, websiteAgeYears, googleReviewCount, asksForReviews, runsAds
  bookingTool, noShowRatePerWeek, recurringClientPct, visitsPerWeek, avgVisitValue
  posSystem, walkInPct, onlineOrdering, loyaltyProgram, transactionsPerDay
  ecomPlatform, monthlyRevenueBand, aov, returnRate, adSpendPct, fulfillment
  billingModel, timeTrackingTool, arAging60PlusPct, newClientFlow
  stage, salesCycleDays, crm, demoCloseRate, primaryChannel, churnRatePct
  maintenancePct, truckCount, onCallRotation
  pricingModel, bookingLeadDays, portfolioPlatform, assetDeliveryTool
  wantedTimeBack (string[]), keepsUpAtNight (string[]), leavingMoneyOnTable (string[]), softwareThatFlopped (string[])

TRANSCRIPT:
---
${transcript.slice(0, 15000)}
---

Output only the AssessmentAnswers JSON object.`

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!resp.ok) {
    const txt = await resp.text()
    throw new Error(`Anthropic ${resp.status}: ${txt.slice(0, 300)}`)
  }

  const json = await resp.json()
  let content = json?.content?.[0]?.text
  if (!content) throw new Error('no content from Anthropic')

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('no JSON object in response: ' + content.slice(0, 200))
  content = jsonMatch[0]

  const answers = JSON.parse(content) as AssessmentAnswers

  // Safety fallbacks
  answers.reportId = answers.reportId || `retell-${call.call_id || Date.now()}`
  answers.ownerFirstName =
    answers.ownerFirstName || answers.ownerName?.split(' ')[0] || 'there'
  answers.industry = (answers.industry || 'project-based') as Industry
  answers.customerType = (answers.customerType || 'consumer') as AssessmentAnswers['customerType']
  answers.revenueModel = (answers.revenueModel || 'per-project') as AssessmentAnswers['revenueModel']
  answers.teamSize = Number(answers.teamSize) || 1
  answers.yearsInBusiness = Number(answers.yearsInBusiness) || 0

  return answers
}

// ════════════════════════════════════════════════════════════════
// Internal notification email (to Zyph team, not the caller)
// ════════════════════════════════════════════════════════════════

async function notifyInternal(opts: {
  source: 'retell' | 'web'
  answers: AssessmentAnswers
  callerEmail: string | null
  reportUrl: string
  callId?: string
  callDurationSec?: number | null
}) {
  if (!RESEND_KEY) return { skipped: 'no RESEND_KEY' }

  const { source, answers, callerEmail, reportUrl, callId, callDurationSec } = opts
  const resend = new Resend(RESEND_KEY)

  const sourceLabel = source === 'retell' ? 'Phone call' : 'Website chat'
  const subj = `[Zyph] New ${sourceLabel.toLowerCase()} — ${answers.company} (${answers.industry})`

  const summaryLines = [
    `Source:       ${sourceLabel}`,
    `Name:         ${answers.ownerName}`,
    `Company:      ${answers.company}`,
    `Trade:        ${answers.trade}`,
    `Industry:     ${answers.industry}`,
    `Team size:    ${answers.teamSize}`,
    `Years:        ${answers.yearsInBusiness}`,
    `Location:     ${answers.location}`,
    `Top pain:     ${answers.topPain}`,
    `Caller email: ${callerEmail || '(not captured)'}`,
  ]
  if (callId) summaryLines.push(`Call ID:      ${callId}`)
  if (callDurationSec)
    summaryLines.push(`Duration:     ${Math.floor(callDurationSec / 60)}m ${callDurationSec % 60}s`)

  const text = `New assessment submission.

${summaryLines.join('\n')}

Report preview URL (not sent to caller):
${reportUrl}

Full answers JSON:
${JSON.stringify(answers, null, 2)}
`

  const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;line-height:1.55;color:#0f172a;max-width:620px;margin:32px auto;padding:0 20px">
  <div style="background:linear-gradient(90deg,#6c5ce7,#00cec9);color:white;padding:16px 20px;border-radius:10px;margin-bottom:24px">
    <div style="opacity:.85;font-size:12px;letter-spacing:.08em;text-transform:uppercase">${sourceLabel}</div>
    <div style="font-size:20px;font-weight:700;margin-top:4px">${escapeHtml(answers.company)} &middot; ${answers.industry}</div>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 0;color:#64748b;width:130px">Owner</td><td style="padding:6px 0"><strong>${escapeHtml(answers.ownerName)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Trade</td><td style="padding:6px 0">${escapeHtml(answers.trade)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Team size</td><td style="padding:6px 0">${answers.teamSize}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Years in business</td><td style="padding:6px 0">${answers.yearsInBusiness}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Location</td><td style="padding:6px 0">${escapeHtml(answers.location)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b;vertical-align:top">Top pain</td><td style="padding:6px 0">${escapeHtml(answers.topPain)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Caller email</td><td style="padding:6px 0">${callerEmail ? escapeHtml(callerEmail) : '<em style="color:#94a3b8">not captured</em>'}</td></tr>
    ${callId ? `<tr><td style="padding:6px 0;color:#64748b">Call ID</td><td style="padding:6px 0"><code style="font-size:12px">${escapeHtml(callId)}</code></td></tr>` : ''}
  </table>

  <p style="margin:24px 0 8px"><a href="${reportUrl}" style="background:#0f172a;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Preview the report we'd send &rarr;</a></p>
  <p style="color:#64748b;font-size:12px;margin:4px 0 24px">This report was NOT emailed to the caller. Follow up manually.</p>

  <details style="margin-top:16px">
    <summary style="cursor:pointer;color:#64748b;font-size:13px">Full answers JSON</summary>
    <pre style="background:#f1f5f9;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;margin-top:8px">${escapeHtml(JSON.stringify(answers, null, 2))}</pre>
  </details>

  <p style="color:#94a3b8;font-size:12px;margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px">
    Zyph Labs assessment pipeline &middot; automated internal notification
  </p>
</body></html>`

  const result = await resend.emails.send({
    from: RESEND_FROM,
    to: INTERNAL_NOTIFY_TO,
    subject: subj,
    text,
    html,
  })

  return result
}

// ════════════════════════════════════════════════════════════════
// Google Sheet append via Apps Script webhook
// ════════════════════════════════════════════════════════════════

async function appendToSheet(opts: {
  source: 'retell' | 'web'
  answers: AssessmentAnswers
  callerEmail: string | null
  reportUrl: string
}) {
  if (!SHEETS_WEBHOOK_URL) return { skipped: 'no SHEETS_WEBHOOK_URL' }

  const { source, answers, callerEmail, reportUrl } = opts
  const row = {
    timestamp: new Date().toISOString(),
    source,
    name: answers.ownerName,
    email: callerEmail || '',
    company: answers.company,
    industry: answers.industry,
    trade: answers.trade,
    topPain: answers.topPain,
    teamSize: answers.teamSize,
    yearsInBusiness: answers.yearsInBusiness,
    location: answers.location,
    reportUrl,
    answersJson: JSON.stringify(answers),
    status: 'new',
  }

  const resp = await fetch(SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  })

  if (!resp.ok) {
    const txt = await resp.text()
    throw new Error(`Sheets ${resp.status}: ${txt.slice(0, 200)}`)
  }

  return await resp.json().catch(() => ({ ok: true }))
}

// ════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════

function extractEmailFromTranscript(transcript: string): string | null {
  const match = transcript.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match?.[0] ?? null
}

function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Retell pings GET during webhook setup for liveness check
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'retell-webhook',
    model: 'claude-haiku-4-5',
    version: 3,
    behavior: 'internal-only (no caller email)',
  })
}
