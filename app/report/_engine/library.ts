// Recommendation library — each rec is a template with triggers and priority.
// The matcher picks the top 5 per tier for a given set of assessment answers.

import type { AssessmentAnswers, LibraryRec } from './types'

// Helper: compute monthly $ recovered from missed after-hours leads.
const missedLeadDollars = (a: AssessmentAnswers) =>
  Math.round((a.leadsLostAfterHoursPerMonth ?? 0) * (a.closeRate ?? 0) * (a.avgTicket ?? 0))

// Helper: dollars from improving close rate by `delta` (e.g. 0.05 = 5 pp).
const closeRateLiftDollars = (a: AssessmentAnswers, delta: number) =>
  Math.round((a.leadsPerMonth ?? 0) * delta * (a.avgTicket ?? 0))

export const LIBRARY: LibraryRec[] = [
  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — QUICK WINS (DIY)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 't1-missed-call-textback',
    tier: 1,
    category: 'intake',
    title: 'Missed-call auto text-back',
    pitch: "Every voicemail gets an instant SMS reply so after-hours leads don't slip away.",
    effort: 'Easy',
    setupHours: '30 min',
    cost: 'Free (Google Voice) or $15/mo (OpenPhone)',
    fixes: (a) =>
      (a.leadsLostAfterHoursPerMonth ?? 0) > 0
        ? `You said ${(a.leadsLostAfterHoursPerMonth ?? 0)} leads/month slip through weekend voicemails — that's ~$${Math.round((a.leadsLostAfterHoursPerMonth ?? 0) * 12 * (a.closeRate ?? 0) * (a.avgTicket ?? 0) / 1000)}k/year at your ticket size.`
        : "After-hours calls go to voicemail — a text reply recovers the ones that don't leave a message.",
    roi: (a) => ({
      hoursPerWeek: 0,
      dollarsPerMonth: missedLeadDollars(a) || 2500,
      summary: `Recover ${a.leadsLostAfterHoursPerMonth || 'missed'} after-hours leads/mo ≈ $${Math.round((missedLeadDollars(a) || 2500) / 1000)}k/mo at your ${Math.round((a.closeRate ?? 0) * 100)}% close rate and $${((a.avgTicket ?? 0) / 1000).toFixed(0)}k ticket`,
    }),
    diyGuide: {
      tools: ['Google Voice (free) OR OpenPhone 7-day trial'],
      steps: [
        'Sign up for Google Voice with your business number forwarded',
        'Enable "Send automatic reply to missed calls" in settings',
        'Paste this template: "Hey — caught your call but can\'t pick up. Shoot me a text with what you\'re thinking and I\'ll get back within the hour."',
        'Test it: call yourself from another phone and confirm the reply arrives',
      ],
    },
    cta: null,
    triggers: (a) => a.afterHoursHandling === 'voicemail' || (a.leadsLostAfterHoursPerMonth ?? 0) > 0,
    priority: (a) => 50 + Math.min((a.leadsLostAfterHoursPerMonth ?? 0) * 10, 40),
  },

  {
    id: 't1-gbp-review-link',
    tier: 1,
    category: 'marketing',
    title: 'Google review request link + invoice QR code',
    pitch: 'One-click review link on every invoice and job-done email.',
    effort: 'Easy',
    setupHours: '45 min',
    cost: 'Free',
    fixes: (a) =>
      `You have ${a.googleReviewCount} Google reviews and ${a.asksForReviews ? 'sometimes ask' : "don't actively ask"} — competitors your size typically have 60+ and they're less qualified.`,
    roi: (a) => ({
      dollarsPerMonth: 2500 + Math.max(0, 60 - (a.googleReviewCount ?? 0)) * 50,
      summary: `Triple your reviews in 6 months → more calls from Google Maps ≈ $${(2.5 + Math.max(0, 60 - (a.googleReviewCount ?? 0)) * 0.05).toFixed(1)}k/mo uplift`,
    }),
    diyGuide: {
      tools: ['Google Business Profile', 'QR code generator (qr-code-generator.com)'],
      steps: [
        'Go to your Google Business Profile → click "Ask for reviews"',
        'Copy the short g.page/r/... link Google gives you',
        'Generate a QR code with that link',
        'Add both the link and QR to your invoice template footer',
        'Add one line: "Liked our work? A 30-second review means the world to us."',
      ],
    },
    cta: null,
    triggers: (a) => (a.googleReviewCount ?? 0) < 200,
    priority: (a) => 40 + (a.asksForReviews ? 0 : 20) + Math.max(0, (60 - a.googleReviewCount) / 2),
  },

  {
    id: 't1-calendly-sitevisit',
    tier: 1,
    category: 'intake',
    title: 'Calendly for site-visit booking',
    pitch: 'Stop playing phone tag to schedule walkthroughs.',
    effort: 'Easy',
    setupHours: '20 min',
    cost: 'Free (Calendly free tier)',
    fixes: (a) =>
      (a.crewSize ?? 1) > 1
        ? 'Site-visit scheduling eats 3+ hrs/week in back-and-forth. Self-serve booking closes that loop instantly.'
        : "Phone tag for site visits is a tax on your billable hours — let customers pick the slot themselves.",
    roi: () => ({
      hoursPerWeek: 3,
      summary: 'Save ~3 hrs/week of scheduling back-and-forth',
    }),
    diyGuide: {
      tools: ['Calendly (free tier)', 'Google Calendar'],
      steps: [
        'Sign up at calendly.com with your Google account',
        'Create an event type: "Site visit" — 60 min, Mon/Wed/Fri 9am–3pm only',
        'Put the link in your voicemail greeting, email signature, and website',
        'Share it when you text back a new lead: "Grab a time that works: calendly.com/yourname"',
      ],
    },
    cta: null,
    triggers: () => true,
    priority: (a) => 30 + ((a.crewSize ?? 1) === 1 ? 15 : 5),
  },

  {
    id: 't1-qbo-reminders',
    tier: 1,
    category: 'office',
    title: 'QuickBooks auto-reminders for overdue invoices',
    pitch: 'Stop chasing money manually — let QBO nag for you on a schedule.',
    effort: 'Easy',
    setupHours: '30 min',
    cost: 'Free (already on QBO)',
    fixes: (a) =>
      a.chasingPayments
        ? `You're chasing $${(a.chasingPaymentsAmount ?? 0) ? ((a.chasingPaymentsAmount ?? 0) / 1000).toFixed(0) + 'k' : 'open invoices'} right now and invoicing lags the job by ${(a.invoiceDelayDays ?? 0)} days.`
        : `Invoicing lags the job by ${(a.invoiceDelayDays ?? 0)} days — automated reminders pull cash in faster.`,
    roi: (a) => ({
      hoursPerWeek: 2,
      dollarsPerMonth: Math.max(1500, ((a.chasingPaymentsAmount ?? 0) || 5000) / 4),
      summary: `Save 2 hrs/week on AR chasing + pull invoice payments 10 days faster ≈ $${Math.round(Math.max(1500, ((a.chasingPaymentsAmount ?? 0) || 5000) / 4) / 100) / 10}k/mo cash flow`,
    }),
    diyGuide: {
      tools: ['QuickBooks Online'],
      steps: [
        'QBO → Settings → Account and Settings → Sales → Reminders',
        'Enable reminder emails at 3 days before due, on due date, 3 days overdue, 14 days overdue',
        'Customize the 14-day message — firm but polite',
        'Turn on "Automatically apply late fees" (1.5%/mo is standard)',
        'Bonus: connect Stripe or GoCardless for one-click payment',
      ],
    },
    cta: null,
    triggers: (a) => a.accountingTool === 'quickbooks',
    priority: (a) => 35 + (a.chasingPayments ? 25 : 0) + Math.min((a.invoiceDelayDays ?? 0), 20),
  },

  {
    id: 't1-chatgpt-quotes',
    tier: 1,
    category: 'quoting',
    title: 'ChatGPT proposal template',
    pitch: 'Feed ChatGPT your numbers and get a polished 3-page proposal in 5 minutes.',
    effort: 'Easy',
    setupHours: '1 hr to build template, then 5 min/quote',
    cost: 'Free (ChatGPT free tier) or $20/mo (Plus)',
    fixes: (a) =>
      `You said quotes take ${(a.quotingSpeedDays ?? 0)}${(a.quotingSpeedDays ?? 0) === 1 ? ' day' : ' days'} and you do them ${a.quotingTool === 'excel' ? 'in Excel' : a.quotingTool === 'pen-paper' ? 'by hand' : 'manually'} — that's the single biggest thing to offload.`,
    roi: (a) => ({
      hoursPerWeek: 6,
      dollarsPerMonth: closeRateLiftDollars(a, 0.05),
      summary: `Cut quoting from ~2 hrs to 20 min per quote. Faster quotes = ~5pp close rate lift ≈ $${(closeRateLiftDollars(a, 0.05) / 1000).toFixed(1)}k/mo`,
    }),
    diyGuide: {
      tools: ['ChatGPT (free tier fine)', 'Google Docs'],
      steps: [
        'Build a "master prompt" that includes: your business name, warranty terms, payment schedule, exclusions, example language from past quotes',
        'Save it as a Google Doc you paste into ChatGPT every time',
        'After site visit → dictate your line items and pricing into ChatGPT with the master prompt → it outputs a polished proposal → you review and send',
        'Cuts a 2-hour task to 20 minutes. The AI never forgets your warranty terms.',
      ],
    },
    cta: null,
    triggers: (a) => a.quotingTool !== 'jobber' && a.quotingTool !== 'buildertrend' && a.quotingTool !== 'procore',
    priority: (a) => 45 + Math.min((a.quotingSpeedDays ?? 0) * 3, 30) + (a.wantedTimeBack.includes('quoting') ? 15 : 0),
  },

  {
    id: 't1-gbp-optimize',
    tier: 1,
    category: 'marketing',
    title: 'Google Business Profile full optimization',
    pitch: 'Fill every field, add 20 photos, post weekly. Free Google real estate most contractors ignore.',
    effort: 'Easy',
    setupHours: '2 hrs',
    cost: 'Free',
    fixes: () =>
      'Most contractors have a half-filled Google Business Profile. Every unfilled field is a ranking penalty.',
    roi: () => ({
      dollarsPerMonth: 3000,
      summary: 'Complete profiles rank higher in Maps. Typical contractor sees +25% calls from GBP within 30 days ≈ $3k/mo',
    }),
    diyGuide: {
      tools: ['Google Business Profile'],
      steps: [
        'Fill every field: services, service areas, hours, attributes, appointment URL',
        'Upload 20+ photos: exterior shots of completed jobs, team photos, before/afters',
        'Turn on Messaging and respond within 2 hours',
        'Post weekly: job photos, seasonal offers, quick tips',
        'Respond to every review (even old ones) — Google sees engagement',
      ],
    },
    cta: null,
    triggers: () => true,
    priority: (a) => 25 + (a.leadSources.includes('google') ? 15 : 0),
  },

  {
    id: 't1-followup-templates',
    tier: 1,
    category: 'quoting',
    title: 'Quote follow-up email sequence (3 emails)',
    pitch: 'Never lose a deal to silence. 3 emails at 2, 5, and 10 days.',
    effort: 'Easy',
    setupHours: '45 min',
    cost: 'Free',
    fixes: (a) =>
      a.quoteFollowUp === 'never'
        ? "You said you don't follow up on quiet quotes — industry stats say that's 30% of losable deals."
        : 'You said you follow up "sometimes" — systematizing it recovers jobs you\'re already paid to have won.',
    roi: (a) => ({
      dollarsPerMonth: closeRateLiftDollars(a, 0.08),
      summary: `Systematic follow-up = ~8pp close rate lift ≈ $${(closeRateLiftDollars(a, 0.08) / 1000).toFixed(1)}k/mo`,
    }),
    diyGuide: {
      tools: ['Gmail templates or QuickBooks invoice comments'],
      steps: [
        'Email 1 (day 2): "Just checking you received the quote — any questions?"',
        'Email 2 (day 5): "Wanted to flag: I can hold these prices until [date]. After that, material costs might push it."',
        'Email 3 (day 10): "Still interested? If timing shifted, no problem — let me know and I\'ll put you in the Q[next] schedule."',
        'Set Gmail template + calendar reminder per quote sent',
      ],
    },
    cta: null,
    triggers: (a) => a.quoteFollowUp !== 'systematic',
    priority: (a) => 35 + (a.quoteFollowUp === 'never' ? 15 : 0),
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — MEDIUM LIFTS (We set up)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 't2-jobber-setup',
    tier: 2,
    category: 'jobs',
    title: 'Jobber setup + spreadsheet migration',
    pitch: 'Scheduling, quoting, invoicing, and crew dispatch in one app — migrated from your spreadsheets.',
    effort: 'Medium',
    setupHours: '12–16 hrs (us) + 2 hrs training',
    cost: '$1,500 setup + Jobber: $99–$249/mo',
    fixes: (a) =>
      `You're running ${a.jobMgmtTool === 'group-text' ? 'crew dispatch on group texts' : a.jobMgmtTool === 'whiteboard' ? 'the schedule on a whiteboard' : 'everything manually'} and ${a.quotingTool === 'excel' ? 'quotes in Excel' : 'quotes by hand'}. Jobber replaces 4 tools with one.`,
    roi: () => ({
      hoursPerWeek: 5,
      dollarsPerMonth: 5000,
      summary: 'Save 5 hrs/week across quoting, scheduling, invoicing ≈ $5k/mo in reclaimed production time',
    }),
    whatYouGet: [
      'Full Jobber configuration with your services, pricing, tax settings',
      'Migration of last 6 months of active jobs from spreadsheets',
      'Crew member accounts + mobile app training',
      'QBO integration so invoices sync automatically',
      '2-hour live training session for you + office',
    ],
    cta: 'calendly-scope',
    triggers: (a) => (a.crewSize ?? 1) >= 2 && (['group-text', 'whiteboard', 'none'].includes(a.jobMgmtTool)),
    priority: (a) => 50 + Math.min((a.crewSize ?? 1) * 2, 20) + (a.wantedTimeBack.includes('scheduling') ? 10 : 0),
  },

  {
    id: 't2-review-automation',
    tier: 2,
    category: 'marketing',
    title: 'NiceJob review automation',
    pitch: 'Every finished job triggers a review request sequence on autopilot.',
    effort: 'Medium',
    setupHours: '4–6 hrs',
    cost: '$1,200 setup + NiceJob: $99/mo',
    fixes: (a) =>
      `You have ${a.googleReviewCount} reviews but don't ask systematically — the gap between your reputation and your Google presence is where leads get lost.`,
    roi: () => ({
      dollarsPerMonth: 4200,
      summary: 'Grow reviews from current → 80+ in 12 months. Estimated 15% lift in Google Maps leads ≈ $4.2k/mo',
    }),
    whatYouGet: [
      'NiceJob configured and integrated with Jobber or QBO',
      '3-email review request sequence, written in your voice',
      'Branded review landing page',
      'Auto-reply templates for 5-star and <5-star reviews',
      'Monthly review-performance email for the first 3 months',
    ],
    cta: 'calendly-scope',
    triggers: (a) => (a.googleReviewCount ?? 0) < 100 && a.crewSize >= 1,
    priority: (a) => 40 + Math.max(0, (60 - a.googleReviewCount) / 2) + (a.asksForReviews ? 0 : 10),
  },

  {
    id: 't2-website-refresh',
    tier: 2,
    category: 'marketing',
    title: 'Website refresh + Google Business Profile optimization',
    pitch: 'Modernize your website and tighten your Google presence — in 2 weeks.',
    effort: 'Medium',
    setupHours: '20–30 hrs',
    cost: '$2,500',
    fixes: (a) =>
      !a.hasWebsite
        ? "You don't have a website — you're invisible to anyone who Googles you before calling."
        : `Your site is ${(a.websiteAgeYears ?? 0)} years old — design and SEO standards have moved since.`,
    roi: () => ({
      dollarsPerMonth: 6000,
      summary: '40% more inbound leads from Google within 60 days ≈ $6k/mo',
    }),
    whatYouGet: [
      'Refreshed homepage, services, portfolio, and contact pages',
      'Mobile-first design (most of your traffic is phones)',
      'Google Business Profile fully optimized',
      'Local SEO: city + neighborhood landing pages for your service area',
      'Basic analytics dashboard',
    ],
    cta: 'calendly-scope',
    triggers: (a) => !a.hasWebsite || (a.websiteAgeYears ?? 0) >= 2,
    priority: (a) => 45 + ((a.websiteAgeYears ?? 0) >= 3 ? 15 : 0) + (!a.hasWebsite ? 25 : 0),
  },

  {
    id: 't2-lead-routing',
    tier: 2,
    category: 'intake',
    title: 'Instant lead-alert automation',
    pitch: 'Every web form, missed call, and Facebook lead rings your phone within 60 seconds.',
    effort: 'Medium',
    setupHours: '4–8 hrs',
    cost: '$800 setup + $20/mo for Zapier',
    fixes: (a) =>
      `You said you get back to new leads in "${a.leadResponseTime}" — industry data says that's ${a.leadResponseTime === 'days' ? '500%' : '200%'} slower than the average winner.`,
    roi: (a) => ({
      dollarsPerMonth: closeRateLiftDollars(a, 0.1),
      summary: `2x faster lead response → ~10pp close rate lift ≈ $${(closeRateLiftDollars(a, 0.1) / 1000).toFixed(1)}k/mo`,
    }),
    whatYouGet: [
      'Zapier workflow: web form → SMS to you → email to office → Google Sheet log',
      'Facebook Lead Ads integration (even if you run ads later)',
      'OpenPhone or Google Voice routing for the missed-call piece',
      'Weekly report showing lead source performance',
    ],
    cta: 'calendly-scope',
    triggers: (a) => a.leadResponseTime === 'next-day' || a.leadResponseTime === 'days',
    priority: (a) => 40 + (a.leadResponseTime === 'days' ? 20 : 10),
  },

  {
    id: 't2-lsa-ads',
    tier: 2,
    category: 'marketing',
    title: 'Google Local Services Ads setup',
    pitch: "Pay-per-lead ads at the top of Google — Google guarantees they're real.",
    effort: 'Medium',
    setupHours: '8 hrs setup + ongoing management',
    cost: '$1,500 setup + $400–$1,200/mo ad spend',
    fixes: (a) =>
      a.softwareThatFlopped.some((s) => s.toLowerCase().includes('facebook') || s.toLowerCase().includes('ad'))
        ? "You tried ads before and they flopped. LSA is different — you pay for leads, not clicks, and Google screens them."
        : 'Pay-per-lead ads at the top of Google — you only pay when a qualified lead calls.',
    roi: () => ({
      dollarsPerMonth: 8000,
      summary: 'Typical contractor sees 8–12 qualified LSA leads/mo at $60–$80/lead ≈ $8k/mo in closed revenue',
    }),
    whatYouGet: [
      'Full Google Screened certification process (insurance, background check)',
      'Service area, services, and budget configured',
      'Ad copy and photo optimization',
      '30-day launch period with weekly adjustments',
      'Dispute-bad-leads process documented',
    ],
    cta: 'calendly-scope',
    triggers: (a) => !a.runsAds.includes('lsa') && a.segment !== 'commercial',
    priority: (a) => 35 + ((a.leadsPerMonth ?? 0) < 20 ? 15 : 0),
  },

  {
    id: 't2-conversational-texting',
    tier: 2,
    category: 'intake',
    title: 'Conversational texting platform (Podium/OpenPhone)',
    pitch: 'Two-way SMS with your whole team on one number, web-to-text, and review requests built in.',
    effort: 'Medium',
    setupHours: '3–5 hrs',
    cost: '$600 setup + $79–$189/mo',
    fixes: (a) =>
      'You mostly communicate with customers by text already — a real platform logs it, routes it to the right person, and triggers reviews automatically.',
    roi: () => ({
      hoursPerWeek: 3,
      dollarsPerMonth: 2500,
      summary: '3 hrs/week back on message triage + 25% faster response = ~$2.5k/mo in won jobs',
    }),
    whatYouGet: [
      'Podium or OpenPhone account set up with your business number',
      'Web-to-text widget on your homepage',
      'Auto-replies for after-hours',
      'Team routing: calls to office, texts to whoever is covering',
      'Integration with Google reviews',
    ],
    cta: 'calendly-scope',
    triggers: (a) => (a.crewSize ?? 1) >= 2 && a.afterHoursHandling === 'voicemail',
    priority: () => 35,
  },

  {
    id: 't2-housecall-pro',
    tier: 2,
    category: 'jobs',
    title: 'Housecall Pro setup for solo trades',
    pitch: 'Scheduling, invoicing, dispatch, customer texting — one app built for one-person trades businesses.',
    effort: 'Medium',
    setupHours: '6–8 hrs + 1 hr training',
    cost: '$900 setup + $79–$199/mo',
    fixes: (a) =>
      (a.crewSize ?? 1) === 1
        ? "You're the owner, dispatcher, tech, and bookkeeper. Housecall Pro takes 3 of those jobs and automates them."
        : 'Built for service trades — better fit than Jobber for HVAC/plumbing/electrical.',
    roi: () => ({
      hoursPerWeek: 5,
      dollarsPerMonth: 3500,
      summary: '5 hrs/week back on scheduling + invoicing + auto-text reminders cut no-shows by 40% ≈ $3.5k/mo',
    }),
    whatYouGet: [
      'Full Housecall Pro setup with your services and pricing',
      'Customer database imported from QBO or spreadsheet',
      'Auto-text reminders before jobs',
      'Digital invoicing with on-the-spot payment',
      '1-hour live training',
    ],
    cta: 'calendly-scope',
    triggers: (a) => a.tradeCategory === 'trades' && (a.crewSize ?? 1) <= 3,
    priority: (a) => 45 + ((a.crewSize ?? 1) === 1 ? 15 : 0),
  },

  {
    id: 't2-maintenance-plan-launch',
    tier: 2,
    category: 'marketing',
    title: 'Maintenance plan launch (recurring revenue)',
    pitch: 'Sign customers up for annual tune-ups = predictable income through the slow season.',
    effort: 'Medium',
    setupHours: '10 hrs',
    cost: '$1,400 setup',
    fixes: (a) =>
      a.keepsUpAtNight.some((s) => s.includes('slow-season') || s.includes('cash-flow'))
        ? "You said slow-season cash flow keeps you up at night. A maintenance plan base smooths that out — $100/mo × 100 customers = $10k/mo you can count on."
        : 'Customers love it (set-and-forget), you love it (recurring revenue), banks love it (predictable income).',
    roi: (a) => ({
      dollarsPerMonth: 7500,
      summary: 'Typical trades contractor hits 100 plan members in year 1 at $75–$150/mo ≈ $7.5k/mo recurring',
    }),
    whatYouGet: [
      'Pricing structure for basic/premium/deluxe tiers',
      'One-page brochure for in-home sign-ups',
      'QuickBooks recurring invoice setup',
      'Email launch campaign to existing customer base',
      'Script + objection handling for pitching at the end of service calls',
    ],
    cta: 'calendly-scope',
    triggers: (a) => a.tradeCategory === 'trades' || a.tradeCategory === 'specialty',
    priority: (a) => 40 + (a.keepsUpAtNight.some((s) => s.includes('cash') || s.includes('slow')) ? 15 : 0),
  },

  {
    id: 't2-estimator-training',
    tier: 2,
    category: 'quoting',
    title: 'STACK or PlanSwift estimator training',
    pitch: 'Proper takeoff software cuts estimating from days to hours — we train you on yours.',
    effort: 'Medium',
    setupHours: '16 hrs over 2 weeks',
    cost: '$2,000 + software license',
    fixes: (a) =>
      `You're doing takeoffs ${a.quotingTool === 'pen-paper' ? 'by hand' : 'in Excel'} on $${((a.avgTicket ?? 0) / 1000).toFixed(0)}k+ jobs — takeoff software pays for itself in the first month.`,
    roi: () => ({
      hoursPerWeek: 8,
      dollarsPerMonth: 5000,
      summary: '~8 hrs/week back on takeoffs + faster bids win more work ≈ $5k/mo',
    }),
    whatYouGet: [
      'STACK or PlanSwift license setup with your assemblies',
      '4x 2-hour training sessions with real project takeoffs',
      'Template library: 20 common assembly types for your trade',
      'Ongoing Slack support for 60 days',
    ],
    cta: 'calendly-scope',
    triggers: (a) =>
      (a.avgTicket ?? 0) >= 30000 &&
      (a.quotingTool === 'excel' || a.quotingTool === 'pen-paper'),
    priority: (a) => 30 + Math.min(((a.avgTicket ?? 0) - 30000) / 5000, 30),
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — BIG BUILDS (Custom)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 't3-ai-voice-agent',
    tier: 3,
    category: 'intake',
    title: 'AI voice agent — 24/7 intake, qualifies leads, books site visits',
    pitch: 'Never miss another call. Our AI picks up, talks like a human, qualifies the job, and puts it on your calendar.',
    effort: 'Big',
    setupHours: '40–60 hrs',
    cost: '$6,500 build + $200/mo',
    priceAnchor: 'Typical agency build: $18k–$25k · Us: $6,500 · Pays back in 2 months',
    fixes: (a) =>
      (a.leadsLostAfterHoursPerMonth ?? 0) > 0
        ? `You said ${(a.leadsLostAfterHoursPerMonth ?? 0)} leads/mo go to voicemail. This is your after-hours insurance policy AND your front desk.`
        : 'The AI is both your after-hours safety net and a full-time intake person — without the $50k salary.',
    roi: (a) => ({
      hoursPerWeek: (a.crewSize ?? 1) > 1 ? 8 : 5,
      dollarsPerMonth: missedLeadDollars(a) + 4000,
      summary: `Recover all after-hours leads + offload ${(a.crewSize ?? 1) > 1 ? 8 : 5} hrs/week of phone intake ≈ $${Math.round((missedLeadDollars(a) + 4000) / 1000)}k/mo + $${Math.round(missedLeadDollars(a) * 12 / 1000)}k/yr from missed-lead recovery`,
    }),
    whatYouGet: [
      "Custom AI agent trained on your services, service area, pricing tiers",
      'Qualifies: project type, timeline, budget, decision-maker, address',
      'Books site visits directly into your Google Calendar',
      'Texts you the lead summary + books follow-up if after-hours',
      '1-800 number + local forwarding',
      'Monthly tuning for the first 6 months',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => a.afterHoursHandling === 'voicemail' || (a.leadsLostAfterHoursPerMonth ?? 0) > 0 || a.primaryIntake === 'owner',
    priority: (a) => 60 + Math.min((a.leadsLostAfterHoursPerMonth ?? 0) * 8, 30),
  },

  {
    id: 't3-ai-estimator',
    tier: 3,
    category: 'quoting',
    title: 'Custom AI estimator trained on your pricing',
    pitch: 'Upload site photos + scope notes → AI generates a quote in your pricing in 10 minutes.',
    effort: 'Big',
    setupHours: '80–120 hrs',
    cost: '$12,000 one-time',
    priceAnchor: 'Typical agency build: $30k–$50k · Us: $12,000 · Pays back in 4 months',
    fixes: (a) =>
      `Quoting takes you ${(a.quotingSpeedDays ?? 0)} days currently. This is the answer — not a tool, YOUR tool, trained on how you actually price.`,
    roi: (a) => ({
      hoursPerWeek: 8,
      dollarsPerMonth: closeRateLiftDollars(a, 0.1),
      summary: `Cut quoting from ${(a.quotingSpeedDays ?? 0)}d → 10 min. Faster quotes win more jobs ≈ $${(closeRateLiftDollars(a, 0.1) / 1000).toFixed(1)}k/mo uplift + 8 hrs/week back`,
    }),
    whatYouGet: [
      'Web app where you upload photos + dictate scope',
      'AI pre-fills line items using your past quotes as training data',
      'You review, adjust, and send — never start from a blank page again',
      'PDF proposal output branded as your business',
      'Integrates with Jobber/QBO for seamless handoff',
      '6 months of free tuning as your pricing evolves',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.quotingSpeedDays ?? 0) >= 2 && (a.avgTicket ?? 0) >= 5000,
    priority: (a) => 45 + Math.min((a.quotingSpeedDays ?? 0) * 4, 20) + (a.wantedTimeBack.includes('quoting') ? 15 : 0),
  },

  {
    id: 't3-client-portal',
    tier: 3,
    category: 'jobs',
    title: 'Custom client portal: schedules, change orders, punch lists',
    pitch: "Every client gets a login where they see exactly what's happening — no more 20 texts/day mid-job.",
    effort: 'Big',
    setupHours: '100–140 hrs',
    cost: '$15,000 one-time',
    priceAnchor: 'Typical agency build: $40k+ · Us: $15,000 · Pays back in 6 months',
    fixes: () =>
      'Clients drown you in "is the tile in yet?" texts. A portal replaces those with a live dashboard they actually use.',
    roi: () => ({
      hoursPerWeek: 6,
      dollarsPerMonth: 5500,
      summary: 'Cut client calls/texts by 60%. Faster change-order approvals ≈ $5.5k/mo + 6 hrs/week back',
    }),
    whatYouGet: [
      'Branded client portal at portal.yoursite.com',
      'Live schedule: milestones, dependencies, photos from crew',
      'Change order approvals with digital signature',
      'Punch list: clients can flag items, you close them',
      'Photo gallery per project (marketing asset!)',
      'Payment portal integrated with QBO',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.crewSize ?? 1) >= 4 && a.segment !== 'commercial',
    priority: (a) => 35 + (a.clientCommsStyle === 'reactive' ? 20 : 0),
  },

  {
    id: 't3-website-funnel',
    tier: 3,
    category: 'marketing',
    title: 'Full website rebuild + lead funnel + SEO engine',
    pitch: 'Not a website — a lead machine. We design, build, optimize, and run it for 12 months.',
    effort: 'Big',
    setupHours: '60–80 hrs',
    cost: '$8,500 build + $500/mo management',
    priceAnchor: 'Typical agency: $20k+ build / $1,500+ monthly · Us: $8,500 / $500',
    fixes: (a) =>
      !a.hasWebsite
        ? "No website = invisible on Google. This fixes that in 60 days."
        : `Your current site is ${(a.websiteAgeYears ?? 0)} years old and doesn't show up for "${a.trade.toLowerCase().split(' ')[0]} ${a.location.split(',')[0]}." This makes it rank in 60 days.`,
    roi: () => ({
      dollarsPerMonth: 15000,
      summary: 'From near-zero organic leads to 8–12/mo within 6 months ≈ $15k/mo',
    }),
    whatYouGet: [
      'Full rebuild on Next.js (same stack as this report)',
      'Service pages for each city you serve',
      'Portfolio with video walkthroughs (we shoot them)',
      'Blog engine + 2 SEO posts/mo for 12 months',
      'Review wall pulling live from Google',
      'Form → SMS alert → auto-reply pipeline',
      'Monthly SEO performance report',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => !a.hasWebsite || (a.websiteAgeYears ?? 0) >= 3,
    priority: (a) => 40 + ((a.websiteAgeYears ?? 0) >= 5 ? 20 : 0) + (!a.hasWebsite ? 25 : 0),
  },

  {
    id: 't3-full-ops',
    tier: 3,
    category: 'ops',
    title: 'End-to-end ops system — website → CRM → quoting → jobs → invoicing',
    pitch: 'The "if money were no object" version. Everything in one platform, built for your business specifically.',
    effort: 'Big',
    setupHours: '200–300 hrs',
    cost: '$22,000 build + $800/mo',
    priceAnchor: 'Typical agency/enterprise build: $60k–$120k · Us: $22,000 · Pays back in 8 months',
    fixes: (a) =>
      `At ${a.crewSize} people, you're already operating at the scale where an off-the-shelf tool stack starts breaking down. This is the custom build.`,
    roi: (a) => ({
      hoursPerWeek: 20,
      dollarsPerMonth: 22000,
      summary: `Replaces spreadsheets, reduces admin to 1 hr/day, unifies everything ≈ $22k/mo + 20 hrs/week across the team`,
    }),
    whatYouGet: [
      'Custom website + CRM + estimator + job portal + invoicing, all unified',
      'AI voice agent for intake',
      'QBO stays as accounting system of record',
      'Role-based logins for office, crew leads, subs',
      'iOS + Android mobile apps (white-labeled)',
      'Dashboard showing leads, jobs, AR, margin — live',
      '12 months of free iteration',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.crewSize ?? 1) >= 8,
    priority: (a) => 30 + Math.min((a.crewSize ?? 1), 30),
  },

  {
    id: 't3-construction-crm',
    tier: 3,
    category: 'ops',
    title: 'Construction-specific CRM (pipeline + follow-up automation)',
    pitch: 'A CRM that actually knows what a site visit, a change order, and a draw schedule are.',
    effort: 'Big',
    setupHours: '60–80 hrs',
    cost: '$9,500 build + $250/mo',
    priceAnchor: 'Typical custom CRM: $25k+ · Us: $9,500 · Pays back in 4 months',
    fixes: (a) =>
      `You're tracking leads in ${a.quotingTool === 'excel' ? 'Excel' : 'your head'} — a proper pipeline view tells you which deals need attention today.`,
    roi: (a) => ({
      hoursPerWeek: 4,
      dollarsPerMonth: closeRateLiftDollars(a, 0.07),
      summary: `Nothing falls through cracks anymore. ~7pp close rate lift ≈ $${(closeRateLiftDollars(a, 0.07) / 1000).toFixed(1)}k/mo + 4 hrs/week back`,
    }),
    whatYouGet: [
      'Pipeline view: Lead → Site Visit → Quote Sent → Negotiating → Won/Lost',
      'Auto-follow-up emails at every stage',
      'Quote tracking: see who opened it, who didn\'t',
      'Revenue forecast by close probability',
      'Tagging for trade/neighborhood/referral source',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.officeSize ?? 0) >= 1 || (a.crewSize ?? 1) >= 3,
    priority: (a) => 30 + ((a.leadsPerMonth ?? 0) >= 15 ? 10 : 0),
  },

  {
    id: 't3-ai-bookkeeper',
    tier: 3,
    category: 'office',
    title: 'AI bookkeeper — auto-categorize receipts, match transactions',
    pitch: 'Photograph a receipt, get it booked, reconciled, and coded to the right job. No human in the loop.',
    effort: 'Big',
    setupHours: '60 hrs',
    cost: '$7,500 build + $150/mo',
    priceAnchor: 'Typical bookkeeper: $800–$1,500/mo · This AI: $150/mo · Payback: 1 month',
    fixes: (a) =>
      (a.officeSize ?? 0) <= 1
        ? "You're doing the books between everything else — this takes it off your plate without the cost of a bookkeeper."
        : 'Office staff spend half their week on receipt-chasing and reconciliation. This kills that forever.',
    roi: () => ({
      hoursPerWeek: 8,
      dollarsPerMonth: 2500,
      summary: '8 hrs/week saved on bookkeeping + never lose a receipt ≈ $2.5k/mo in tax deductions + time',
    }),
    whatYouGet: [
      'Mobile app: snap a receipt, it posts to QBO with job coded',
      'Bank transaction auto-matching trained on your patterns',
      'Monthly P&L by job delivered automatically',
      'Tax-deductible expense highlight',
      'Integration with QBO, Xero, or spreadsheet',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => a.accountingTool === 'quickbooks' || a.accountingTool === 'xero' || a.accountingTool === 'spreadsheet',
    priority: (a) => 25 + ((a.officeSize ?? 0) <= 1 ? 15 : 0),
  },

  {
    id: 't3-solo-ops-app',
    tier: 3,
    category: 'ops',
    title: 'Custom solo-operator ops app (iOS/Android)',
    pitch: "One app, built for you: book jobs, quote on-site, invoice, track parts, get paid. Never open 4 apps again.",
    effort: 'Big',
    setupHours: '80–120 hrs',
    cost: '$11,000 build + $250/mo',
    priceAnchor: 'Typical custom app: $40k+ · Us: $11,000 · Pays back in 8 months',
    fixes: (a) =>
      (a.crewSize ?? 1) === 1
        ? "As a solo operator, every minute in an app-switching tax compounds. One unified tool removes that."
        : 'Built for small teams where everyone does a bit of everything — one place for scheduling, quoting, invoicing, and field notes.',
    roi: () => ({
      hoursPerWeek: 7,
      dollarsPerMonth: 5000,
      summary: '7 hrs/week back + faster quote-to-paid cycle ≈ $5k/mo',
    }),
    whatYouGet: [
      'iOS + Android app branded as your business',
      'On-site quoting with photo attachments',
      'Digital invoicing with Stripe/Square integration',
      'Parts inventory linked to invoices',
      'Customer database that persists across jobs',
      'Simple P&L dashboard',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.crewSize ?? 1) <= 3 && a.tradeCategory === 'trades',
    priority: (a) => 35 + ((a.crewSize ?? 1) === 1 ? 15 : 0),
  },

  {
    id: 't3-ai-booking-agent-solo',
    tier: 3,
    category: 'intake',
    title: 'AI booking + dispatch agent (solo specialty)',
    pitch: "An AI agent that picks up every call, qualifies, and slots the job into your calendar based on travel time from your current job.",
    effort: 'Big',
    setupHours: '30–40 hrs',
    cost: '$4,500 build + $150/mo',
    priceAnchor: 'Typical dispatcher salary: $48k/yr · This AI: $1,800/yr · Payback: 1 month',
    fixes: (a) =>
      "Every call you take on a ladder is a job you're doing poorly. An AI agent handles the calls, books the slot, and texts you the summary.",
    roi: () => ({
      hoursPerWeek: 10,
      dollarsPerMonth: 7000,
      summary: '10 hrs/week back + never miss a call = typical +$7k/mo from recovered opportunities',
    }),
    whatYouGet: [
      'Custom AI trained on your services + service area',
      'Books directly into your Google Calendar (drive-time aware)',
      'Texts you a summary of every call',
      'Forwards callbacks requested outside your hours',
      'Monthly tuning for the first 6 months',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.crewSize ?? 1) <= 3 && (a.afterHoursHandling === 'voicemail' || a.primaryIntake === 'owner'),
    priority: (a) => 50 + ((a.crewSize ?? 1) === 1 ? 15 : 0) + Math.min(a.leadsLostAfterHoursPerMonth * 3, 15),
  },

  {
    id: 't3-lead-qualifier-ai',
    tier: 3,
    category: 'intake',
    title: 'AI lead qualification + triage',
    pitch: 'Filters tire-kickers before they hit your calendar. Only real buyers get through.',
    effort: 'Big',
    setupHours: '40 hrs',
    cost: '$5,500 + $100/mo',
    priceAnchor: 'Typical value vs. a full-time SDR: $60k/yr salary replaced',
    fixes: (a) =>
      `You're getting ${(a.leadsPerMonth ?? 0)} leads/mo at a ${Math.round((a.closeRate ?? 0) * 100)}% close rate. Half your quoting time is going to jobs that were never going to book.`,
    roi: (a) => ({
      hoursPerWeek: 6,
      dollarsPerMonth: closeRateLiftDollars(a, 0.15),
      summary: `Stop wasting 6 hrs/week on tire-kickers. Effective close rate +15pp on REAL leads ≈ $${(closeRateLiftDollars(a, 0.15) / 1000).toFixed(1)}k/mo`,
    }),
    whatYouGet: [
      'AI scores every inbound lead: budget, timeline, fit, motivation',
      'Only Score-A leads ring your phone — the rest get a polite deflection',
      'Monthly lead-source quality report (which channel sends real buyers?)',
      'Weekly re-training on deals you won vs. lost',
    ],
    cta: 'calendly-strategy',
    triggers: (a) => (a.leadsPerMonth ?? 0) >= 15 && (a.closeRate ?? 0) < 0.3,
    priority: (a) => 30 + ((a.closeRate ?? 0) < 0.2 ? 15 : 0) + Math.min((a.leadsPerMonth ?? 0) / 2, 15),
  },
]
