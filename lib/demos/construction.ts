import type { Demo } from './types'
import { HENDERSON_HVAC } from './businesses'

const b = HENDERSON_HVAC

// 1. AI Receptionist
export const AI_RECEPTIONIST_CONSTRUCTION: Demo = {
  slug: 'ai-receptionist-construction',
  title: 'AI Receptionist',
  subtitle: 'Answers calls 24/7, qualifies, books, and texts Rick within 60 seconds.',
  category: 'receptionist',
  industry: 'construction',
  business: b,
  tier2Price: '$3,500 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Never miss another call. The AI Receptionist answers in Rick\'s voice, qualifies the job, checks the calendar, books the slot, and texts Rick a summary before the customer has even hung up.',
  howItWorks: [
    'Incoming call forwards to the AI agent after 2 rings (or 24/7)',
    'Agent greets in Rick\'s voice, captures name, address, issue, urgency',
    'For emergencies: dispatches on-call tech + texts Rick P1 alert',
    'For quotes/repair: checks calendar, offers 2 time slots, books the slot',
    'Summary text + booking goes to Rick and to Jobber immediately',
  ],
  inputFields: [
    { key: 'callerName', label: 'Caller name', type: 'text', placeholder: 'Jane Mitchell' },
    { key: 'callerPhone', label: 'Caller phone', type: 'phone', placeholder: '(780) 555-0142' },
    { key: 'address', label: 'Service address', type: 'text' },
    { key: 'issue', label: 'Issue described', type: 'textarea' },
    {
      key: 'urgency',
      label: 'Urgency',
      type: 'select',
      options: [
        { label: 'Emergency — no heat / no water', value: 'P1' },
        { label: 'Urgent — within 24–48 hrs', value: 'P2' },
        { label: 'Routine — schedule this week', value: 'P3' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Emergency: no heat at -18°C',
      description: 'Classic after-hours P1 call on a cold January evening',
      values: {
        callerName: 'Jane Mitchell',
        callerPhone: '(780) 555-0142',
        address: '14212 97 St NW, Edmonton',
        issue: 'Furnace just stopped. Blowing cold air only. House is 16° and dropping. Two kids at home.',
        urgency: 'P1',
      },
    },
    {
      label: 'Routine: annual tune-up',
      description: 'Existing customer wants to book their fall maintenance',
      values: {
        callerName: 'Carl Burroughs',
        callerPhone: '(780) 555-0198',
        address: '9820 Ada Blvd NW, Edmonton',
        issue: 'Annual furnace tune-up. Had one last year with Kyle, happy to book him again if available.',
        urgency: 'P3',
      },
    },
    {
      label: 'Urgent: AC not cooling',
      description: 'Mid-summer, customer wants someone tomorrow',
      values: {
        callerName: 'Priya Lal',
        callerPhone: '(780) 555-0167',
        address: '11007 Saskatchewan Dr, Edmonton',
        issue: 'AC running but not cooling. Upstairs is 29°. Not dying but miserable. Can wait till tomorrow.',
        urgency: 'P2',
      },
    },
  ],
  brainHook:
    'The Brain knows every customer\'s full history. If Carl called and his file shows "prefers Kyle, paid net-15 last time, referred by the Hendersons" — the agent uses all of that. It also knows Rick\'s family calendar, so it won\'t promise a 7am slot on a Tuesday (hockey).',
  generateOutput: (v, biz) => {
    const urgencyLabel =
      v.urgency === 'P1' ? 'EMERGENCY (P1)' : v.urgency === 'P2' ? 'Urgent (P2)' : 'Routine (P3)'
    const slot =
      v.urgency === 'P1'
        ? 'Tonight, ETA 35 minutes'
        : v.urgency === 'P2'
          ? 'Tomorrow, 10am–12pm'
          : 'Thursday, 9am–11am'

    return [
      {
        type: 'call-summary',
        channelLabel: 'Call transcript summary',
        body: `Incoming call — ${new Date().toLocaleString('en-CA', { timeZone: 'America/Edmonton' })}

Caller: ${v.callerName}
Phone: ${v.callerPhone}
Address: ${v.address}
Reported: ${v.issue}

Classification: ${urgencyLabel}
Booked: ${slot}
Preferred tech: (none specified)
Customer mood: ${v.urgency === 'P1' ? 'stressed, reassurance given' : 'calm, normal conversation'}

AI said: "You're good, ${v.callerName.split(' ')[0]} — ${v.urgency === 'P1' ? 'I\'m getting Rick on the phone with an on-call tech right now, someone will be at your door within the hour' : 'I\'ve got you down for ' + slot.toLowerCase() + ', I\'ll text you a confirmation. Anything else I can do?'}"`,
      },
      {
        type: 'sms',
        recipient: `${biz.ownerName} (Rick) · (780) 555-0100`,
        channelLabel: v.urgency === 'P1' ? 'URGENT SMS to Rick' : 'SMS to Rick',
        body: `${v.urgency === 'P1' ? '🚨 P1 — ' : ''}${v.callerName} · ${v.address}\n${v.issue.slice(0, 120)}${v.issue.length > 120 ? '…' : ''}\nBooked: ${slot}\nTap to call: ${v.callerPhone}\n${v.urgency === 'P1' ? 'Dispatching Kyle — he\'s 22 min out. Confirm?' : 'Pushed to Jobber. You don\'t need to do anything unless you want to.'}`,
      },
      {
        type: 'sms',
        recipient: `${v.callerName} · ${v.callerPhone}`,
        channelLabel: 'Confirmation SMS to customer',
        body: `Hey ${v.callerName.split(' ')[0]} — this is Henderson HVAC. ${v.urgency === 'P1' ? 'Kyle is on the way, ETA 22 min. He\'ll call you when he\'s 5 min out.' : `You\'re booked for ${slot.toLowerCase()}. We\'ll confirm the morning of. Reply STOP to cancel.`}\n\n— Rick & the Henderson crew`,
      },
    ]
  },
}

// 2. AI Quote + Follow-Up Agent
export const AI_QUOTE_CONSTRUCTION: Demo = {
  slug: 'ai-quote-construction',
  title: 'AI Quote + Follow-Up Agent',
  subtitle: 'Dictate a scope by voice or photo → quote drafted in Rick\'s voice. Auto follow-up at 3/7/14 days.',
  category: 'quote',
  industry: 'construction',
  business: b,
  tier2Price: '$3,000 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Rick walks the job, snaps two photos, talks for 45 seconds into his phone. The agent drafts a complete quote in his voice — line items, assumptions, exclusions — and queues three follow-up nudges at 3/7/14 days if the customer doesn\'t respond.',
  howItWorks: [
    'Rick records a voice note + photos at the end of the walk-through',
    'Agent transcribes, identifies scope (furnace replace, ducting, etc.)',
    'Pulls current supplier pricing + Henderson standard labor rates',
    'Drafts email quote in Rick\'s voice with line items, assumptions, terms',
    'Queues follow-up nudges: "gentle reminder" day 3, "any questions?" day 7, "closing the file?" day 14',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Customer email', type: 'text' },
    { key: 'scope', label: 'Rick\'s voice note (transcribed)', type: 'textarea' },
    { key: 'photos', label: 'Photos attached (filenames)', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Furnace + HRV replacement',
      description: 'Older home, two-stage furnace install plus HRV',
      values: {
        customerName: 'Derek and Amanda Foster',
        customerEmail: 'dfoster@example.ca',
        scope:
          'Ok so Foster job, 1964 bungalow in Glenora. Existing furnace is a Carrier 58MCA, probably 18 years old, single-stage, 80% efficient. Recommending we replace with the Lennox SL280V, two-stage. HRV is original, we\'ll do the Venmar AVS, 100 CFM. Ductwork is fine, no mods needed. One day install with Kyle and Mark. Gas line is good. Electrical fine. Call it out as ready by Friday. Pricing standard residential retrofit.',
        photos: 'IMG_4421.jpg (existing furnace), IMG_4422.jpg (HRV), IMG_4424.jpg (electrical panel)',
      },
    },
    {
      label: 'AC add-on, existing furnace',
      description: 'Adding central AC to an existing setup',
      values: {
        customerName: 'Priya Lal',
        customerEmail: 'priya@example.ca',
        scope:
          'Lal job, Saskatchewan Dr. Furnace is a 2019 Lennox, good for AC add-on. Recommend the Lennox ML14XC1, 3 ton, matches the house size. Outside unit goes on the south wall near the existing hose bib. Lineset run is about 14 feet, easy. Electrical has capacity. Half-day install. Priya wants it before July.',
        photos: 'IMG_4510.jpg (furnace nameplate), IMG_4512.jpg (proposed outdoor location)',
      },
    },
  ],
  brainHook:
    'The Brain remembers every past quote — what closed, at what margin, and what the customer said when they bought or balked. For the Foster quote, it would remind Rick: "Fosters were referred by the Mitchells — they bought at Gold tier. Similar quote closed 9/10 times at your current price."',
  generateOutput: (v, biz) => {
    const firstName = v.customerName.split(' ')[0]
    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: `Your quote — Henderson HVAC`,
        body: `Hi ${firstName},

Thanks again for having me out today. Here\'s the quote we talked about.

——————

SCOPE
  • Remove and dispose of existing furnace
  • Install new Lennox SL280V two-stage high-efficiency furnace
  • Replace HRV with Venmar AVS 100 CFM unit
  • Commission, test, and verify combustion
  • Haul-away of old equipment

PRICING
  Equipment (furnace + HRV)        $4,850
  Install labor (1 day, 2 techs)     $1,400
  Permits + inspection               $   320
  Commissioning                      $   180
  —————
  Subtotal                           $6,750
  GST (5%)                           $   337.50
  TOTAL                              $7,087.50

ASSUMPTIONS
  • Gas line sized correctly (verified on-site)
  • No ductwork modifications needed
  • Electrical panel has capacity (verified)
  • Install window: 8 hrs on a single weekday

WARRANTY
  • 10-year parts on the furnace (Lennox)
  • 2-year labor from us
  • 1-year on the HRV

TIMING
  If you say yes by Friday, we can have it in before the cold snap next week.

Just reply to this email or text me directly at (780) 555-0100 — either works.

Thanks,
Rick
Henderson HVAC & Heating`,
      },
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        channelLabel: 'Follow-up (3 days later) — queued',
        subject: `Quick bump on the furnace quote`,
        body: `Hey ${firstName},

Quick bump on the quote from Monday — any questions I can answer?

Not pushing, just want to make sure it didn\'t get buried in your inbox.

— Rick`,
      },
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        channelLabel: 'Follow-up (7 days later) — queued',
        subject: `Still good on the quote?`,
        body: `Hi ${firstName},

Wanted to check in one more time. Happy to tweak the quote, walk through any of the line items, or answer anything else — zero pressure.

If the timing isn\'t right that\'s totally fine too, just let me know so I can close the file.

— Rick`,
      },
    ]
  },
}

