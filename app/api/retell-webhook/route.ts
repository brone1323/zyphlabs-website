// POST /api/retell-webhook — called by Retell when an assessment call ends.
//
// v5 behavior (2026-04-22, per Brian's spec):
// - Extracts AssessmentAnswers from transcript via Anthropic Claude Haiku
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
  if (event !== 'call_analyzed' && event !== 'call_ended') {
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
  const callerEmail = extractEmailFromText(transcript)

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

SCHEMA required fields: reportId, ownerName, ownerFirstName, company, trade, industry (one of: project-based, appointment-based, retail, ecommerce, professional-services, b2b-saas, trades, creative), customerType (consumer/business/both), revenueModel (per-project/per-visit/subscription/transactional/hourly), yearsInBusiness, teamSize, location, topPain.

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
  const answers = JSON.parse(m[0]) as AssessmentAnswers

  answers.reportId = answers.reportId || `retell-${call.call_id || Date.now()}`
  answers.ownerFirstName = answers.ownerFirstName || answers.ownerName?.split(' ')[0] || 'there'
  answers.industry = (answers.industry || 'project-based') as Industry
  answers.customerType = (answers.customerType || 'consumer') as AssessmentAnswers['customerType']
  answers.revenueModel = (answers.revenueModel || 'per-project') as AssessmentAnswers['revenueModel']
  answers.teamSize = Number(answers.teamSize) || 1
  answers.yearsInBusiness = Number(answers.yearsInBusiness) || 0
  return answers
}

export async function GET() {
  return NextResponse.json({
    ok: true, endpoint: 'retell-webhook', model: 'claude-haiku-4-5', version: 5,
    behavior: 'per-spec: internal notify + caller email + sheets',
  })
}
