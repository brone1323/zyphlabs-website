import type { Demo } from './types'
import { WHITMAN_ROSS } from './businesses'

const b = WHITMAN_ROSS

// 1. AI Intake + Qualification Agent
export const INTAKE_PROFESSIONAL: Demo = {
  slug: 'intake-professional',
  title: 'AI Intake + Qualification Agent',
  subtitle: '24/7 inbound handling. Qualifies (service, budget, urgency, conflict check), books, sends prep.',
  category: 'intake',
  industry: 'professional',
  business: b,
  tier2Price: '$4,000 build + $300/mo',
  buildTime: '2 weeks',
  description:
    'The intake call is the most expensive call the firm takes — partners lose 20 minutes to prospects who weren\'t a fit. The agent qualifies in 5 minutes: what, how much, how urgent, any conflict, then books the right partner.',
  howItWorks: [
    'Inbound call/web form routes to the intake agent',
    'Qualifies: service type, deal size / estimated work, urgency, jurisdiction',
    'Runs conflict check against client database',
    'If qualified + no conflict → books intake call with the right partner',
    'Sends prep materials + engagement letter template automatically',
  ],
  inputFields: [
    { key: 'callerName', label: 'Caller name', type: 'text' },
    { key: 'company', label: 'Company (if applicable)', type: 'text' },
    { key: 'callerEmail', label: 'Email', type: 'text' },
    {
      key: 'matterType',
      label: 'Matter type',
      type: 'select',
      options: [
        { label: 'Commercial real estate purchase', value: 'cre' },
        { label: 'Small business incorporation', value: 'incorp' },
        { label: 'Contract review', value: 'contract' },
        { label: 'Residential real estate', value: 'residential' },
      ],
    },
    { key: 'context', label: 'Details', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Commercial real estate deal',
      description: '$3.2M commercial purchase, needs closing counsel',
      values: {
        callerName: 'Trevor Brooks',
        company: 'Brooks Holdings Ltd.',
        callerEmail: 'tbrooks@brooks-holdings.example.com',
        matterType: 'cre',
        context: 'Buying a $3.2M commercial property in Oakland. Closing in 45 days. Need representation on the purchase.',
      },
    },
    {
      label: 'Small incorporation',
      description: 'New consulting business, wants to incorporate',
      values: {
        callerName: 'Maya Lindqvist',
        company: '(forming)',
        callerEmail: 'maya@example.com',
        matterType: 'incorp',
        context: 'Leaving my job to consult, want to incorporate properly before my first client engagement in 3 weeks.',
      },
    },
    {
      label: 'Conflict — decline gracefully',
      description: 'Prospect is on the opposite side of an existing client',
      values: {
        callerName: 'Greg Walsh',
        company: 'Walsh Industrial Supply',
        callerEmail: 'g.walsh@example.com',
        matterType: 'contract',
        context: 'Need contract review on an MSA with Clearview Apartments.',
      },
    },
  ],
  brainHook:
    'The Brain remembers Trevor Brooks was referred by Jane Kurtzman (long-time client). That context surfaces at the top of David\'s call prep: "your caller was referred by Jane — she\'d be happy with a warm outcome". It also knows Clearview is an active client, so any intake referencing them triggers the auto-conflict check.',
  generateOutput: (v, biz) => {
    const first = v.callerName.split(' ')[0]

    if (v.context.toLowerCase().includes('clearview')) {
      return [
        {
          type: 'email',
          recipient: v.callerName,
          subject: `Following up on your inquiry`,
          body: `Dear ${v.callerName},

Thank you for reaching out to Whitman & Ross regarding your matter.

Unfortunately, we\'ve identified a potential conflict that prevents us from taking on this representation. We are unable to disclose specifics, but we want to be upfront with you so you can seek counsel promptly.

Happy to recommend two firms that would be a good fit for contract review work of this scope — just reply and I\'ll make the intro.

Regards,
David Whitman
Whitman & Ross LLP`,
        },
        {
          type: 'dashboard',
          channelLabel: '🚨 Conflict flagged — intake blocked',
          body: `BLOCKED intake: ${v.callerName} / ${v.company}
Matter: ${v.matterType}
Potential conflict: inquiry references "Clearview" — active client matter on file.

No partner call booked. Graceful decline email queued.
Suggested referrals: Harper & Finch LLP (contract, San Francisco), Liang Legal (Oakland).`,
        },
      ]
    }

    const dollar =
      v.matterType === 'cre'
        ? '$8k–12k estimated legal fees on a $3.2M closing'
        : v.matterType === 'incorp'
          ? '$1.8k–2.4k flat fee for standard incorporation + shareholder agreement'
          : v.matterType === 'contract'
            ? '$450–600/hr, typical engagement 3–8 hours'
            : '$2.1k flat fee for residential closing'
    const partner = v.matterType === 'incorp' ? 'Priya Ross' : 'David Whitman'

    return [
      {
        type: 'call-summary',
        channelLabel: 'Intake call summary',
        body: `Caller: ${v.callerName} ${v.company ? `(${v.company})` : ''}
Email: ${v.callerEmail}
Matter: ${v.matterType === 'cre' ? 'Commercial real estate — purchase-side' : v.matterType === 'incorp' ? 'Incorporation' : v.matterType === 'contract' ? 'Contract review' : 'Residential real estate'}
Context: ${v.context}

Qualification:
  • Type fit: ✓ (firm does this work)
  • Jurisdiction: ✓ CA
  • Conflict check: ✓ clear
  • Est. fees: ${dollar}
  • Urgency: ${v.context.toLowerCase().includes('day') || v.context.toLowerCase().includes('week') ? 'high' : 'normal'}
  • Referral source: ${v.callerName === 'Trevor Brooks' ? 'Jane Kurtzman (✓ long-time client)' : 'direct'}

Recommended partner: ${partner}
Booked: Intake consultation, 30 min, Tuesday 2:00pm`,
      },
      {
        type: 'email',
        recipient: `${v.callerName} <${v.callerEmail}>`,
        subject: `Confirming your intake call with Whitman & Ross`,
        body: `Dear ${first},

Thank you for your inquiry. I\'ve confirmed your intake consultation with ${partner} for Tuesday at 2:00pm PDT — 30 minutes via Teams (link to follow).

Prep materials attached:
  • Client intake questionnaire (10 min to complete)
  • Our firm background and relevant matter experience
  • Draft engagement letter for your review

Please complete the questionnaire before the call — it lets ${partner} hit the ground running and keeps billable time to a minimum.

Regards,
Intake Team
Whitman & Ross LLP`,
      },
      {
        type: 'dashboard',
        channelLabel: `${partner}\'s prep dashboard`,
        body: `TUESDAY 2:00PM — ${v.callerName} intake
  Matter: ${v.matterType === 'cre' ? 'Commercial RE purchase, $3.2M, Oakland' : v.matterType === 'incorp' ? 'Incorporation, consulting business, 3-wk timeline' : 'Contract review'}
  Referred by: ${v.callerName === 'Trevor Brooks' ? 'Jane Kurtzman — warm context' : 'Direct inbound'}
  Fee range: ${dollar}
  Conflict check: clear
  Pre-call materials: [sent ✓] [filled: pending]

  5-min brief will auto-generate 15 min before the call.`,
      },
    ]
  },
}