// 3. Autonomous Task Tracker
export const TASK_TRACKER_CONSTRUCTION: Demo = {
  slug: 'task-tracker-construction',
  title: 'Autonomous Task Tracker',
  subtitle: 'Reads crew check-ins + schedule. Proactively updates customers and flags slipping jobs.',
  category: 'task-tracker',
  industry: 'construction',
  business: b,
  tier2Price: '$2,800 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'The tracker watches Jobber + crew check-ins, figures out which jobs are on track vs slipping, proactively texts customers "on track for Friday" updates, and pages Rick the moment something is at risk — so he\'s never the last to know.',
  howItWorks: [
    'Watches Jobber for crew check-ins, GPS, photos, and status updates',
    'Cross-references with the crew schedule and job milestone plan',
    'Sends proactive "on track" updates to customers (Monday, Wednesday, Friday)',
    'Detects risk: "crew not on site by 10am", "material not delivered", "change order pending"',
    'Drafts an owner alert + a customer-facing update for Rick to approve',
  ],
  inputFields: [
    { key: 'jobName', label: 'Job', type: 'text' },
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerPhone', label: 'Customer phone', type: 'phone' },
    { key: 'plannedFinish', label: 'Planned finish date', type: 'text', placeholder: 'Friday Apr 26' },
    {
      key: 'status',
      label: 'Current job status',
      type: 'select',
      options: [
        { label: 'On track — day 2 of 4 done', value: 'on-track' },
        { label: 'At risk — material not delivered', value: 'material' },
        { label: 'At risk — crew pulled to emergency', value: 'crew' },
        { label: 'Slipping — change order pending decision', value: 'co-pending' },
      ],
    },
    { key: 'notes', label: 'Notes from the field', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'On track — kitchen reno',
      description: 'Mid-week check-in, everything going to plan',
      values: {
        jobName: 'Henderson Kitchen Retrofit',
        customerName: 'Deborah Henderson',
        customerPhone: '(780) 555-0181',
        plannedFinish: 'Friday, Apr 26',
        status: 'on-track',
        notes: 'Day 2 of 4. Demo complete, rough plumbing done this morning. Kyle + Mark back tomorrow for finish.',
      },
    },
    {
      label: 'Material delay',
      description: 'Supplier missed the delivery window',
      values: {
        jobName: 'Foster Furnace Install',
        customerName: 'Derek Foster',
        customerPhone: '(780) 555-0163',
        plannedFinish: 'Friday, Apr 26',
        status: 'material',
        notes:
          'Lennox shipment didn\'t land Wednesday. ETA Thursday 3pm now. Means we can\'t finish Friday as planned — realistic is Monday afternoon.',
      },
    },
    {
      label: 'Crew pulled to emergency',
      description: 'Kyle diverted to a P1 no-heat call',
      values: {
        jobName: 'Lal AC Install',
        customerName: 'Priya Lal',
        customerPhone: '(780) 555-0167',
        plannedFinish: 'Tomorrow',
        status: 'crew',
        notes: 'Kyle was supposed to finish Lal AC this afternoon. P1 no-heat call came in, diverting Kyle. Mark can finish Lal Saturday morning.',
      },
    },
  ],
  brainHook:
    'The Brain knows Rick\'s customers well enough to vary tone: the Hendersons (family friends) get warm, casual updates. Derek Foster, who\'s anxious about timelines, gets extra reassurance and one more update than average. Priya, who\'s busy, gets short and factual.',
  generateOutput: (v, biz) => {
    const firstName = v.customerName.split(' ').slice(-1)[0]
    let customerMsg = ''
    let ownerMsg = ''
    let channelLabel = ''

    if (v.status === 'on-track') {
      channelLabel = 'Proactive update (on track)'
      customerMsg = `Hi ${firstName} — quick midweek check-in on the ${v.jobName.toLowerCase()}. Kyle and Mark are done with demo and rough plumbing. Still on track to wrap ${v.plannedFinish}. I\'ll text you Thursday evening with a Friday morning ETA.\n\n— Rick`
      ownerMsg = `${v.jobName}: on track. Customer update sent (${v.customerPhone}). Next check-in auto-scheduled for Thursday PM.`
    } else if (v.status === 'material') {
      channelLabel = 'Material delay — customer soften-up'
      customerMsg = `Hi ${firstName} — heads up on the ${v.jobName.toLowerCase()}. Lennox missed their Wednesday shipment, unit is now landing Thursday afternoon. That bumps us from Friday finish to Monday afternoon. I\'d rather tell you now than Friday morning. Cold snap isn\'t until next week so you\'re good on timing.\n\nIf Monday doesn\'t work, text me and we\'ll figure it out.\n\n— Rick`
      ownerMsg = `🟠 ${v.jobName}: 3-day slip. Material ETA Thurs 3pm. New finish: Mon PM. Customer draft ready — one-tap approve below. Also: Lennox rep not answering since yesterday, want me to escalate?`
    } else if (v.status === 'crew') {
      channelLabel = 'Crew pulled — reschedule note'
      customerMsg = `Hi ${firstName} — bad news and good news. Kyle got pulled to a no-heat emergency (somebody\'s kids with a 16° house, had to go), so he can\'t finish your AC today. Good news: Mark can wrap it Saturday morning, and I\'ll knock $150 off for the hassle.\n\nLet me know Saturday works and I\'ll confirm Mark for 8am.\n\n— Rick`
      ownerMsg = `🟠 Lal AC pushed to Saturday. Draft to customer offers $150 discount — tap to approve or adjust. Mark confirmed available 8am Sat. No conflict with his Saturday plans (checked calendar).`
    } else {
      channelLabel = 'Change-order awaiting decision'
      customerMsg = `Hi ${firstName} — still waiting on your call on the change order we talked about yesterday. No pressure, just flagging it because the crew has downtime if I don\'t have a yes/no by tomorrow AM. Either direction is fine, just need to know.\n\n— Rick`
      ownerMsg = `🟡 ${v.jobName}: change-order pending 26 hrs. Customer tends to take 3–4 days normally — above average wait. Draft nudge ready.`
    }

    return [
      {
        type: 'dashboard',
        channelLabel: 'Rick\'s morning dashboard',
        body: `═══════════════════════════════════════
  HENDERSON HVAC — TODAY\'S JOBS
  ${new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'short', day: 'numeric' })}
═══════════════════════════════════════

  ${v.status === 'on-track' ? '🟢' : v.status === 'co-pending' ? '🟡' : '🟠'}  ${v.jobName}
     Customer: ${v.customerName}
     Planned finish: ${v.plannedFinish}
     Status: ${v.status === 'on-track' ? 'ON TRACK' : 'AT RISK'}
     Field notes: ${v.notes.slice(0, 90)}${v.notes.length > 90 ? '…' : ''}

  ACTIONS NEEDED FROM YOU: ${v.status === 'on-track' ? 'None — update already sent' : '1 (see below)'}`,
      },
      {
        type: 'sms',
        recipient: `${v.customerName} · ${v.customerPhone}`,
        channelLabel,
        body: customerMsg,
      },
      {
        type: 'sms',
        recipient: `${biz.ownerName} (Rick)`,
        channelLabel: 'Alert to Rick',
        body: ownerMsg,
      },
    ]
  },
}

