import type { Demo } from './types'
import { PEAK_PLUMBING } from './businesses'

const b = PEAK_PLUMBING

// 1. AI Dispatch Triage
export const DISPATCH_TRIAGE: Demo = {
  slug: 'dispatch-triage',
  title: 'AI Dispatch Triage',
  subtitle: 'Incoming call → urgency assessment → wakes on-call tech for P1 only.',
  category: 'on-call-triage',
  industry: 'field',
  business: b,
  tier2Price: '$3,500 build + $300/mo',
  buildTime: '2 weeks',
  description:
    'In field services, the difference between a routed call and a missed call is revenue. The AI triage picks up every call, classifies urgency precisely (flooding? no water? leaking into ceiling?), and only pages the on-call tech when it\'s genuinely P1.',
  howItWorks: [
    'All inbound calls (24/7) routed to the AI first',
    'Asks targeted questions: is water actively leaking? main shutoff reachable? flood contained?',
    'P1 (active flooding / burst line / no water + weather) → pages on-call tech within 60 sec',
    'P2 → books first morning slot, sends customer SMS',
    'P3 → queues for next business day with full context',
  ],
  inputFields: [
    { key: 'callerName', label: 'Caller', type: 'text' },
    { key: 'callerPhone', label: 'Phone', type: 'phone' },
    { key: 'issueReported', label: 'What they said', type: 'textarea' },
    {
      key: 'containmentStatus',
      label: 'Containment',
      type: 'select',
      options: [
        { label: 'Actively flooding — cannot stop', value: 'flooding' },
        { label: 'Contained — caught in a bucket', value: 'contained' },
        { label: 'Slow drip — can wait', value: 'drip' },
        { label: 'No water in building', value: 'no-water' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'P1 — burst line, flooding basement',
      description: 'Water pouring out, midnight, panic',
      values: {
        callerName: 'Sarah Bayliss',
        callerPhone: '(403) 555-0122',
        issueReported: 'Water pouring out from behind my washing machine. Main shutoff is stuck. Basement is filling.',
        containmentStatus: 'flooding',
      },
    },
    {
      label: 'P2 — toilet leaking, contained',
      description: 'Slow leak, customer has a bucket under it',
      values: {
        callerName: 'Marcus Abel',
        callerPhone: '(403) 555-0158',
        issueReported: 'Toilet tank is leaking from the bottom. Caught in a bucket, maybe half a cup an hour. Annoying but not urgent.',
        containmentStatus: 'contained',
      },
    },
    {
      label: 'P3 — slow drip',
      description: 'Kitchen faucet dripping, no rush',
      values: {
        callerName: 'Yvonne Patel',
        callerPhone: '(403) 555-0181',
        issueReported: 'Kitchen faucet has been dripping for like two months, finally getting around to calling.',
        containmentStatus: 'drip',
      },
    },
  ],
  brainHook:
    'The Brain remembers Sarah Bayliss\' house — 1984 build, galvanized lines we replaced 3 years ago. When she calls with flooding, the agent can tell the on-call tech: "Sarah Bayliss, we did a repipe for her in 2023, so this is likely upstream of our work or at a joint we didn\'t touch. Check the basement panel first."',
  generateOutput: (v, biz) => {
    const first = v.callerName.split(' ')[0]

    if (v.containmentStatus === 'flooding' || v.containmentStatus === 'no-water') {
      return [
        {
          type: 'call-summary',
          channelLabel: 'P1 DISPATCH',
          body: `🚨 P1 EMERGENCY — DISPATCHING NOW

Caller: ${v.callerName} (${v.callerPhone})
Reported: ${v.issueReported}
Containment: ${v.containmentStatus.toUpperCase()}

Instructions given to caller (while dispatching):
  1. "Locate main water shutoff — usually where the main comes into the house, basement or utility room."
  2. "If you can\'t turn it, move valuables off the floor first."
  3. "Jake is 18 minutes out. He\'ll text when he\'s 5 min away."

Tech dispatched: Jake (nearest on-call, 18 min ETA)
Tom (owner) notified — non-waking`,
        },
        {
          type: 'sms',
          recipient: 'Jake (on-call tech)',
          channelLabel: 'Tech page',
          body: `🚨 P1 — ${v.callerName}, ${v.callerPhone}\n${v.issueReported.slice(0, 150)}\nACTIVE FLOOD\nHistory: we repiped this house in 2023\nETA target: 18 min\nReply Y to accept.`,
        },
        {
          type: 'sms',
          recipient: `${v.callerName} · ${v.callerPhone}`,
          channelLabel: 'Customer reassurance',
          body: `Hi ${first} — Peak Plumbing here. Jake is on the way, ETA 18 min. Try to find the main shutoff (basement / utility). He\'ll call you 5 min out. Everything will be ok.`,
        },
      ]
    }

    if (v.containmentStatus === 'contained') {
      return [
        {
          type: 'call-summary',
          channelLabel: 'P2 — booked morning slot',
          body: `🟡 P2 — CONTAINED, BOOKED

Caller: ${v.callerName} (${v.callerPhone})
Reported: ${v.issueReported}
Containment: contained

Action: booked first morning slot, 8:00–10:00am with Jake.
Tom (owner) NOT paged — seen at 7am.

AI told caller:
  "${first}, since you\'ve got it in a bucket and there\'s no active flooding, I\'ve booked Jake for tomorrow morning first thing — 8 to 10am. I\'ll text you a confirmation and he\'ll call 20 min before he arrives."`,
        },
        {
          type: 'sms',
          recipient: `${v.callerName} · ${v.callerPhone}`,
          channelLabel: 'Customer confirmation',
          body: `Hi ${first}! Peak Plumbing here. Jake booked for tomorrow 8–10am. He\'ll call 20 min before. If it gets worse overnight, text this number anytime.`,
        },
      ]
    }

    return [
      {
        type: 'call-summary',
        channelLabel: 'P3 — queued for dispatcher',
        body: `🟢 P3 — QUEUED FOR MORNING DISPATCHER

Caller: ${v.callerName} (${v.callerPhone})
Reported: ${v.issueReported}

Action: in dispatcher queue for next business day. Tom reviews at 7am.

AI told caller:
  "${first} — I\'ve got you on the list. Someone will call you tomorrow morning between 8 and 9 to book a time that works. That dripping is costing you about 2 gallons a week, so we\'ll get it sorted soon."`,
      },
    ]
  },
}

// 2. AI Customer ETA Portal
export const ETA_PORTAL: Demo = {
  slug: 'eta-portal',
  title: 'AI Customer ETA Portal',
  subtitle: '"Rick is 20 min out" tracking page — the Domino\'s tracker effect.',
  category: 'eta-portal',
  industry: 'field',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Customers hate the "between 10am and 2pm" window. The ETA portal pulls live GPS from the tech\'s phone and shows the customer: who\'s coming, their photo, how close they are, what they\'re going to do when they arrive. Review rates jump 3x.',
  howItWorks: [
    'Job dispatched → unique tracking URL created + texted to customer',
    'Portal shows: tech name + photo, current ETA (live-updated), job summary',
    'Updates every 2 min with live GPS position',
    'At "tech is at your door" → portal auto-triggers a quick intro message',
    'Post-job → portal becomes the invoice + review ask URL',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerPhone', label: 'Phone', type: 'phone' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'techName', label: 'Tech dispatched', type: 'text' },
    { key: 'jobType', label: 'Job type', type: 'text' },
    {
      key: 'etaState',
      label: 'Current ETA state',
      type: 'select',
      options: [
        { label: 'Dispatched — 18 min out', value: 'dispatched' },
        { label: '5 min away', value: 'near' },
        { label: 'On-site, working', value: 'onsite' },
        { label: 'Job complete', value: 'done' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Tech 18 min out',
      description: 'Initial dispatch notification',
      values: {
        customerName: 'Sarah Bayliss',
        customerPhone: '(403) 555-0122',
        address: '3921 Taylor Ave',
        techName: 'Jake',
        jobType: 'Emergency leak repair',
        etaState: 'dispatched',
      },
    },
    {
      label: '5 min out — door knock coming',
      description: 'Late-stage update',
      values: {
        customerName: 'Marcus Abel',
        customerPhone: '(403) 555-0158',
        address: '1218 Centre St',
        techName: 'Luis',
        jobType: 'Toilet repair',
        etaState: 'near',
      },
    },
  ],
  brainHook:
    'The Brain personalizes the portal per customer — for Sarah (who was flooding, high stress), the portal shows a calmer "everything is under control" message. For Marcus (routine), it shows friendlier small-talk content and a "what to ask Luis" tip card.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]

    if (v.etaState === 'dispatched') {
      return [
        {
          type: 'sms',
          recipient: `${v.customerName} · ${v.customerPhone}`,
          channelLabel: 'Tracking link sent',
          body: `Hi ${first}! Peak Plumbing. ${v.techName} is on the way, ETA 18 min.\n\n📍 Track live: peakpl.link/${v.techName.toLowerCase()}-${Math.floor(Math.random() * 9000 + 1000)}\n\nYou\'ll see his live location, ETA, and a photo so you know who\'s at your door.`,
        },
        {
          type: 'multi-channel',
          channelLabel: 'Live tracking portal (what customer sees)',
          body: `━━━━━━━━━━━━━━━━━━━━━━━━
  [PHOTO OF JAKE — badge]
  Jake is on the way!
  ━━━━━━━━━━━━━━━━━━━━━━━━

  ETA: 18 minutes
  Currently: Heading south on Gaetz Ave
  [LIVE MAP — updating every 2 min]

  Coming for: Emergency leak repair
  License plate: BFS-4281 (white van)

  What Jake will do when he arrives:
    1. Quick intro + ask you to show him the leak
    2. Shut off water to the affected area
    3. Diagnose + give you a flat-rate quote before any work
    4. Fix it (or book follow-up if parts needed)

  Questions? Text this number.

  [ CHAT WITH JAKE ]   [ RESCHEDULE ]`,
        },
      ]
    }

    if (v.etaState === 'near') {
      return [
        {
          type: 'sms',
          recipient: `${v.customerName} · ${v.customerPhone}`,
          channelLabel: '5 min out',
          body: `Hi ${first}! Luis is 5 min out — just turning onto Centre St. Anything I should know before he knocks? Dog? Gate? Where to park?`,
        },
      ]
    }

    if (v.etaState === 'onsite') {
      return [
        {
          type: 'multi-channel',
          channelLabel: 'Live portal while tech is working',
          body: `━━━━━━━━━━━━━━━━━━━━━━━━
  Luis is working on your job
  ━━━━━━━━━━━━━━━━━━━━━━━━

  Started: 11:14am
  Estimated: 45–60 min
  Quote given: $285 flat fee (approved ✓)

  [ PHOTOS FROM LUIS ]
    • Old wax ring (showed corrosion)
    • New wax ring installed
    • Bowl refit, tested with a flush

  Current status: final leak test + cleanup
  ETA done: ~12:10pm`,
        },
      ]
    }

    return [
      {
        type: 'multi-channel',
        channelLabel: 'Post-job portal',
        body: `Job complete ✓

  Before / after photos attached.
  Invoice sent to your email (tap to pay).

  How did we do?
  ★ ★ ★ ★ ★  ← tap to leave a Google review

  — ${v.techName} + the Peak Plumbing team`,
      },
    ]
  },
}

// 3. AI Instant-Invoice Agent
export const INSTANT_INVOICE: Demo = {
  slug: 'instant-invoice',
  title: 'AI Instant-Invoice Agent',
  subtitle: 'Job complete → photos + parts + voice note → invoice + payment link within 30 min.',
  category: 'instant-invoice',
  industry: 'field',
  business: b,
  tier2Price: '$2,800 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Every day an invoice sits un-sent costs you money. The agent reads the tech\'s end-of-job voice note + photos, drafts the invoice, applies correct taxes + warranty info, and sends with a one-tap payment link before the tech pulls out of the driveway.',
  howItWorks: [
    'Tech finishes job, records a 30-sec voice note + uploads photos',
    'Agent transcribes, identifies parts + labor, matches to price book',
    'Drafts the invoice with GST, warranty text, pay link',
    'Texts invoice to customer within 30 min of job done',
    'Tracks time-to-pay per invoice — usually < 48 hrs when sent this fast',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Email', type: 'text' },
    { key: 'techName', label: 'Tech', type: 'text' },
    { key: 'voiceNote', label: 'Tech\'s voice note (transcribed)', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Toilet wax ring repair',
      description: 'Standard job, flat-rate pricing',
      values: {
        customerName: 'Marcus Abel',
        customerEmail: 'm.abel@example.com',
        techName: 'Luis',
        voiceNote: 'Abel job, toilet tank leak. Turned out to be a cracked wax ring under the bowl. Replaced ring, new supply line, retested. 45 min on site. Parts: 1 wax ring $8, 1 supply line $12. Labor at flat rate 265. Customer was home, seemed happy. No warranty concerns. Oh he asked about tankless water heaters, left him a card.',
      },
    },
    {
      label: 'Emergency leak — after hours',
      description: 'Midnight call with premium rate',
      values: {
        customerName: 'Sarah Bayliss',
        customerEmail: 's.bayliss@example.com',
        techName: 'Jake',
        voiceNote: 'Bayliss emergency. Burst fitting on the cold line to the washer, flooded about a quarter inch of the basement. Did a temporary cap, she\'ll call us back to do the proper repair next week. 90 min on site. Parts: 1 SharkBite cap $22, 2 towels for mop up. Labor emergency rate 350. She\'s going to also need flooring follow-up, I told her we\'d have the office call her with a repair recommendation list.',
      },
    },
  ],
  brainHook:
    'The Brain knows Marcus is a word-of-mouth referrer — it adds a thank-you line to his invoice: "Marcus — thanks for telling your neighbors about us, you\'ve sent us 4 referrals this year." Small, specific, makes him want to send more.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    const isEmerg = v.voiceNote.toLowerCase().includes('emergency')
    const total = isEmerg ? 372 : 285

    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: `Invoice — Peak Plumbing (job ${new Date().toISOString().slice(0, 10)})`,
        body: `Hi ${first},

Quick invoice for the work ${v.techName} did today. Before/after photos attached.

  LINE ITEMS
  ───────────────────────
  ${isEmerg ? 'Emergency after-hours service (90 min)' : 'Flat-rate toilet repair (45 min)'} ......... $${isEmerg ? '350.00' : '265.00'}
  Parts ........................................ $${isEmerg ? '22.00' : '20.00'}
  ───────────────────────
  Subtotal ..................................... $${isEmerg ? '372.00' : '285.00'}
  GST 5% ....................................... $${(total * 0.05).toFixed(2)}
  TOTAL ........................................ $${(total * 1.05).toFixed(2)}

  Pay link (takes 30 seconds): https://pay.peakpl.link/inv-${Math.floor(Math.random() * 90000 + 10000)}

  WARRANTY
  • 1 year warranty on the work performed (labor + parts)
  • Call this number if anything leaks again, we\'ll come back

${isEmerg ? '\n  P.S. Sarah — we\'ll email you tomorrow with flooring-repair referrals. Your insurance may cover it; let us know if you need a report for the claim.' : '\n  P.S. Thanks for the tankless inquiry — I\'ve put you on Tom\'s callback list for Tuesday.'}

— Tom Delaney
Peak Plumbing & Heating`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Invoice ledger',
        body: `✓ Invoice sent — Marcus Abel — $${(total * 1.05).toFixed(2)}
  Time from job complete to invoice sent: 18 min
  Expected pay-by: 2 business days (your current avg)
  [ Also drafted: tankless heater callback note for Tuesday ]`,
      },
    ]
  },
}