// 2. AI Engagement Letter Drafter
export const ENGAGEMENT_LETTER: Demo = {
  slug: 'engagement-letter-drafter',
  title: 'AI Engagement Letter Drafter',
  subtitle: 'Takes intake transcript + firm templates → drafts engagement letter in partner\'s voice.',
  category: 'engagement-letter',
  industry: 'professional',
  business: b,
  tier2Price: '$3,500 build + $275/mo',
  buildTime: '2 weeks',
  description:
    'Engagement letters are boilerplate that requires senior time. The agent reads the intake call transcript + the firm\'s templates, drafts a customized engagement letter in David\'s voice, and queues it for his 90-second review + e-signature send.',
  howItWorks: [
    'Reads the intake call transcript + matter type',
    'Merges the right template (transactional, litigation, advisory)',
    'Customizes: scope, fee structure, timeline, contingencies',
    'Drafts in David\'s signature style (plain English, no legalese)',
    'Queues for review → on approval, sends via DocuSign',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    {
      key: 'matterType',
      label: 'Matter type',
      type: 'select',
      options: [
        { label: 'Commercial real estate', value: 'cre' },
        { label: 'Incorporation', value: 'incorp' },
        { label: 'Contract review', value: 'contract' },
      ],
    },
    { key: 'scopeSummary', label: 'Scope summary', type: 'textarea' },
    { key: 'feeStructure', label: 'Fee structure', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Commercial RE — Brooks',
      description: 'Standard purchase-side transactional engagement',
      values: {
        clientName: 'Brooks Holdings Ltd.',
        matterType: 'cre',
        scopeSummary: 'Represent purchaser in $3.2M commercial property acquisition in Oakland, CA. Includes title review, agreement of purchase and sale, closing. Not including zoning or environmental review unless separately engaged.',
        feeStructure: 'Flat fee $8,500 + disbursements',
      },
    },
  ],
  brainHook:
    'The Brain applies David\'s specific preferences: he likes to include a "we\'ll tell you upfront if scope changes" paragraph, he wants all limitations in a dedicated "what this engagement does not include" section, and he signs "David" not "David W. Whitman" for existing client relationships.',
  generateOutput: (v, biz) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    return [
      {
        type: 'email',
        recipient: v.clientName,
        subject: `Engagement letter for your review — Whitman & Ross LLP`,
        htmlBody: `<div style="font-family: Georgia, serif; line-height: 1.6; color: #1e293b; max-width: 640px; padding: 16px; background: white; border-radius: 8px">
          <div style="text-align: right; color: #64748b; font-size: 13px">${today}</div>
          <p style="margin-top: 24px">Dear ${v.clientName.split(' ')[0]},</p>
          <p>Thank you for retaining Whitman &amp; Ross LLP. This letter confirms the terms of our engagement. We\'ve written it in plain English — if anything is unclear, please ask before you sign.</p>
          <h3 style="color:#0f172a">Scope</h3>
          <p>${v.scopeSummary}</p>
          <h3 style="color:#0f172a">What this engagement does <em>not</em> include</h3>
          <ul>
            <li>Zoning or land-use review</li>
            <li>Environmental due diligence</li>
            <li>Tax advice beyond sales tax and transfer tax allocation</li>
            <li>Post-closing disputes (separate retainer if needed)</li>
          </ul>
          <h3 style="color:#0f172a">Fees</h3>
          <p>${v.feeStructure}. Disbursements (title search, registry, courier) billed at cost. We\'ll tell you upfront if the scope changes and fees need to change with it.</p>
          <h3 style="color:#0f172a">Timeline</h3>
          <p>We\'ll aim to close within the 45-day timeline you indicated. We\'ll provide weekly status updates every Friday.</p>
          <h3 style="color:#0f172a">Communication</h3>
          <p>Your primary contact will be David Whitman (me). My assistant, Sam Park, can also reach me quickly. Please email or call — we don\'t do SMS for substantive matters.</p>
          <p>If these terms work for you, please e-sign below and return. We\'ll get started as soon as we have a signed copy back.</p>
          <p>Regards,<br/><strong>David</strong><br/><span style="color:#64748b">David Whitman, Partner<br/>Whitman &amp; Ross LLP</span></p>
          <div style="border-top: 1px dashed #cbd5e1; margin-top: 32px; padding-top: 16px; color: #64748b; font-size: 13px">Client signature: _____________________   Date: _______</div>
        </div>`,
        body: `[Formatted engagement letter in David\'s plain-English voice — see HTML preview]`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Review queue for David',
        body: `ENGAGEMENT LETTER DRAFTED — ${v.clientName}
  Matter: ${v.matterType === 'cre' ? 'Commercial real estate' : v.matterType === 'incorp' ? 'Incorporation' : 'Contract review'}
  Fee: ${v.feeStructure}
  Length: 1 page, ~320 words
  Readability: plain-English (your style)

  Flags to check:
    ✓ Scope matches intake transcript
    ✓ "What this does not include" section included (your preference)
    ✓ 45-day timeline reflects client\'s deadline
    ✓ Signed as "David" (existing client relationship pattern)

  [ Approve & send via DocuSign ] [ Edit ] [ Pull into full draft ]`,
      },
    ]
  },
}