// 4. AI Collections Agent
export const AI_COLLECTIONS_CONSTRUCTION: Demo = {
  slug: 'ai-collections-construction',
  title: 'AI Collections Agent',
  subtitle: 'Watches AR. Drafts escalating payment nudges in Rick\'s voice at 7/14/30 days.',
  category: 'collections',
  industry: 'construction',
  business: b,
  tier2Price: '$2,800 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'No more chasing money. The agent watches every unpaid invoice, drafts a friendly-to-firm ladder of nudges in Rick\'s voice, and only involves him when it\'s time for the "I\'m going to have to add to your bill" conversation.',
  howItWorks: [
    'Reads Jobber invoices + customer payment history',
    'Day 7: friendly "reminder, hope everything went well" email/SMS',
    'Day 14: "just want to make sure it didn\'t get lost" — includes payment link',
    'Day 21: "I\'m going to need to add late fees next week"',
    'Day 30: drafts formal demand letter + pings Rick to personally call',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Customer email', type: 'text' },
    { key: 'invoiceNum', label: 'Invoice #', type: 'text' },
    { key: 'amount', label: 'Amount owing ($)', type: 'number' },
    { key: 'jobType', label: 'Job type', type: 'text' },
    {
      key: 'daysOverdue',
      label: 'Days overdue',
      type: 'select',
      options: [
        { label: '7 days — friendly nudge', value: '7' },
        { label: '14 days — second reminder', value: '14' },
        { label: '21 days — warning', value: '21' },
        { label: '30+ days — escalation', value: '30' },
      ],
    },
    {
      key: 'history',
      label: 'Past payment behavior',
      type: 'select',
      options: [
        { label: 'Always on time', value: 'good' },
        { label: 'Sometimes slow (30–45d)', value: 'slow' },
        { label: 'New customer — no history', value: 'new' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'First nudge — slow-pay Henderson',
      description: '7 days overdue on a $4,200 invoice, usually pays eventually',
      values: {
        customerName: 'Grace Henderson',
        customerEmail: 'grace@hendersonestate.example.ca',
        invoiceNum: 'HEN-0412',
        amount: '4200',
        jobType: 'Basement furnace replacement',
        daysOverdue: '7',
        history: 'slow',
      },
    },
    {
      label: 'Third warning — big job',
      description: '21 days on a $12k commercial rooftop job',
      values: {
        customerName: 'Clearview Apartments Ltd',
        customerEmail: 'accounts@clearview.example.com',
        invoiceNum: 'CLR-0398',
        amount: '12480',
        jobType: 'Rooftop HVAC unit replacement (Bldg C)',
        daysOverdue: '21',
        history: 'slow',
      },
    },
    {
      label: '30-day demand letter',
      description: 'New customer, stopped responding, formal tone',
      values: {
        customerName: 'Jamal Davies',
        customerEmail: 'jamal.d@example.ca',
        invoiceNum: 'DAV-0421',
        amount: '1850',
        jobType: 'AC service call + diagnostic',
        daysOverdue: '30',
        history: 'new',
      },
    },
  ],
  brainHook:
    'The Brain knows Henderson always pays at 35–45 days and isn\'t a risk — so its day-7 nudge is extra soft ("hope the job went well, invoice is ready whenever"). Clearview has been paying at 40 days for 3 years — the Brain would suggest skipping the nudge entirely. New customers get firmer language earlier.',
  generateOutput: (v, biz) => {
    const firstName = v.customerName.split(' ')[0]
    const amt = Number(v.amount || 0).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    let subj = ''
    let body = ''
    let ownerNote = ''

    if (v.daysOverdue === '7') {
      subj = `Invoice ${v.invoiceNum} — just a heads up`
      body = `Hi ${firstName},

Hope everything\'s been good since we wrapped the ${v.jobType.toLowerCase()} — just a quick note that invoice ${v.invoiceNum} for ${amt} is sitting open. No stress, wanted to make sure it didn\'t get buried.

Pay link: https://pay.zyph.link/hen/${v.invoiceNum}

— Rick`
      ownerNote = `${v.customerName} — 7d nudge sent. Based on their history (${v.history === 'good' ? 'always on time' : v.history === 'slow' ? 'usually 30–45d' : 'new account'}), I\'ll check in again in 7 days automatically.`
    } else if (v.daysOverdue === '14') {
      subj = `Just circling back — invoice ${v.invoiceNum}`
      body = `Hi ${firstName},

Circling back on invoice ${v.invoiceNum} (${amt}) for the ${v.jobType.toLowerCase()}. Just want to make sure it didn\'t get lost in an email thread somewhere.

If there\'s anything about the work you want to talk through before you pay, just tell me — happy to chat.

Pay link: https://pay.zyph.link/hen/${v.invoiceNum}

— Rick`
      ownerNote = `${v.customerName} — 14d nudge sent. Next step: 21d warning with late-fee reminder.`
    } else if (v.daysOverdue === '21') {
      subj = `Heads up on invoice ${v.invoiceNum} — late fees start next week`
      body = `Hi ${firstName},

Hate to have to send this one. Invoice ${v.invoiceNum} (${amt}) is at 21 days — per our terms, a 1.5% late fee kicks in at 30 days.

If something changed on your end, just give me a call at (780) 555-0100 and we\'ll work something out. I\'d rather know than guess.

Pay link: https://pay.zyph.link/hen/${v.invoiceNum}

— Rick`
      ownerNote = `🟠 ${v.customerName} — 21d warning sent (${amt}). They\'re a ${v.history === 'slow' ? 'known slow-pay' : 'new account'}. If nothing by day 28, I\'ll ping you to make a personal call.`
    } else {
      subj = `Final notice — invoice ${v.invoiceNum}`
      body = `Hi ${firstName},

This is a final notice on invoice ${v.invoiceNum} for ${amt}, now 30+ days overdue.

If we don\'t hear back in the next 7 days, we\'ll be forwarding this to collections and adding the 1.5% monthly late fee going forward. I\'d really rather not go that route — a quick call to (780) 555-0100 fixes this in 5 minutes.

Pay link: https://pay.zyph.link/hen/${v.invoiceNum}

Regards,
Rick Henderson
Henderson HVAC & Heating`
      ownerNote = `🔴 ${v.customerName} — 30d final notice drafted. RECOMMEND: personal call from you today. Their number is (780) 555-xxxx. Calendar blocked 2–2:15pm for you to make the call.`
    }

    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: subj,
        body,
      },
      {
        type: 'sms',
        recipient: `${biz.ownerName} (Rick)`,
        channelLabel: 'Internal note to Rick',
        body: ownerNote,
      },
    ]
  },
}