// 4. AI Maintenance Plan Converter
export const MAINTENANCE_PLAN: Demo = {
  slug: 'maintenance-plan',
  title: 'AI Maintenance Plan Converter',
  subtitle: 'Post-service, pitches maintenance plan at peak sentiment moment in owner\'s voice.',
  category: 'maintenance-plan',
  industry: 'field',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Recurring revenue is the difference between feast-or-famine and a stable business. The agent pitches the maintenance plan at the perfect moment — 2 hrs after the tech leaves, while the customer is still relieved — in the owner\'s voice, personalized to the job that just got fixed.',
  howItWorks: [
    'Job completed + paid → agent waits 2 hours',
    'Drafts personalized pitch: references the actual job + warns about related future issues',
    'Offers the maintenance plan (annual tune-up, priority dispatch, 10% off repairs)',
    'One-click accept → contract + first charge set up',
    'Tracks conversion by job type (plumbing vs heating vs emergency)',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Email', type: 'text' },
    { key: 'jobCompleted', label: 'Job completed', type: 'text' },
    { key: 'agingConcern', label: 'Aging / future concern spotted', type: 'text' },
  ],
  scenarios: [
    {
      label: 'After emergency — peak sentiment',
      description: 'Just saved them from a flood — perfect moment',
      values: {
        customerName: 'Sarah Bayliss',
        customerEmail: 's.bayliss@example.com',
        jobCompleted: 'Emergency burst-line repair at midnight',
        agingConcern: 'Galvanized lines on the hot side — not urgent but they\'re 40+ years old',
      },
    },
  ],
  brainHook:
    'The Brain knows Sarah spent $372 on the emergency and was visibly stressed. It softens the pitch: leads with "I\'m not trying to upsell you after an expensive night" and positions the plan as "insurance against a repeat of tonight" — tone that respects the moment.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: `A thought after tonight (no hard sell)`,
        body: `Hi ${first},

I\'m not trying to upsell you after an expensive night — want to acknowledge that first.

But Jake mentioned your galvanized hot-side lines are 40+ years old. They\'re not leaking now, and I\'m not saying they will tomorrow. I\'d just rather talk about this when you\'re warm and dry than the next time something bursts at 1am.

Our Maintenance Plan is $28/month. What you get:
  • Annual full-home plumbing inspection (45 min, we find the quiet stuff)
  • Priority dispatch — plan holders jump the queue on emergency calls
  • 10% off any repair labor
  • Free water heater flush annually

What it\'d cost you next time if tonight\'s situation happens again at 1am: ~$400 instead of $350, and a 90-min wait instead of 20.

Want me to set it up? Reply with "yes" and I\'ll send the authorization link. Or "not right now" and I\'ll quit bugging you about it.

Glad you\'re dry.

— Tom
Peak Plumbing & Heating`,
      },
    ]
  },
}

