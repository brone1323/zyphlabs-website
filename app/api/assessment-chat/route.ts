// POST /api/assessment-chat — conversational assessment via Claude.
//
// Request: { messages: [{role:'user'|'assistant', content:string}, ...] }
// Response (in-progress): { text: string, done: false }
// Response (complete):    { text: string, done: true, answers: AssessmentAnswers }
//
// Claude runs the same 8-industry assessment flow as the Retell agent, but
// adapted for typed chat. When Claude has gathered enough information, it
// uses the `complete_assessment` tool to emit a structured AssessmentAnswers
// object — that's our signal to stop the chat and kick off the submit pipeline.

import { NextResponse } from 'next/server'
import type { AssessmentAnswers, Industry } from '@/app/report/_engine/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const MODEL = 'claude-haiku-4-5-20251001'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

// ─────────────────────────────────────────────────────────────────
// System prompt — adapted from Retell v2 for typed chat
// ─────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a friendly AI business consultant from Zyph Labs. You run a short, casual assessment via chat for business owners of any kind. You know enough about construction, medical, retail, e-commerce, professional services, SaaS, trades, and creative businesses to talk like a knowledgeable friend in any of those.

# Voice

- You're TYPING, not talking. Keep messages short: 1–2 sentences max.
- Plain talk, contractions, warm but efficient. No jargon unless they use it first.
- One question per message. Never batch questions.
- Match their vocabulary — if they say "patients", say "patients"; "tickets" → "tickets"; "crews" → "crews".
- Briefly acknowledge ("Got it.", "Makes sense.") before the next question, but skip if it would feel forced.
- If they give a short answer, probe once; if still short, move on.
- Never read bulleted lists aloud.
- Never tell them you're classifying their industry — they should feel like a conversation.

# Goal

In about 8–10 exchanges, capture enough to know:

- What kind of business they run (industry, team size, revenue model)
- How they acquire customers and fulfill work
- Where time is disappearing and money is leaking
- What they'd do with 5 more hours a week
- Their email (captured at the end)

# Flow

## Opening
Start with a warm, 1-sentence greeting + the first question. Do NOT greet them and wait — ask the first question in the same message.

## Layer 1 — Universal (always ask, in order, one at a time)
1. What's the name of your business and what do you do?
2. How long have you been at it?
3. How big's the team — solo, a few people, or a bigger crew?
4. Who's your main customer — consumers, businesses, or a mix?
5. How do customers pay you — per project, per visit, subscription, at the register, or by the hour?
6. What part of running the business is eating the most time or driving you nuts right now?

After Layer 1, silently classify their INDUSTRY into one of:
- project-based (GCs, remodelers, agencies, consultants, freelancers)
- appointment-based (medical, dental, therapy, salon, fitness, cleaning, tutoring)
- retail (shops, cafes, restaurants, boutique gyms)
- ecommerce (Shopify, Amazon, Etsy, DTC brands)
- professional-services (law, accounting, advisory, real estate, insurance)
- b2b-saas (startups, software companies)
- trades (electrical, plumbing, HVAC, landscaping, pool, pest, locksmith)
- creative (photography, videography, design, writing, production)

## Layer 2 — Industry branch (pick 3–4 questions, not all)

**project-based:** How are you building quotes? From lead to quote out the door — how long? Do you follow up when a quote goes quiet? Out of 10 quotes how many close? Ticket size on a typical job?

**appointment-based:** How are people booking with you? Roughly how many no-shows per week? What % of clients are recurring vs one-time? What happens to after-hours calls?

**retail:** What POS? Walk-ins vs appointments — what's the split? Online ordering? Loyalty program running?

**ecommerce:** What platform? Rough monthly revenue band? AOV? Return rate? Ad spend as % of revenue?

**professional-services:** Billing hourly, retainer, or flat fee? What's tracking time? How much AR past 60 days? Where do new clients come from?

**b2b-saas:** What MRR band? Typical sales cycle? CRM? Out of 10 demos how many close? Primary channel?

**trades:** How are you dispatching? % revenue maintenance vs one-off? How many trucks? On-call rotation?

**creative:** Pricing model — day rate, per project, retainer? How far in advance are clients booking? Portfolio platform? Delivery method?

## Layer 3 — Pain deep-dive (2–3 questions based on Layer 1 Q6)

If quoting: How long is a typical quote taking? What tool? Do you follow up?
If missed calls / after-hours: What happens now? How many leads slip? Response time on a new lead?
If chasing money / AR: Lag between job done and invoice out? Any open money you're chasing?
If reviews / marketing: Rough Google review count? Do you actively ask?
If admin / paperwork: System for invoicing/expenses? Hours/week on admin?

## Close
Quick recap in one sentence, then: "If I gave you back 5 hours a week, what would you stop doing yourself?" (Save the answer.)

Then: "Last thing — what's the best email to reach you? We'll use it to follow up, not spam."

## When you have enough
When you have all Layer 1 required fields + industry + top pain + owner's email, call the `complete_assessment` tool with the full structured AssessmentAnswers object. Do NOT mention the tool to them. Your final message BEFORE calling the tool should be a warm human close like "Awesome, that gives me everything I need — thanks [Name]. We'll be in touch within 24 hours."

