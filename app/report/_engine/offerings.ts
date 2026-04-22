// Zyph Labs offering catalog per Brian's spec (workspace _spec/zyph-offering-matrix.md).
// Each industry has a Tier 2 (Single Automation, $2-5k) and Tier 3 (Full System + Brain).
// All paid tiers are Zyph-built AI integrations. No "configure their SaaS" entries.

import type { Industry } from './types'
import type { QuickWinCard, FullSystemCard } from './types-v2'

export interface IndustryOffering {
  tier2: Omit<QuickWinCard, 'cta'>
  tier3: Omit<FullSystemCard, 'cta'>
}

export const OFFERINGS: Record<Industry, IndustryOffering> = {
  'project-based': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Proposal Agent',
      pitch: 'A Zyph-built agent that turns a 10-minute scope call into a polished proposal in your voice — drafted, priced, and ready for your thumbs-up before the client gets off their coffee break.',
      whatItDoes: [
        'Listens to your voice note or reads your photos and scope notes',
        'Drafts line items from your past jobs and pricing history',
        'Writes the cover letter in your tone',
        'Pushes the final to e-sign when you approve',
      ],
      integratesWith: ['QuickBooks', 'your email', 'your quote template library'],
      priceBand: '$3k–$4k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Quote turnaround goes from 3 days to same-day. Close rate lifts 10–25% on faster response alone.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Project-Based Full System',
      pitch: 'Your whole operation — quote → contract → project delivery → invoicing → AR — automated end-to-end, with a Brain that remembers every job, client, and supplier.',
      pipeline: [
        'Scope intake by voice, photo, or email',
        'Proposal drafted in owner voice + auto-contract on acceptance',
        'Project portal with milestone updates in dual voices (client vs team)',
        'Change orders captured from the field',
        'Auto-invoice on completion + AR chase agent',
      ],
      brain: {
        summary: 'Knows every job\'s margin, every client\'s payment behavior, every supplier\'s pricing drift. Remembers your family schedule so it doesn\'t book estimates during kid pickups.',
        examples: [
          '"Henderson margin is 8% below your average — talk to the cabinet sub."',
          '"You promised Dave a callback Monday; I\'ve blocked 10am."',
          '"Rick\'s crew is 20% more efficient than Kyle\'s on kitchens — weight next week toward that."',
        ],
      },
      priceBand: '$18k build + $1.2k/mo',
      timeToLive: '4 weeks',
      expectedImpact: '~Half an employee of cost. Scales every employee you already have. Full operational visibility for the first time.',
    },
  },

  'appointment-based': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Booking Concierge',
      pitch: 'A 24/7 front-desk agent that answers calls, SMS, and DMs — checks your calendar, books real appointments, sends intake forms, and reminds automatically.',
      whatItDoes: [
        'Handles 80%+ of inbound booking volume without staff involvement',
        'Qualifies by service type, insurance, urgency',
        'Books directly into your calendar + sends intake forms',
        'Reminds on your cadence — more touches for known no-show risks',
      ],
      integratesWith: ['your booking tool', 'your phone line', 'SMS (Twilio)', 'email'],
      priceBand: '$2.5k–$3.5k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Front-desk hours cut 60%+. No-show rate halved. After-hours bookings captured instead of lost.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Practice Full System',
      pitch: 'The full client lifecycle — from first DM to recall after 6 months — automated, with a Brain that remembers every client like your best front-desk person ever did.',
      pipeline: [
        'Booking concierge for inbound',
        'Adaptive intake forms by service type',
        'Personalized reminder cadence (risk-weighted)',
        'Post-visit follow-up in provider voice',
        'Auto-rebook nudge on each client\'s natural interval',
        'Insurance/billing chase + review-ask at peak sentiment',
      ],
      brain: {
        summary: 'Knows every client\'s history, sensitivities, no-show risk, lifetime value. Remembers the provider\'s preferences and respects buffer-between-patients rules.',
        examples: [
          '"Sarah mentioned her daughter\'s wedding last visit — flag for conversation Tuesday."',
          '"Three long-term clients haven\'t rebooked in 90 days — reach-outs drafted."',
          '"No-show rate 8%, down from 12% last month. The risk-weighted reminders are working."',
        ],
      },
      priceBand: '$16k build + $1k/mo',
      timeToLive: '4 weeks',
      expectedImpact: 'Front-desk workload cut 70%+. Client retention lifts 15–30% from consistent follow-up. Provider hours unlocked.',
    },
  },

  'retail': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Customer Concierge',
      pitch: 'An always-on agent on every channel — DMs, web chat, phone — that handles "are you open," menu questions, reservations, and catering inquiries without you touching your phone.',
      whatItDoes: [
        'Answers every inbound question in your voice 24/7',
        'Books tables, captures catering leads, handles menu questions',
        'Harvests customer contact into your list',
        'Routes hot leads (catering, events) to you in real time',
      ],
      integratesWith: ['Instagram DMs', 'Google Business chat', 'web chat', 'your POS calendar'],
      priceBand: '$2.5k–$4k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Never miss an inquiry. Catering leads captured instead of lost. Staff time on "are you open" questions goes to zero.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Retail Full System',
      pitch: 'Your whole operation — customer service, loyalty, staff scheduling, inventory, social — wrapped around your POS, with a Brain that knows every regular.',
      pipeline: [
        'Customer concierge on every channel',
        'Loyalty layer that remembers orders, not just punches',
        'Auto-reorder alerts from POS inventory thresholds',
        'Staff schedule suggestions from foot-traffic patterns',
        'Personalized winback ("Haven\'t seen you in 6 weeks, usual oat latte\'s on us")',
        'Weekly social + promo drafted in owner voice',
      ],
      brain: {
        summary: 'Knows every regular\'s order, birthday, usual time, spend, referral value. Knows which staff shifts outperform, which products underperform by time of day.',
        examples: [
          '"Revenue $18.2k, up 4% WoW. Tuesday dinner is soft — consider a promo."',
          '"Linda hasn\'t been in 3 weeks — winback drafted."',
          '"You\'re below par on matcha inventory for Friday."',
        ],
      },
      priceBand: '$15k build + $1k/mo',
      timeToLive: '4 weeks',
      expectedImpact: 'Owner off the floor. Every regular feels like a VIP. Inventory tight. Staff scheduled to demand.',
    },
  },

  'ecommerce': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Customer Service Agent',
      pitch: 'An agent that handles 60–80% of your tickets — where\'s-my-order, returns, sizing, exchanges — across email, chat, and Instagram DM. Reads order data, writes in brand voice, escalates edge cases.',
      whatItDoes: [
        'Resolves order-status, tracking, returns, sizing questions autonomously',
        'Pulls real Shopify/Amazon order data — no guessing',
        'Writes in your brand voice using your tone rules',
        'Escalates complex cases with full context so your team moves fast',
      ],
      integratesWith: ['Shopify/Amazon/Etsy', 'Gorgias or Intercom', 'Instagram DMs'],
      priceBand: '$3k–$4.5k',
      timeToLive: '1–2 weeks',
      expectedImpact: '60–80% of tickets closed without human touch. Founder time recovered. Response time in seconds instead of hours.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The E-commerce Full System',
      pitch: 'Your whole post-click funnel — service, returns, reviews, winback, fulfillment exceptions — automated, with a Brain that tracks LTV and tells you which SKUs make loyal customers.',
      pipeline: [
        'Customer service agent (Tier 2)',
        'Return/exchange workflow with judgment ("regret buyer" vs "defective")',
        'Review harvesting at delivery + 14 days',
        'Personalized winback sequences',
        'Fulfillment exception handling',
        'Ad-spend insight layer (LTV, not first-order revenue)',
      ],
      brain: {
        summary: 'Knows every customer\'s LTV trajectory, which SKUs are gateways to repeat orders, which ad channels attract loyalists vs one-and-dones. Remembers brand voice rules and margin sensitivities.',
        examples: [
          '"Cedar soap SKU has 2.1x LTV — push it in the next Meta ad set."',
          '"Three VIP customers haven\'t ordered in 90 days — winback drafted."',
          '"Your Meta spend is burning on single-order buyers; Google repeat rate is 40% higher."',
        ],
      },
      priceBand: '$18k build + $1.5k/mo',
      timeToLive: '4 weeks',
      expectedImpact: 'Support costs down 60%+. Repeat rate up. Ad spend targeted at loyalist cohorts instead of churners.',
    },
  },

  'professional-services': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Intake + Qualification Agent',
      pitch: 'A 24/7 agent that catches every inbound — call, email, web form — qualifies by service type, budget, urgency, and conflict, then books the intake call with prep already done.',
      whatItDoes: [
        'Qualifies prospects on service type, urgency, budget fit',
        'Runs preliminary conflicts check against your client DB',
        'Books the intake call with the right partner',
        'Sends prep materials in your firm voice',
      ],
      integratesWith: ['Clio Grow or HubSpot', 'your calendar', 'email', 'web forms'],
      priceBand: '$3k–$4.5k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Partner hours on unqualified intake cut 70%. More matters in pipeline because nothing slips at the top of funnel.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Firm Full System',
      pitch: 'Full client lifecycle from first touch to retainer renewal — intake, engagement letters, doc gen, time capture, AR, relationship tending — with a Brain that remembers every matter.',
      pipeline: [
        'Intake + qualification agent (Tier 2)',
        'Engagement letter drafted from intake transcript + firm templates',
        'Onboarding orchestration + doc-request chasing',
        'Time capture from calendar + comms + document activity',
        'Invoice drafting + AR chase in firm voice',
        'Relationship touch reminders by cadence',
      ],
      brain: {
        summary: 'Knows every client\'s matter history, payment behavior, communication style. Knows every partner\'s conflict rules, family schedule, and preferred matter routing.',
        examples: [
          '"Billed $38k this week, 62% realization. Three clients crossed 60-day AR — nudges drafted."',
          '"The Johnson matter is 11 days since last contact. Usual cadence is 7."',
          '"You have court Tuesday; I\'ve pulled prep materials and blocked Monday afternoon."',
        ],
      },
      priceBand: '$20k build + $1.5k/mo',
      timeToLive: '4 weeks',
      expectedImpact: 'Associate time on routine docs cut 80%. Realization rate up 5–12 points. AR aging halved.',
    },
  },

  'b2b-saas': {
    tier2: {
      kind: 'tier-2',
      title: 'AI SDR + Demo Scheduler',
      pitch: 'A Zyph-built SDR that qualifies inbound, researches prospects, books demos, and follows up — works the pipeline when your team is closing or sleeping.',
      whatItDoes: [
        'Qualifies inbound leads against ICP in seconds',
        'Researches prospect before booking (LinkedIn, 10-K, recent news)',
        'Books demos into rep calendar with context pre-pasted',
        'Drafts specific follow-ups in rep voice with relevance hooks',
      ],
      integratesWith: ['HubSpot / Salesforce / Close', 'your calendar', 'Clay or Apollo'],
      priceBand: '$3k–$5k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Reply rate up 2–3x on outbound. Reps stop playing SDR. Demo-ready meetings only.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Revenue Full System',
      pitch: 'Full GTM + customer success automation — SDR, onboarding, churn detection, expansion — with a Brain that reads product usage + CRM + support and tells you where the next dollar is.',
      pipeline: [
        'AI SDR (Tier 2)',
        'Demo prep agent (pre-call research)',
        'Post-demo follow-up with specific references',
        'Trial activation agent (nudges stuck users)',
        'Onboarding orchestrator + health signals',
        'Churn risk detector + expansion surfacer',
      ],
      brain: {
        summary: 'Knows every account\'s usage patterns, sentiment, renewal risk, expansion signal. Knows every rep\'s close rate by segment. Remembers founder strategic priorities (enterprise push vs PLG).',
        examples: [
          '"Pipeline $420k, closed $68k. Acme usage dropped 40% — churn risk flagged, outreach drafted."',
          '"Three mid-market deals stalled at legal — same blocker. MSA amendment drafted."',
          '"Jordan is closing 2.3x Chris on mid-market. Consider reallocating leads."',
        ],
      },
      priceBand: '$20k build + $1.5k/mo',
      timeToLive: '4 weeks',
      expectedImpact: 'Pipeline velocity up. Churn predicted 3–6 weeks earlier. Rev ops compounds instead of being rebuilt each quarter.',
    },
  },

  'trades': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Dispatch Triage',
      pitch: 'An agent on your line that assesses urgency on every call — water actively leaking = wake a tech, noisy dishwasher = book tomorrow. Stops 2am calls for things that aren\'t emergencies.',
      whatItDoes: [
        'Answers inbound 24/7 and diagnoses urgency',
        'Wakes on-call tech only for P1 emergencies',
        'Books P2/P3 calls directly into the next-day schedule',
        'Texts customer ETA and confirms before rolling truck',
      ],
      integratesWith: ['Jobber / Housecall Pro / ServiceTitan', 'your phone line', 'SMS', 'calendar'],
      priceBand: '$3k–$4k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Emergency-call stress down. After-hours leads captured. Techs stop getting woken up for dishwasher noise.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Dispatch Full System',
      pitch: 'Emergency-to-review, fully automated — triage, routing, ETA portal, invoice, review, maintenance-plan conversion — with a Brain that knows every tech, neighborhood, and repeat customer.',
      pipeline: [
        'Dispatch triage (Tier 2)',
        'Tech routing by skill + geography + customer history',
        'Customer ETA portal — the Domino\'s tracker effect',
        'Job completion capture (photos, parts, voice notes)',
        'Instant invoice + payment link',
        'Review request at peak sentiment + maintenance-plan pitch',
      ],
      brain: {
        summary: 'Knows every tech\'s strengths, every neighborhood\'s typical issues, every customer\'s service history. Knows your overtime rules, after-hours rates, and which suppliers are open late.',
        examples: [
          '"47 calls, 94% response under 2hrs. Rick is overworked (63 hrs) — rotate next week."',
          '"Glenora had 4 water-heater calls this week — aging cohort. Consider a postcard campaign."',
          '"Three one-time customers never heard back post-service. Maintenance-plan pitches drafted."',
        ],
      },
      priceBand: '$17k build + $1.2k/mo',
      timeToLive: '4 weeks',
      expectedImpact: '24/7 coverage without tech burnout. Review rate 4–6x. One-time calls converted to recurring.',
    },
  },

  'creative': {
    tier2: {
      kind: 'tier-2',
      title: 'AI Inquiry + Proposal Agent',
      pitch: 'An agent that catches every DM and email inquiry, qualifies (date, scope, budget), and drafts a custom proposal in your voice using your template library — ready for your one-tap approval.',
      whatItDoes: [
        'Answers inbound DMs + emails in your voice 24/7',
        'Qualifies: date, scope, location, budget, vibe',
        'Drafts proposal from your template library + past work',
        'Sends after one-tap review',
      ],
      integratesWith: ['HoneyBook / Dubsado', 'Instagram DMs', 'email'],
      priceBand: '$2.5k–$4k',
      timeToLive: '1–2 weeks',
      expectedImpact: 'Inquiry-to-book ratio doubles. You stop answering the same "how much" question 40x a week.',
    },
    tier3: {
      kind: 'tier-3',
      title: 'The Studio Full System',
      pitch: 'Full client journey — inquiry, contract, pre-shoot, delivery, rebooking — automated in your voice, with a Brain that protects your edit weeks and remembers every client\'s style.',
      pipeline: [
        'Inquiry agent (Tier 2)',
        'Contract + deposit automation',
        'Pre-shoot questionnaire + mood board synthesis',
        'Day-of logistics from past similar shoots',
        'Post-shoot delivery + proofing',
        'Testimonial + rebooking nudge on natural intervals',
      ],
      brain: {
        summary: 'Knows every client\'s style preferences, revision tolerance, referral value. Respects your edit-week protection, vacation blocks, and creative capacity ceiling.',
        examples: [
          '"Booked $14k, delivered 3 projects. Your edit queue is 2 deep — Friday is blocked."',
          '"The Hendersons\' wedding anniversary is next month — rebook nudge drafted."',
          '"Inquiry-to-book dropped to 22% — two prospects ghosted after proposal. Warm follow-ups drafted."',
        ],
      },
      priceBand: '$15k build + $1k/mo',
      timeToLive: '4 weeks',
      expectedImpact: 'Creative days protected. Repeat-book rate up 30–50%. Admin time cut 70%.',
    },
  },
}

export function getOffering(industry: Industry): IndustryOffering {
  return OFFERINGS[industry] ?? OFFERINGS['project-based']
}
