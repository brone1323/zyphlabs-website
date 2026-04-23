import type { Demo } from './types'
import { NIMBUS_DATA } from './businesses'

const b = NIMBUS_DATA

// 1. AI SDR / Demo Scheduler
export const AI_SDR: Demo = {
  slug: 'ai-sdr',
  title: 'AI SDR / Demo Scheduler',
  subtitle: 'Inbound + outbound lead handling, qualification, demo booking, follow-up drafting.',
  category: 'sdr',
  industry: 'saas',
  business: b,
  tier2Price: '$4,500 build + $400/mo',
  buildTime: '2 weeks',
  description:
    'Human SDRs burn out on volume. This agent handles inbound leads 24/7 (qualify → book → confirm), and runs outbound sequences with personalized intros using actual research about each prospect\'s company.',
  howItWorks: [
    'Inbound: captures lead, qualifies on fit (industry, size, use case, budget hint)',
    'Books qualified leads to the rep\'s calendar automatically',
    'Outbound: reads ICP list, researches each company, drafts personalized intro',
    'Handles replies: positive → book, neutral → nurture, negative → respect',
    'Syncs every touch to HubSpot / Pipedrive',
  ],
  inputFields: [
    {
      key: 'direction',
      label: 'Direction',
      type: 'select',
      options: [
        { label: 'Inbound — qualify & book', value: 'inbound' },
        { label: 'Outbound — research & pitch', value: 'outbound' },
      ],
    },
    { key: 'prospectName', label: 'Prospect name', type: 'text' },
    { key: 'prospectCompany', label: 'Company', type: 'text' },
    { key: 'prospectEmail', label: 'Email', type: 'text' },
    { key: 'context', label: 'What we know about them', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Inbound — Shopify brand',
      description: 'Growth lead from their website form',
      values: {
        direction: 'inbound',
        prospectName: 'Sam Keelor',
        prospectCompany: 'Keelor + Co. (DTC skincare)',
        prospectEmail: 'sam@keelorandco.example.com',
        context: 'Filled out form on /pricing. Shopify Plus store, roughly 800 orders/mo. Said they\'re "drowning in spreadsheets".',
      },
    },
    {
      label: 'Outbound — ICP match',
      description: 'Cold prospect, great fit, doesn\'t know about Nimbus yet',
      values: {
        direction: 'outbound',
        prospectName: 'Marisa Adoh',
        prospectCompany: 'Thistle + Thorn Apothecary',
        prospectEmail: 'marisa@thistlethorn.example.com',
        context:
          'DTC herbal skincare, ~1200 orders/mo, Shopify. Raised a seed round in January — likely investing in ops. Founder posted on LinkedIn about "data is a mess, need a unified view".',
      },
    },
  ],
  brainHook:
    'The Brain reads every reply across every thread — it noticed last month that prospects mentioning "drowning in spreadsheets" converted at 3x the baseline. It\'s now auto-flagging that exact language as a hot-signal pattern.',
  generateOutput: (v, biz) => {
    const first = v.prospectName.split(' ')[0]
    if (v.direction === 'inbound') {
      return [
        {
          type: 'email',
          recipient: `${v.prospectName} <${v.prospectEmail}>`,
          subject: `Re: your note about the spreadsheets (Nimbus)`,
          body: `Hi ${first},

Thanks for the note — "drowning in spreadsheets" is basically the one-line pitch for why we built Nimbus.

Quick context before we meet: we connect your Shopify, Klaviyo, Meta, and Google data into one dashboard. 20-min setup, no engineer needed. Most Shopify Plus brands see their real LTV by product line within the first hour.

I\'ve held three slots this week on Jordan\'s calendar — pick whatever works:

  → Wed Apr 24, 11:00am PDT
  → Thu Apr 25, 2:00pm PDT
  → Fri Apr 26, 9:30am PDT

(or reply with a different time if none work)

I\'ll send a calendar invite with a link to your Shopify store so Jordan has real numbers ready to show you, not slides.

Talk soon,
Jordan Kim
Founder, Nimbus Data`,
        },
        {
          type: 'dashboard',
          channelLabel: 'HubSpot sync',
          body: `NEW LEAD CREATED: ${v.prospectCompany}
  Contact: ${v.prospectName}  ·  ${v.prospectEmail}
  Source: website /pricing form
  Lead score: 82 (high)
    + Shopify Plus (ICP fit)
    + "drowning in spreadsheets" language = hot-signal pattern (3x avg conv)
    + Volume: ~800 orders/mo (mid-market fit)
  Next step: demo booked pending reply
  Assigned to: Jordan`,
        },
      ]
    }

    return [
      {
        type: 'email',
        recipient: `${v.prospectName} <${v.prospectEmail}>`,
        subject: `Your LinkedIn post about the data mess`,
        body: `Hi ${first},

Saw your LinkedIn post two weeks back about the "unified view" problem — that landed because we hear it almost weekly from founders in the DTC space around Thistle + Thorn\'s stage.

Congrats on the seed, by the way. Smart to invest in ops early.

Here\'s why I\'m reaching out: we built Nimbus specifically for brands at ~500–2000 orders/mo who are too big for Shopify reports and too small for Looker. Connects your Shopify, Klaviyo, Meta, and Google in about 20 min. No engineer, no BI license.

Happy to show you in 15 min — no pitch deck, just your actual numbers. Want to do it Thursday or Friday?

— Jordan
Founder, Nimbus Data

P.S. If it\'s not the right time, totally fair — let me know and I\'ll go quiet.`,
      },
    ]
  },
}