# Never
- Never recommend solutions during the chat.
- Never promise pricing or results.
- Never ask more than one question per message.
- Never read long lists aloud — at most 3 options offered naturally ("like per project, per visit, or hourly?").
- Never repeat a question they already answered.
- Never mention the industry classification or that you're picking questions.
- Never go past ~15 exchanges. If running long, wrap.`

// ─────────────────────────────────────────────────────────────────
// Tool definition — Claude calls this when the assessment is complete
// ─────────────────────────────────────────────────────────────────

const COMPLETE_ASSESSMENT_TOOL = {
  name: 'complete_assessment',
  description:
    "Call this when you have enough information to submit a complete AssessmentAnswers object. Include every field you can infer from the conversation. Required fields are mandatory. Optional fields should be OMITTED if there's no evidence — do not fabricate.",
  input_schema: {
    type: 'object',
    properties: {
      // ── Required ──
      reportId: { type: 'string', description: 'URL-safe slug like "jane-doe-20260420"' },
      ownerName: { type: 'string' },
      ownerFirstName: { type: 'string' },
      company: { type: 'string' },
      trade: { type: 'string', description: 'Plain-English description of what they do' },
      industry: {
        type: 'string',
        enum: [
          'project-based',
          'appointment-based',
          'retail',
          'ecommerce',
          'professional-services',
          'b2b-saas',
          'trades',
          'creative',
        ],
      },
      customerType: { type: 'string', enum: ['consumer', 'business', 'both'] },
      revenueModel: {
        type: 'string',
        enum: ['per-project', 'per-visit', 'subscription', 'transactional', 'hourly'],
      },
      yearsInBusiness: { type: 'number' },
      teamSize: { type: 'number' },
      location: { type: 'string', description: "City/region they operate in, best guess if not stated" },
      topPain: {
        type: 'string',
        description: 'Free-text summary of their biggest time sink or money leak',
      },
      ownerEmail: { type: 'string', description: 'Best contact email they provided' },

      // ── Commonly-filled optional fields ──
      leadSources: { type: 'array', items: { type: 'string' } },
      primaryIntake: { type: 'string' },
      afterHoursHandling: { type: 'string' },
      leadResponseTime: { type: 'string' },
      closeRate: { type: 'number' },
      avgTicket: { type: 'number' },
      quotingTool: { type: 'string' },
      quotingSpeedDays: { type: 'number' },
      quoteFollowUp: { type: 'string' },
      jobMgmtTool: { type: 'string' },
      accountingTool: { type: 'string' },
      chasingPayments: { type: 'boolean' },
      bookingTool: { type: 'string' },
      noShowRatePerWeek: { type: 'number' },
      recurringClientPct: { type: 'number' },
      posSystem: { type: 'string' },
      ecomPlatform: { type: 'string' },
      monthlyRevenueBand: { type: 'string' },
      aov: { type: 'number' },
      billingModel: { type: 'string' },
      crm: { type: 'string' },
      stage: { type: 'string' },
      maintenancePct: { type: 'number' },
      truckCount: { type: 'number' },
      pricingModel: { type: 'string' },
      portfolioPlatform: { type: 'string' },
      wantedTimeBack: { type: 'array', items: { type: 'string' } },
    },
    required: [
      'reportId',
      'ownerName',
      'ownerFirstName',
      'company',
      'trade',
      'industry',
      'customerType',
      'revenueModel',
      'yearsInBusiness',
      'teamSize',
      'location',
      'topPain',
      'ownerEmail',
    ],
  },
}

// ─────────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  if (!ANTHROPIC_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []
  if (messages.length === 0) {
    return NextResponse.json({ error: 'no messages' }, { status: 400 })
  }

  // Clamp: keep the last 30 turns max to bound context.
  const trimmed = messages.slice(-30)

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        tools: [COMPLETE_ASSESSMENT_TOOL],
        messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
      }),
    })

    if (!resp.ok) {
      const txt = await resp.text()
      return NextResponse.json(
        { error: `anthropic ${resp.status}`, detail: txt.slice(0, 300) },
        { status: 502 },
      )
    }

    const data = await resp.json()
    const content = Array.isArray(data?.content) ? data.content : []

    // Collect text + tool use
    let text = ''
    let toolInput: any = null

    for (const block of content) {
      if (block.type === 'text' && typeof block.text === 'string') {
        text += block.text
      } else if (block.type === 'tool_use' && block.name === 'complete_assessment') {
        toolInput = block.input
      }
    }

    if (toolInput) {
      // Normalize into AssessmentAnswers
      const answers: AssessmentAnswers = {
        ...toolInput,
        industry: (toolInput.industry || 'project-based') as Industry,
        teamSize: Number(toolInput.teamSize) || 1,
        yearsInBusiness: Number(toolInput.yearsInBusiness) || 0,
        reportId:
          toolInput.reportId ||
          `web-${(toolInput.ownerFirstName || 'anon').toLowerCase()}-${Date.now()}`,
        ownerFirstName:
          toolInput.ownerFirstName || toolInput.ownerName?.split(' ')[0] || 'there',
      }

      return NextResponse.json({
        text: text.trim() || "Awesome — that's everything I need. Thanks!",
        done: true,
        answers,
        ownerEmail: toolInput.ownerEmail || null,
      })
    }

    return NextResponse.json({
      text: text.trim() || '...',
      done: false,
    })
  } catch (err) {
    console.error('[assessment-chat] error', err)
    return NextResponse.json(
      { error: 'chat failed', detail: String(err).slice(0, 300) },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'assessment-chat', model: MODEL })
}