// 5. AI Review Harvester (field)
export const REVIEW_HARVESTER_FIELD: Demo = {
  slug: 'review-harvester-field',
  title: 'AI Review Harvester',
  subtitle: 'Post-service review ask when the stress just resolved — peak gratitude moment.',
  category: 'review-harvester',
  industry: 'field',
  business: b,
  tier2Price: '$1,800 build + $150/mo',
  buildTime: '2 weeks',
  description:
    'Field services win their best reviews within 2 hours of the fix. This agent nails the timing, references the specific job + tech, and drafts one-tap-approve replies.',
  howItWorks: [
    'Job complete → agent waits 90 min (let them breathe)',
    'Personal SMS referencing the actual issue + tech name',
    'Positive → auto-links to Google review',
    'Low star → pauses, pings Tom before it goes public',
    'Reply drafts in Tom\'s voice for every new review',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerPhone', label: 'Phone', type: 'phone' },
    { key: 'techName', label: 'Tech', type: 'text' },
    { key: 'jobSummary', label: 'Job summary', type: 'text' },
    {
      key: 'sentiment',
      label: 'Sentiment',
      type: 'select',
      options: [
        { label: 'Very positive (emergency saved)', value: 'positive' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Concern flagged', value: 'negative' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Emergency save',
      description: 'Jake came at midnight, stopped the flood',
      values: {
        customerName: 'Sarah Bayliss',
        customerPhone: '(403) 555-0122',
        techName: 'Jake',
        jobSummary: 'Emergency burst-line repair at midnight',
        sentiment: 'positive',
      },
    },
  ],
  brainHook:
    'The Brain sends review asks more readily after emergency jobs (conversion 4x higher) and holds back after low-sentiment routine maintenance. It also knows which tech goes with which kind of review language — Jake\'s customers write about him being "calm", Luis\'s write about him being "friendly".',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    if (v.sentiment === 'negative') {
      return [
        {
          type: 'dashboard',
          channelLabel: 'Review ask BLOCKED',
          body: `⛔ Held review ask for ${v.customerName}. ${v.techName} flagged a concern. Recommend Tom call before any public review ask.`,
        },
      ]
    }
    return [
      {
        type: 'sms',
        recipient: `${v.customerName} · ${v.customerPhone}`,
        channelLabel: 'Review ask (90 min after)',
        body: `Hi ${first} — Tom from Peak. Just checking in that everything\'s dry and calm now after Jake\'s visit.\n\nIf you\'d drop a quick Google review, it means the world to a small crew like us:\n→ g.page/peak-plumbing-reddeer/review\n\nEither way, glad Jake got there fast.\n— Tom`,
      },
      {
        type: 'email',
        recipient: biz.ownerName + ' (Tom)',
        channelLabel: 'Reply drafted for incoming review',
        subject: `${first} left you a 5-star`,
        body: `"Called Peak at 11:40pm with water pouring out of my basement. Jake was at my door in 22 minutes, calm and confident, had it shut off in 5 min, talked me through options. Paid more than a normal job but absolutely worth it."

DRAFT REPLY:
"Thank you Sarah — Jake said you kept your cool which made his job easier. Glad the flood was short and nothing precious got wet. See you next week for the follow-up. — Tom"

[ Approve ] [ Edit ]`,
      },
    ]
  },
}

// 6. AI Collections Agent (field)
export const COLLECTIONS_FIELD: Demo = {
  slug: 'collections-field',
  title: 'AI Collections Agent',
  subtitle: 'Payment chase for unpaid invoices, escalating in owner\'s voice.',
  category: 'collections',
  industry: 'field',
  business: b,
  tier2Price: '$2,800 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Field services often send invoices and forget. The agent tracks AR, sends friendly-to-firm reminders, and escalates only when Tom needs to get involved — cutting DSO in half for most clients.',
  howItWorks: [
    'Watches invoices from the field billing system',
    'Day 7 / 14 / 21 / 30 reminder ladder in Tom\'s voice',
    'Pay link included in every touch',
    'Flags patterns: same customer, 3rd slow-pay → Tom alerted',
    'Drafts written demand letter at day 45',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Email', type: 'text' },
    { key: 'invoiceAmount', label: 'Invoice amount ($)', type: 'number' },
    { key: 'daysOverdue', label: 'Days overdue', type: 'number' },
    { key: 'jobSummary', label: 'Job summary', type: 'text' },
  ],
  scenarios: [
    {
      label: '14 days overdue',
      description: 'Second nudge, friendly tone',
      values: {
        customerName: 'Marcus Abel',
        customerEmail: 'm.abel@example.com',
        invoiceAmount: '299',
        daysOverdue: '14',
        jobSummary: 'Toilet wax ring repair',
      },
    },
  ],
  brainHook:
    'The Brain knows Marcus has referred us 4 times in the past year — so the nudge stays warm and doesn\'t threaten late fees until day 30+. High-value referrers get a softer ladder.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    const amt = Number(v.invoiceAmount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: `Quick heads-up on invoice`,
        body: `Hi ${first},

Just circling back on the invoice for the ${v.jobSummary.toLowerCase()} a couple weeks back (${amt}). No urgency, just making sure it didn\'t get lost in the shuffle.

Pay link: https://pay.peakpl.link/marcus-${Math.floor(Math.random() * 9000)}

Thanks a ton for the referrals this year, means a lot.

— Tom`,
      },
    ]
  },
}

export const FIELD_DEMOS: Demo[] = [
  DISPATCH_TRIAGE,
  ETA_PORTAL,
  INSTANT_INVOICE,
  MAINTENANCE_PLAN,
  REVIEW_HARVESTER_FIELD,
  COLLECTIONS_FIELD,
]
