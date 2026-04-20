// Sample report data for Miller Remodeling — hardcoded demo persona
// This is the schema the recommendation engine will eventually populate.

export type Tier = 1 | 2 | 3
export type Effort = 'Easy' | 'Medium' | 'Big'

export interface Recommendation {
  id: string
  tier: Tier
  title: string
  pitch: string // one-line hook
  fixes: string // verbatim quote-back of their pain
  effort: Effort
  setupHours: string // "30 min" / "8–12 hrs" / "60–100 hrs"
  cost: string // "Free" / "$1,200 setup + $99/mo" / "$6,500"
  priceAnchor?: string // only on Tier 3: "Typical agency: $18k+"
  roi: {
    hoursPerWeek?: number
    dollarsPerMonth?: number
    summary: string // "Recover 3 after-hours leads/mo ≈ $9k/mo"
  }
  whatYouGet?: string[] // for T2/T3: scope list
  diyGuide?: {
    tools: string[] // tools they'll use
    steps: string[] // step-by-step
  }
  cta?: 'calendly-scope' | 'calendly-strategy' | null
}

export interface ReportData {
  id: string
  ownerName: string
  ownerFirstName: string
  company: string
  trade: string
  crewSize: string
  location: string
  yearsInBusiness: number
  // Headline numbers
  hoursPerWeekRecoverable: number
  dollarsPerMonthRecoverable: string // "$12k–$18k"
  // Summary
  whatWeHeard: string
  doingRight: string[] // 2-3 bullets, also upsell angle
  // Recs
  recommendations: Recommendation[]
  // Starting point — top 3 rec IDs ranked by ROI/effort
  topThreeIds: string[]
  // Social proof
  logos?: string[]
  reviews?: { quote: string; author: string; role: string }[]
}

