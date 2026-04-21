// POST /api/assessment-submit — final handler for web-chat completions.
//
// Request: { answers: AssessmentAnswers, email?: string }
// Response: { ok: true, reportUrl, notifyResult, sheetResult }
//
// Runs the shared assessment pipeline: internal email + Google Sheet append.
// The report URL is generated and returned but NOT emailed to the user.

import { NextResponse } from 'next/server'
import type { AssessmentAnswers } from '@/app/report/_engine/types'
import {
  buildReportUrl,
  notifyInternal,
  appendToSheet,
  extractEmailFromText,
} from '../_lib/assessment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const answers = body?.answers as AssessmentAnswers | undefined
  if (!answers || !answers.ownerName || !answers.company || !answers.industry) {
    return NextResponse.json({ error: 'incomplete answers' }, { status: 400 })
  }

  // Email can come from the body OR be extracted from anywhere in the payload
  const email =
    (typeof body?.email === 'string' && body.email.trim()) ||
    (typeof body?.ownerEmail === 'string' && body.ownerEmail.trim()) ||
    extractEmailFromText(JSON.stringify(answers)) ||
    null

  const reportUrl = buildReportUrl(answers)

  const notifyResult = await notifyInternal({
    source: 'web',
    answers,
    callerEmail: email,
    reportUrl,
  }).catch((err) => {
    console.error('[assessment-submit] notify failed', err)
    return { error: String(err).slice(0, 200) }
  })

  const sheetResult = await appendToSheet({
    source: 'web',
    answers,
    callerEmail: email,
    reportUrl,
  }).catch((err) => {
    console.error('[assessment-submit] sheet append failed', err)
    return { error: String(err).slice(0, 200) }
  })

  return NextResponse.json({
    ok: true,
    reportUrl,
    email,
    notifyResult,
    sheetResult,
  })
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'assessment-submit' })
}
