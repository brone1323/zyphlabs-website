// POST /api/assessment-progress — fires on every /assessment question advance.
//
// Request: { sessionId, currentQuestion, totalQuestions, lastField, raw }
// Response: { ok: true, sheetResult }
//
// The sheet upsert is keyed by sessionId so each prospect gets ONE row that
// evolves as they move through the flow. If they bail at Q4, the row stays
// at Q4 forever. When they finally complete, the completion handler
// (/api/assessment-submit) flips their row's status to 'completed'.

import { NextResponse } from 'next/server'
import { progressToSheet } from '../_lib/assessment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }) }

  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
  const currentQuestion = Number(body?.currentQuestion) || 0
  const totalQuestions = Number(body?.totalQuestions) || 10
  const lastField = typeof body?.lastField === 'string' ? body.lastField : ''
  const raw = body?.raw && typeof body.raw === 'object' ? body.raw : {}

  if (!sessionId) {
    return NextResponse.json({ error: 'missing sessionId' }, { status: 400 })
  }

  const sheetResult = await progressToSheet({
    sessionId, currentQuestion, totalQuestions, lastField, raw,
  }).catch((err) => ({ error: String(err).slice(0, 200) }))

  return NextResponse.json({ ok: true, sheetResult })
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'assessment-progress', version: 1 })
}
