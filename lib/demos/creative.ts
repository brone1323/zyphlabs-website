import type { Demo } from './types'
import { ALDER_ASH_STUDIO } from './businesses'

const b = ALDER_ASH_STUDIO

// 1. AI Inquiry + Proposal Agent
export const INQUIRY_PROPOSAL: Demo = {
  slug: 'inquiry-proposal',
  title: 'AI Inquiry + Proposal Agent',
  subtitle: '24/7 inbound handling. Qualifies + drafts proposal in creative\'s voice using template library.',
  category: 'inquiry-proposal',
  industry: 'creative',
  business: b,
  tier2Price: '$3,500 build + $275/mo',
  buildTime: '2 weeks',
  description:
    'Most creatives lose bookings because inquiries sit unanswered for 36 hours. The agent replies within minutes, qualifies (date, scope, budget fit), and drafts a proposal in the creative\'s observational voice — ready to send the same day.',
  howItWorks: [
    'Inbound inquiry from site form, IG DM, or email → agent replies within 10 min',
    'Asks the right 4 questions to qualify (date, hours, scope, style preference)',
    'Merges into Maya\'s proposal template — not a mass PDF, an actual email',
    'If fit → offers call. If soft-fit → offers lite package. If no-fit → warm decline + referral',
    'Syncs everything to HoneyBook',
  ],
  inputFields: [
    { key: 'inquirerName', label: 'Inquirer name', type: 'text' },
    { key: 'inquirerEmail', label: 'Email', type: 'text' },
    { key: 'eventType', label: 'Event type', type: 'text' },
    { key: 'eventDate', label: 'Event date', type: 'text' },
    { key: 'budget', label: 'Budget mentioned', type: 'text' },
    { key: 'styleNotes', label: 'Style notes / vibe', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Ideal wedding inquiry',
      description: 'Great fit, dream date, budget in range',
      values: {
        inquirerName: 'Emma Reinhart',
        inquirerEmail: 'emma.r@example.com',
        eventType: 'Wedding',
        eventDate: 'Saturday, September 19',
        budget: '$5,500–6,500',
        styleNotes: 'Intimate, 40 guests, mountain backdrop. Not into posed shots — want candid, real. Saw your Coelho wedding and loved it.',
      },
    },
    {
      label: 'Scope mismatch — soft fit',
      description: 'Nice couple, too-short day, smaller package fits',
      values: {
        inquirerName: 'David Lam',
        inquirerEmail: 'david.lam@example.com',
        eventType: 'Elopement',
        eventDate: 'Thursday, June 12',
        budget: '$1,800',
        styleNotes: '2 of us only, a notary, the lake. 2 hours would be plenty.',
      },
    },
    {
      label: 'No-fit — decline warmly',
      description: 'Beautiful request but wrong style for Maya',
      values: {
        inquirerName: 'Ritika Das',
        inquirerEmail: 'ritika@example.com',
        eventType: 'Wedding',
        eventDate: 'Saturday, August 8',
        budget: '$2,500',
        styleNotes: 'Big traditional Indian wedding, 350 guests, 3 events over 4 days. Looking for someone who does full coverage at affordable rate.',
      },
    },
  ],
  brainHook:
    'The Brain studies Maya\'s past bookings — she\'s more excited by small weddings with mountain backdrops than big urban events. It scores each inquiry not just for budget fit but for "Maya will want to shoot this" fit. High-fit inquiries get the warmest, most specific proposals.',
  generateOutput: (v, biz) => {
    const first = v.inquirerName.split(' ')[0]
    const budget = Number(v.budget.replace(/[^\d]/g, '').slice(0, 4))

    if (v.eventType === 'Wedding' && budget < 3500) {
      return [
        {
          type: 'email',
          recipient: `${v.inquirerName} <${v.inquirerEmail}>`,
          subject: `About your wedding — a thoughtful referral`,
          body: `Hi ${first},

Thank you for reaching out — your wedding sounds like it\'s going to be stunning, and I love that you\'re pulling off a 4-day celebration.

I want to be transparent: a 350-guest, multi-event wedding needs a photographer with full coverage and a second or third shooter, which realistically sits in the $6–10k range for the depth of coverage you deserve. My documentary style and smaller packages work best for intimate events — I wouldn\'t be the right fit for you.

I\'d rather tell you that now than take the booking and disappoint you.

Two photographers I\'d trust with your day:
  → Anand Patel (Calgary) — specializes in large Indian weddings, 8 years in: anandpatel.photo
  → Selvi & Co. (Vancouver) — team of 3, does 3-day coverage: selvico.com

Wishing you a beautiful August.

Warmly,
Maya
Alder & Ash Studio`,
        },
      ]
    }

    if (v.eventType === 'Elopement') {
      return [
        {
          type: 'email',
          recipient: `${v.inquirerName} <${v.inquirerEmail}>`,
          subject: `About your lake elopement — yes please`,
          body: `Hi ${first},

Two people, a notary, a lake, a Thursday. Feels like a poem 🫶

Your date (June 12) is open and that hour of afternoon is soft and golden on most of our lakes. My 2-hour elopement package is exactly that:

  • 2 hours of coverage — ceremony + portraits after
  • 60–90 edited images delivered in 3 weeks
  • Print release included
  • $1,750 + GST

The only upsell I\'d mention: a one-hour hike-portrait add-on for $400 if you want to wander off into the trees after the ceremony. Most people end up wanting those shots more than the ceremony ones.

If the lake isn\'t locked in yet, I have a couple favourites I could share.

Want to grab a 15-min call this week?

Warmly,
Maya`,
        },
      ]
    }

    // ideal wedding
    return [
      {
        type: 'email',
        recipient: `${v.inquirerName} <${v.inquirerEmail}>`,
        subject: `Your September wedding — a proposal inside`,
        body: `Hi ${first},

Your note made my day. September 19 at 40 guests with mountains behind you is the kind of wedding I plan my year around.

And you already get my approach — "candid, real" is basically my voice as a photographer. The Coelhos are still one of my favourites; I\'ll send you the unpublished shots from the morning if you want to see the really quiet moments.

Here\'s what I\'m imagining for you:

━━━━━━━━━━━━━━━━━━━━━━━━
THE SEPTEMBER PACKAGE — Sep 19
━━━━━━━━━━━━━━━━━━━━━━━━

  • 8 hours of coverage (getting-ready through first dance)
  • Second shooter (Amy — you\'ll meet her first)
  • 600–800 edited images in your online gallery
  • Full print release
  • 2x engagement session beforehand (value $800, included)
  • Sneak-peek gallery delivered within 48 hrs

  Total: $6,200 + GST · $1,500 retainer to book · balance 30 days before

━━━━━━━━━━━━━━━━━━━━━━━━

I have a 20-minute call slot Friday at 2pm or Tuesday at 11am if you want to chat. Or if you want to jump straight to booking, reply "yes" and I\'ll send contract + retainer link.

I\'d really love to photograph your wedding.

Warmly,
Maya
Alder & Ash Studio
(250) 555-0112`,
      },
      {
        type: 'dashboard',
        channelLabel: 'HoneyBook update',
        body: `NEW LEAD (hot): ${v.inquirerName}
  Event: Sep 19 wedding, 40 guests, mountains
  Fit score: 94 / 100 (your ideal)
  Budget match: ✓ ($5.5–6.5k range, package at $6.2k)
  Proposal sent: today, 11:42am
  Follow-up scheduled: Thursday AM if silent
  Calendar held: your 2pm Fri + 11am Tues for discovery call`,
      },
    ]
  },
}