// 2. AI Demo Prep Agent
export const DEMO_PREP: Demo = {
  slug: 'demo-prep',
  title: 'AI Demo Prep Agent',
  subtitle: 'Before each booked demo, researches prospect, pulls case studies, drafts talking points.',
  category: 'demo-prep',
  industry: 'saas',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    '30 minutes of demo prep per call × 10 demos per week = a half day gone. The agent runs the research, pulls similar-case wins, and drops a 1-page brief into your inbox 2 hours before every demo.',
  howItWorks: [
    'Watches calendar for booked demos',
    'Researches prospect (LinkedIn, site, Crunchbase, news)',
    'Pulls most-relevant customer case study for pattern match',
    'Drafts 1-page brief: who they are, likely pain, 3 talking points, 2 risk flags',
    'Auto-sends 2 hrs before demo',
  ],
  inputFields: [
    { key: 'prospectCompany', label: 'Company', type: 'text' },
    { key: 'attendeeNames', label: 'Attendees on call', type: 'text' },
    { key: 'demoDate', label: 'Demo scheduled', type: 'text' },
    { key: 'priorNotes', label: 'Notes from prior touches', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Mid-market DTC demo',
      description: 'Keelor + Co, Sam + their ops lead',
      values: {
        prospectCompany: 'Keelor + Co.',
        attendeeNames: 'Sam Keelor (founder), Anita Mishra (ops lead)',
        demoDate: 'Wed Apr 24, 11:00am',
        priorNotes: 'Inbound, said "drowning in spreadsheets". Form mentions Shopify Plus, 800 orders/mo. No mention of budget.',
      },
    },
  ],
  brainHook:
    'The Brain has watched 147 Shopify-Plus-at-800-orders demos. It knows the #1 question from that segment is "what does the Klaviyo integration actually show vs native Klaviyo" and surfaces the pre-empt talking point: "open by showing the cross-channel LTV view that Klaviyo alone can\'t produce".',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'email',
        recipient: 'Jordan Kim <jordan@nimbusdata.example.com>',
        subject: `Demo prep: ${v.prospectCompany} — ${v.demoDate}`,
        body: `DEMO BRIEF — ${v.prospectCompany}
${v.demoDate}

═══ WHO\'S ON THE CALL ═══
${v.attendeeNames}

  • Sam Keelor: Founder, ex-Zola product marketing. 4 years running Keelor + Co. Active on LinkedIn.
  • Anita Mishra: Ops lead, joined 9 months ago from Gymshark. Operations & data background — likely the day-to-day user.

═══ COMPANY ═══
  • Keelor + Co: DTC skincare, founded 2021
  • Shopify Plus, ~800 orders/mo (per form)
  • Estimated ARR: $3.5–4.5M
  • Funding: bootstrapped, no announced raise
  • Recent press: glowing feature in The Strategist (Jan) — "luxe on a reasonable budget"

═══ LIKELY PAIN ═══
  Primary: "drowning in spreadsheets" (their words)
    → Translation: they\'re stitching Shopify + Klaviyo + Meta manually every Monday
  Secondary: LTV visibility by product
    → Skincare = repeat category, LTV is everything, they\'re probably flying blind

═══ 3 TALKING POINTS TO OPEN WITH ═══
  1. Open with the cross-channel LTV view — Klaviyo alone can\'t produce this, it\'s their #1 "oh wow" moment at their size
  2. Hook: "what\'s your LTV of a Klaviyo-only acquired customer vs Meta?" — 90% of brands at their size don\'t know
  3. Close with: 20-min setup, same-day time-to-value

═══ MOST RELEVANT CASE STUDY ═══
  Juniper Wellness (similar profile: DTC, 650 orders/mo, Shopify + Klaviyo + Meta)
  Result: cut monthly reporting from 6 hrs to 15 min, discovered 41% of "repeat" LTV came from Klaviyo flows (not Meta as they\'d assumed)
  → Share link: nimbus.io/case/juniper

═══ RISK FLAGS ═══
  🟡 They\'re bootstrapped — tight on budget, lean into starter tier pricing
  🟡 Sam\'s a product marketer — she\'ll care about voice/brand surfacing in dashboards; show the white-label export

Good luck — you\'ve got this.`,
      },
    ]
  },
}