// 5. AI Review Harvester (construction variant)
export const REVIEW_HARVESTER_CONSTRUCTION: Demo = {
  slug: 'review-harvester-construction',
  title: 'AI Review Harvester',
  subtitle: 'Job completion → personalized review ask referencing the actual work and tech name.',
  category: 'review-harvester',
  industry: 'construction',
  business: b,
  tier2Price: '$1,800 build + $150/mo',
  buildTime: '2 weeks',
  description:
    'Most review asks are generic and get ignored. This one references the actual job, the tech\'s name, and a specific moment from the visit — and goes out at peak sentiment right after completion. Reply drafts get one-tap approved from Rick\'s phone.',
  howItWorks: [
    'Job marked complete in Jobber → agent waits 90 min (letting the customer breathe)',
    'Generates a personalized ask referencing specific details: the scope, the tech, a moment if known',
    'Sends via SMS (9x open rate of email for this context)',
    'If positive → auto-links to Google review',
    'New review drops → drafts reply in Rick\'s voice for one-tap approve',
    'Bad review → pauses posting, pings Rick immediately to call the customer',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerPhone', label: 'Phone', type: 'phone' },
    { key: 'techName', label: 'Tech who did the job', type: 'text' },
    { key: 'jobSummary', label: 'Job summary', type: 'text' },
    {
      key: 'sentiment',
      label: 'Captured sentiment signal',
      type: 'select',
      options: [
        { label: 'Happy — tech noted positive mood', value: 'happy' },
        { label: 'Neutral — routine completion', value: 'neutral' },
        { label: 'Unhappy — tech flagged a concern', value: 'unhappy' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Emergency save — grateful customer',
      description: 'Kyle saved them from a frozen night — peak positive moment',
      values: {
        customerName: 'Jane Mitchell',
        customerPhone: '(780) 555-0142',
        techName: 'Kyle',
        jobSummary: 'Emergency furnace repair at -18°C, got heat back in 90 minutes',
        sentiment: 'happy',
      },
    },
    {
      label: 'Routine tune-up',
      description: 'Annual maintenance, nothing dramatic',
      values: {
        customerName: 'Carl Burroughs',
        customerPhone: '(780) 555-0198',
        techName: 'Mark',
        jobSummary: 'Annual furnace tune-up, replaced filter and cleaned flame sensor',
        sentiment: 'neutral',
      },
    },
    {
      label: 'Concern flagged',
      description: 'Customer was unhappy about the cleanup — Rick needs to know',
      values: {
        customerName: 'Derek Foster',
        customerPhone: '(780) 555-0163',
        techName: 'Kyle',
        jobSummary: 'Furnace + HRV replacement',
        sentiment: 'unhappy',
      },
    },
  ],
  brainHook:
    'The Brain notices when Kyle\'s reviews trend higher than Mark\'s on emergency calls but lower on installs — feeding Rick intel on where each tech shines. It also stops asking customers for reviews once they\'ve left one in the last 180 days.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    if (v.sentiment === 'unhappy') {
      return [
        {
          type: 'dashboard',
          channelLabel: 'Review ask BLOCKED — owner alert',
          body: `⛔ Review request for ${v.customerName} was held back.

Reason: ${v.techName} flagged concern after the ${v.jobSummary.toLowerCase()}.
Recommendation: personal call from Rick before any review ask.
Calendar: blocked 4:15–4:30pm for you today.

Talking points (drafted):
  1. "Hey ${first}, it\'s Rick — Kyle mentioned the cleanup wasn\'t up to the standard we want. I\'m sorry about that."
  2. Offer: send someone back tomorrow AM for a full walk-through.
  3. If they\'re good after the call → ask for review THEN, not now.`,
        },
        {
          type: 'sms',
          recipient: biz.ownerName + ' (Rick)',
          channelLabel: 'Alert to Rick',
          body: `🚨 Held ${v.customerName}\'s review ask. Kyle flagged a cleanup issue. Suggest you call them today. Talking points drafted in dashboard.`,
        },
      ]
    }

    const msg =
      v.sentiment === 'happy'
        ? `Hey ${first} — Rick here. Kyle told me the ${v.jobSummary.toLowerCase()} had a good ending. Really appreciate you trusting us on the call.\n\nIf it\'s not a hassle, would you mind dropping a quick Google review? Even a sentence helps us a ton. Takes 30 seconds:\n\n→ https://g.page/henderson-hvac/review\n\nThanks ${first},\nRick`
        : `Hey ${first} — Mark wrapped the tune-up this morning. Thanks for the coffee.\n\nIf you\'ve got 30 seconds, a quick Google review would mean a lot:\n\n→ https://g.page/henderson-hvac/review\n\nThanks,\nRick`

    return [
      {
        type: 'sms',
        recipient: `${v.customerName} · ${v.customerPhone}`,
        channelLabel: 'Review ask (sent 90 min after job complete)',
        body: msg,
      },
      {
        type: 'email',
        recipient: `Rick <${'rick@hendersonhvac.example.ca'}>`,
        channelLabel: '(24 hours later) When review posts',
        subject: `${first} just left you a 5-star Google review — reply drafted`,
        body: `${first} ${v.customerName.split(' ').slice(-1)[0]} left a 5-star review:

  "${v.sentiment === 'happy' ? 'Called Henderson at 8pm when our furnace died. Kyle was here within the hour, had heat back in 90 minutes. Professional, kind to my kids, cleaned up. Would absolutely call again.' : 'Great service, Mark was on time and thorough. Recommend.'}"

DRAFT REPLY (tap to approve):

  "${v.sentiment === 'happy' ? `Thanks so much ${first} — Kyle felt terrible pulling you out of the cold snap and was really glad to get there fast. Glad the kids are warm again. — Rick` : `Thanks ${first} — happy to hear Mark took good care of you. See you at the next tune-up! — Rick`}"

[ Approve & post ] [ Edit ] [ Skip ]`,
      },
    ]
  },
}