// 3. AI Time Capture Agent
export const TIME_CAPTURE: Demo = {
  slug: 'time-capture',
  title: 'AI Time Capture Agent',
  subtitle: 'Reads calendar, comms, document activity → proposes daily time entries.',
  category: 'time-capture',
  industry: 'professional',
  business: b,
  tier2Price: '$4,000 build + $300/mo',
  buildTime: '2 weeks',
  description:
    'Partners lose 8–15% of billable time to "where did my Tuesday go?" This agent watches your calendar, email, and document activity and proposes a clean day of time entries — you review, edit, post in 3 minutes instead of 45.',
  howItWorks: [
    'Monitors calendar, email subject lines, document touch events',
    'Groups activity by matter (inferred from subject lines + recipients)',
    'Proposes hourly entries with narrative ("reviewed title search for Brooks...")',
    'You review, nudge, approve — posts to billing system',
    'Trains on your edits — gets better at inferring matter per email thread',
  ],
  inputFields: [
    { key: 'partnerName', label: 'Partner', type: 'text', defaultValue: 'David Whitman' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'calendarSample', label: 'Calendar sample', type: 'textarea' },
    { key: 'emailSample', label: 'Email/doc activity sample', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Typical Wednesday',
      description: 'Split day: two client calls, contract drafting, admin',
      values: {
        partnerName: 'David Whitman',
        date: 'Wednesday, Apr 22',
        calendarSample:
          '9:00–9:45 Brooks intake call\n10:15–11:30 deposition prep — Kurtzman v. Rentco\n12:30–1:30 lunch w/ Sam (firm admin)\n2:00–2:30 intake — Lindqvist incorporation\n3:00–5:15 contract review for Walsh Industrial',
        emailSample:
          'Sent: 12 emails to Brooks re: title docs (between 9:50 and 11:00)\nDocument: edits to Kurtzman brief draft (11:30–12:15, 45 min)\nCalls logged: 1 inbound from Kurtzman (14 min, 3:45pm)\nEmail thread w/ Walsh (5 emails 3:00–5:00)',
      },
    },
  ],
  brainHook:
    'The Brain knows David never bills for the first 5 min of the Brooks matter on any day (he writes them off as "relationship time"). It also knows lunch with Sam is non-billable admin. These preferences are reflected in the daily draft without being asked.',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'dashboard',
        channelLabel: `Proposed time entries — ${v.date}`,
        body: `PROPOSED ENTRIES · ${v.partnerName} · ${v.date}
Total billable: 6.4 hrs · Non-billable: 1.2 hrs

─── BROOKS HOLDINGS — $3.2M COMMERCIAL ACQUISITION ───
  0.75  09:00–09:45  Intake consultation; scope alignment for $3.2M Oakland purchase
  1.20  09:50–11:00  Title search review; drafted follow-up questions to vendor counsel (12 emails)
  ─────────
  1.95 hrs · $878.00

─── KURTZMAN v. RENTCO ───
  1.25  10:15–11:30  Deposition prep — reviewed transcript excerpts, outlined opposing witness Qs
  0.75  11:30–12:15  Brief revisions — section IV rewrites, citations tightened
  0.25  15:45–15:59  Follow-up call with client re: scheduling deposition
  ─────────
  2.25 hrs · $1,012.50

─── LINDQVIST — INCORPORATION (new matter) ───
  0.50  14:00–14:30  Intake call; confirmed scope + flat-fee estimate
  ─────────
  0.50 hrs · $225.00

─── WALSH INDUSTRIAL — CONTRACT REVIEW ───
  2.25  15:00–17:15  Full review of draft MSA with Clearview; drafted redline summary (emailed at 5:02pm)
  ─────────
  2.25 hrs · $1,012.50

─── NON-BILLABLE ───
  1.00  12:30–13:30  Lunch w/ Sam (admin, not billable — your flag)

✓ Brooks first-5-min write-off applied (your pattern)
✓ No entries duplicated across matters
✓ Narratives drafted in your style (verb-led, specific, plain)

[ Post all to billing ] [ Review individually ] [ Hold for tomorrow ]`,
      },
    ]
  },
}

