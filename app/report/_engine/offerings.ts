// Zyph Labs offering matrix — per workspace _spec/zyph-offering-matrix.md
//
// Per industry:
//   Tier 1 — free third-party tool rec + $100/hr paid setup help
//   Tier 2 — menu of 6 single-automation AI builds ($1.8k-$4.5k each)
//   Tier 3 — Full System with the Brain (4-week build + monthly retainer)
//
// Hard rule: every paid Tier 2 / Tier 3 is a Zyph-built custom AI integration.
// Tier 1 free path points to an off-the-shelf tool (ideally free) the owner
// can use themselves. Tier 1 paid path = Zyph hands-on setup billed hourly.

import type { Industry } from './types'

export interface Tier1Offer {
  free: {
    toolName: string       // e.g. "Google Voice"
    toolUrl?: string
    oneLiner: string       // what it does in one line
    why: string            // why it helps their pain
    free: boolean          // whether the free tier is actually free
  }
  paid: {
    rate: string           // "$100/hr, 1-hour minimum"
    tasks: string[]        // specific setup tasks Zyph will do
  }
}

export interface Tier2Offer {
  id: string               // stable identifier, e.g. "trades-ai-receptionist"
  title: string
  pitch: string            // 1-2 sentence positioning
  whatItDoes: string[]     // 3-5 bullet points
  integratesWith: string[] // tool names to merge with the user's actual stack
  price: number            // base build, CAD
  retainer: number         // monthly retainer, CAD
  timeToLive: string       // "1-2 weeks"
  expectedImpact: string
  painTags: PainTag[]      // which pain patterns this surfaces for
}

export interface Tier3Offer {
  title: string
  pitch: string
  pipeline: string[]       // workflow sequence
  brain: {
    summary: string
    examples: string[]
  }
  buildPrice: number
  retainer: number
  timeToLive: string
  expectedImpact: string
}

export interface IndustryOffering {
  tier1: Tier1Offer
  tier2Menu: Tier2Offer[]
  tier3: Tier3Offer
}

// Pain tags surfaced from the assessment (topPain text + painTag button + wantedTimeBack)
export type PainTag =
  | 'missed-calls'
  | 'quoting'
  | 'chasing-money'
  | 'admin'
  | 'reviews'
  | 'marketing'
  | 'staff'
  | 'no-shows'
  | 'inventory'
  | 'scheduling'
  | 'onboarding'
  | 'returns'
  | 'churn'
  | 'dispatch'
  | 'being-bottleneck'

