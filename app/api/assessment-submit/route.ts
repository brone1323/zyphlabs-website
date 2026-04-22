// POST /api/assessment-submit — final handler for web-chat / /assessment completions.
//
// Request: { answers: AssessmentAnswers, email?: string }
// Response: { ok: true, reportUrl, notifyResult, callerResult, sheetResult }

import { NextResponse } from 'next/server'
import type { AssessmentAnswers } from '@/app/report/_engine/types'
import {
  buildReportUrl, notifyInternal, sendCallerEmail, appendToSheet, extractEmailFromText,
} from '../_lib/assessment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }) }

  const answers = body?.answers as AssessmentAnswers | undefined
  if (!answers || !answers.company || !answers.industry) {
    return NextResponse.json({ error: 'incomplete answers' }, { status: 400 })
  }

  const email =
    (typeof body?.email === 'string' && body.email.trim()) ||
    (typeof body?.ownerEmail === 'string' && body.ownerEmail.trim()) ||
    extractEmailFromText(JSON.stringify(answers)) || null

  const reportUrl = buildReportUrl(answers)

  const notifyResult = await notifyInternal({
    source: 'web', answers, callerEmail: email, reportUrl,
  }).catch((err) => ({ error: String(err).slice(0, 200) }))

  const callerResult = email
    ? await sendCallerEmail({
        to: email,
        firstName: answers.ownerFirstName || answers.ownerName?.split(' ')[0] || 'there',
        company: answers.company,
        reportUrl,
      }).catch((err) => ({ error: String(err).slice(0, 200) }))
    : { skipped: 'no caller email' }

  const sheetResult = await appendToSheet({
    source: 'web', answers, callerEmail: email, reportUrl,
  }).catch((err) => ({ error: String(err).slice(0, 200) }))

  return NextResponse.json({ ok: true, reportUrl, email, notifyResult, callerResult, sheetResult })
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'assessment-submit', version: 2 })
}