// 4. AI Collections (pro services)
export const COLLECTIONS_PROFESSIONAL: Demo = {
  slug: 'collections-professional',
  title: 'AI Collections Agent',
  subtitle: 'Watches AR. Drafts escalating nudges in partner\'s voice. Flags sensitive clients.',
  category: 'collections',
  industry: 'professional',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Law firm collections are awkward. This agent drafts the escalation ladder in David\'s professional voice, knows which clients to handle gently vs firmly, and flags when a human partner needs to pick up the phone.',
  howItWorks: [
    'Reads invoices + payment history per client',
    'Client-specific tone based on relationship length + value',
    'Day 14 / 30 / 45 escalating nudges',
    'Flags sensitive relationships (e.g. referral partners) for partner to personally handle',
    'Drafts demand letters when needed',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'invoiceNumber', label: 'Invoice #', type: 'text' },
    { key: 'amount', label: 'Amount ($)', type: 'number' },
    { key: 'daysOverdue', label: 'Days overdue', type: 'number' },
    {
      key: 'clientTier',
      label: 'Client relationship',
      type: 'select',
      options: [
        { label: 'Long-term client (5+ years)', value: 'long' },
        { label: 'Active, 1–4 years', value: 'active' },
        { label: 'One-off matter, no further work', value: 'one-off' },
        { label: 'Sensitive — referral partner', value: 'referral' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Long-term client, 21 days late',
      description: 'Soft nudge appropriate',
      values: {
        clientName: 'Jane Kurtzman',
        invoiceNumber: 'WR-2026-0412',
        amount: '3840',
        daysOverdue: '21',
        clientTier: 'long',
      },
    },
    {
      label: 'Referral partner — escalate to partner',
      description: 'Don\'t auto-dun a referral partner, flag to David',
      values: {
        clientName: 'Harper Finch (Harper & Finch LLP)',
        invoiceNumber: 'WR-2026-0418',
        amount: '1200',
        daysOverdue: '30',
        clientTier: 'referral',
      },
    },
  ],
  brainHook:
    'The Brain remembers Jane Kurtzman is an 8-year client with a consistent pattern of paying at day 30–35. Her "21 days overdue" is actually "normal for Jane". The Brain suggests skipping the 14-day nudge and only sending at day 30 — and phrasing it as "just circling back" rather than "you\'re overdue".',
  generateOutput: (v, biz) => {
    const amt = Number(v.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const first = v.clientName.split(' ')[0]

    if (v.clientTier === 'referral') {
      return [
        {
          type: 'email',
          recipient: biz.ownerName + ' (David)',
          channelLabel: '🟠 Flag — referral partner AR',
          subject: `${v.clientName} — ${amt} at ${v.daysOverdue} days, suggest personal handling`,
          body: `This one is outside my automation scope:

Client: ${v.clientName}
Relationship: Referral partner — 3 referrals sent our way in the last 18 months
Invoice ${v.invoiceNumber}: ${amt}, ${v.daysOverdue} days overdue

Recommended action: you make a personal email or quick call rather than an automated nudge. Referral relationships are too high-value to dun through the system.

Draft personal email (your voice, if you want):

"Harper — no stress at all, just making sure ${v.invoiceNumber} didn\'t get buried. Happy to swap an extended timeline for anything you\'d like to trade on. Give me a ring if easier. — David"

[ Use this draft ] [ I\'ll handle directly ]`,
        },
      ]
    }

    if (v.clientTier === 'long') {
      return [
        {
          type: 'email',
          recipient: v.clientName,
          subject: `Quick note — invoice ${v.invoiceNumber}`,
          body: `${first === 'Jane' ? 'Jane' : `Dear ${first}`},

Just circling back on invoice ${v.invoiceNumber} (${amt}) from the matter we wrapped last month. No urgency — happy to wait if there\'s anything on your end holding it up, just wanted to make sure it wasn\'t sitting in a spam folder.

Regards,
David`,
        },
      ]
    }

    // one-off, escalate at 30d
    return [
      {
        type: 'email',
        recipient: v.clientName,
        subject: `Follow-up on invoice ${v.invoiceNumber}`,
        body: `Dear ${first},

Following up on invoice ${v.invoiceNumber} for ${amt}, now ${v.daysOverdue} days overdue.

Please remit within 7 days or reply with a payment plan proposal. Our standard terms provide for a 1.5% monthly late fee on balances over 45 days — I\'d prefer to resolve this before we get there.

Regards,
David Whitman`,
      },
    ]
  },
}

// 5. AI Relationship Touch Reminder
export const RELATIONSHIP_TOUCH: Demo = {
  slug: 'relationship-touch',
  title: 'AI Relationship Touch Reminder',
  subtitle: 'Tracks last-contact cadence per client. Nudges partner when relationships go cold.',
  category: 'relationship-touch',
  industry: 'professional',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Partners lose clients to forgetting, not to dissatisfaction. The agent tracks last meaningful touch per client and nudges you — with a draft message — when the right one goes cold.',
  howItWorks: [
    'Tracks last substantive touch per client (email, call, meeting)',
    'Calculates expected cadence per client (quarterly for transactional, monthly for litigation)',
    'Alerts when overdue',
    'Drafts a light check-in in partner\'s voice',
    'One-tap send or edit',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'lastContactDate', label: 'Last substantive touch', type: 'text' },
    { key: 'typicalCadence', label: 'Typical cadence', type: 'text' },
    { key: 'recentContext', label: 'Any recent context', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Long-term client going cold',
      description: 'Jane Kurtzman, usually 4–6 weeks, now 11 weeks',
      values: {
        clientName: 'Jane Kurtzman',
        lastContactDate: 'Feb 3 (11 weeks ago)',
        typicalCadence: 'Every 4–6 weeks',
        recentContext: 'Her son got engaged — she mentioned a potential pre-nup conversation 2 calls back, never followed up.',
      },
    },
  ],
  brainHook:
    'The Brain connects context across conversations. The pre-nup note from an earlier call auto-surfaces as the opener: "Hey Jane — was just thinking about your son\'s engagement…" — much warmer than a cold check-in.',
  generateOutput: (v, biz) => {
    const first = v.clientName.split(' ')[0]
    return [
      {
        type: 'dashboard',
        channelLabel: 'Cold relationship alert',
        body: `🟡 ${v.clientName} — relationship going cold
  Last substantive touch: ${v.lastContactDate}
  Typical cadence: ${v.typicalCadence}
  Age of gap: ${v.lastContactDate.includes('week') ? v.lastContactDate.match(/\d+/)?.[0] + ' weeks' : 'over 10 weeks'} (2x normal)

  Relevant context you can use:
    • Son got engaged (mentioned Feb 3)
    • Pre-nup question came up — never resolved
    • Her youngest starts university in September

  Draft check-in ready below.`,
      },
      {
        type: 'email',
        recipient: v.clientName,
        subject: `Thinking of you — and a small question`,
        body: `Dear ${first},

Was just thinking about your son\'s engagement — hope the planning is going well and that Em is keeping her head through it.

You mentioned back in February that you\'d been wondering about a pre-nup conversation. No pressure, but if that\'s still on your mind I\'m happy to set aside 30 minutes to walk through what a practical approach would look like. No charge for the chat.

Otherwise, just wanted to say hi.

Regards,
David`,
      },
    ]
  },
}

// 6. AI Document Request Nudger
export const DOC_REQUEST_NUDGER: Demo = {
  slug: 'doc-request-nudger',
  title: 'AI Document Request Nudger',
  subtitle: 'Tracks outstanding client docs, auto-nudges in partner\'s voice with specifics.',
  category: 'document-nudger',
  industry: 'professional',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Every transactional matter has a stack of "still need the signed resolution from you" emails. This agent tracks outstanding document requests per matter and sends specific, dateable nudges — in partner\'s voice — so nothing gets stuck.',
  howItWorks: [
    'Reads matter checklists (commercial closings, incorporation, litigation discovery)',
    'Tracks what\'s requested vs what\'s received',
    'Nudges client at day 3/7/14 with specific items outstanding',
    'Copies firm paralegal on days 7 and 14',
    'If a deadline is imminent → upgrades nudge to "urgent, closing is in X days"',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'matterName', label: 'Matter', type: 'text' },
    { key: 'itemsMissing', label: 'Items outstanding', type: 'textarea' },
    { key: 'daysElapsed', label: 'Days since original request', type: 'number' },
    { key: 'closingDate', label: 'Closing / deadline', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Closing in 10 days, 3 docs outstanding',
      description: 'Brooks Holdings CRE purchase, getting tight',
      values: {
        clientName: 'Brooks Holdings Ltd.',
        matterName: 'Commercial acquisition — 1455 Market St, Oakland',
        itemsMissing: '• Corporate resolution authorizing purchase (signed by directors)\n• EIN / tax ID registration\n• Wire transfer confirmation for deposit ($320k)',
        daysElapsed: '7',
        closingDate: 'May 5 (10 days away)',
      },
    },
  ],
  brainHook:
    'The Brain knows Trevor Brooks hates being hounded — last matter he complained about "too many follow-ups". So the first nudge is softer than default, and the agent consolidates three separate docs into one clean list instead of three separate pings.',
  generateOutput: (v, biz) => {
    const first = v.clientName.split(' ')[0].replace(/[.,]/g, '')
    return [
      {
        type: 'email',
        recipient: v.clientName,
        subject: `Quick request — three items for the Oakland closing`,
        body: `Dear ${first === 'Brooks' ? 'Trevor' : first},

Hope things are going well. Quick note on the ${v.matterName.split(' — ')[0]} — I\'ve got three items outstanding that I\'ll need to close on time. Combining them into one email so I\'m not pestering you piecemeal:

${v.itemsMissing}

Closing date is ${v.closingDate}. Ideally I\'d have these in hand by end of day Friday, but let me know if anything is going to take longer — we have options.

Regards,
David`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Matter checklist dashboard',
        body: `${v.matterName}
  Status: 7 / 10 items received  ·  ${v.daysElapsed} days elapsed  ·  ${v.closingDate}

  ✓ Purchase agreement signed
  ✓ Title report reviewed
  ✓ Deposit confirmed
  ✓ Property disclosures
  ✓ Survey received
  ✓ Tenancy agreements
  ✓ Insurance binder
  ✗ Corporate resolution
  ✗ EIN registration
  ✗ Wire confirmation for final deposit

  Nudge sent today. Next: May 1 (final reminder) if nothing back.
  If silent past May 2 → escalates to phone call from David.`,
      },
    ]
  },
}

export const PROFESSIONAL_DEMOS: Demo[] = [
  INTAKE_PROFESSIONAL,
  ENGAGEMENT_LETTER,
  TIME_CAPTURE,
  COLLECTIONS_PROFESSIONAL,
  RELATIONSHIP_TOUCH,
  DOC_REQUEST_NUDGER,
]