export const OFFERINGS: Record<Industry, IndustryOffering> = {

  // ─── 1. CONSTRUCTION / PROJECT-BASED ────────────────────────────────
  'project-based': {
    tier1: {
      free: {
        toolName: 'Google Voice',
        toolUrl: 'https://voice.google.com',
        oneLiner: 'Free second phone line with custom after-hours greeting.',
        why: "Won't recover the call, but at least the caller hears a professional greeting telling them when you'll call back instead of ringing out.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Get you set up properly on Jobber or Housecall Pro',
          'Configure your Google Business Profile + review request flow',
          'Build a job costing / margin tracking spreadsheet wired to QuickBooks',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'project-ai-receptionist',
        title: 'AI Receptionist',
        pitch: 'Answers your phone 24/7, qualifies the lead, books the estimate, and texts you within 60 seconds.',
        whatItDoes: [
          'Picks up every call (missed-call-callback + live answer)',
          'Qualifies scope, location, budget before booking',
          'Drops estimate on your calendar',
          'Texts you a one-line summary before the caller hangs up',
        ],
        integratesWith: ['Twilio', 'your calendar', 'Jobber or Housecall Pro'],
        price: 3500, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Recovers ~$2-4k/month in after-hours leads that currently hit voicemail.',
        painTags: ['missed-calls', 'being-bottleneck'],
      },
      {
        id: 'project-ai-quote',
        title: 'AI Quote + Follow-Up Agent',
        pitch: 'Voice or photo in, polished quote out — in your voice. Auto-nudges quotes that go cold at 3/7/14 days.',
        whatItDoes: [
          'Dictate scope by voice or snap photos; agent drafts the quote',
          'Writes the cover note in your tone',
          'Pushes for your thumbs-up then sends for e-sign',
          'Nudges cold quotes in your voice on a schedule',
        ],
        integratesWith: ['Jobber', 'your email', 'your quote template library'],
        price: 3000, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Turnaround 3 days → same day. Close rate up 10-25% on speed alone.',
        painTags: ['quoting', 'being-bottleneck'],
      },
      {
        id: 'project-ai-task-tracker',
        title: 'Autonomous Task Tracker',
        pitch: "Reads crew check-ins and proactively updates customers ('on track for Friday') and you ('Henderson inspection slipping').",
        whatItDoes: [
          'Pulls crew check-ins, schedule, and job notes',
          'Sends the customer a calm status update on their timeline',
          'Flags you on slippage before it becomes a complaint',
          'Builds a weekly digest of every job state',
        ],
        integratesWith: ['Jobber', 'Slack or SMS', 'your calendar'],
        price: 2800, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Kills the "where are we on Henderson?" calls. Recovers 4-6 hrs/week of your time.',
        painTags: ['admin', 'being-bottleneck', 'staff'],
      },
      {
        id: 'project-ai-collections',
        title: 'AI Collections Agent',
        pitch: 'Watches your AR and writes escalating payment nudges in your voice at 7/14/30 days.',
        whatItDoes: [
          'Reads QuickBooks AR daily',
          'Drafts nudge #1 (friendly), #2 (firm), #3 (escalated) in your voice',
          'Pushes for your one-tap approval before sending',
          'Flags legal / lien-worthy accounts separately',
        ],
        integratesWith: ['QuickBooks', 'your email', 'SMS via Twilio'],
        price: 2800, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'DSO drops 15-30 days. Recovers 60-80% of stuck invoices without a human chase.',
        painTags: ['chasing-money'],
      },
      {
        id: 'project-ai-review',
        title: 'AI Review Harvester',
        pitch: 'Job closeout triggers a personalized review ask in your voice — referencing the actual work and tech name.',
        whatItDoes: [
          'Detects job completion from your system',
          'Texts a personalized ask referencing what you just did',
          'Drafts replies to every new review for your one-tap approval',
          'Flags bad reviews to you instantly before they fester',
        ],
        integratesWith: ['Jobber', 'Google Business Profile', 'SMS'],
        price: 1800, retainer: 150, timeToLive: '2 weeks',
        expectedImpact: '3-5x review velocity. More reviews = more inbound leads at zero ad cost.',
        painTags: ['reviews', 'marketing'],
      },
      {
        id: 'project-ai-oncall',
        title: 'AI On-Call Triage',
        pitch: 'After-hours call → urgency classification → wakes the on-call tech for P1 only. Books P2/P3 for next business day.',
        whatItDoes: [
          'Answers after-hours, triages urgency conversationally',
          'Wakes the on-call person only for true emergencies',
          'Books non-urgent calls for next-day scheduling',
          "Logs everything so you see what got escalated and what didn't",
        ],
        integratesWith: ['Twilio', 'OpsGenie or your rotation tool', 'your calendar'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: "Stops 3am wake-ups for dishwasher noise. Crew shows up fresh on P1 calls.",
        painTags: ['missed-calls', 'staff', 'being-bottleneck'],
      },
    ],
    tier3: {
      title: 'The Construction Full System',
      pitch: 'Proposal → Contract → Dispatch → Progress → Invoice → Collections, all connected, all wired through the Brain.',
      pipeline: [
        'Voice/photo intake → proposal in your voice',
        'Accept → auto-contract with e-sign',
        'Scheduled → crew job packet + customer confirmation',
        'Live progress tracker with dual-audience updates',
        'Change orders captured from the field',
        'Close-out triggers invoice + review request',
        'Collections nudges escalate in your voice',
      ],
      brain: {
        summary: "Knows every job's margin, every crew's efficiency, every customer's payment behavior. Remembers your family schedule.",
        examples: [
          '"You quoted $42k, closed $18k. Henderson\'s margin tracking low — talk to the cabinet sub."',
          '"Rick\'s crew is 20% more efficient than Kyle\'s on kitchens."',
          '"You promised Dave a callback Monday; I\'ve blocked 10am."',
        ],
      },
      buildPrice: 18000, retainer: 1200, timeToLive: '4 weeks',
      expectedImpact: '~Half an employee of cost. Scales every employee you already have. Full operational visibility for the first time.',
    },
  },

  // ─── 2. APPOINTMENT-BASED ───────────────────────────────────────────
  'appointment-based': {
    tier1: {
      free: {
        toolName: 'Calendly + Square Appointments',
        toolUrl: 'https://calendly.com',
        oneLiner: 'Free booking page + automated SMS reminders.',
        why: "Calendly's free tier covers one-call scheduling; Square adds reminders. Gets you 60% of the way there before any AI.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Configure Calendly/Square with your services, buffers, and working hours',
          'Design your intake form (medical/legal/liability as needed)',
          'Set up the reminder cadence that actually reduces no-shows',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'appt-ai-booking',
        title: 'AI Booking Concierge',
        pitch: '24/7 front-desk agent that takes calls, SMS, and DMs — checks your calendar, books real appointments, sends intake forms.',
        whatItDoes: [
          'Picks up every inbound channel (phone, SMS, chat, DM)',
          'Checks availability against your calendar',
          'Books the slot + sends the intake form',
          'Confirms 24 hours out with a tailored reminder',
        ],
        integratesWith: ['Twilio', 'your calendar', 'your booking system'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'No more "sorry, we\'re closed" voicemails. Captures 15-25% more bookings that currently go to your competitors.',
        painTags: ['missed-calls', 'scheduling', 'being-bottleneck'],
      },
      {
        id: 'appt-ai-noshow',
        title: 'AI No-Show Defender',
        pitch: 'Risk-scores appointments from history. High-risk bookings get extra reminder touchpoints in your voice.',
        whatItDoes: [
          "Scores every new booking's no-show probability",
          'High-risk bookings get extra personal touchpoints',
          'Voice-style messaging, not corporate spam',
          "Weekly report of what's working",
        ],
        integratesWith: ['your booking system', 'SMS', 'email'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'No-show rate drops from 12-18% to 5-8%. Recovers 3-6 billable slots/week.',
        painTags: ['no-shows', 'scheduling'],
      },
      {
        id: 'appt-ai-rebook',
        title: 'AI Rebooking Agent',
        pitch: 'Waits the right interval (6wk cleaning, 8wk cut, weekly therapy) then nudges them to rebook in your voice.',
        whatItDoes: [
          'Learns the right cadence per service type',
          'Nudges at peak-likelihood moment',
          'Drafts the message in your tone',
          'Books the slot automatically when they reply yes',
        ],
        integratesWith: ['your booking system', 'SMS'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Lapsed-client recovery up 30-50%. Fills the gaps between high-value regulars.',
        painTags: ['admin', 'churn', 'marketing'],
      },
      {
        id: 'appt-ai-billing',
        title: 'AI Insurance / Billing Chaser',
        pitch: 'Watches your AR and handles follow-up calls and emails to insurance companies + patients.',
        whatItDoes: [
          'Reads AR daily + claim status feeds',
          'Drafts claim-specific follow-up scripts',
          'Handles patient payment nudges separately from insurance',
          'Escalates to you only when it actually needs you',
        ],
        integratesWith: ['your PMS/EHR', 'QuickBooks', 'email'],
        price: 3500, retainer: 300, timeToLive: '2 weeks',
        expectedImpact: 'Claim follow-up time -70%. Recovers $3-8k/month in aged AR per full-time provider.',
        painTags: ['chasing-money', 'admin'],
      },
      {
        id: 'appt-ai-followup',
        title: 'AI Post-Visit Follow-Up',
        pitch: 'Personalized "how are you feeling?" check-ins in your voice. Captures sentiment, flags concerns, surfaces testimonials.',
        whatItDoes: [
          'Times the check-in right (24-72hrs post-visit depending on service)',
          'Tailored to the procedure or service',
          'Routes concerning replies to you immediately',
          'Pulls great replies into a testimonial-ready queue',
        ],
        integratesWith: ['your booking system', 'SMS'],
        price: 2000, retainer: 175, timeToLive: '1-2 weeks',
        expectedImpact: 'Patient retention up 15-20%. Early concern-catch prevents bad reviews.',
        painTags: ['marketing', 'reviews', 'admin'],
      },
      {
        id: 'appt-ai-review',
        title: 'AI Review Harvester',
        pitch: 'Review ask at peak sentiment moment post-visit. Draft replies for one-tap approval.',
        whatItDoes: [
          'Triggers right after the positive follow-up reply',
          'Personalizes the ask to the specific visit',
          'Drafts your reply to every incoming review',
          'Flags bad reviews to you instantly',
        ],
        integratesWith: ['Google Business Profile', 'SMS', 'your booking system'],
        price: 1800, retainer: 150, timeToLive: '2 weeks',
        expectedImpact: '3-5x review velocity. More reviews = more bookings at zero ad cost.',
        painTags: ['reviews', 'marketing'],
      },
    ],
    tier3: {
      title: 'The Practice Full System',
      pitch: 'Inbound → booking → intake → visit → follow-up → rebook → payment → review, all connected through the Practice Brain.',
      pipeline: [
        'Inbound on any channel → booking concierge',
        'Auto intake form + appointment prep',
        'Visit day: reminders + check-in triage',
        'Post-visit follow-up + review harvest',
        'Rebook nudge at the right interval',
        'AR + insurance chase runs in the background',
      ],
      brain: {
        summary: "Knows every client's history, sensitivities, no-show risk, lifetime value. Remembers your buffer preferences and Friday blocks.",
        examples: [
          '"47 clients seen this week, $12.4k revenue, no-shows down to 8%."',
          '"Three long-term clients haven\'t rebooked in 90 days — reach-outs drafted."',
          '"Sarah mentioned her daughter\'s wedding at last visit — flag for conversation Tuesday."',
        ],
      },
      buildPrice: 16000, retainer: 1000, timeToLive: '4 weeks',
      expectedImpact: 'Full operational visibility. ~Half an employee in cost, scales every provider on your team.',
    },
  },

  // ─── 3. RETAIL ──────────────────────────────────────────────────────
  'retail': {
    tier1: {
      free: {
        toolName: 'Square Loyalty + Google Business Posts',
        toolUrl: 'https://squareup.com/us/en/loyalty',
        oneLiner: 'Free loyalty program + weekly Google posts to stay top of search.',
        why: "Square Loyalty is free on Square POS; Google Business posts are free and push you above competitors. Both stack with any automation you add later.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Configure Square POS properly (menu, modifiers, taxes, tips)',
          'Set up Square Loyalty with a reward that actually drives repeat visits',
          'Optimize your Google Business Profile + post schedule',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'retail-ai-concierge',
        title: 'AI Customer Concierge',
        pitch: 'Handles DMs, web chat, "are you open?" calls, menu questions, reservation + catering inquiries.',
        whatItDoes: [
          'Picks up phone + DM + chat in one agent',
          'Answers hours, menu, location, pricing questions',
          'Books reservations + catering inquiries',
          'Routes real problems to you with full context',
        ],
        integratesWith: ['Twilio', 'Instagram DM', 'your reservation system'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Stops your team from answering 30+ "are you open" calls/week. Captures catering inquiries that currently vanish.',
        painTags: ['missed-calls', 'admin', 'being-bottleneck'],
      },
      {
        id: 'retail-ai-winback',
        title: 'AI Winback Agent',
        pitch: 'Monitors POS for lapsed regulars. Personalized winback in your voice ("Haven\'t seen you in 6 weeks, your usual oat latte\'s on us").',
        whatItDoes: [
          'Reads POS for per-customer last-visit',
          'Flags lapsed regulars automatically',
          'Drafts the message referencing their actual usual',
          'Offers a small on-brand incentive',
        ],
        integratesWith: ['Square / Toast / Clover POS', 'SMS', 'email'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Recovers 20-30% of lapsed regulars. Higher ROI than any ad spend you could run.',
        painTags: ['marketing', 'churn'],
      },
      {
        id: 'retail-ai-inventory',
        title: 'AI Inventory & Reorder Assistant',
        pitch: 'Reads POS, flags low stock before runout, drafts reorder emails to suppliers.',
        whatItDoes: [
          'Monitors SKU-level velocity vs on-hand',
          'Flags runout risk before it happens',
          'Drafts supplier emails with quantities + PO numbers',
          'Tracks supplier reliability over time',
        ],
        integratesWith: ['your POS', 'your inventory module', 'email'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'No more "we\'re out of matcha" Friday afternoons. Freezes up 5-8 hrs/week of ordering time.',
        painTags: ['inventory', 'admin', 'being-bottleneck'],
      },
      {
        id: 'retail-ai-schedule',
        title: 'AI Staff Schedule Optimizer',
        pitch: 'Reads historical foot traffic patterns, proposes weekly schedule, flags mismatches.',
        whatItDoes: [
          'Pulls foot traffic / transaction history',
          'Proposes staffing that matches demand',
          'Flags over/understaffed shifts before they ship',
          'Handles time-off + availability constraints',
        ],
        integratesWith: ['your POS', 'your scheduling tool', 'email/SMS'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Labor cost -8-12% without cutting service. Freezes 3-5 hrs/week of schedule-building.',
        painTags: ['staff', 'admin', 'scheduling'],
      },
      {
        id: 'retail-ai-social',
        title: 'AI Social Content Drafter',
        pitch: 'Weekly Google Business posts + Instagram captions in your voice. Photo input → captioned draft.',
        whatItDoes: [
          'Takes a photo or two and writes the caption',
          'Weekly Google Business post queue ready for one-tap approval',
          'Seasonal / holiday posts queued in advance',
          'Learns your voice from past posts',
        ],
        integratesWith: ['Google Business Profile', 'Instagram', 'your email'],
        price: 2000, retainer: 175, timeToLive: '1-2 weeks',
        expectedImpact: 'Consistent weekly presence at zero effort. Drives 10-20% more organic search traffic.',
        painTags: ['marketing'],
      },
      {
        id: 'retail-ai-review',
        title: 'AI Review Harvester',
        pitch: 'Post-transaction review ask via SMS/email. Drafted replies + bad-review escalation.',
        whatItDoes: [
          'Triggers on transaction completion (or receipt email)',
          'Personalized ask referencing what they bought',
          'Drafts your reply to every incoming review',
          'Flags bad reviews immediately',
        ],
        integratesWith: ['your POS', 'Google Business Profile', 'SMS/email'],
        price: 1800, retainer: 150, timeToLive: '2 weeks',
        expectedImpact: '3-5x review velocity. Pushes you above competing shops in local search.',
        painTags: ['reviews', 'marketing'],
      },
    ],
    tier3: {
      title: 'The Retail Full System',
      pitch: 'Every regular, every SKU, every shift, every post — connected through the Retail Brain.',
      pipeline: [
        'Inbound (call, DM, walk-in) handled by the concierge',
        'POS feeds winback + loyalty + inventory signals',
        'Schedule proposed weekly from traffic history',
        'Social posts queued + reviews harvested automatically',
        'Weekly brief lands Sunday night in your voice',
      ],
      brain: {
        summary: "Knows every regular's order, birthday, spend. Knows which staff sells more, which SKUs die by daypart, what weather does to foot traffic.",
        examples: [
          '"Revenue $18.2k, up 4%. Tuesday dinner is soft — consider a promo."',
          '"Linda hasn\'t been in 3 weeks, winback drafted."',
          '"Below par on matcha inventory for Friday."',
        ],
      },
      buildPrice: 15000, retainer: 1000, timeToLive: '4 weeks',
      expectedImpact: 'Full operational visibility across POS, staff, inventory, marketing. ~Half an employee in cost.',
    },
  },

  // ─── 4. E-COMMERCE ──────────────────────────────────────────────────
  'ecommerce': {
    tier1: {
      free: {
        toolName: 'Klaviyo Free Tier',
        toolUrl: 'https://www.klaviyo.com/pricing',
        oneLiner: 'Free up to 250 contacts — enough to run a real cart-recovery + welcome flow.',
        why: "Cart recovery alone recovers 5-10% of abandoned revenue. Free tier covers early-stage stores until volume justifies an upgrade.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Install + configure Shopify apps (reviews, cart recovery, returns)',
          'Build your Klaviyo welcome + cart recovery + post-purchase flows',
          'Set up a returns workflow that matches how your team actually works',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'ecom-ai-cs',
        title: 'AI Customer Service Agent',
        pitch: 'Handles 60-80% of tickets (WISMO, returns, sizing, exchanges) across email, chat, and Instagram DM.',
        whatItDoes: [
          'Reads order data on every inquiry',
          'Answers WISMO with real tracking data',
          'Processes low-risk returns + exchanges automatically',
          'Escalates real edge cases with full context to your team',
        ],
        integratesWith: ['Shopify', 'Gorgias / Zendesk', 'Instagram DM'],
        price: 4000, retainer: 300, timeToLive: '2 weeks',
        expectedImpact: 'CS ticket volume to humans -60-80%. Response time under 2 min, 24/7.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'ecom-ai-returns',
        title: 'AI Return / Exchange Triage',
        pitch: 'Routes returns by type (regret buyer vs defective) with different workflows. Auto-approves low-risk, escalates edge cases.',
        whatItDoes: [
          'Classifies the return reason from customer language',
          'Auto-approves low-risk returns without human touch',
          'Routes defective / warranty claims to the right queue',
          'Flags abuse patterns on high-return customers',
        ],
        integratesWith: ['Shopify', 'your returns platform', 'warehouse'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Return processing time -70%. Exchange conversion +15% (customers keep buying when the path is easy).',
        painTags: ['returns', 'admin'],
      },
      {
        id: 'ecom-ai-winback',
        title: 'AI Winback Agent',
        pitch: 'Personalized winback sequences based on actual purchase history + browse behavior.',
        whatItDoes: [
          'Reads purchase history per customer',
          'Triggers winback at the right interval (60/90/120 days)',
          'Personalizes copy + offer to what they bought',
          'Stops when they place a new order',
        ],
        integratesWith: ['Shopify', 'Klaviyo', 'SMS'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Lapsed-customer reactivation 15-25%. Higher ROI than cold acquisition.',
        painTags: ['marketing', 'churn'],
      },
      {
        id: 'ecom-ai-review',
        title: 'AI Review Harvester',
        pitch: 'Post-delivery + 14-day review asks. Product-specific. Reply drafting for one-tap approval.',
        whatItDoes: [
          'Times the ask to post-delivery sweet spot',
          'Personalizes by product + past reviews',
          'Drafts your reply to every review',
          'Surfaces product quality issues from the pattern of bad reviews',
        ],
        integratesWith: ['Shopify', 'Judge.me / Yotpo / Loox', 'SMS/email'],
        price: 2000, retainer: 175, timeToLive: '2 weeks',
        expectedImpact: '3-5x review rate. Reviews drive 15-30% higher conversion on product pages.',
        painTags: ['reviews', 'marketing'],
      },
      {
        id: 'ecom-ai-fulfillment',
        title: 'AI Fulfillment Exception Handler',
        pitch: 'Watches for late packages, address issues, lost shipments. Proactively contacts the customer before they complain.',
        whatItDoes: [
          'Monitors every order across carriers',
          'Flags stuck / late / lost packages before SLA breach',
          'Drafts the proactive apology + resolution in your voice',
          'Handles address correction flow automatically',
        ],
        integratesWith: ['Shopify', 'ShipStation / carriers', 'email'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Cuts fulfillment-related tickets 60-80%. Turns bad shipping experiences into "they actually care" moments.',
        painTags: ['admin', 'reviews', 'churn'],
      },
      {
        id: 'ecom-ai-ads',
        title: 'AI Ad-Copy + Creative Drafter',
        pitch: 'Pulls winning-product data, drafts ad variants in brand voice for review.',
        whatItDoes: [
          'Identifies products with highest LTV + repeat rate',
          'Drafts ad copy variants in your brand voice',
          'Builds creative briefs from product photography',
          'Tracks which variants you ship + what wins',
        ],
        integratesWith: ['Shopify', 'Meta Ads / Google Ads', 'your asset library'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Ad creative cycle 1 week → 1 day. Frees up 8-12 hrs/week of copywriter time.',
        painTags: ['marketing', 'being-bottleneck'],
      },
    ],
    tier3: {
      title: 'The E-Commerce Full System',
      pitch: 'Every customer touch, every order, every return — connected through the E-Commerce Brain.',
      pipeline: [
        'Pre-purchase: concierge + ads + reviews',
        'Post-purchase: fulfillment watch + follow-up',
        'Returns / exchanges routed by type',
        'Winback + loyalty triggered automatically',
        'Weekly brief on LTV trends, channel performance, product velocity',
      ],
      brain: {
        summary: "Knows every customer's LTV trajectory, which products drive repeat orders, which channels attract loyalists vs one-and-done.",
        examples: [
          '"$47k revenue, 4.2% refunds. Cedar soap has 2.1x LTV — push in next ad set."',
          '"Three VIPs haven\'t ordered in 90 days — winback drafted."',
          '"Meta burning on one-order buyers; Google repeat rate 40% higher."',
        ],
      },
      buildPrice: 18000, retainer: 1500, timeToLive: '4 weeks',
      expectedImpact: 'Full CX automation + real LTV visibility. ~Half an employee in cost, scales across your whole catalog.',
    },
  },

  // ─── 5. PROFESSIONAL SERVICES ────────────────────────────────────────
  'professional-services': {
    tier1: {
      free: {
        toolName: 'Calendly + HoneyBook Free Trial',
        toolUrl: 'https://calendly.com',
        oneLiner: 'Free scheduling + 7-day HoneyBook trial for proposals, contracts, invoicing in one place.',
        why: "Calendly is free forever for basic booking; HoneyBook's free trial is enough to see if proposal/contract/invoice-in-one fits how you work. Most firms discover they actually need it.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Build your engagement letter templates in HoneyBook or Dubsado',
          'Configure your intake form with the right conflict-check fields',
          'Set up your QBO/Xero with retainers + trust accounting rules',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'pro-ai-intake',
        title: 'AI Intake + Qualification Agent',
        pitch: '24/7 inbound handling. Qualifies service type, budget, urgency, conflict check. Books the intake call. Sends prep materials.',
        whatItDoes: [
          'Answers phone + form + chat inbound',
          'Runs your qualification criteria conversationally',
          'Conflict-checks names before booking',
          'Sends the pre-call prep materials automatically',
        ],
        integratesWith: ['Twilio', 'your calendar', 'your CRM / case management system'],
        price: 4000, retainer: 300, timeToLive: '2 weeks',
        expectedImpact: 'Intake conversion +25-35%. Partner time on unqualified leads drops to zero.',
        painTags: ['missed-calls', 'admin', 'being-bottleneck'],
      },
      {
        id: 'pro-ai-engagement',
        title: 'AI Engagement Letter Drafter',
        pitch: 'Takes intake call transcript + your firm templates → drafts the engagement letter in partner voice for review.',
        whatItDoes: [
          'Reads the intake call transcript',
          'Pulls the right template for the matter type',
          'Drafts the letter in the partner\'s voice',
          'Flags unusual terms for extra review',
        ],
        integratesWith: ['your template library', 'HoneyBook / DocuSign', 'email'],
        price: 3500, retainer: 275, timeToLive: '2 weeks',
        expectedImpact: 'Engagement letter turnaround 3 days → same day. Closes matters that go cold waiting on paperwork.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'pro-ai-time',
        title: 'AI Time Capture Agent',
        pitch: 'Reads your calendar, comms, and document activity → proposes daily time entries for partner review.',
        whatItDoes: [
          'Watches calendar, email, doc activity through the day',
          'Proposes time entries matched to matters',
          'Flags unbilled time you\'d otherwise lose',
          'Learns your billing patterns over time',
        ],
        integratesWith: ['your calendar', 'email', 'time + billing system'],
        price: 4000, retainer: 300, timeToLive: '2 weeks',
        expectedImpact: 'Recovers 4-8 billable hours/week per partner that currently vanishes. Realization rate up 8-15%.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'pro-ai-collections',
        title: 'AI Collections Agent',
        pitch: 'Watches AR. Drafts escalating nudges in partner voice. Flags sensitive clients for personal touch.',
        whatItDoes: [
          'Reads AR across all partners',
          'Drafts escalating nudges in the partner\'s voice',
          'Flags long-tenure clients for partner-only touch',
          'Sends for one-tap approval',
        ],
        integratesWith: ['QuickBooks / Xero', 'email', 'your time + billing tool'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'DSO drops 15-30 days. Recovers 60-80% of aged AR without partner time.',
        painTags: ['chasing-money'],
      },
      {
        id: 'pro-ai-relationship',
        title: 'AI Relationship Touch Reminder',
        pitch: 'Tracks last-contact cadence per client. Nudges the partner when relationships go cold. Drafts the check-in message.',
        whatItDoes: [
          'Logs every client touchpoint across email, calendar, calls',
          'Flags relationships going cold vs usual cadence',
          'Drafts a personal check-in referencing real context',
          'Weekly partner digest of who needs a touch',
        ],
        integratesWith: ['email', 'calendar', 'your CRM'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Client retention up 10-20%. Cross-sell opportunities surface that would otherwise die.',
        painTags: ['churn', 'marketing'],
      },
      {
        id: 'pro-ai-docs',
        title: 'AI Document Request Nudger',
        pitch: 'Tracks outstanding client docs, auto-nudges in partner voice with specifics.',
        whatItDoes: [
          'Tracks every document request per matter',
          'Nudges the client with specifics (not just "still waiting")',
          'Escalates stuck requests to partner',
          'Closes the loop when docs come in',
        ],
        integratesWith: ['your matter management system', 'email', 'secure file portal'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Matters move 30-50% faster. Partner time on "still waiting on docs" drops to zero.',
        painTags: ['admin', 'being-bottleneck'],
      },
    ],
    tier3: {
      title: 'The Firm Full System',
      pitch: 'Intake → engagement → matter work → time capture → billing → collections → relationship cadence, all connected through the Firm Brain.',
      pipeline: [
        'Inbound → intake + qualification + conflict check',
        'Engagement letter drafted + sent',
        'Matter opens; time captured passively',
        'Billing + collections run in background',
        'Relationship cadence tracked per client',
        'Weekly partner brief drops Sunday night',
      ],
      brain: {
        summary: "Knows every client's matter history, payment behavior, communication style, relationship depth. Remembers conflict rules, jurisdictional quirks, partner routing.",
        examples: [
          '"$38k billed, 62% realization. Three clients past 60-day AR — nudges drafted."',
          '"Johnson matter is 11 days since contact — usual cadence is 7."',
          '"Court Tuesday; prep materials pulled, Monday afternoon blocked."',
        ],
      },
      buildPrice: 20000, retainer: 1500, timeToLive: '4 weeks',
      expectedImpact: 'Full firm visibility + realization lift + retention gains. ~Half an associate in cost.',
    },
  },

  // ─── 6. B2B SAAS ────────────────────────────────────────────────────
  'b2b-saas': {
    tier1: {
      free: {
        toolName: 'HubSpot Free CRM',
        toolUrl: 'https://www.hubspot.com/products/get-started-free',
        oneLiner: 'Forever-free CRM with deal pipeline, email tracking, and meeting scheduler built in.',
        why: "HubSpot free is enough to run disciplined deal stages + sequences before you need anything custom. Most startups outgrow it naturally — and when they do, the AI layer sits on top of it.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Configure HubSpot / Pipedrive properly (pipelines, stages, automation)',
          'Build your email sequences + lifecycle stage mapping',
          'Wire up lead-routing rules that actually work for your team shape',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'saas-ai-sdr',
        title: 'AI SDR / Demo Scheduler',
        pitch: 'Inbound + outbound lead handling, qualification, demo booking, follow-up drafting.',
        whatItDoes: [
          'Handles inbound form + chat + email leads',
          'Runs your qualification script conversationally',
          'Books demos against AE calendars',
          'Drafts personalized follow-ups after no-shows',
        ],
        integratesWith: ['HubSpot / Salesforce', 'Calendly', 'your email domain'],
        price: 4500, retainer: 400, timeToLive: '2 weeks',
        expectedImpact: 'Demo show rate +20-35%. Replaces or augments one SDR at ~40% of the cost.',
        painTags: ['missed-calls', 'being-bottleneck'],
      },
      {
        id: 'saas-ai-demo-prep',
        title: 'AI Demo Prep Agent',
        pitch: 'Before each booked demo, researches prospect, pulls relevant case studies, drafts talking points for rep.',
        whatItDoes: [
          'Pulls prospect + company context automatically',
          'Matches to the right case studies in your library',
          'Drafts demo talking points + anticipated objections',
          'Lands in rep\'s inbox 1 hour before the call',
        ],
        integratesWith: ['your CRM', 'LinkedIn / Apollo', 'your content library'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Rep prep time drops from 20min to 2min per demo. Conversion per demo up 10-20%.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'saas-ai-activation',
        title: 'AI Trial Activation Agent',
        pitch: 'Watches product usage, nudges stuck users at key friction points, drafts help messages in rep voice.',
        whatItDoes: [
          'Reads product usage events per trial user',
          'Detects stuck-at-setup / low-engagement patterns',
          'Nudges at the right friction moment with the right help',
          'Escalates real implementation blockers to your CSM',
        ],
        integratesWith: ['your product analytics', 'CRM', 'email + in-app'],
        price: 4000, retainer: 350, timeToLive: '2 weeks',
        expectedImpact: 'Trial-to-paid conversion +15-30%. Drops onboarding friction without hiring more CSMs.',
        painTags: ['onboarding', 'churn'],
      },
      {
        id: 'saas-ai-churn',
        title: 'AI Churn Risk Detector',
        pitch: 'Monitors usage + support + billing signals. Alerts CSM when an account is at risk with specific recommendations.',
        whatItDoes: [
          'Multi-signal risk scoring (usage, tickets, invoice age, stakeholder changes)',
          'Flags accounts 30-60 days before likely churn',
          'Drafts the CSM outreach with specific context',
          'Tracks intervention outcomes to improve the model',
        ],
        integratesWith: ['product analytics', 'support desk', 'billing', 'CRM'],
        price: 4500, retainer: 400, timeToLive: '2 weeks',
        expectedImpact: 'Churn rate -15-25%. Each saved account pays back the whole system many times over.',
        painTags: ['churn'],
      },
      {
        id: 'saas-ai-expansion',
        title: 'AI Expansion Opportunity Surfacer',
        pitch: 'Identifies accounts ready for upsell based on usage patterns. Drafts expansion pitch for CSM.',
        whatItDoes: [
          'Detects seat / usage / feature-adoption expansion signals',
          'Scores accounts by expansion readiness',
          'Drafts the upsell pitch for CSM review',
          'Feeds what wins back into scoring',
        ],
        integratesWith: ['product analytics', 'CRM', 'billing'],
        price: 4000, retainer: 350, timeToLive: '2 weeks',
        expectedImpact: 'Net revenue retention +10-20 points. Growth without adding acquisition cost.',
        painTags: ['marketing'],
      },
      {
        id: 'saas-ai-followup',
        title: 'AI Post-Demo Follow-Up',
        pitch: 'Drafts follow-up emails referencing specifics from the call transcript in rep voice.',
        whatItDoes: [
          'Reads the demo transcript / notes',
          'Drafts a follow-up referencing real moments from the call',
          'Attaches relevant case studies',
          'Ready for rep one-tap send',
        ],
        integratesWith: ['Gong / Chorus / Fathom', 'CRM', 'email'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Follow-up rate 100%, reply rate +30-50% vs template follow-ups.',
        painTags: ['admin', 'being-bottleneck'],
      },
    ],
    tier3: {
      title: 'The Revenue Full System',
      pitch: 'Inbound → qualification → demo prep → activation → expansion → churn defense, all connected through the Revenue Brain.',
      pipeline: [
        'Inbound captured + qualified 24/7',
        'Demos auto-prepped for reps',
        'Trial users nudged through activation',
        'Churn + expansion signals run continuously',
        'Post-call follow-ups drafted in rep voice',
        'Weekly founder/VP brief on pipeline + retention health',
      ],
      brain: {
        summary: "Knows every account's usage, engagement, sentiment, renewal risk, expansion signal. Knows rep close rates by segment, CSM retention rates.",
        examples: [
          '"Pipeline $420k, closed $68k. Acme usage dropped 40% — churn risk flagged."',
          '"Three mid-market deals stalled at legal — MSA amendment drafted."',
          '"Jordan is closing 2.3x Chris on mid-market; consider reallocating leads."',
        ],
      },
      buildPrice: 20000, retainer: 1500, timeToLive: '4 weeks',
      expectedImpact: 'Go-to-market ops, customer success, and expansion — one connected system. ~Half an employee in cost.',
    },
  },

  // ─── 7. FIELD SERVICES / TRADES ─────────────────────────────────────
  'trades': {
    tier1: {
      free: {
        toolName: 'Google Voice + OpsGenie Free',
        toolUrl: 'https://voice.google.com',
        oneLiner: 'Free second line + on-call rotation tool so you\'re not the only number answering at 2am.',
        why: "Before you automate, get the phone off your own number. Google Voice handles routing; OpsGenie's free tier handles rotation — so you and your techs aren't all getting every emergency call.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Configure Jobber or Housecall Pro for your workflow',
          'Set up OpsGenie on-call rotation with escalation rules',
          'Build your quick-invoice flow so the crew can invoice from the truck',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'trades-ai-dispatch',
        title: 'AI Dispatch Triage',
        pitch: 'Incoming call → urgency assessment → wakes the on-call tech for P1 only.',
        whatItDoes: [
          'Picks up every call, including after-hours',
          'Triages urgency conversationally (flooding vs slow drain)',
          'Wakes on-call tech for true P1',
          'Books P2/P3 for next-day scheduling',
        ],
        integratesWith: ['Twilio', 'OpsGenie / your rotation tool', 'your calendar'],
        price: 3500, retainer: 300, timeToLive: '2 weeks',
        expectedImpact: 'Stops 3am wake-ups for non-emergencies. Tech retention goes up. Service availability goes up.',
        painTags: ['missed-calls', 'dispatch', 'staff'],
      },
      {
        id: 'trades-ai-eta',
        title: 'AI Customer ETA Portal',
        pitch: '"Rick is 20 min out" tracking page pulled from truck GPS or tech phone. The Domino\'s tracker effect.',
        whatItDoes: [
          'Pulls tech location in real time',
          'Sends "your tech is on the way" link to the customer',
          'Updates ETA automatically as the truck moves',
          'Handles "where is my tech?" calls without a dispatcher',
        ],
        integratesWith: ['your field service software', 'SMS', 'mapping APIs'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Customer satisfaction jumps significantly. Dispatch calls drop 70%+.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'trades-ai-invoice',
        title: 'AI Instant-Invoice Agent',
        pitch: 'Job complete → photos + parts + voice note captured → invoice drafted + payment link sent within 30 minutes.',
        whatItDoes: [
          'Captures parts, photos, voice note from the truck',
          'Drafts invoice against your price book',
          'Sends to customer with payment link before tech drives away',
          'Sweeps the payment back to your AR',
        ],
        integratesWith: ['your field service software', 'QuickBooks', 'Stripe / Square'],
        price: 2800, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Time-to-invoice goes from 3-7 days to 30 min. DSO drops 20+ days.',
        painTags: ['chasing-money', 'admin', 'being-bottleneck'],
      },
      {
        id: 'trades-ai-maintenance',
        title: 'AI Maintenance Plan Converter',
        pitch: 'Post-service, pitches a maintenance plan in your voice at the peak sentiment moment.',
        whatItDoes: [
          'Triggers right after the customer is happiest',
          'Personalizes the pitch to the equipment they have',
          'Handles the sign-up flow without a human',
          'Tracks conversion by tech + by equipment type',
        ],
        integratesWith: ['your field service software', 'SMS / email', 'Stripe'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Maintenance plan attach rate 10% → 25-35%. Recurring revenue that compounds every year.',
        painTags: ['marketing', 'admin'],
      },
      {
        id: 'trades-ai-review',
        title: 'AI Review Harvester',
        pitch: 'Post-service review ask when stress just resolved. Reply drafting + bad-review escalation.',
        whatItDoes: [
          'Times the ask to "water\'s flowing again" moment',
          'Personalized to the tech + the work',
          'Drafts replies for one-tap approval',
          'Flags bad reviews to you immediately',
        ],
        integratesWith: ['Google Business Profile', 'your field service software', 'SMS'],
        price: 1800, retainer: 150, timeToLive: '2 weeks',
        expectedImpact: '3-5x review rate. Reviews drive inbound calls at zero ad cost.',
        painTags: ['reviews', 'marketing'],
      },
      {
        id: 'trades-ai-collections',
        title: 'AI Collections Agent',
        pitch: 'Payment chase for unpaid invoices, escalating in your voice.',
        whatItDoes: [
          'Watches AR continuously',
          'Drafts 7/14/30-day escalating nudges in your voice',
          'Handles payment plan requests automatically',
          'Flags legal / lien-worthy accounts separately',
        ],
        integratesWith: ['QuickBooks', 'your field service software', 'email / SMS'],
        price: 2800, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Recovers 60-80% of stuck invoices. DSO drops 15-30 days.',
        painTags: ['chasing-money'],
      },
    ],
    tier3: {
      title: 'The Dispatch Full System',
      pitch: 'Call → triage → dispatch → ETA → service → invoice → review → maintenance plan, all connected through the Dispatch Brain.',
      pipeline: [
        'Call triaged 24/7, P1 wakes on-call only',
        'Customer gets real-time ETA portal',
        'Service captured from the truck',
        'Invoice + payment link before tech leaves',
        'Review ask + maintenance plan at peak sentiment',
        'Weekly brief on tech utilization, routes, margin',
      ],
      brain: {
        summary: "Knows every tech's strengths, every neighborhood's typical issues, every customer's service history. Remembers your rate rules + overtime policies.",
        examples: [
          '"47 calls this week, 94% response under 2hrs. Rick is at 63 hrs — rotate next week."',
          '"Glenora had 4 water heater calls — aging cohort, postcard campaign?"',
          '"Three one-timers never heard back post-service; maintenance pitches drafted."',
        ],
      },
      buildPrice: 17000, retainer: 1200, timeToLive: '4 weeks',
      expectedImpact: 'Full dispatch visibility + AR + retention. ~Half an employee in cost, scales every tech on the truck.',
    },
  },

  // ─── 8. CREATIVE ────────────────────────────────────────────────────
  'creative': {
    tier1: {
      free: {
        toolName: 'HoneyBook Free Trial + Pixieset Free Tier',
        toolUrl: 'https://www.honeybook.com',
        oneLiner: 'HoneyBook trial for inquiries/contracts/invoicing; Pixieset free tier for client galleries.',
        why: "These two cover 80% of creative business admin out of the box. Most shooters are cobbling it together with 5 tools — consolidate first, then automate.",
        free: true,
      },
      paid: {
        rate: '$100/hr, 1-hour minimum',
        tasks: [
          'Configure HoneyBook / Dubsado with your service packages + workflows',
          'Set up Pixieset / Pic-Time gallery delivery + proofing',
          'Build your template bank (inquiry replies, proposals, contracts, pre-shoot prep)',
        ],
      },
    },
    tier2Menu: [
      {
        id: 'creative-ai-inquiry',
        title: 'AI Inquiry + Proposal Agent',
        pitch: '24/7 inbound handling. Qualifies date, scope, budget. Drafts proposal in your voice from your template library.',
        whatItDoes: [
          'Replies to every inquiry within minutes',
          'Qualifies fit conversationally',
          'Drafts a tailored proposal referencing your work',
          'Holds the date tentatively while you decide',
        ],
        integratesWith: ['HoneyBook / Dubsado', 'email', 'your calendar'],
        price: 3500, retainer: 275, timeToLive: '2 weeks',
        expectedImpact: 'Inquiry-to-book rate up 20-35%. Stops prospects from going to whoever replied first.',
        painTags: ['missed-calls', 'admin', 'being-bottleneck'],
      },
      {
        id: 'creative-ai-contract',
        title: 'AI Contract + Deposit Flow',
        pitch: 'Proposal accepted → auto-contract + deposit request + calendar lock.',
        whatItDoes: [
          'Fires the contract when proposal is accepted',
          'Pushes the deposit request with payment link',
          'Locks the date on deposit receipt',
          'Sends a welcome packet automatically',
        ],
        integratesWith: ['HoneyBook / Dubsado', 'Stripe', 'calendar'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Time from accept-to-deposit drops from days to hours. No more lost bookings to slow paperwork.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'creative-ai-preshoot',
        title: 'AI Pre-Shoot Questionnaire Agent',
        pitch: 'Client intake form auto-sent + mood board builder + logistics confirmation.',
        whatItDoes: [
          'Sends the right questionnaire for the shoot type',
          'Builds a mood board from client replies',
          'Confirms logistics (location, start time, contact) 48hr before',
          'Flags anything unusual to you',
        ],
        integratesWith: ['HoneyBook', 'email', 'Pinterest / your mood board tool'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Pre-shoot prep time drops 50-70%. Fewer surprises on shoot day.',
        painTags: ['admin', 'being-bottleneck'],
      },
      {
        id: 'creative-ai-gallery',
        title: 'AI Gallery Delivery + Proofing',
        pitch: 'Post-shoot gallery delivery with proof/revision tracking. Drafts delivery notes in your voice.',
        whatItDoes: [
          'Delivers the gallery with a personalized note',
          'Tracks proofing + revision requests',
          'Nudges clients who haven\'t selected',
          'Captures testimonial moments automatically',
        ],
        integratesWith: ['Pixieset / Pic-Time', 'email', 'your CRM'],
        price: 3000, retainer: 250, timeToLive: '2 weeks',
        expectedImpact: 'Gallery delivery communication drops from 1 hr to 5 min per client.',
        painTags: ['admin', 'reviews'],
      },
      {
        id: 'creative-ai-rebook',
        title: 'AI Rebooking Agent',
        pitch: 'Anniversary nudges, refresh-cycle reminders (corporate headshots, annual family shoots) in your voice.',
        whatItDoes: [
          'Tracks the natural re-shoot interval per client type',
          'Nudges at the right moment with context from the last shoot',
          'Offers a loyal-client rate if appropriate',
          'Books automatically on yes',
        ],
        integratesWith: ['HoneyBook', 'your calendar', 'email'],
        price: 2500, retainer: 200, timeToLive: '2 weeks',
        expectedImpact: 'Repeat client bookings up 30-50%. Revenue that compounds every year.',
        painTags: ['marketing', 'churn'],
      },
      {
        id: 'creative-ai-testimonial',
        title: 'AI Testimonial Harvester',
        pitch: 'Testimonial ask at delivery peak. Drafts reply + testimonial usage requests.',
        whatItDoes: [
          'Triggers on gallery delivery + positive reply',
          'Asks for a testimonial with specific prompts',
          'Drafts the social / website usage reply',
          'Gets photo usage releases automatically',
        ],
        integratesWith: ['Pixieset', 'email', 'your CRM'],
        price: 2000, retainer: 175, timeToLive: '2 weeks',
        expectedImpact: 'Testimonials up 3-5x. Social proof for future inquiry conversion.',
        painTags: ['reviews', 'marketing'],
      },
    ],
    tier3: {
      title: 'The Studio Full System',
      pitch: 'Inquiry → proposal → contract → pre-shoot → shoot → gallery → testimonial → rebook, all connected through the Studio Brain.',
      pipeline: [
        'Inquiry auto-qualified + proposal drafted',
        'Accept → contract + deposit + calendar lock',
        'Pre-shoot prep + mood board built',
        'Post-shoot gallery delivered with personal note',
        'Testimonial + rebook nudges run automatically',
        'Weekly brief on pipeline, edit queue, anniversary rebooks',
      ],
      brain: {
        summary: "Knows every client's style preferences, deliverable expectations, revision tolerance. Respects your edit-week protection + capacity limits.",
        examples: [
          '"Booked $14k, delivered 3 projects. Edit queue is 2 galleries deep — Friday blocked for catch-up."',
          '"Hendersons\' anniversary next month, rebook nudge drafted."',
          '"Inquiry-to-book dropped to 22%; two prospects ghosted, warm follow-ups drafted."',
        ],
      },
      buildPrice: 15000, retainer: 1000, timeToLive: '4 weeks',
      expectedImpact: 'All client admin off your plate. ~Half an employee in cost, scales every creative on your team.',
    },
  },
}

// ─── Matchers ────────────────────────────────────────────────────────

export function getOffering(industry: Industry): IndustryOffering {
  return OFFERINGS[industry] ?? OFFERINGS['project-based']
}

// Normalize user's raw pain signals into PainTag array
export function painSignals(raw: {
  topPain?: string
  painTag?: string
  wantedTimeBack?: string | string[]
}): PainTag[] {
  const tags = new Set<PainTag>()
  const addFromFree = (s: string) => {
    const t = s.toLowerCase()
    if (/miss(ed)?\s*call|after.?hours|voicemail|ringing/.test(t)) tags.add('missed-calls')
    if (/quote|quoting|estimat|proposal/.test(t)) tags.add('quoting')
    if (/chase|chasing|overdue|unpaid|invoice|ar\b|receivable|collection/.test(t)) tags.add('chasing-money')
    if (/review|rating|reput/.test(t)) tags.add('reviews')
    if (/admin|paperwork|bookkeep|billing|schedul|dispatch/.test(t)) tags.add('admin')
    if (/market|social|content|ad\b|ads\b/.test(t)) tags.add('marketing')
    if (/staff|crew|team|hiring|rotation|on.?call/.test(t)) tags.add('staff')
    if (/no.?show|cancel|resched/.test(t)) tags.add('no-shows')
    if (/inventor|stock|reorder|runout/.test(t)) tags.add('inventory')
    if (/book|appoint|slot|calendar/.test(t)) tags.add('scheduling')
    if (/onboard|activation|trial|setup/.test(t)) tags.add('onboarding')
    if (/return|refund|exchange/.test(t)) tags.add('returns')
    if (/churn|retention|lapsed|cancel/.test(t)) tags.add('churn')
    if (/bottleneck|everything|too much|overwhelm/.test(t)) tags.add('being-bottleneck')
  }
  if (raw.topPain) addFromFree(raw.topPain)
  if (raw.painTag) {
    const m: Record<string, PainTag> = {
      'missed calls': 'missed-calls',
      'quoting': 'quoting',
      'chasing money': 'chasing-money',
      'reviews / marketing': 'reviews',
      'admin / paperwork': 'admin',
      'staff / team': 'staff',
    }
    const t = m[raw.painTag.toLowerCase()]
    if (t) tags.add(t)
  }
  const wantedList = Array.isArray(raw.wantedTimeBack) ? raw.wantedTimeBack : raw.wantedTimeBack ? [raw.wantedTimeBack] : []
  for (const w of wantedList) {
    switch (w) {
      case 'chasing-payments': tags.add('chasing-money'); break
      case 'answering-calls': tags.add('missed-calls'); break
      case 'quoting': tags.add('quoting'); break
      case 'admin': tags.add('admin'); break
      case 'marketing': tags.add('marketing'); break
      case 'being-bottleneck': tags.add('being-bottleneck'); break
    }
  }
  return [...tags]
}

// Pick 2-4 Tier 2 offers from the industry menu based on pain signals.
// Ranking: count of matching tags desc. If user has no signals yet, returns [].
export function matchTier2(industry: Industry, signals: PainTag[]): Tier2Offer[] {
  const menu = OFFERINGS[industry]?.tier2Menu ?? []
  if (signals.length === 0) return []
  const scored = menu
    .map((offer) => ({ offer, score: offer.painTags.filter((t) => signals.includes(t)).length }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
  const picks = scored.slice(0, 4).map((s) => s.offer)
  // Always return at least 2 if any matched; pad with highest-value defaults if needed.
  if (picks.length < 2 && menu.length >= 2) {
    for (const offer of menu) {
      if (picks.length >= 2) break
      if (!picks.find((p) => p.id === offer.id)) picks.push(offer)
    }
  }
  return picks
}

// Sum the base build prices for a given set of Tier 2 offers.
export function sumTier2(offers: Tier2Offer[]): number {
  return offers.reduce((s, o) => s + o.price, 0)
}
