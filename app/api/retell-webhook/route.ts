// POST /api/retell-webhook — called by Retell when an assessment call ends.
//
// v4 behavior (2026-04-20):
// - Extracts AssessmentAnswers from transcript via Anthropic Claude Haiku
// - Internal notification + Sheet append via shared pipeline in _lib/assessment
// - Caller gets nothing automated — follow-up is manual

import { NextResponse } from 'next/server'
import type { AssessmentAnswers, Industry } from '@/app/report/_engine/types'
import {
  buildReportUrl,
  notifyInternal,
  appendToSheet,
  extractEmailFromText,
} from '../_lib/assessment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

// ═══════════════════════════════════════════════════════════════
// Main handler
// ═══════════════════════════════════════════════════════════════

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
    answers = await extractAnswersFromTranscript(transcript, call)
  } catch (err) {
    console.error('[retell-webhook] extraction failed', err)
    return NextResponse.json(
      { error: 'extraction failed', detail: String(err).slice(0, 300) },
      { status: 500 },
    )
  }

  const reportUrl = buildReportUrl(answers)
  const callerEmail = extractEmailFromText(transcript)

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

// ═══════════════════════════════════════════════════════════════
// Extract via Anthropic Claude Haiku (transcript → AssessmentAnswers)
// Only used for Retell; web chat collects answers directly via tool use.
// ═══════════════════════════════════════════════════════════════

async function extractAnswersFromTranscript(
  transcript: string,
  call: any,
): Promise<AssessmentAnswers> {
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

// ═══════════════════════════════════════════════════════════════
// Health check (Retell pings GET during webhook setup)
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'retell-webhook',
    model: 'claude-haiku-4-5',
    version: 4,
    behavior: 'internal-only; shared pipeline via _lib/assessment',
  })
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            