// 2. AI Contract + Deposit Flow
export const CONTRACT_DEPOSIT: Demo = {
  slug: 'contract-deposit',
  title: 'AI Contract + Deposit Flow',
  subtitle: 'Proposal accepted → auto-contract + deposit request + calendar lock.',
  category: 'contract-deposit',
  industry: 'creative',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'The moment between "yes I love the proposal" and "ok I\'ve paid the deposit" is where 15% of bookings leak. This agent closes the loop: contract generated, deposit invoice sent, calendar held, all within minutes of the yes.',
  howItWorks: [
    'Client replies "yes" or clicks Accept → agent fires the whole sequence',
    'Generates contract from template + event details',
    'Sends via e-sign (HoneyBook / Dubsado)',
    'Sends deposit invoice with pay link',
    'Locks the date on Maya\'s calendar the moment deposit is paid',
    'Drafts the first "welcome" email with prep checklist',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'clientEmail', label: 'Email', type: 'text' },
    { key: 'eventType', label: 'Event', type: 'text' },
    { key: 'eventDate', label: 'Date', type: 'text' },
    { key: 'totalFee', label: 'Total fee ($)', type: 'number' },
    { key: 'depositAmount', label: 'Deposit amount ($)', type: 'number' },
  ],
  scenarios: [
    {
      label: 'Accepted wedding — fire the sequence',
      description: 'Emma said yes, triggering the full flow',
      values: {
        clientName: 'Emma Reinhart',
        clientEmail: 'emma.r@example.com',
        eventType: 'Wedding',
        eventDate: 'Saturday, September 19',
        totalFee: '6200',
        depositAmount: '1500',
      },
    },
  ],
  brainHook:
    'The Brain routes deposit receipts into an automated "you\'re officially booked" sequence — but it also schedules a human-feeling personal check-in 30 days before the wedding, where Maya sends one image from a past wedding with "thinking of you, can\'t wait for Sept".',
  generateOutput: (v, biz) => {
    const first = v.clientName.split(' ')[0]
    const total = Number(v.totalFee).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    const deposit = Number(v.depositAmount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    return [
      {
        type: 'email',
        recipient: `${v.clientName} <${v.clientEmail}>`,
        subject: `You\'re officially on my calendar 🌿 (contract + deposit inside)`,
        body: `Hi ${first},

The best email I get to send!

Attached:
  → Your contract — quick read, sign at the bottom
  → Your deposit invoice (${deposit}) — Stripe link for easy payment

Once the deposit lands, I\'ll officially hold September 19 as yours. Until then, it\'s a pencil date.

After you pay, I\'ll send a "welcome" email with:
  → Your engagement session booking link
  → A prep checklist (what to wear, locations, timeline math)
  → My direct phone number for anything wedding-adjacent

Can\'t wait to start 💛

Warmly,
Maya`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Booking sequence triggered',
        body: `✓ CONTRACT GENERATED — from "Sept Wedding v4" template
  ✓ DEPOSIT INVOICE SENT — ${deposit} via Stripe
  ✓ CALENDAR HELD — Sep 19 status: "Pencil" (will flip to "Confirmed" on deposit payment)

  ON PAYMENT:
    → Welcome email auto-sends (template #12, your prep checklist)
    → Engagement session booking widget unlocked
    → First "thinking of you" reminder scheduled for Aug 20 (~30 days out)
    → Second shooter Amy notified: Sep 19 confirmed`,
      },
    ]
  },
}

