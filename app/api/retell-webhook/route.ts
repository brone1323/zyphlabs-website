// POST /api/retell-webhook — called by Retell when an assessment call ends.
// Extracts AssessmentAnswers from the transcript via Anthropic Claude,
// generates the report URL (stateless — answers encoded in URL), emails the link.

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { AssessmentAnswers, Industry } from '@/app/report/_engine/types'
import { encodeAnswers } from '@/app/report/_engine/encoding'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RESEND_FROM = process.env.RESEND_FROM || 'Zyph Labs <onboarding@resend.dev>'
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zyphlabs.com'
const RESEND_KEY = process.env.RESEND_API_KEY

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
    return NextResponse.json({ error: 'extraction failed', detail: String(err).slice(0, 300) }, { status: 500 })
  }

  const encoded = encodeAnswers(answers)
  const reportUrl = `${SITE_URL}/report/dynamic?data=${encoded}`

  const email = extractEmailFromTranscript(transcript)
  let emailResult: any = null
  if (email && RESEND_KEY) {
    try {
      emailResult = await sendReportEmail({ to: email, firstName: answers.ownerFirstName, company: answers.company, reportUrl })
    } catch (err) {
      console.error('[retell-webhook] email send failed', err)
      emailResult = { error: String(err).slice(0, 200) }
    }
  }

  return NextResponse.json({
    ok: true,
    reportUrl,
    email,
    emailed: !!(email && RESEND_KEY && !emailResult?.error),
    emailResult,
  })
}

async function extractAnswers(transcript: string, call: any): Promise<AssessmentAnswers> {
  if (!ANTHROPIC_KEY) throw new Error('ANTHROPIC_API_KEY not set')

  const systemPrompt = 'You are a precise data extraction engine. Output strictly valid JSON matching the requested schema. No markdown, no commentary outside the JSON.'

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

  // Claude sometimes wraps JSON in ```json ... ``` even when asked not to.
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('no JSON object in response: ' + content.slice(0, 200))
  content = jsonMatch[0]

  const answers = JSON.parse(content) as AssessmentAnswers

  answers.reportId = answers.reportId || `retell-${call.call_id || Date.now()}`
  answers.ownerFirstName = answers.ownerFirstName || answers.ownerName?.split(' ')[0] || 'there'
  answers.industry = (answers.industry || 'project-based') as Industry
  answers.customerType = (answers.customerType || 'consumer') as AssessmentAnswers['customerType']
  answers.revenueModel = (answers.revenueModel || 'per-project') as AssessmentAnswers['revenueModel']
  answers.teamSize = Number(answers.teamSize) || 1
  answers.yearsInBusiness = Number(answers.yearsInBusiness) || 0

  return answers
}

function extractEmailFromTranscript(transcript: string): string | null {
  const match = transcript.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match?.[0] ?? null
}

async function sendReportEmail(opts: {
  to: string
  firstName: string
  company: string
  reportUrl: string
}) {
  const resend = new Resend(RESEND_KEY)
  const { to, firstName, company, reportUrl } = opts

  const text = `Hey ${firstName},

Thanks for jumping on with us. Here's your ${company} AI Opportunity Report — a personalized breakdown of where AI and automation can save you hours and make you money:

${reportUrl}

It's broken into three tiers:
1. Quick wins you can set up yourself this week (free / under $50/mo)
2. Medium lifts where we set things up for you ($500–$3k)
3. Big builds for custom AI systems (price-anchored against typical agency cost)

Whenever you're ready to talk through any of it, book a 20-minute call via the Book a strategy call button in the report.

Zyph Labs
zyphlabs.com`

  const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:40px auto;padding:0 20px">
  <h2 style="font-size:24px;margin:0 0 20px;color:#0f172a">Hey ${firstName},</h2>
  <p>Thanks for jumping on with us. Here's your <strong>${company}</strong> AI Opportunity Report — a personalized breakdown of where AI and automation can save you hours and make you money:</p>
  <p style="margin:32px 0"><a href="${reportUrl}" style="background:linear-gradient(90deg,#6c5ce7,#00cec9);color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block">Open your report →</a></p>
  <p>It's broken into three tiers:</p>
  <ol>
    <li><strong>Quick wins</strong> you can set up yourself this week (free / under $50/mo)</li>
    <li><strong>Medium lifts</strong> where we set things up for you ($500–$3k)</li>
    <li><strong>Big builds</strong> for custom AI systems (price-anchored against typical agency cost)</li>
  </ol>
  <p>Whenever you're ready to talk through any of it, book a 20-minute call via the <em>Book a strategy call</em> button in the report.</p>
  <p style="color:#64748b;font-size:14px;margin-top:48px;border-top:1px solid #e2e8f0;padding-top:20px">
    Zyph Labs · <a href="https://zyphlabs.com" style="color:#6c5ce7;text-decoration:none">zyphlabs.com</a>
  </p>
</body></html>`

  const result = await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject: `${firstName}, your ${company} AI Opportunity Report is ready`,
    text,
    html,
  })

  return result
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'retell-webhook', model: 'claude-haiku-4-5' })
}