// 6. AI On-Call Triage
export const ON_CALL_TRIAGE_CONSTRUCTION: Demo = {
  slug: 'on-call-triage-construction',
  title: 'AI On-Call Triage',
  subtitle: 'Incoming after-hours call → urgency classification → wakes on-call tech only for P1.',
  category: 'on-call-triage',
  industry: 'construction',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Rick used to wake up for every 2am call. Now the AI classifies urgency (P1 = no heat below freezing, P2 = leak contained, P3 = annoying but wait till morning) and only pages the on-call tech for P1 — and books P2/P3 for 8am tomorrow.',
  howItWorks: [
    'All after-hours calls route to the AI first',
    'Agent triages in 60 seconds: no heat / water / CO / contained? Temperature? Kids or elderly? Insurance claim started?',
    'P1 → wakes the on-call tech, dispatches, texts Rick',
    'P2 → books for first slot next business day, sends customer SMS confirmation',
    'P3 → leaves detailed note for the morning crew, Rick doesn\'t see it until 7am',
  ],
  inputFields: [
    { key: 'callerName', label: 'Caller name', type: 'text' },
    { key: 'callerPhone', label: 'Phone', type: 'phone' },
    { key: 'issue', label: 'What they said', type: 'textarea' },
    {
      key: 'outsideTemp',
      label: 'Outside temperature',
      type: 'select',
      options: [
        { label: 'Below -10°C', value: 'freezing' },
        { label: '-10 to +5°C', value: 'cold' },
        { label: 'Above 5°C', value: 'mild' },
        { label: 'Summer — heat wave', value: 'hot' },
      ],
    },
    {
      key: 'occupants',
      label: 'Vulnerable occupants?',
      type: 'select',
      options: [
        { label: 'Kids / elderly / medical', value: 'vulnerable' },
        { label: 'No', value: 'none' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'P1 — no heat, -18°C, kids',
      description: 'The textbook page-Rick scenario',
      values: {
        callerName: 'Jane Mitchell',
        callerPhone: '(780) 555-0142',
        issue: 'Furnace just stopped. Blowing cold. House is 16° and dropping. Two kids under 5 at home.',
        outsideTemp: 'freezing',
        occupants: 'vulnerable',
      },
    },
    {
      label: 'P2 — leak, contained',
      description: 'Annoying but not dangerous tonight',
      values: {
        callerName: 'Mike Flores',
        callerPhone: '(780) 555-0175',
        issue:
          'Small drip from the PRV on the hot water tank, maybe a cup an hour into a bucket. Not flooding, just annoying. Can wait till morning.',
        outsideTemp: 'mild',
        occupants: 'none',
      },
    },
    {
      label: 'P3 — nuisance noise',
      description: 'Squeaky furnace, wants it fixed ASAP but no safety issue',
      values: {
        callerName: 'Paige Alvarez',
        callerPhone: '(780) 555-0190',
        issue: 'Furnace making a squealing noise when it kicks on. Still heating fine. Driving me crazy.',
        outsideTemp: 'mild',
        occupants: 'none',
      },
    },
  ],
  brainHook:
    'The Brain remembers that Rick doesn\'t want to be woken after midnight on Tuesdays (hockey the next morning) — so P2 calls that would normally surface to him are rerouted to backup tech Mark. It also tracks which customers have legitimately escalated: a Mike Flores P3 yesterday is now a P2 tonight even if he says it\'s minor.',
  generateOutput: (v, biz) => {
    // classify
    const freezing = v.outsideTemp === 'freezing'
    const vulnerable = v.occupants === 'vulnerable'
    const noHeat = v.issue.toLowerCase().includes('no heat') || v.issue.toLowerCase().includes('cold') || v.issue.toLowerCase().includes('furnace')
    const leak = v.issue.toLowerCase().includes('leak') || v.issue.toLowerCase().includes('drip') || v.issue.toLowerCase().includes('flood')
    const noise = v.issue.toLowerCase().includes('noise') || v.issue.toLowerCase().includes('squeak') || v.issue.toLowerCase().includes('squeal')

    let priority: 'P1' | 'P2' | 'P3' = 'P3'
    if ((noHeat && (freezing || vulnerable)) || v.issue.toLowerCase().includes('co ') || v.issue.toLowerCase().includes('flood')) priority = 'P1'
    else if (leak || (noHeat && !freezing)) priority = 'P2'
    else if (noise) priority = 'P3'

    const first = v.callerName.split(' ')[0]

    if (priority === 'P1') {
      return [
        {
          type: 'call-summary',
          channelLabel: 'AI triage result: P1 EMERGENCY',
          body: `🚨 P1 — DISPATCHING ON-CALL TECH

Caller: ${v.callerName} (${v.callerPhone})
Issue: ${v.issue}
Outside: ${v.outsideTemp === 'freezing' ? 'below -10°C' : v.outsideTemp}
Occupants: ${vulnerable ? 'vulnerable (kids/elderly/medical)' : 'adults only'}

AI decision logic:
  + No heat + freezing outside temperature + vulnerable occupants = P1 dispatch
  + Kyle is on-call tonight, sleeping 11 km from address
  + Kyle has been paged, ETA 35 min
  + Customer told ETA, reassurance given

AI said to caller:
  "You\'re good ${first} — Kyle\'s getting dressed and will be at your door in about 35 minutes.
   Keep everyone in one room if you can, grab extra blankets. He\'ll text you when he\'s 5 minutes out."`,
        },
        {
          type: 'sms',
          recipient: 'Kyle (on-call tech)',
          channelLabel: 'Tech page',
          body: `🚨 P1 — Mitchell residence, 14212 97 St NW\nNo heat, -18° outside, 2 kids under 5.\nETA target 35 min.\nPhone: ${v.callerPhone}\nHistory: existing customer, Lennox G50UH installed 2019.\nReply Y to accept dispatch.`,
        },
        {
          type: 'sms',
          recipient: biz.ownerName + ' (Rick)',
          channelLabel: 'Owner alert (non-waking)',
          body: `FYI — P1 dispatched. Kyle en route to Mitchell, no heat, 2 kids. You\'re not needed. Summary at 7am.`,
        },
      ]
    }

    if (priority === 'P2') {
      return [
        {
          type: 'call-summary',
          channelLabel: 'AI triage result: P2 — booked for morning',
          body: `🟡 P2 — BOOKED FIRST SLOT TOMORROW

Caller: ${v.callerName} (${v.callerPhone})
Issue: ${v.issue}
Outside: ${v.outsideTemp}
Occupants: ${vulnerable ? 'vulnerable' : 'adults only'}

AI decision logic:
  + ${leak ? 'Leak is contained, no active flooding.' : 'Heat intermittent but weather is mild.'}
  + No safety risk tonight.
  + Booked for 8am first slot.
  + Rick is NOT paged — he\'ll see this at 7am.

AI said to caller:
  "Ok ${first} — I\'ve got you first slot tomorrow at 8am with Mark. Put a bucket under it like you\'re already doing,
   and close the shutoff valve just upstream if you feel comfortable. Text us if it gets worse overnight."`,
        },
        {
          type: 'sms',
          recipient: `${v.callerName} · ${v.callerPhone}`,
          channelLabel: 'Customer confirmation',
          body: `Hi ${first} — Mark will be at your place tomorrow between 8:00 and 9:30 AM. We\'ll text you when he\'s 20 min out. Overnight issue? Text this number.`,
        },
      ]
    }

    return [
      {
        type: 'call-summary',
        channelLabel: 'AI triage result: P3 — note for morning',
        body: `🟢 P3 — QUEUED FOR MORNING CREW

Caller: ${v.callerName} (${v.callerPhone})
Issue: ${v.issue}
Priority: P3 (nuisance, no safety/comfort issue)

AI decision logic:
  + No heat loss, no leak, no safety concern.
  + Mild weather.
  + Queued for morning dispatcher — Rick wakes up to this in the normal routing.

AI said to caller:
  "That sounds like a bearing or belt. Nothing urgent — I\'ve got you on the board for later this week.
   Mark or Kyle will call you between 8 and 9 tomorrow morning to lock in a time that works."`,
      },
    ]
  },
}

export const CONSTRUCTION_DEMOS: Demo[] = [
  AI_RECEPTIONIST_CONSTRUCTION,
  AI_QUOTE_CONSTRUCTION,
  TASK_TRACKER_CONSTRUCTION,
  AI_COLLECTIONS_CONSTRUCTION,
  REVIEW_HARVESTER_CONSTRUCTION,
  ON_CALL_TRIAGE_CONSTRUCTION,
]