// 3. AI Pre-Shoot Questionnaire Agent
export const PRE_SHOOT: Demo = {
  slug: 'pre-shoot',
  title: 'AI Pre-Shoot Questionnaire Agent',
  subtitle: 'Client intake form + mood board builder + logistics confirmation.',
  category: 'pre-shoot',
  industry: 'creative',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Showing up to a shoot without knowing "Emma\'s grandmother is in a wheelchair and needs to be in the family portrait" is a miss. This agent runs a gentle intake, builds a mood board, confirms logistics, and drops the whole brief on Maya\'s phone 72 hours before the shoot.',
  howItWorks: [
    '30 days before shoot: sends intake questionnaire',
    'Collects: family VIP list, accessibility needs, must-have shots, Pinterest links',
    'Builds a combined mood board from their links + Maya\'s portfolio',
    '7 days before: logistics confirm (arrival time, addresses, backup rain plan)',
    '72 hrs before: delivers the final brief to Maya',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'eventType', label: 'Event', type: 'text' },
    { key: 'eventDate', label: 'Date', type: 'text' },
    { key: 'stageComplete', label: 'Stage', type: 'select', options: [
      { label: 'Questionnaire sent', value: 'sent' },
      { label: 'Responses received, brief drafted', value: 'brief' },
    ] },
  ],
  scenarios: [
    {
      label: 'Pre-wedding brief',
      description: 'Emma\'s brief, 72 hrs before her wedding',
      values: {
        clientName: 'Emma Reinhart',
        eventType: 'Wedding — 40 guests, outdoor mountain venue',
        eventDate: 'Saturday, September 19',
        stageComplete: 'brief',
      },
    },
  ],
  brainHook:
    'The Brain cross-references accessibility notes with past shoots — it knows Maya\'s set of accessibility-friendly locations at this venue, and proposes them in the brief: "the stone terrace by the lake is flat, good for wheelchair access".',
  generateOutput: (v, biz) => {
    if (v.stageComplete === 'sent') {
      return [
        {
          type: 'email',
          recipient: v.clientName,
          subject: `A few questions so your ${v.eventType.split(' ')[0].toLowerCase()} goes perfectly`,
          body: `Hi ${v.clientName.split(' ')[0]},

I\'m starting to get excited about ${v.eventDate} 🌿 Here\'s a quick pre-shoot questionnaire (15 min) — it helps me show up ready and avoid the "who\'s this grandparent?" scramble on the day.

Fill out here: alderash.link/Q/${v.clientName.split(' ')[0].toLowerCase()}

Questions cover:
  1. VIP list — anyone you MUST have in a family photo
  2. Accessibility needs
  3. "Must have" shots (feel free to send Pinterest links)
  4. Parts of the day you DON\'T want photographed
  5. Final logistics — venue addresses, arrival times, rain plan

Due: by end of next Friday (3 weeks out).

Talk soon,
Maya`,
        },
      ]
    }

    return [
      {
        type: 'dashboard',
        channelLabel: 'Pre-shoot brief for Maya (72 hrs out)',
        body: `SHOOT BRIEF — ${v.clientName.toUpperCase()} WEDDING
  ${v.eventDate}  ·  40 guests  ·  outdoor mountain venue

  VIPs (must be in family portrait):
    • Grandma Rose (Emma\'s) — in wheelchair, accessibility needed
    • Uncle Trevor (deceased father figure — will be emotional for Emma)
    • Maya the dog (Emma is very serious about including her)

  ACCESSIBILITY:
    • Stone terrace by the lake = flat, good for wheelchair
    • Avoid the pine-needle path for family photos (uneven)

  MUST-HAVE SHOTS (from their Pinterest + questionnaire):
    1. Detail of grandma Rose\'s hand holding bouquet
    2. Groom\'s reaction shot — they\'re doing a first look at 2pm
    3. Wide environmental with mountain reflection in lake
    4. Dog in aisle (she\'s a ring bearer!)
    5. Candid of Emma\'s brothers before ceremony

  NO-PHOTO ZONES:
    • Emma doesn\'t want getting-dressed photos
    • Post-ceremony private moment (15 min, just them)

  LOGISTICS:
    • Call time: 10:00am at getting-ready cabin (address attached)
    • Ceremony: 2:30pm
    • Reception: 5:00pm same venue
    • Rain plan: covered patio, confirmed with venue

  WEATHER: sunny, high 16°C, golden hour 6:42pm (shoot couple portraits 5:45–6:45)

  MOOD BOARD (collab link): alderash.link/board/emma-09-19

  Amy (2nd shooter): briefed separately, will arrive at 10am.

  You\'ve got this 💛`,
      },
    ]
  },
}

