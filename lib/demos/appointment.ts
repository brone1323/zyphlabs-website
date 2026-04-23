import type { Demo } from './types'
import { AURORA_DENTAL } from './businesses'

const b = AURORA_DENTAL

// 1. AI Booking Concierge
export const BOOKING_CONCIERGE_APPT: Demo = {
  slug: 'booking-concierge-appt',
  title: 'AI Booking Concierge',
  subtitle: '24/7 phone/SMS/chat booking. Checks calendar, offers slots, confirms, sends intake.',
  category: 'booking',
  industry: 'appointment',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Your front desk never closes. Patients can book by calling at 11pm, texting, or DM\'ing your page. The agent checks the operatory schedule, offers real slots, collects insurance info, and sends the intake packet — all without a human.',
  howItWorks: [
    'Inbound call/SMS/chat routed to the Concierge',
    'Captures: reason (new patient, cleaning, emergency), insurance, preferred provider',
    'Checks the real schedule across both ops and proposes two slots',
    'Confirms booking, sends intake form + insurance verification request',
    'New patient appointments → flags for Dr. Shah\'s pre-review the morning of',
  ],
  inputFields: [
    { key: 'patientName', label: 'Patient name', type: 'text' },
    { key: 'patientPhone', label: 'Phone', type: 'phone' },
    {
      key: 'reason',
      label: 'Reason for visit',
      type: 'select',
      options: [
        { label: 'New patient — first visit + cleaning', value: 'new' },
        { label: 'Regular 6-month cleaning', value: 'cleaning' },
        { label: 'Toothache / pain', value: 'pain' },
        { label: 'Follow-up on prior treatment', value: 'followup' },
      ],
    },
    { key: 'insurance', label: 'Insurance provider', type: 'text' },
    {
      key: 'provider',
      label: 'Preferred provider',
      type: 'select',
      options: [
        { label: 'No preference', value: 'any' },
        { label: 'Dr. Shah', value: 'shah' },
        { label: 'Dr. Reeves', value: 'reeves' },
        { label: 'Hygienist Kendra', value: 'kendra' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'New patient — after hours',
      description: 'Calls at 9:42pm, never been in before',
      values: {
        patientName: 'Jason Okafor',
        patientPhone: '(403) 555-0117',
        reason: 'new',
        insurance: 'Alberta Blue Cross — group 88210',
        provider: 'any',
      },
    },
    {
      label: 'Existing — 6 month recall',
      description: 'Routine cleaning, wants same hygienist as last time',
      values: {
        patientName: 'Sofia Reyes',
        patientPhone: '(403) 555-0148',
        reason: 'cleaning',
        insurance: 'Sun Life',
        provider: 'kendra',
      },
    },
    {
      label: 'Toothache — today if possible',
      description: 'Pain started overnight, wants emergency slot',
      values: {
        patientName: 'Michael Chen',
        patientPhone: '(403) 555-0163',
        reason: 'pain',
        insurance: 'Pacific Blue Cross',
        provider: 'any',
      },
    },
  ],
  brainHook:
    'The Brain remembers Sofia prefers Kendra, always runs 5 min late, and cancels if she has to park more than a block away — so it books her in the 10am slot (parking opens up) and defaults to Kendra. For Jason (new patient), it surfaces a warm opening line Dr. Shah can use: "Jason, welcome — your chart says this is your first cleaning in a few years. We\'ll take it easy."',
  generateOutput: (v, biz) => {
    const first = v.patientName.split(' ')[0]
    const slot =
      v.reason === 'pain'
        ? 'Today at 2:15pm'
        : v.reason === 'new'
          ? 'Tuesday, May 5 at 10:00am'
          : 'Wednesday, May 6 at 10:30am'
    const providerName =
      v.provider === 'shah' ? 'Dr. Shah' : v.provider === 'reeves' ? 'Dr. Reeves' : v.provider === 'kendra' ? 'Kendra' : 'Kendra (hygienist)'

    return [
      {
        type: 'call-summary',
        channelLabel: 'Booking conversation summary',
        body: `Caller: ${v.patientName} (${v.patientPhone})
Reason: ${v.reason === 'new' ? 'New patient — first visit' : v.reason === 'cleaning' ? '6-month cleaning' : v.reason === 'pain' ? 'Toothache / pain' : 'Follow-up'}
Insurance: ${v.insurance}
Preferred provider: ${v.provider === 'any' ? 'No preference' : providerName}

AI offered: "${slot}, does that work?"
Booked: ${slot} with ${providerName}
Operatory: Op 2

AI also sent:
  • Confirmation SMS with clinic address + parking note
  • Intake packet link (includes medical history + consent forms)
  • Insurance pre-verification started with ${v.insurance.split(' ')[0]}`,
      },
      {
        type: 'sms',
        recipient: `${v.patientName} · ${v.patientPhone}`,
        channelLabel: 'Booking confirmation',
        body: `Hi ${first}! Aurora Family Dental here 🦷\n\nYou\'re booked: ${slot} with ${providerName}.\n📍 4820 Kensington Rd NW — parking in back off 49 St\n📋 Quick intake (5 min): https://aurora.dentalforms.link/${first.toLowerCase()}\n\nReply STOP to cancel, or text us any questions.\n— Dr. Shah & team`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Front-desk dashboard next morning',
        body: `TODAY\'S HUDDLE — NEW PATIENTS + NOTABLE
  ───────────────────────────────────────

  ${slot.includes('Today') ? '14:15' : slot.slice(-7)}   ${v.patientName}  (${providerName})
     Reason: ${v.reason === 'new' ? 'NEW PATIENT — first visit' : v.reason === 'pain' ? 'EMERGENCY — toothache' : 'Routine'}
     Insurance: ${v.insurance}  [✓ pre-verified]
     ${v.reason === 'new' ? 'No prior records. Book 60 min instead of 45 to allow for pano + medical history review.' : v.reason === 'pain' ? 'Offered first available slot. Ibuprofen advice given over phone. Flag for triage on arrival.' : 'Regular recall — chart reviewed, no flags.'}`,
      },
    ]
  },
}

// 2. AI No-Show Defender
export const NO_SHOW_DEFENDER: Demo = {
  slug: 'no-show-defender',
  title: 'AI No-Show Defender',
  subtitle: 'Risk-scores appointments from history. High-risk bookings get extra reminders in Dr. Shah\'s voice.',
  category: 'no-show',
  industry: 'appointment',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Every no-show is $280 you can never get back. This agent scores every booking for no-show risk (first-time, past history, day of week, weather, distance), then layers in extra reminders and a confirm-or-swap text for the high-risk ones.',
  howItWorks: [
    'At booking: scores the appointment 0–100 for no-show risk',
    'Low risk: standard reminder cadence (24 hr)',
    'Medium: adds a 72-hr reminder + a "still good?" text morning-of',
    'High: Dr. Shah\'s voice steps in — warmer, personalized, with easy reschedule option',
    'If confirmed → holds slot. If silence → 2hrs before, offers slot to waitlist, still confirmed patient gets a firm reminder',
  ],
  inputFields: [
    { key: 'patientName', label: 'Patient', type: 'text' },
    { key: 'patientPhone', label: 'Phone', type: 'phone' },
    { key: 'appointmentTime', label: 'Appointment', type: 'text' },
    { key: 'historyNoShows', label: 'Past no-shows (last 12 mo)', type: 'number' },
    {
      key: 'riskFactors',
      label: 'Other factors',
      type: 'select',
      options: [
        { label: 'First-time patient', value: 'new' },
        { label: 'Distant — 40+ min drive', value: 'distant' },
        { label: 'Big procedure (filling / extraction)', value: 'big' },
        { label: 'None of the above', value: 'none' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Serial no-shower',
      description: '3 misses in last year + filling appointment',
      values: {
        patientName: 'Ben Parker',
        patientPhone: '(403) 555-0135',
        appointmentTime: 'Friday 2:30pm — filling #19',
        historyNoShows: '3',
        riskFactors: 'big',
      },
    },
    {
      label: 'First-time patient',
      description: 'New patient, high drop-off risk at the starting gate',
      values: {
        patientName: 'Jason Okafor',
        patientPhone: '(403) 555-0117',
        appointmentTime: 'Tuesday 10:00am — NP exam + cleaning',
        historyNoShows: '0',
        riskFactors: 'new',
      },
    },
    {
      label: 'Reliable regular',
      description: 'Never misses, routine cleaning — baseline reminder only',
      values: {
        patientName: 'Sofia Reyes',
        patientPhone: '(403) 555-0148',
        appointmentTime: 'Wednesday 10:30am — cleaning',
        historyNoShows: '0',
        riskFactors: 'none',
      },
    },
  ],
  brainHook:
    'The Brain stacks signals: weather forecast, hockey game at 1pm Saturday, Sofia\'s text exchange mentioning her sick toddler — all feed into the risk score. If Sofia mentioned the toddler, it pre-drafts a rescheduling offer: "Hi Sofia — total understanding, want me to move it? Next open slot is Monday."',
  generateOutput: (v, biz) => {
    const first = v.patientName.split(' ')[0]
    const risk =
      Number(v.historyNoShows || 0) >= 2 || v.riskFactors === 'big'
        ? 'HIGH'
        : v.riskFactors === 'new' || v.riskFactors === 'distant'
          ? 'MEDIUM'
          : 'LOW'

    const messages: import('./types').DemoOutputPreview[] =
      risk === 'LOW'
        ? [
            {
              type: 'sms' as const,
              recipient: `${v.patientName} · ${v.patientPhone}`,
              channelLabel: '24-hr reminder (standard)',
              body: `Hi ${first}, reminder: ${v.appointmentTime} with Aurora Family Dental. Reply C to confirm or call to reschedule. See you soon!`,
            },
          ]
        : risk === 'MEDIUM'
          ? [
              {
                type: 'sms' as const,
                recipient: `${v.patientName} · ${v.patientPhone}`,
                channelLabel: '72-hr reminder (medium risk)',
                body: `Hi ${first}! Looking forward to your first visit on ${v.appointmentTime}. 👋\n\nIf anything changes, just text me here — I\'ll move it no problem.\n— Dr. Shah`,
              },
              {
                type: 'sms' as const,
                recipient: `${v.patientName} · ${v.patientPhone}`,
                channelLabel: 'Morning-of check-in',
                body: `Morning ${first}! Today at ${v.appointmentTime.split(' — ')[0]}. Parking in the back off 49 St — plenty of spots. Text if you need anything.`,
              },
            ]
          : [
              {
                type: 'sms' as const,
                recipient: `${v.patientName} · ${v.patientPhone}`,
                channelLabel: '72-hr — Dr. Shah\'s voice',
                body: `Hi ${first} — Dr. Shah here (via text). Just wanted to check in on ${v.appointmentTime}.\n\nIf the timing doesn\'t work anymore, no awkwardness — text me back and I\'ll find something better. If you\'re good, a quick 👍 helps us hold the slot.\n— Priya`,
              },
              {
                type: 'sms' as const,
                recipient: `${v.patientName} · ${v.patientPhone}`,
                channelLabel: '24-hr — firm confirm required',
                body: `Hi ${first}! Confirming ${v.appointmentTime} tomorrow. Please reply C to confirm — if we don\'t hear back by 3pm today we\'ll offer the slot to our waitlist.\n\nTotally fine to reschedule, just text back.`,
              },
              {
                type: 'dashboard' as const,
                channelLabel: 'Front-desk dashboard',
                body: `⚠ HIGH NO-SHOW RISK — ${v.patientName}
  ${v.appointmentTime}
  Factors: ${v.historyNoShows} past misses · ${v.riskFactors === 'big' ? 'big procedure (high decline rate)' : v.riskFactors === 'new' ? 'first visit' : v.riskFactors === 'distant' ? 'distant patient' : '—'}
  Risk score: 72 / 100

  If no confirm by 3pm:
    → offer slot to: Mira Anand (waitlist, lives 4 min away)
    → text firm reminder to ${v.patientName}
    → keep slot for ${v.patientName} unless they explicitly release`,
              },
            ]

    return messages
  },
}

// 3. AI Rebooking Agent
export const REBOOKING_APPT: Demo = {
  slug: 'rebooking-appt',
  title: 'AI Rebooking Agent',
  subtitle: 'Post-visit, nudges patients to rebook at the right interval — in Dr. Shah\'s voice.',
  category: 'rebooking',
  industry: 'appointment',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Most practices lose 15–25% of patients to the "I\'ll book it next month" graveyard. This agent waits the right interval per patient (6 months for cleanings, 3 months for perio, 8 weeks for ortho), then sends a personalized nudge — and books them in one reply.',
  howItWorks: [
    'Reads last visit type + recommended recall interval',
    'Waits the personalized interval (6 mo default, tighter for perio/high risk)',
    'Sends a warm rebook nudge: references last visit + offers 2 pre-checked slots',
    'Patient replies "Wed 10am" → booked, confirmation sent, calendar synced',
    'If no response by +14 days → second gentler nudge, then stops',
  ],
  inputFields: [
    { key: 'patientName', label: 'Patient', type: 'text' },
    { key: 'patientPhone', label: 'Phone', type: 'phone' },
    { key: 'lastVisitDate', label: 'Last visit date', type: 'text' },
    { key: 'lastVisitType', label: 'Last visit type', type: 'text' },
    {
      key: 'recallInterval',
      label: 'Recall interval',
      type: 'select',
      options: [
        { label: '6 months (standard cleaning)', value: '6mo' },
        { label: '3 months (perio maintenance)', value: '3mo' },
        { label: '4 months (higher-risk recall)', value: '4mo' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Standard recall — 6 mo',
      description: 'Regular patient due for her next cleaning',
      values: {
        patientName: 'Sofia Reyes',
        patientPhone: '(403) 555-0148',
        lastVisitDate: 'October 24',
        lastVisitType: 'cleaning + exam',
        recallInterval: '6mo',
      },
    },
    {
      label: 'Perio maintenance — 3 mo',
      description: 'Tighter cadence, Dr. wants them back sooner',
      values: {
        patientName: 'Harold Chen',
        patientPhone: '(403) 555-0178',
        lastVisitDate: 'January 15',
        lastVisitType: 'perio maintenance',
        recallInterval: '3mo',
      },
    },
  ],
  brainHook:
    'The Brain remembers: Sofia said at her last cleaning "my daughter\'s wedding is in March, I\'ll want a polish a week before." The rebook agent doesn\'t just nudge her for 6 months — it also pre-drafts a "hey want to book that polish for early March?" text two weeks before.',
  generateOutput: (v, biz) => {
    const first = v.patientName.split(' ')[0]
    return [
      {
        type: 'sms',
        recipient: `${v.patientName} · ${v.patientPhone}`,
        channelLabel: 'Rebook nudge',
        body: `Hi ${first}! It\'s been ${v.recallInterval === '6mo' ? '6 months' : v.recallInterval === '4mo' ? '4 months' : '3 months'} since your ${v.lastVisitType} with us — you\'re due for your next visit.\n\nI pulled two slots that might work:\n  • Tues May 12, 10:00am\n  • Thurs May 14, 2:30pm\n\nJust reply with the one you want and I\'ll lock it in. Or text another day and I\'ll find something close.\n\n— Dr. Shah & team`,
      },
      {
        type: 'sms',
        recipient: `${v.patientName} · ${v.patientPhone}`,
        channelLabel: '(14 days later) Gentle second nudge — queued if no response',
        body: `Hi ${first} — no worries if the timing isn\'t right, just checking in one more time on your recall. A quick \'not now\' is fine and I\'ll bump it a few months. 🙂\n— Dr. Shah`,
      },
    ]
  },
}

// 4. AI Insurance / Billing Chaser
export const INSURANCE_CHASER: Demo = {
  slug: 'insurance-chaser',
  title: 'AI Insurance / Billing Chaser',
  subtitle: 'Watches AR. Handles follow-up calls and emails to insurers + patients.',
  category: 'billing-chaser',
  industry: 'appointment',
  business: b,
  tier2Price: '$3,500 build + $300/mo',
  buildTime: '2 weeks',
  description:
    'Insurance AR is where practices bleed money. The agent watches every claim, politely but firmly follows up with insurers (Alberta Blue Cross, Sun Life, Pacific Blue Cross), and chases patient co-pays with the right tone for each personality.',
  howItWorks: [
    'Reads claim submissions + payment postings',
    'Day 14 no payment → polite email to insurer with claim #',
    'Day 21 → phone call (AI agent) with reference number + voice claim inquiry',
    'Day 30 → escalation to human billing lead with full paper trail',
    'Parallel: patient co-pay chasing, warmer tone, payment link',
  ],
  inputFields: [
    { key: 'patientName', label: 'Patient', type: 'text' },
    { key: 'insurer', label: 'Insurer', type: 'text' },
    { key: 'claimNum', label: 'Claim #', type: 'text' },
    { key: 'claimAmount', label: 'Claim amount ($)', type: 'number' },
    { key: 'copayAmount', label: 'Patient co-pay ($)', type: 'number' },
    {
      key: 'stage',
      label: 'Follow-up stage',
      type: 'select',
      options: [
        { label: '14 days — polite first follow-up', value: '14' },
        { label: '21 days — phone call to insurer', value: '21' },
        { label: '30+ days — escalate', value: '30' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Alberta Blue Cross — 14 days',
      description: 'Standard claim, first follow-up to the insurer',
      values: {
        patientName: 'Sofia Reyes',
        insurer: 'Alberta Blue Cross',
        claimNum: 'ABC-2026-88412',
        claimAmount: '420',
        copayAmount: '60',
        stage: '14',
      },
    },
    {
      label: 'Sun Life — 30 days, escalate',
      description: 'Still unpaid, now drafts escalation email + patient side',
      values: {
        patientName: 'Harold Chen',
        insurer: 'Sun Life',
        claimNum: 'SL-42098771',
        claimAmount: '780',
        copayAmount: '140',
        stage: '30',
      },
    },
  ],
  brainHook:
    'The Brain learns each insurer\'s behavior: Alberta Blue Cross historically pays in 18 days, so day-14 nudges are gentle. Sun Life pays at 25+ and has a known pattern of rejecting X-rays coded as diagnostic — the Brain pre-flags claims likely to hit that rejection.',
  generateOutput: (v, biz) => {
    const amt = (n: string) => Number(n || 0).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    const first = v.patientName.split(' ')[0]

    if (v.stage === '14') {
      return [
        {
          type: 'email',
          recipient: `claims@${v.insurer.toLowerCase().replace(/\s/g, '')}.example.ca`,
          subject: `Follow-up on claim ${v.claimNum} — Aurora Family Dental`,
          body: `Hi ${v.insurer} team,

Following up on claim ${v.claimNum} for patient ${v.patientName}, submitted 14 days ago for ${amt(v.claimAmount)}.

Can you confirm the claim is in process or flag anything outstanding?

Happy to re-submit documentation if needed. Thanks,

Aurora Family Dental
Billing Dept.
4820 Kensington Rd NW, Calgary`,
        },
      ]
    }

    if (v.stage === '21') {
      return [
        {
          type: 'call-summary',
          channelLabel: 'AI voice call to insurer',
          body: `Outbound call to ${v.insurer} — Provider Services line.
Duration: 8 min 42s on hold + 2 min 14s with agent.

AI agent:
  "Hi, I\'m calling from Aurora Family Dental in Calgary about claim ${v.claimNum} for ${v.patientName}. It\'s been 21 days since submission, can you give me a status?"

${v.insurer} agent:
  "Let me pull that up. Ok I see it — it\'s in review, pending verification of the patient\'s secondary coverage."

AI agent:
  "Ok thanks. We have no indication of secondary coverage on our end — can you tell me what triggered that flag?"

${v.insurer} agent:
  "Appears the patient provided a secondary on their last claim 3 years ago. Let me make a note to clear that flag."

Result: confirmed flag was outdated, cleared. Claim now shows "in processing, ETA 5–7 business days."`,
        },
        {
          type: 'sms',
          recipient: biz.ownerName + ' (Dr. Shah)',
          channelLabel: 'Update to Dr. Shah',
          body: `${v.patientName} claim (${v.insurer}) — was flagged for outdated secondary coverage. AI agent called, cleared it, ETA 5–7 days.`,
        },
      ]
    }

    // 30
    return [
      {
        type: 'email',
        recipient: biz.ownerName + ' + Billing Lead',
        channelLabel: 'Escalation to human',
        subject: `Escalation: ${v.patientName} / ${v.insurer} — 30+ days unpaid`,
        body: `Claim ${v.claimNum} is now 32 days out. Full paper trail attached.

Timeline:
  Day 14: polite email sent, no response
  Day 21: AI voice call — ${v.insurer} said "in review", follow-up by 25
  Day 25: second email, no response
  Day 30: escalation.

Recommended action: call Sheila (${v.insurer} supervisor line), use ref # from day-21 call: SL-REF-884112.

Patient co-pay of ${amt(v.copayAmount)} is still outstanding as well — draft nudge ready.`,
      },
      {
        type: 'email',
        recipient: `${v.patientName} (co-pay)`,
        subject: `Just a heads-up on your balance — ${v.copayAmount}`,
        body: `Hi ${first},

Hope you\'ve been well since your last visit. We still have an outstanding balance of ${amt(v.copayAmount)} from your visit — the insurance portion is tied up on their end (we\'re handling that), but this co-pay piece is separate.

Super easy to pay: https://pay.aurora.dental/${v.claimNum.toLowerCase()}

Or text this number if something\'s changed on your side — we\'re happy to work with you.

Thanks,
— Aurora Family Dental`,
      },
    ]
  },
}

// 5. AI Post-Visit Follow-Up
export const POST_VISIT_FOLLOWUP: Demo = {
  slug: 'post-visit-followup',
  title: 'AI Post-Visit Follow-Up',
  subtitle: 'Personalized "how are you feeling?" check-in, captures sentiment, surfaces testimonials.',
  category: 'post-visit',
  industry: 'appointment',
  business: b,
  tier2Price: '$2,000 build + $175/mo',
  buildTime: '1–2 weeks',
  description:
    'Small check-in, big loyalty lift. 24–48 hours after a meaningful visit (extraction, new patient, kids first visit), the agent sends a personal-feeling note in Dr. Shah\'s voice. Positive answers become testimonials with consent; concerns escalate to Dr. Shah instantly.',
  howItWorks: [
    'Visits flagged as "meaningful" (extraction, NP, child\'s first visit) trigger 24–48hr follow-up',
    'Personalized SMS: mentions the actual procedure + tech',
    'Reply with sentiment — AI classifies: ok / great / concern',
    'Great → consent-request to use feedback as testimonial',
    'Concern → Dr. Shah alerted same day with suggested response',
  ],
  inputFields: [
    { key: 'patientName', label: 'Patient', type: 'text' },
    { key: 'patientPhone', label: 'Phone', type: 'phone' },
    { key: 'visitType', label: 'Visit type', type: 'text' },
    { key: 'visitDate', label: 'Visit date', type: 'text' },
    {
      key: 'patientResponse',
      label: 'Simulated patient reply',
      type: 'select',
      options: [
        { label: '(empty — show initial nudge only)', value: 'none' },
        { label: '"Feeling good! Thank you"', value: 'good' },
        { label: '"A bit sore still"', value: 'sore' },
        { label: '"Actually having some concern, can you call me?"', value: 'concern' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Kids first visit — warm check-in',
      description: 'Parent brought their 4-year-old for first dental visit',
      values: {
        patientName: 'Amira Okafor (daughter of Jason)',
        patientPhone: '(403) 555-0117',
        visitType: 'First pediatric visit (age 4)',
        visitDate: 'Tuesday',
        patientResponse: 'good',
      },
    },
    {
      label: 'Extraction — soreness check',
      description: 'Adult molar extraction yesterday, checking on pain',
      values: {
        patientName: 'Ben Parker',
        patientPhone: '(403) 555-0135',
        visitType: 'Molar extraction (#19)',
        visitDate: 'Yesterday',
        patientResponse: 'sore',
      },
    },
    {
      label: 'Concern → escalate',
      description: 'Patient replies with a complication — instant alert to Dr. Shah',
      values: {
        patientName: 'Harold Chen',
        patientPhone: '(403) 555-0178',
        visitType: 'Root canal, tooth #14',
        visitDate: 'Monday',
        patientResponse: 'concern',
      },
    },
  ],
  brainHook:
    'The Brain knows Ben is anxious about dental pain — his follow-up is extra reassuring, mentions Dr. Shah personally, and lowers the bar to reply ("even just a 👍 is fine"). For Amira (4 years old), it also drafts a "sticker and toy chest survived another visit" line for the parent.',
  generateOutput: (v, biz) => {
    const first = v.patientName.split(' ')[0]
    const ask = `Hi ${first}! Dr. Shah here via text — just checking in after your ${v.visitType.toLowerCase()} ${v.visitDate.toLowerCase()}. How are you feeling?\n\nQuick replies:\n  1 — great, no issues\n  2 — a little sore but ok\n  3 — need to talk, please call me`

    if (v.patientResponse === 'none' || !v.patientResponse) {
      return [
        {
          type: 'sms',
          recipient: `${v.patientName} · ${v.patientPhone}`,
          channelLabel: 'Follow-up ask',
          body: ask,
        },
      ]
    }

    if (v.patientResponse === 'good') {
      return [
        {
          type: 'sms',
          recipient: `${v.patientName} · ${v.patientPhone}`,
          channelLabel: 'Follow-up ask',
          body: ask,
        },
        {
          type: 'sms',
          recipient: `${v.patientName} · ${v.patientPhone}`,
          channelLabel: 'Positive reply follow-up',
          body: `So glad to hear ${first.toLowerCase() === 'amira (daughter of jason)'.toLowerCase().slice(0, 5) || first} is feeling good! 🎉\n\nIf you\'re up for it — would you mind leaving us a quick Google review? It really helps other families find us.\n→ https://g.page/aurora-dental/review\n\nThanks either way,\n— Dr. Shah`,
        },
      ]
    }

    if (v.patientResponse === 'sore') {
      return [
        {
          type: 'sms',
          recipient: `${v.patientName} · ${v.patientPhone}`,
          channelLabel: 'Follow-up ask',
          body: ask,
        },
        {
          type: 'sms',
          recipient: `${v.patientName} · ${v.patientPhone}`,
          channelLabel: 'Soreness guidance',
          body: `Totally normal at this stage ${first}! Some soreness for 2–3 days is expected. A few things that help:\n\n• Ibuprofen 400mg every 6 hrs (if no reason not to)\n• Salt-water rinse 3x daily\n• Soft foods today + tomorrow\n• No straws, no smoking\n\nIf it gets worse, not better, text me here anytime.\n— Dr. Shah`,
        },
      ]
    }

    return [
      {
        type: 'sms',
        recipient: `${v.patientName} · ${v.patientPhone}`,
        channelLabel: 'Follow-up ask',
        body: ask,
      },
      {
        type: 'sms',
        recipient: biz.ownerName + ' (Dr. Shah)',
        channelLabel: '🚨 Concern flag to Dr. Shah',
        body: `${v.patientName} replied "3 — need to talk" to post-${v.visitType} check-in.\n\nCalling them now would be ideal. Chart pulled, your 2pm is clear for 10 min.\nTheir #: ${v.patientPhone}\nLast RX given: Amoxicillin 500mg TID`,
      },
      {
        type: 'sms',
        recipient: `${v.patientName} · ${v.patientPhone}`,
        channelLabel: 'Auto-response while escalating',
        body: `Got it ${first} — Dr. Shah is seeing this now. She\'ll call you within the next hour. If it\'s urgent / severe pain, please reply ER and we\'ll route you to the emergency clinic.`,
      },
    ]
  },
}

// 6. AI Review Harvester (appt variant)
export const REVIEW_HARVESTER_APPT: Demo = {
  slug: 'review-harvester-appt',
  title: 'AI Review Harvester',
  subtitle: 'Review asks at peak sentiment moment post-visit. Draft replies for one-tap approval.',
  category: 'review-harvester',
  industry: 'appointment',
  business: b,
  tier2Price: '$1,800 build + $150/mo',
  buildTime: '2 weeks',
  description:
    'In dental, the right moment to ask is 2 hours after the freezing wears off and they feel good. Ask too soon and they\'re still numb. This agent nails the timing, personalizes the ask, and drafts replies for Dr. Shah.',
  howItWorks: [
    'Hygienist marks visit complete → agent calculates the "peak sentiment" window',
    'Sends personalized ask at the right hour (2 hr after extraction, next morning for cleaning)',
    'Uses visit-specific language ("your smile looks fresh" for whitening, "hope the kids did great" for peds)',
    'Drafts replies to all new reviews in Dr. Shah\'s voice for one-tap approval',
    'Bad reviews pause + alert — always handled by human first',
  ],
  inputFields: [
    { key: 'patientName', label: 'Patient', type: 'text' },
    { key: 'patientPhone', label: 'Phone', type: 'phone' },
    { key: 'visitType', label: 'Visit type', type: 'text' },
    { key: 'hygienistOrDr', label: 'Who they saw', type: 'text' },
    {
      key: 'sentiment',
      label: 'Sentiment signal',
      type: 'select',
      options: [
        { label: 'Positive — visit went well', value: 'positive' },
        { label: 'Neutral — routine', value: 'neutral' },
        { label: 'Negative — flagged concern', value: 'negative' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Pediatric — glowing',
      description: 'Kid\'s first visit, parent beaming',
      values: {
        patientName: 'Jason Okafor (parent of Amira)',
        patientPhone: '(403) 555-0117',
        visitType: 'Pediatric first visit',
        hygienistOrDr: 'Kendra + Dr. Shah',
        sentiment: 'positive',
      },
    },
    {
      label: 'Adult cleaning',
      description: 'Routine 6-month with Kendra',
      values: {
        patientName: 'Sofia Reyes',
        patientPhone: '(403) 555-0148',
        visitType: 'Cleaning + exam',
        hygienistOrDr: 'Kendra',
        sentiment: 'positive',
      },
    },
  ],
  brainHook:
    'The Brain never asks a patient for a review more than once per 12 months, never on the same day as a billing issue, and knows which patients have reviewed competitors in the past — those get a warmer, more personal ask.',
  generateOutput: (v, biz) => {
    const first = v.patientName.split(' ')[0]
    if (v.sentiment === 'negative') {
      return [
        {
          type: 'dashboard',
          channelLabel: 'Review ask BLOCKED — owner alert',
          body: `⛔ Held ${v.patientName}\'s review ask — negative sentiment flagged.

Recommendation: Dr. Shah personal call today.`,
        },
      ]
    }
    return [
      {
        type: 'sms',
        recipient: `${v.patientName} · ${v.patientPhone}`,
        channelLabel: 'Review ask (peak sentiment window)',
        body: `Hi ${first}! Hope the cleaning feel is still going strong 😄\n\nIf you had a minute, a quick Google review would mean the world. Takes 30 sec:\n→ https://g.page/aurora-dental/review\n\nThanks ${first}!\n— Dr. Shah & the team`,
      },
      {
        type: 'email',
        recipient: biz.ownerName + ' (Dr. Shah)',
        channelLabel: '(Next day) Review posted — reply drafted',
        subject: `${first} left you a 5-star review!`,
        body: `Review from ${v.patientName}:
"Took my 4-year-old for her first dental visit. Kendra was so patient — got down to her level, let her play with the mirror, made it feel like a game. Dr. Shah gave us great take-home advice. She actually asked when we can come back."

DRAFT REPLY:
"Thanks so much ${first}! Kendra was so thrilled to meet Amira — she talked about the \'mirror game\' all afternoon. So glad the first visit set a good tone. See you both soon! — Dr. Shah"

[ Approve & post ] [ Edit ]`,
      },
    ]
  },
}

export const APPOINTMENT_DEMOS: Demo[] = [
  BOOKING_CONCIERGE_APPT,
  NO_SHOW_DEFENDER,
  REBOOKING_APPT,
  INSURANCE_CHASER,
  POST_VISIT_FOLLOWUP,
  REVIEW_HARVESTER_APPT,
]
