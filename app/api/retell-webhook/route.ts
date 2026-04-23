// POST /api/retell-webhook — called by Retell when an assessment call ends.
//
// v8 behavior (2026-04-23):
// - Processes ONLY `call_analyzed` events. Previously v7 also processed `call_ended`,
//   which fired BEFORE Retell finished analysis and resulted in duplicate notifications
//   (one with a blank/partial trade field, one with full analysis). One call = one notify now.
// - Extracts AssessmentAnswers from transcript via Anthropic Claude Haiku
// - Schema includes new Q7 (project mgmt tools), Q8 (hours/week on info), Q9 (interest level)
// - Schema includes ownerEmail (Haiku reconstructs spoken "at"/"dot" emails)
// - Industry list reduced to 6 (dropped project-based, b2b-saas)
// - Internal notification + caller email + Sheet append via shared pipeline

import { NextResponse } from 'next/server'
import type { AssessmentAnswers, Industry } from '@/app/report/_engine/types'
import {
  buildReportUrl, notifyInternal, sendCallerEmail, appendToSheet, extractEmailFromText,
} from '../_lib/assessment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

export async function POST(req: Request) {
  let payload: any
  try { payload = await req.json() } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }) }

  const event = payload?.event
  // Only process call_analyzed (has full Retell analysis). Ignore call_ended and all
  // other events — call_ended fires before analysis and would cause duplicate processing.
  if (event !== 'call_analyzed') {
    return NextResponse.json({ ignored: event }, { status: 200 })
  }

  const call = payload?.call ?? {}
  const transcript: string = call.transcript ?? ''
  if (!transcript) return NextResponse.json({ skipped: 'no transcript' }, { status: 200 })

  let answers: AssessmentAnswers
  try { answers = await extractAnswersFromTranscript(transcript, call) }
  catch (err) {
    console.error('[retell-webhook] extraction failed', err)
    return NextResponse.json({ error: 'extraction failed', detail: String(err).slice(0, 300) }, { status: 500 })
  }

  const reportUrl = buildReportUrl(answers)
  const callerEmail =
    ((answers as any).ownerEmail && String((answers as any).ownerEmail).trim()) ||
    extractEmailFromText(transcript)

  const notifyResult = await notifyInternal({
    source: 'retell', answers, callerEmail, reportUrl,
    callId: call.call_id,
    callDurationSec: call.duration_ms ? Math.round(call.duration_ms / 1000) : null,
  }).catch((err) => ({ error: String(err).slice(0, 200) }))

  const callerResult = callerEmail
    ? await sendCallerEmail({
        to: callerEmail,
        firstName: answers.ownerFirstName || answers.ownerName?.split(' ')[0] || 'there',
        company: answers.company,
        reportUrl,
      }).catch((err) => ({ error: String(err).slice(0, 200) }))
    : { skipped: 'no caller email in transcript' }

  const sheetResult = await appendToSheet({
    source: 'retell', answers, callerEmail, reportUrl,
  }).catch((err) => ({ error: String(err).slice(0, 200) }))

  return NextResponse.json({ ok: true, reportUrl, callerEmail, notifyResult, callerResult, sheetResult })
}

async function extractAnswersFromTranscript(transcript: string, call: any): Promise<AssessmentAnswers> {
  if (!ANTHROPIC_KEY) throw new Error('ANTHROPIC_API_KEY not set')

  const systemPrompt = 'You are a precise data extraction engine. Output strictly valid JSON matching the schema. No markdown.'
  const userPrompt = `Read the call transcript and produce a single AssessmentAnswers JSON object.

SCHEMA required fields:
- reportId, ownerName, ownerFirstName, ownerEmail
- company, trade
- industry (one of: trades, appointment-based, retail, ecommerce, professional-services, creative)
- customerType (consumer | business | both)
- revenueModel (per-project | per-visit | subscription | transactional | hourly)
- yearsInBusiness, teamSize, location, topPain

NEW FIELDS (from the Q7-Q9 flow):
- projectMgmtTools: array of strings from ["crm","excel","email","phone","sms","spreadsheets","whiteboard","other"] — which tools the caller named when asked how they keep their team and customers in sync on projects. Include every tool they mentioned.
- infoHoursPerWeek: free-text string of how many hours/week the team spends on information handling (e.g. "15 hours/week" or "about 20"). Empty string if not stated.
- interestLevel: "yes" | "maybe" | "no" — when asked "would you be interested in getting 90% of that time back with real-time visibility of progress/costs/margins?" capture their stance. Default to "maybe" if they were receptive but non-committal. Default to "" if not asked.

INDUSTRY MAPPING NOTE: construction/GC/remodel/plumbing/HVAC/electrical all map to "trades". Do not output "project-based" or "b2b-saas" — those are not valid values anymore.

EMAIL EXTRACTION NOTE: callers often speak email addresses aloud using "at" for @ and "dot" for "." (e.g. "brian at solardev dot ca" -> "brian@solardev.ca"). Reconstruct the literal email address in ownerEmail. If no email was provided, set ownerEmail to an empty string "".

TRANSCRIPT:
---
${transcript.slice(0, 15000)}
---

Output only the JSON object.`

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
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
  const m = content.match(/\{[\s\S]*\}/)
  if (!m) throw new Error('no JSON in response')
  const raw = JSON.parse(m[0]) as any

  // Normalize defaults
  raw.reportId = raw.reportId || `retell-${call.call_id || Date.now()}`
  raw.ownerFirstName = raw.ownerFirstName || raw.ownerName?.split(' ')[0] || 'there'
  // Map legacy industry names that Haiku might still output
  if (raw.industry === 'project-based' || raw.industry === 'b2b-saas') raw.industry = 'trades'
  raw.industry = (raw.industry || 'trades') as Industry
  raw.customerType = (raw.customerType || 'consumer')
  raw.revenueModel = (raw.revenueModel || 'per-project')
  raw.teamSize = Number(raw.teamSize) || 1
  raw.yearsInBusiness = Number(raw.yearsInBusiness) || 0

  // Copy new Q7/Q8/Q9 fields into the underscore-prefixed shape the matcher reads.
  const tools = Array.isArray(raw.projectMgmtTools) ? raw.projectMgmtTools : []
  ;(raw as any)._projectMgmtTools = tools
  ;(raw as any)._infoHoursPerWeek = raw.infoHoursPerWeek || ''
  ;(raw as any)._interestLevel = raw.interestLevel || ''

  return raw as AssessmentAnswers
}

export async function GET() {
  return NextResponse.json({
    ok: true, endpoint: 'retell-webhook', model: 'claude-haiku-4-5', version: 8,
    behavior: 'v8: call_analyzed-only (no more duplicate processing) + Q7-Q9 extraction + 6 industries',
  })
}