// 4. AI Gallery Delivery + Proofing
export const GALLERY_DELIVERY: Demo = {
  slug: 'gallery-delivery',
  title: 'AI Gallery Delivery + Proofing',
  subtitle: 'Post-shoot gallery delivery with proof/revision tracking. Drafts delivery notes.',
  category: 'gallery-delivery',
  industry: 'creative',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Gallery delivery is when the magic happens or doesn\'t. The agent automates the whole post-shoot flow: sneak peeks at 48 hrs, full gallery within the promised window, personalized delivery note in Maya\'s voice, proof-selection tracking, printing upsell.',
  howItWorks: [
    '48-hour mark: sneak-peek gallery auto-sent (5–8 hero images)',
    'Delivery date: full gallery + personal note referencing specific moments',
    'Proof tracking: client can favourite + order prints, agent watches the cart',
    'Gentle prints upsell: "you favourited 12 images, I\'ve made a 16-print album option"',
    'Final push: reminder 6 weeks before their anniversary to book re-shoot',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'eventType', label: 'Event', type: 'text' },
    { key: 'deliveryStage', label: 'Stage', type: 'select', options: [
      { label: '48hr sneak peek', value: 'sneak' },
      { label: 'Full gallery delivery', value: 'full' },
      { label: 'Proof-selection reminder', value: 'proof' },
    ] },
    { key: 'specificMoment', label: 'Specific moment to reference', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'Sneak peek — 48 hrs after',
      description: 'Emma\'s first look after the wedding',
      values: {
        clientName: 'Emma Reinhart',
        eventType: 'Wedding',
        deliveryStage: 'sneak',
        specificMoment: 'The moment grandma Rose held Emma\'s hand during the ceremony. Uncle Trevor wiped tears during the vows. Maya the dog got a treat from the flower girl at 3:15.',
      },
    },
    {
      label: 'Full gallery delivery',
      description: '3-week mark, full gallery ready',
      values: {
        clientName: 'Emma Reinhart',
        eventType: 'Wedding',
        deliveryStage: 'full',
        specificMoment: 'Full 627 edited images, plus a favorites folder of 48 hand-picked.',
      },
    },
  ],
  brainHook:
    'The Brain learned Emma\'s Pinterest mood board leaned toward black-and-white dramatic. The agent\'s delivery note highlights "I included a bonus black-and-white mini-collection at the end — it\'s how I saw the day".',
  generateOutput: (v, biz) => {
    const first = v.clientName.split(' ')[0]

    if (v.deliveryStage === 'sneak') {
      return [
        {
          type: 'email',
          recipient: v.clientName,
          subject: `A peek — your wedding 🌿 (8 images inside)`,
          body: `Hi ${first},

I always promise a sneak peek within 48 hours, so here it is. 8 images from a day that felt like a good dream.

The moment grandma Rose held your hand during the ceremony — that one is already one of my favourite photographs I\'ve ever taken. And Uncle Trevor during the vows. And Maya (the dog, not me) getting a treat at 3:15.

Your full gallery is in edit — I\'m on track to have it to you in about 2.5 more weeks.

See the preview: alderash.link/gallery/emma-sneak

Warmly,
Maya`,
        },
      ]
    }

    if (v.deliveryStage === 'full') {
      return [
        {
          type: 'email',
          recipient: v.clientName,
          subject: `Your wedding gallery is ready 💛`,
          body: `Hi ${first},

627 images. Every moment I could find.

A few things before you dive in:

  → I included a bonus 12-image black-and-white mini-collection at the end. Your mood board leaned dramatic, and those are my attempt at capturing how the day *felt* rather than how it *looked*.

  → My 48 personal favourites are in a folder labelled "For Maya\'s archive" — the ones I would print for myself if I were you.

  → Download link is good for 365 days; after that you\'ll need to ping me.

  → Print shop is live — if you want me to curate a 16-print wedding album, reply and I\'ll pick the ones I\'d include (no pressure).

Seeing the gallery: alderash.link/gallery/emma-full

I feel lucky to have photographed you.

— Maya`,
        },
        {
          type: 'dashboard',
          channelLabel: 'Internal tracking',
          body: `DELIVERY COMPLETE — Emma Reinhart wedding
  Sneak peek open rate: ✓ (opened 14x in 48 hrs)
  Full gallery delivered: today, 11:42am
  Next auto-actions:
    → Day 7: check-in + "can I use any for my portfolio?" consent request
    → Day 14: print-shop reminder if no orders
    → Day 30: testimonial ask (tier-in to review harvester)
    → Day 335: "anniversary portrait?" rebook nudge`,
        },
      ]
    }

    return [
      {
        type: 'email',
        recipient: v.clientName,
        subject: `Not rushing you — just a note`,
        body: `Hi ${first} — not rushing, just a friendly nudge: your gallery link is good for another 30 days before it auto-archives. If you\'ve been meaning to pick print favourites, now\'s a soft-deadline moment.\n\n— Maya`,
      },
    ]
  },
}