// 3. AI Trial Activation Agent
export const TRIAL_ACTIVATION: Demo = {
  slug: 'trial-activation',
  title: 'AI Trial Activation Agent',
  subtitle: 'Watches product usage, nudges stuck users at friction points, drafts help messages.',
  category: 'trial-activation',
  industry: 'saas',
  business: b,
  tier2Price: '$4,000 build + $350/mo',
  buildTime: '2 weeks',
  description:
    'Most SaaS trial conversion is won or lost in the first session. The agent watches every trial user\'s events in real time, detects friction points, and triggers the right help at the right second — chat message, tooltip, or personalized email.',
  howItWorks: [
    'Reads product usage events (page views, integration connects, widget interactions)',
    'Scores activation: got to first "aha" moment? connected at least one data source?',
    'Triggers: stuck at Klaviyo OAuth → help article; completed 3 connections → prompt to invite teammate',
    'Drafts personalized check-in emails in CSM\'s voice',
    'Flags "at risk" trials for human intervention',
  ],
  inputFields: [
    { key: 'accountName', label: 'Account', type: 'text' },
    { key: 'userName', label: 'User', type: 'text' },
    { key: 'userEmail', label: 'Email', type: 'text' },
    { key: 'trialDay', label: 'Trial day', type: 'number' },
    {
      key: 'signal',
      label: 'Event signal',
      type: 'select',
      options: [
        { label: 'Stuck at OAuth (30+ min)', value: 'oauth-stuck' },
        { label: 'Completed first source connection', value: 'first-connect' },
        { label: 'Hit the aha moment (built first dashboard)', value: 'aha' },
        { label: 'Silent 72+ hours — at risk', value: 'silent' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Stuck at Klaviyo OAuth',
      description: 'User opened integration, stuck 40 min, probably hit a permission error',
      values: {
        accountName: 'Keelor + Co.',
        userName: 'Anita Mishra',
        userEmail: 'anita@keelorandco.example.com',
        trialDay: '2',
        signal: 'oauth-stuck',
      },
    },
    {
      label: 'Aha moment — upsell trigger',
      description: 'Just saw their real LTV, expand the conversation',
      values: {
        accountName: 'Juniper Wellness',
        userName: 'Priya Shenoy',
        userEmail: 'priya@juniperwellness.example.com',
        trialDay: '4',
        signal: 'aha',
      },
    },
    {
      label: 'Silent for 3 days — at risk',
      description: 'No logins since day 1, needs rescue',
      values: {
        accountName: 'Ember + Oak',
        userName: 'Liam Curran',
        userEmail: 'liam@emberoak.example.com',
        trialDay: '4',
        signal: 'silent',
      },
    },
  ],
  brainHook:
    'The Brain correlates user-level intent: Anita was "drowning in spreadsheets" in the sales call. When she gets stuck at OAuth on day 2, the agent\'s message references that directly: "I know you\'re trying to escape the spreadsheet loop — let me get you past the Klaviyo step in 2 minutes."',
  generateOutput: (v, biz) => {
    const first = v.userName.split(' ')[0]

    if (v.signal === 'oauth-stuck') {
      return [
        {
          type: 'sms',
          recipient: `${v.userName} (in-app chat + email)`,
          channelLabel: 'Proactive chat + email',
          body: `Hi ${first} — Jordan from Nimbus 👋\n\nI see you\'ve been on the Klaviyo connect step for about 40 min. 9 times out of 10 this is a permission thing on the Klaviyo side — your account admin needs to generate an API key with "read" scope on campaigns, flows, and profiles.\n\n2-min video walkthrough just for this step: nimbus.io/klaviyo-setup\n\nWant me to hop on a quick 10-min screen-share? I can get you past this right now.`,
        },
      ]
    }

    if (v.signal === 'aha') {
      return [
        {
          type: 'email',
          recipient: `${v.userName} <${v.userEmail}>`,
          subject: `Your first real LTV number — and a thought`,
          body: `Hi ${first},

Saw you just built your first LTV-by-channel dashboard. That $142 Meta → $47 actual-LTV gap is the #1 reason brands at your scale over-invest in Meta.

Two things:

1. If you want to dig deeper, check the product-level LTV view — it\'s the 4th tab on the dashboard. 80% of our power users say that\'s the report they open every Monday.

2. Your trial is on day 4 of 14. If you want to invite Sam (your founder) to see this, the "share read-only" button in the top-right will send him a guest link.

Happy to jump on a 15-min call if any of the numbers look surprising.

— Jordan`,
        },
      ]
    }

    if (v.signal === 'silent') {
      return [
        {
          type: 'email',
          recipient: `${v.userName} <${v.userEmail}>`,
          subject: `Is there a block I can help with?`,
          body: `Hi ${first},

Noticed you haven\'t been back in Nimbus since the signup flow. Not chasing — just wanted to check if something went sideways.

Most common reasons I hear:
  1. Hit a snag connecting a data source and shelved it
  2. Got busy, meant to come back, never did
  3. Realized it wasn\'t the right fit and didn\'t want to say

Any of those (or something else), I\'d love a 1-line reply. If it\'s #3, zero hard feelings — I\'ll just close the trial so we\'re not in your inbox.

— Jordan`,
        },
      ]
    }

    return [
      {
        type: 'email',
        recipient: `${v.userName} <${v.userEmail}>`,
        subject: `Nice work — first source connected`,
        body: `Hi ${first},

First source connected on day ${v.trialDay} of your trial — half the battle. Most customers connect 3 sources in their first week; the cross-channel views get much more interesting once Klaviyo + Meta are both in there.

Keep going!
— Jordan`,
      },
    ]
  },
}

// 4. AI Churn Risk Detector
export const CHURN_RISK: Demo = {
  slug: 'churn-risk',
  title: 'AI Churn Risk Detector',
  subtitle: 'Monitors usage + support + billing signals. Alerts CSM with specific recommendations.',
  category: 'churn-risk',
  industry: 'saas',
  business: b,
  tier2Price: '$4,500 build + $400/mo',
  buildTime: '2 weeks',
  description:
    'Churn is predictable if you watch the right signals early. The agent fuses usage, support tickets, NPS, and billing events into a daily risk score per account — and triggers a personalized save motion 14 days before the average CSM would notice.',
  howItWorks: [
    'Ingests product usage, NPS, support, billing, and CS notes',
    'Assigns a 0–100 churn risk score per account, daily',
    'Alerts at 65+ with specific root cause and recommended play',
    'Drafts CSM outreach tailored to the root cause',
    'Tracks save rate per recommendation',
  ],
  inputFields: [
    { key: 'accountName', label: 'Account', type: 'text' },
    { key: 'contractValue', label: 'ARR ($)', type: 'number' },
    { key: 'daysToRenewal', label: 'Days to renewal', type: 'number' },
    {
      key: 'signal',
      label: 'Top risk signal',
      type: 'select',
      options: [
        { label: 'Usage dropped 40% in 30 days', value: 'usage-drop' },
        { label: 'Champion user left company', value: 'champion-left' },
        { label: 'NPS dropped 9 → 4', value: 'nps-drop' },
        { label: 'Multiple support tickets unresolved', value: 'support-pain' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Usage crater — 60 days out',
      description: 'Juniper Wellness, usage tanked, renewal approaching',
      values: {
        accountName: 'Juniper Wellness',
        contractValue: '14400',
        daysToRenewal: '60',
        signal: 'usage-drop',
      },
    },
  ],
  brainHook:
    'The Brain knows Priya (the champion user) posted on LinkedIn 3 weeks ago about joining a new company. It combines that external signal with the usage drop to surface: "champion gone + usage crater = classic departure-induced churn. The save play is to re-onboard Anita, who\'s been the secondary user."',
  generateOutput: (v, biz) => {
    const arr = Number(v.contractValue || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    return [
      {
        type: 'dashboard',
        channelLabel: 'CSM Risk dashboard',
        body: `🔴 ${v.accountName} — Churn risk 78 / 100
  ARR: ${arr}  ·  Renewal: ${v.daysToRenewal} days

  PRIMARY RISK:
    Usage dropped 44% over last 30 days
    Last login by champion (Priya S.): 28 days ago

  CONTEXT FROM BRAIN:
    ⚠ Champion departed — LinkedIn shows Priya joined Revel Co. 3 wks ago.
    ⚠ Secondary user (Anita M.) has only logged in twice since Priya left.

  RECOMMENDED PLAY: "Champion Handoff"
    Goal: re-onboard Anita as the primary, before renewal conversation.
    Step 1: warm outreach acknowledging Priya\'s departure + offering white-glove handoff
    Step 2: custom 30-min walkthrough of the reports Priya used
    Step 3: set up monthly 15-min check-ins for 3 months post-renewal

  Draft outreach ready below.`,
      },
      {
        type: 'email',
        recipient: `Anita Mishra <anita@juniperwellness.example.com>`,
        subject: `A clean handoff now that Priya has moved on`,
        body: `Hi Anita,

Congratulations are in order for Priya — saw her new role at Revel. You\'ve probably inherited her world.

I wanted to offer a proper handoff before you feel lost in the Nimbus account. I can do a 30-min session custom-tailored to the dashboards Priya actively used, and we can adjust them so they fit the way *you* work — not the way *she* worked.

Three slots this week:
  → Wed 11am PT
  → Thu 2pm PT
  → Fri 10am PT

No pressure if now\'s not the right time — just reply with a word and I\'ll stand down. Renewal is 60 days out and I\'d rather set you up well before that conversation happens.

— Jordan`,
      },
    ]
  },
}

// 5. AI Expansion Opportunity Surfacer
export const EXPANSION_OPPORTUNITY: Demo = {
  slug: 'expansion-opportunity',
  title: 'AI Expansion Opportunity Surfacer',
  subtitle: 'Identifies accounts ready for upsell based on usage patterns. Drafts expansion pitch.',
  category: 'expansion',
  industry: 'saas',
  business: b,
  tier2Price: '$4,000 build + $350/mo',
  buildTime: '2 weeks',
  description:
    'Expansion revenue is 3–4x easier than new logos, but most CS teams aren\'t watching for the signals. The agent surfaces accounts hitting the "ready to expand" profile — usage ceiling, team invites, roadmap question — and drafts a specific pitch.',
  howItWorks: [
    'Monitors: usage approaching plan limits, team invites, new seat requests',
    'Identifies patterns: "3+ team members added + API calls at 80% of cap"',
    'Scores expansion readiness',
    'Drafts outreach tying to specific behavior: "saw you added Sam + Priya, want to bundle those seats?"',
    'Routes to CSM with full context',
  ],
  inputFields: [
    { key: 'accountName', label: 'Account', type: 'text' },
    { key: 'currentPlan', label: 'Current plan', type: 'text' },
    { key: 'currentMRR', label: 'Current MRR ($)', type: 'number' },
    {
      key: 'signal',
      label: 'Expansion signal',
      type: 'select',
      options: [
        { label: 'Approaching plan limits', value: 'limits' },
        { label: 'Multiple team invites sent', value: 'invites' },
        { label: 'Asked about roadmap feature (paid tier)', value: 'roadmap' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Seat expansion — invited 4 people',
      description: 'Thistle + Thorn hit the magic 3-seat signal',
      values: {
        accountName: 'Thistle + Thorn Apothecary',
        currentPlan: 'Growth — $399/mo, 3 seats',
        currentMRR: '399',
        signal: 'invites',
      },
    },
  ],
  brainHook:
    'The Brain knows Marisa (founder at Thistle) responds faster to outreach framed as "save money" than "unlock feature". So the expansion pitch is: "by moving to Scale you\'d save $40/mo vs paying per-seat overage on your current plan" — not "unlock advanced analytics".',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'email',
        recipient: `Marisa Adoh <marisa@thistlethorn.example.com>`,
        subject: `Save $40/mo as your team grows`,
        body: `Hi Marisa,

Small head\'s up — I see you\'ve added 4 team invites in the last week (great, welcome Jules + team). With 4 seats on the Growth plan, you\'ll hit the per-seat overage charge (≈$80/mo extra).

A cleaner option: move to our Scale plan at $479/mo — includes 8 seats + API access + SQL export + priority support. Net you\'d be saving $40/mo vs Growth-with-overage, and you\'d unlock a couple things your team will actually use (the API is how Juniper pipes our data into their weekly executive deck).

Two ways forward:
  1. Reply "yes" and I\'ll upgrade you for next billing cycle
  2. Book 15 min and I\'ll walk through Scale features

Either way, no pressure.

— Jordan`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Expansion queue for CSM',
        body: `EXPANSION OPPORTUNITY — ${v.accountName}
  Current: ${v.currentPlan}
  Signal: 4 team invites sent in 7 days
  Expansion value: +$80/mo MRR with plan switch

  Recommended play: "Save money" framing (per Brain prefs for this customer)
  Draft sent: 1 email queued in your Outbox for approval`,
      },
    ]
  },
}

// 6. AI Post-Demo Follow-Up
export const POST_DEMO_FOLLOWUP: Demo = {
  slug: 'post-demo-followup',
  title: 'AI Post-Demo Follow-Up',
  subtitle: 'Drafts follow-up emails referencing specifics from the call transcript in rep\'s voice.',
  category: 'post-demo',
  industry: 'saas',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Generic "thanks for your time" follow-ups are why nobody replies. This agent reads the actual call transcript, remembers who said what, and drafts a follow-up that references real moments from the conversation.',
  howItWorks: [
    'Listens to the call (Gong / Fathom / native recording)',
    'Extracts: stated pains, objections raised, action items, who said what',
    'Drafts follow-up in rep\'s voice with specific references',
    'Attaches the right case study based on pain pattern',
    'Rep reviews + sends in under 2 minutes',
  ],
  inputFields: [
    { key: 'prospectName', label: 'Prospect', type: 'text' },
    { key: 'prospectEmail', label: 'Email', type: 'text' },
    { key: 'callHighlights', label: 'Call highlights (from transcript)', type: 'textarea' },
    { key: 'nextStep', label: 'Agreed next step', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Demo recap — Keelor',
      description: 'Real call content, custom follow-up',
      values: {
        prospectName: 'Sam Keelor',
        prospectEmail: 'sam@keelorandco.example.com',
        callHighlights:
          'Sam lit up on the cross-channel LTV view — said "I had no idea 40% of repeat was coming from Klaviyo". Anita asked about SSO (we have it). Sam flagged a concern about trial length vs their Monday reporting cycle. Said they\'d need to talk internally before committing. Budget hint: "under $10k/yr".',
        nextStep: 'Internal discussion Thursday, follow-up call Friday',
      },
    },
  ],
  brainHook:
    'The Brain remembers the demo hit the aha moment at 11:14 — the cross-channel LTV slide. It recommends leading the follow-up email with a screenshot of that exact slide. Re-triggering the emotion that made them say "whoa" in the room is the whole play.',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'email',
        recipient: `${v.prospectName} <${v.prospectEmail}>`,
        subject: `"I had no idea 40% was Klaviyo" — a few follow-ups`,
        body: `Hi Sam,

Thanks for the time today — genuinely a fun call. Three things from what we talked about:

1. The cross-channel LTV view
Your quote back at me: "I had no idea 40% of repeat was coming from Klaviyo." The screenshot from 11:14 is attached — feel free to send that around to Anita or anyone else who should see it.

2. SSO for Anita\'s question
Yes we support SAML SSO on the Growth plan and above. Onboarding takes ~20 min with your IT person.

3. Trial vs your Monday cycle
You flagged our 14-day trial vs your Monday reporting rhythm — totally hear you. I can extend your trial to 21 days so you get two full Monday cycles with Nimbus data. Just reply "yes" and I\'ll set that up.

For Thursday\'s internal discussion, I\'d attach:
  - Juniper Wellness case study (closest match to your size + stack): nimbus.io/case/juniper
  - Pricing one-pager (I know you mentioned under-$10k/yr — Growth at $399/mo puts you at $4,788): nimbus.io/pricing

Then let\'s reconnect Friday. I\'ve held 10am and 2pm PT on my end — grab either.

Talk Friday,
Jordan`,
      },
    ]
  },
}

export const SAAS_DEMOS: Demo[] = [
  AI_SDR,
  DEMO_PREP,
  TRIAL_ACTIVATION,
  CHURN_RISK,
  EXPANSION_OPPORTUNITY,
  POST_DEMO_FOLLOWUP,
]