export const millerReport: ReportData = {
  id: 'sample-miller-remodeling',
  ownerName: 'Dan Miller',
  ownerFirstName: 'Dan',
  company: 'Miller Remodeling',
  trade: 'Residential renovations — kitchens, basements, additions',
  crewSize: '8-person crew',
  location: 'Nanaimo, BC (mid-Island)',
  yearsInBusiness: 12,
  hoursPerWeekRecoverable: 14,
  dollarsPerMonthRecoverable: '$12k–$18k',
  whatWeHeard:
    "Dan runs a tight 8-person residential remodeling crew on Vancouver Island with 12 years of reputation built on referrals. The work is quality — the bottleneck is everywhere around the work. Quotes take 3–5 days out of Excel, after-hours calls hit voicemail and 3 leads slip through the cracks each month, and invoicing lags the job by two weeks because Jenny is doing it between everything else. Dan said it straight: 'If you gave me 5 hours a week back, I'd stop quoting.'",
  doingRight: [
    '60% of your work comes from referrals — your reputation is the asset competitors can\'t copy. Let\'s build systems around it.',
    'You\'re already on QuickBooks Online, which means most of the invoicing and AR automations on this report are switches you flip, not software you buy.',
    '14 Google reviews at 4.9★ with zero active asking — imagine this number at 60+ with a 2-minute automation.',
  ],
  recommendations: [
    // ============ TIER 1 — QUICK WINS (DIY) ============
    {
      id: 't1-missed-call-textback',
      tier: 1,
      title: 'Missed-call auto text-back',
      pitch: 'Every voicemail gets an instant SMS reply so after-hours leads don\'t slip away.',
      fixes: 'You said 3 leads/month slip through weekend voicemails — that\'s $108k/year at your ticket size.',
      effort: 'Easy',
      setupHours: '30 min',
      cost: 'Free (Google Voice) or $15/mo (OpenPhone)',
      roi: {
        hoursPerWeek: 0,
        dollarsPerMonth: 9000,
        summary: 'Recover 3 after-hours leads/mo ≈ $9k/mo at your 20% close rate and $15k ticket',
      },
      diyGuide: {
        tools: ['Google Voice (free) OR OpenPhone 7-day trial'],
        steps: [
          'Sign up for Google Voice with your business number forwarded',
          'Enable "Send automatic reply to missed calls" in settings',
          'Paste this template: "Hey — this is Dan at Miller Remodeling. Caught your call but can\'t pick up. Shoot me a text back with what you\'re thinking and I\'ll get back to you within an hour. — Dan"',
          'Test it: call yourself from another phone and confirm the reply arrives',
        ],
      },
      cta: null,
    },
    {
      id: 't1-gbp-review-link',
      tier: 1,
      title: 'Google review request link + invoice QR code',
      pitch: 'One-click review link on every invoice and job-done email.',
      fixes: 'You have 14 reviews at 4.9★ but don\'t actively ask — your competitors have 60+ and they\'re less qualified.',
      effort: 'Easy',
      setupHours: '45 min',
      cost: 'Free',
      roi: {
        hoursPerWeek: 0,
        dollarsPerMonth: 3500,
        summary: 'Triple your reviews in 6 months → more calls from Google Maps ≈ $3.5k/mo uplift',
      },
      diyGuide: {
        tools: ['Google Business Profile', 'QR code generator (qr-code-generator.com)'],
        steps: [
          'Go to your Google Business Profile → click "Ask for reviews"',
          'Copy the short g.page/r/... link Google gives you',
          'Generate a QR code with that link',
          'Add both the link and QR to your QuickBooks invoice template footer',
          'Add one line: "Liked our work? A 30-second review means the world to us."',
        ],
      },
      cta: null,
    },
    {
      id: 't1-calendly-sitevisit',
      tier: 1,
      title: 'Calendly for site-visit booking',
      pitch: 'Stop playing phone tag to schedule walkthroughs.',
      fixes: 'You said site-visit scheduling eats 3 hrs/week in back-and-forth — Jenny\'s time is the bottleneck.',
      effort: 'Easy',
      setupHours: '20 min',
      cost: 'Free (Calendly free tier)',
      roi: {
        hoursPerWeek: 3,
        summary: 'Save ~3 hrs/week of scheduling back-and-forth for Jenny',
      },
      diyGuide: {
        tools: ['Calendly (free tier)', 'Google Calendar'],
        steps: [
          'Sign up at calendly.com with your Google account',
          'Create an event type: "Site visit — Miller Remodeling" — 60 min, Mon/Wed/Fri 9am–3pm only',
          'Add a link to the confirmation reply email: "Book here: calendly.com/miller-remodeling/site-visit"',
          'Put the same link on your website, email signature, and voicemail greeting',
        ],
      },
      cta: null,
    },
    {
      id: 't1-qbo-reminders',
      tier: 1,
      title: 'QuickBooks auto-reminders for overdue invoices',
      pitch: 'Stop chasing money manually — let QBO nag for you on a schedule.',
      fixes: 'You said you\'re chasing $18k across two jobs right now and invoicing lags the job by 2 weeks.',
      effort: 'Easy',
      setupHours: '30 min',
      cost: 'Free (already on QBO)',
      roi: {
        hoursPerWeek: 2,
        dollarsPerMonth: 3000,
        summary: 'Save Jenny 2 hrs/week on AR chasing + pull invoice payments 10 days faster ≈ $3k/mo cash flow',
      },
      diyGuide: {
        tools: ['QuickBooks Online'],
        steps: [
          'In QBO: Settings → Account and Settings → Sales → Reminders',
          'Enable reminder emails at 3 days before due, on due date, 3 days overdue, 14 days overdue',
          'Customize the messages — keep the 14-day one firm but polite',
          'Turn on "Automatically apply late fees" if you want teeth (1.5%/mo is standard)',
          'Bonus: connect Stripe or GoCardless to QBO for one-click payment',
        ],
      },
      cta: null,
    },
    {
      id: 't1-chatgpt-quotes',
      tier: 1,
      title: 'ChatGPT proposal template',
      pitch: 'Feed ChatGPT your numbers and get a polished 3-page proposal in 5 minutes.',
      fixes: 'You said quotes take 3–5 days and "forever" — that\'s the single biggest thing you want off your plate.',
      effort: 'Easy',
      setupHours: '1 hr to build template, then 5 min/quote',
      cost: 'Free (ChatGPT free tier) or $20/mo (Plus)',
      roi: {
        hoursPerWeek: 6,
        dollarsPerMonth: 4500,
        summary: 'Cut quoting from 2 hrs to 20 min per quote. Faster quotes = higher close rate ≈ $4.5k/mo',
      },
      diyGuide: {
        tools: ['ChatGPT (free tier fine)', 'Google Docs'],
        steps: [
          'Build a "master prompt" that includes: your business name, warranty terms, payment schedule, exclusions, example language from past quotes',
          'Save it as a Google Doc you paste into ChatGPT every time',
          'Workflow: after site visit → dictate your line items and pricing into ChatGPT with the master prompt → it outputs polished proposal → you review and send',
          'Cuts a 2-hour task to 20 minutes. The AI never forgets your warranty terms.',
        ],
      },
      cta: null,
    },

    // ============ TIER 2 — MEDIUM LIFTS (We set up) ============
    {
      id: 't2-jobber-setup',
      tier: 2,
      title: 'Jobber setup + Excel migration',
      pitch: 'Scheduling, quoting, invoicing, and crew dispatch in one app — migrated from your spreadsheets.',
      fixes: 'You\'re running everything on Excel and group texts. Jobber replaces 4 tools with one.',
      effort: 'Medium',
      setupHours: '12–16 hrs (us) + 2 hrs training',
      cost: '$1,500 setup + Jobber: $99–$249/mo',
      roi: {
        hoursPerWeek: 5,
        dollarsPerMonth: 5000,
        summary: 'Save 5 hrs/week across quoting, scheduling, invoicing ≈ $5k/mo in reclaimed production time',
      },
      whatYouGet: [
        'Full Jobber configuration with your services, pricing, tax settings',
        'Migration of last 6 months of active jobs from Excel',
        'Crew member accounts + mobile app training',
        'QBO integration so invoices sync automatically',
        '2-hour live training session for you + Jenny',
      ],
      cta: 'calendly-scope',
    },
    {
      id: 't2-review-automation',
      tier: 2,
      title: 'NiceJob review automation',
      pitch: 'Every finished job triggers a review request sequence on autopilot.',
      fixes: 'You have a 4.9★ rating but only 14 reviews — the gap between your reputation and your Google presence is where leads get lost.',
      effort: 'Medium',
      setupHours: '4–6 hrs',
      cost: '$1,200 setup + NiceJob: $99/mo',
      roi: {
        dollarsPerMonth: 4200,
        summary: 'Grow reviews from 14 → 80+ in 12 months. Estimated 15% lift in Google Maps leads ≈ $4.2k/mo',
      },
      whatYouGet: [
        'NiceJob configured and integrated with Jobber or QBO',
        '3-email review request sequence, written in your voice',
        'Branded review landing page at miller-remodeling.com/reviews',
        'Auto-reply templates for 5-star and <5-star reviews',
        'Monthly review-performance email for the first 3 months',
      ],
      cta: 'calendly-scope',
    },
    {
      id: 't2-website-refresh',
      tier: 2,
      title: 'Website refresh + Google Business Profile optimization',
      pitch: 'Modernize your 3-year-old site and tighten your Google presence — in 2 weeks.',
      fixes: 'You said your website "hasn\'t been touched in 3 years" and you\'re invisible to half your potential customers.',
      effort: 'Medium',
      setupHours: '20–30 hrs',
      cost: '$2,500',
      roi: {
        dollarsPerMonth: 6000,
        summary: '40% more inbound leads from Google within 60 days ≈ $6k/mo',
      },
      whatYouGet: [
        'Refreshed homepage, services, portfolio, and contact pages',
        'Mobile-first design (76% of your traffic is phones)',
        'Google Business Profile fully optimized: categories, services, posts, photos',
        'Local SEO: city + neighborhood landing pages for Nanaimo, Parksville, Qualicum',
        'Basic analytics dashboard so you can see which leads came from where',
      ],
      cta: 'calendly-scope',
    },
    {
      id: 't2-lead-routing',
      tier: 2,
      title: 'Instant lead-alert automation',
      pitch: 'Every web form, missed call, and Facebook lead rings your phone within 60 seconds.',
      fixes: 'Fast response wins jobs. You said you get back to new leads "next day" — industry data says that\'s 400% slower than the winner.',
      effort: 'Medium',
      setupHours: '4–8 hrs',
      cost: '$800 setup + $20/mo for Zapier',
      roi: {
        hoursPerWeek: 0,
        dollarsPerMonth: 3500,
        summary: '2x faster lead response → estimated 15% close rate lift ≈ $3.5k/mo',
      },
      whatYouGet: [
        'Zapier workflow: web form → SMS to Dan → email to Jenny → Google Sheet log',
        'Facebook Lead Ads integration (even if you run ads later)',
        'OpenPhone or Google Voice routing for the missed-call piece',
        'Weekly report showing lead source performance',
      ],
      cta: 'calendly-scope',
    },
    {
      id: 't2-lsa-ads',
      tier: 2,
      title: 'Google Local Services Ads setup',
      pitch: 'Pay-per-lead ads at the top of Google — Google guarantees they\'re real.',
      fixes: 'You mentioned Facebook ads flopped once. LSA is different — you pay for leads, not clicks, and Google screens them.',
      effort: 'Medium',
      setupHours: '8 hrs setup + ongoing management',
      cost: '$1,500 setup + $400–$1,200/mo ad spend',
      roi: {
        dollarsPerMonth: 8000,
        summary: 'Typical remodeler sees 8–12 qualified LSA leads/mo at $60–$80/lead ≈ $8k/mo in closed revenue',
      },
      whatYouGet: [
        'Full Google Screened certification process (insurance, background check)',
        'Service area, services, and budget configured',
        'Ad copy and photo optimization',
        '30-day launch period with weekly adjustments',
        'Dispute-bad-leads process documented so you\'re not paying for tire-kickers',
      ],
      cta: 'calendly-scope',
    },

    // ============ TIER 3 — BIG BUILDS (Custom) ============
    {
      id: 't3-ai-voice-agent',
      tier: 3,
      title: 'AI voice agent — 24/7 intake, qualifies leads, books site visits',
      pitch: 'Never miss another call. Our AI picks up, talks like a human, qualifies the job, and puts it on your calendar.',
      fixes: 'You said 3 leads/mo go to voicemail and Jenny can\'t be on the phone all day. This is your after-hours insurance policy and your front desk.',
      effort: 'Big',
      setupHours: '40–60 hrs',
      cost: '$6,500 build + $200/mo',
      priceAnchor: 'Typical agency build: $18k–$25k · Us: $6,500 · Pays back in 2 months',
      roi: {
        hoursPerWeek: 8,
        dollarsPerMonth: 12000,
        summary: 'Recover all after-hours leads + offload 8 hrs/week of phone intake ≈ $12k/mo + $108k/yr from missed-lead recovery',
      },
      whatYouGet: [
        'Custom AI agent trained on Miller Remodeling\'s services, service area, pricing tiers',
        'Qualifies: project type, timeline, budget, decision-maker, address',
        'Books site visits directly into your Google Calendar',
        'Texts you the lead summary + books follow-up if after-hours',
        '1-800 number + local Nanaimo forwarding',
        'Monthly tuning for the first 6 months',
      ],
      cta: 'calendly-strategy',
    },
    {
      id: 't3-ai-estimator',
      tier: 3,
      title: 'Custom AI estimator trained on your pricing',
      pitch: 'Upload site photos + scope notes → AI generates a quote in your pricing in 10 minutes.',
      fixes: 'Quoting is the one thing you said you\'d give up first. This is the answer — not a tool, your tool, trained on how you actually price.',
      effort: 'Big',
      setupHours: '80–120 hrs',
      cost: '$12,000 one-time',
      priceAnchor: 'Typical agency build: $30k–$50k · Us: $12,000 · Pays back in 4 months',
      roi: {
        hoursPerWeek: 8,
        dollarsPerMonth: 9000,
        summary: 'Cut quoting from 2 hrs → 10 min. Faster quotes win more jobs ≈ $9k/mo uplift + 8 hrs/week back',
      },
      whatYouGet: [
        'Web app where you upload photos + dictate scope',
        'AI pre-fills line items using your past quotes as training data',
        'You review, adjust, and send — never start from a blank page again',
        'PDF proposal output branded as Miller Remodeling',
        'Integrates with Jobber/QBO for seamless handoff to invoicing',
        '6 months of free tuning as your pricing evolves',
      ],
      cta: 'calendly-strategy',
    },
    {
      id: 't3-client-portal',
      tier: 3,
      title: 'Custom client portal: schedules, change orders, punch lists',
      pitch: 'Every client gets a login where they see exactly what\'s happening — no more 20 texts/day during a kitchen reno.',
      fixes: 'You said clients "hear from you when they hear from you" and mid-job communication eats your Saturdays.',
      effort: 'Big',
      setupHours: '100–140 hrs',
      cost: '$15,000 one-time',
      priceAnchor: 'Typical agency build: $40k+ · Us: $15,000 · Pays back in 6 months',
      roi: {
        hoursPerWeek: 6,
        dollarsPerMonth: 5500,
        summary: 'Cut client calls/texts by 60%. Faster change-order approvals ≈ $5.5k/mo + 6 hrs/week back',
      },
      whatYouGet: [
        'Branded client portal at portal.miller-remodeling.com',
        'Live schedule: milestones, dependencies, photos from crew',
        'Change order approvals with digital signature',
        'Punch list: clients can flag items, you close them',
        'Photo gallery per project (marketing asset!)',
        'Payment portal integrated with QBO',
      ],
      cta: 'calendly-strategy',
    },
    {
      id: 't3-website-funnel',
      tier: 3,
      title: 'Full website rebuild + lead funnel + SEO engine',
      pitch: 'Not a website — a lead machine. We design, build, optimize, and run it for 12 months.',
      fixes: 'Your current site is 3 years old and doesn\'t show up for "kitchen remodel Nanaimo." This makes it rank in 60 days.',
      effort: 'Big',
      setupHours: '60–80 hrs',
      cost: '$8,500 build + $500/mo management',
      priceAnchor: 'Typical agency: $20k+ build / $1,500+ monthly · Us: $8,500 / $500',
      roi: {
        dollarsPerMonth: 15000,
        summary: 'From near-zero organic leads to 8–12/mo within 6 months ≈ $15k/mo',
      },
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
    },
    {
      id: 't3-full-ops',
      tier: 3,
      title: 'End-to-end ops system — website → CRM → quoting → jobs → invoicing',
      pitch: 'The "if money were no object" version. Everything in one platform, built for Miller Remodeling specifically.',
      fixes: 'You said "I\'d give each person 10 hours/week back if I could." This is the system that does it.',
      effort: 'Big',
      setupHours: '200–300 hrs',
      cost: '$22,000 build + $800/mo',
      priceAnchor: 'Typical agency/enterprise build: $60k–$120k · Us: $22,000 · Pays back in 8 months',
      roi: {
        hoursPerWeek: 20,
        dollarsPerMonth: 22000,
        summary: 'Replaces Excel, reduces admin to 1 hr/day, unifies everything ≈ $22k/mo + 20 hrs/week across the team',
      },
      whatYouGet: [
        'Custom website + CRM + estimator + job portal + invoicing, all unified',
        'AI voice agent for intake',
        'QBO stays as accounting system of record',
        'Role-based logins for Dan, Jenny, crew leads, subs',
        'iOS + Android mobile apps (white-labeled)',
        'Dashboard showing leads, jobs, AR, margin — live',
        '12 months of free iteration as you find what you want',
      ],
      cta: 'calendly-strategy',
    },
  ],
  topThreeIds: ['t1-missed-call-textback', 't1-chatgpt-quotes', 't3-ai-voice-agent'],
  reviews: [
    {
      quote: 'Zyph Labs rebuilt our website and set up our review system in 3 weeks. We went from 22 to 67 Google reviews in 5 months. Full stop.',
      author: 'Mark T.',
      role: 'Owner, Pacific HVAC',
    },
    {
      quote: 'The AI voice agent paid for itself in month 2. We stopped losing the weekend leads we used to lose.',
      author: 'Sarah K.',
      role: 'Owner, Keystone Roofing',
    },
  ],
}
