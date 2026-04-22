// Shared pipeline for assessment submissions — used by both the Retell webhook
// and the web /assessment. Every submission hits:
//   1. buildReportUrl     → stateless URL we can share
//   2. notifyInternal     → email alex@ with the summary + JSON
//   3. sendCallerEmail    → email the caller their report link (per spec)
//   4. appendToSheet      → Google Sheets row for tracker
//
// Any of the outbound steps fail gracefully so a transient error doesn't
// kill the whole request.

import { Resend } from 'resend'
import type { AssessmentAnswers } from '@/app/report/_engine/types'
import { encodeAnswers } from '@/app/report/_engine/encoding'

const RESEND_FROM = process.env.RESEND_FROM || 'Zyph Labs <onboarding@resend.dev>'
const RESEND_KEY = process.env.RESEND_API_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zyphlabs.com'
const INTERNAL_NOTIFY_TO = process.env.INTERNAL_NOTIFY_TO || 'alex@zyphlabs.com'
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL

export type AssessmentSource = 'retell' | 'web'

export function buildReportUrl(answers: AssessmentAnswers): string {
  return `${SITE_URL}/report/dynamic?data=${encodeAnswers(answers)}`
}

// ─────────────────────────────────────────────────────────────────
// Internal notification (to Zyph team)
// ─────────────────────────────────────────────────────────────────

export async function notifyInternal(opts: {
  source: AssessmentSource
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
  const subject = `[Zyph] New ${sourceLabel.toLowerCase()} — ${answers.company} (${answers.industry})`

  const summaryLines = [
    `Source:       ${sourceLabel}`,
    `Name:         ${answers.ownerName}`,
    `Company:      ${answers.company}`,
    `Trade:        ${answers.trade}`,
    `Industry:     ${answers.industry}`,
    `Team size:    ${answers.teamSize}`,
    `Location:     ${answers.location || '(not stated)'}`,
    `Top pain:     ${answers.topPain}`,
    `Caller email: ${callerEmail || '(not captured)'}`,
  ]
  if (callId) summaryLines.push(`Call ID:      ${callId}`)
  if (callDurationSec)
    summaryLines.push(`Duration:     ${Math.floor(callDurationSec / 60)}m ${callDurationSec % 60}s`)

  const text = `New assessment submission.\n\n${summaryLines.join('\n')}\n\nReport URL (shared with caller too):\n${reportUrl}\n\nFull answers JSON:\n${JSON.stringify(answers, null, 2)}\n`

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
    <tr><td style="padding:6px 0;color:#64748b;vertical-align:top">Top pain</td><td style="padding:6px 0">${escapeHtml(answers.topPain)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Contact email</td><td style="padding:6px 0">${callerEmail ? escapeHtml(callerEmail) : '<em style="color:#94a3b8">not captured</em>'}</td></tr>
  </table>
  <p style="margin:24px 0 8px"><a href="${reportUrl}" style="background:#0f172a;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Open the report &rarr;</a></p>
  <details style="margin-top:16px"><summary style="cursor:pointer;color:#64748b;font-size:13px">Full answers JSON</summary><pre style="background:#f1f5f9;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;margin-top:8px">${escapeHtml(JSON.stringify(answers, null, 2))}</pre></details>
  <p style="color:#94a3b8;font-size:12px;margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px">Zyph Labs assessment pipeline &middot; automated internal notification</p>
</body></html>`

  return await resend.emails.send({ from: RESEND_FROM, to: INTERNAL_NOTIFY_TO, subject, text, html })
}

// ─────────────────────────────────────────────────────────────────
// Caller-facing email (report link)
// ─────────────────────────────────────────────────────────────────

export async function sendCallerEmail(opts: {
  to: string
  firstName: string
  company: string
  reportUrl: string
}) {
  if (!RESEND_KEY) return { skipped: 'no RESEND_KEY' }

  const { to, firstName, company, reportUrl } = opts
  const resend = new Resend(RESEND_KEY)

  const text = `Hey ${firstName},

Thanks for jumping on with us. Your ${company} Business Intelligence Report is ready:

${reportUrl}

It's five sections:
1. Business Profile — what we heard
2. Where You Stand — your numbers vs your industry
3. What's Eating Your Week — the quantified leak
4. Your Automation Opportunities — 3 specific recs (Quick Win, Full System, or a 15-min chat)
5. What Happens Next

If one of the automations looks like the obvious next step, book the 30-min strategy call right from the report. If you're still sizing it up, there's a 15-min questions call option on the report too.

Either way — talk soon.

Alex, Zyph Labs
zyphlabs.com`

  const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:40px auto;padding:0 20px">
  <h2 style="font-size:24px;margin:0 0 20px;color:#0f172a">Hey ${escapeHtml(firstName)},</h2>
  <p>Thanks for jumping on with us. Your <strong>${escapeHtml(company)}</strong> Business Intelligence Report is ready:</p>
  <p style="margin:32px 0"><a href="${reportUrl}" style="background:linear-gradient(90deg,#6c5ce7,#00cec9);color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block">Open your report &rarr;</a></p>
  <p>It's five sections:</p>
  <ol>
    <li><strong>Business Profile</strong> — what we heard</li>
    <li><strong>Where You Stand</strong> — your numbers vs your industry</li>
    <li><strong>What&apos;s Eating Your Week</strong> — the quantified leak</li>
    <li><strong>Your Automation Opportunities</strong> — 3 specific recs</li>
    <li><strong>What Happens Next</strong></li>
  </ol>
  <p>If one of the automations looks like the obvious next step, you can book the 30-min strategy call right from the report. Still sizing it up? There&apos;s a 15-min questions call option on the report too.</p>
  <p>Either way — talk soon.</p>
  <p style="color:#64748b;font-size:14px;margin-top:48px;border-top:1px solid #e2e8f0;padding-top:20px">Alex, Zyph Labs &middot; <a href="https://zyphlabs.com" style="color:#6c5ce7;text-decoration:none">zyphlabs.com</a></p>
</body></html>`

  return await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject: `${firstName}, your ${company} Business Intelligence Report`,
    text,
    html,
  })
}

// ─────────────────────────────────────────────────────────────────
// Google Sheet append
// ─────────────────────────────────────────────────────────────────

export async function appendToSheet(opts: {
  source: AssessmentSource
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

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

export function escapeHtml(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function extractEmailFromText(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match?.[0] ?? null
}