// 5. AI Rebooking Agent (creative)
export const REBOOKING_CREATIVE: Demo = {
  slug: 'rebooking-creative',
  title: 'AI Rebooking Agent',
  subtitle: 'Anniversary nudges + refresh-cycle reminders (corporate shoots, headshots) in creative\'s voice.',
  category: 'rebooking',
  industry: 'creative',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'Weddings create lifetime clients — they just need a light tap. The agent remembers every past client\'s milestones (anniversaries, baby arrivals, corporate-headshot refresh cycles) and sends a personal reminder at the right moment.',
  howItWorks: [
    'Tracks: wedding anniversaries, baby due dates, headshot refresh cycles',
    'Anniversary minus 6 weeks: sends a warm rebook note referencing the original shoot',
    'Corporate: 18-month-mark nudge for headshot refresh',
    'Includes a past image + a light "pencil me in?" ask',
    'Self-limits: no more than 1 rebook touch per year per client',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'clientEmail', label: 'Email', type: 'text' },
    { key: 'originalEvent', label: 'Original event', type: 'text' },
    { key: 'originalDate', label: 'Original date', type: 'text' },
    {
      key: 'rebookType',
      label: 'Rebook type',
      type: 'select',
      options: [
        { label: '1-year anniversary portrait', value: 'anniversary' },
        { label: 'Pregnancy / baby arrival', value: 'baby' },
        { label: 'Corporate headshot refresh (18 mo)', value: 'corporate' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Anniversary portrait nudge',
      description: 'Emma\'s 1st anniversary in 6 weeks',
      values: {
        clientName: 'Emma Reinhart',
        clientEmail: 'emma.r@example.com',
        originalEvent: 'Wedding in the mountains',
        originalDate: 'September 19 last year',
        rebookType: 'anniversary',
      },
    },
  ],
  brainHook:
    'The Brain remembers the specific shot from their wedding Emma said she\'d print and hang on the wall. The nudge opens with: "Still thinking about the hand-on-grandma moment — I hope you hung it". Specific > template.',
  generateOutput: (v, biz) => {
    const first = v.clientName.split(' ')[0]
    return [
      {
        type: 'email',
        recipient: `${v.clientName} <${v.clientEmail}>`,
        subject: `Your first anniversary is coming up 🌿`,
        body: `Hi ${first},

Random but intentional email: your 1-year anniversary is about 6 weeks out (Sept 19 — marked in my calendar in green).

I\'m still thinking about the hand-on-grandma moment from your ceremony — I hope that print found a spot on your wall.

If you and Mark want to do a quiet anniversary portrait, I have a 1-hour sunset package for past wedding couples — $425, same lake, 30 edited images. It\'s one of the things I love doing most.

Zero pressure — no reply needed if not this year. Just wanted to remember with you.

Warmly,
Maya`,
      },
    ]
  },
}

// 6. AI Testimonial Harvester
export const TESTIMONIAL_HARVESTER: Demo = {
  slug: 'testimonial-harvester',
  title: 'AI Testimonial Harvester',
  subtitle: 'Testimonial ask at delivery peak. Drafts reply + testimonial usage requests.',
  category: 'testimonial',
  industry: 'creative',
  business: b,
  tier2Price: '$2,000 build + $175/mo',
  buildTime: '2 weeks',
  description:
    'Gallery delivery is peak sentiment — the moment when clients will write the best testimonial they\'ll ever write for you. The agent captures it right then, in a way that feels human, and asks consent to use it on the portfolio.',
  howItWorks: [
    '7 days after gallery delivery: personal ask referencing the specific shoot',
    'Positive reply → drafts social media / portfolio-page testimonial with consent',
    'Google review link included inline',
    'Captures any image favorites they mention — fuel for portfolio picks',
    'Declines gracefully if they\'re not up for it',
  ],
  inputFields: [
    { key: 'clientName', label: 'Client', type: 'text' },
    { key: 'clientEmail', label: 'Email', type: 'text' },
    { key: 'eventType', label: 'Event', type: 'text' },
    { key: 'favMoment', label: 'A moment from their shoot', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Post-delivery testimonial ask',
      description: 'Emma, 7 days after gallery delivery',
      values: {
        clientName: 'Emma Reinhart',
        clientEmail: 'emma.r@example.com',
        eventType: 'Wedding',
        favMoment: 'Grandma Rose hand moment, Maya the dog, black-and-white bonus set',
      },
    },
  ],
  brainHook:
    'The Brain tracks gallery-engagement analytics — if Emma favourited 47 images and opened the gallery 23 times in a week, that\'s a high-engagement signal and a testimonial ask is almost guaranteed to land well. Low-engagement clients get a much softer ask.',
  generateOutput: (v, biz) => {
    const first = v.clientName.split(' ')[0]
    return [
      {
        type: 'email',
        recipient: `${v.clientName} <${v.clientEmail}>`,
        subject: `Been a week — any moments that surprised you?`,
        body: `Hi ${first},

Been a week since I sent the full gallery 🌿

If you\'ve had a chance to sit with the images, I\'d love to hear what surprised you — which moment you didn\'t know was a photo until you saw it. Those always help me learn.

Two (separate) things I\'d love if you\'re up for it:

  1. A written testimonial I could use on my site — a paragraph about what it was like to work with me. No need to polish it, your real words are what I\'d want.

  2. A Google review — 1 min, different from above:
     → https://g.page/alder-ash-studio/review

If neither is your thing right now, just a "❤️" reply tells me you\'re good and I\'ll quit asking.

Warmly,
Maya`,
      },
      {
        type: 'email',
        recipient: biz.ownerName + ' (Maya)',
        channelLabel: '(After client replies) Testimonial drafted for portfolio',
        subject: `Draft testimonial from Emma — ready for portfolio`,
        body: `Client response:
"Maya, the black-and-white bonus set absolutely wrecked me in the best way. You somehow saw Uncle Trevor\'s tears before I even did. The full gallery feels like having the whole day back. Already printed grandma-hand, it\'s in the hallway."

DRAFT PORTFOLIO TESTIMONIAL (Emma\'s own words, with consent request):

"Maya somehow saw Uncle Trevor\'s tears before I even did. The full gallery feels like having the whole day back. — Emma, September wedding, 2025"

DRAFT CONSENT REQUEST:

"Emma — can I use this line on my site? (And maybe the image of grandma\'s hand as a portfolio piece?) Full veto power if not, totally ok either way. — Maya"

[ Send consent request ] [ Edit testimonial ] [ Skip ]`,
      },
    ]
  },
}

export const CREATIVE_DEMOS: Demo[] = [
  INQUIRY_PROPOSAL,
  CONTRACT_DEPOSIT,
  PRE_SHOOT,
  GALLERY_DELIVERY,
  REBOOKING_CREATIVE,
  TESTIMONIAL_HARVESTER,
]
