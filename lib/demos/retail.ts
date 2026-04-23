import type { Demo } from './types'
import { CEDAR_VALLEY_CAFE } from './businesses'

const b = CEDAR_VALLEY_CAFE

// 1. AI Customer Concierge
export const CUSTOMER_CONCIERGE_RETAIL: Demo = {
  slug: 'customer-concierge-retail',
  title: 'AI Customer Concierge',
  subtitle: 'Handles DMs, web chat, "are you open" calls, menu, reservations, catering inquiries.',
  category: 'concierge',
  industry: 'retail',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Tired of answering "are you open Sunday?" for the 400th time? The Concierge answers in Marcus\'s casual voice across IG DMs, Google Business chat, and the website — and hands off real catering leads to Marcus with context.',
  howItWorks: [
    'Connects to IG DMs, Google Business chat, website chat, and the landline',
    'Handles high-volume FAQs: hours, menu, parking, dog-friendly patio, WiFi',
    'For catering/private events: qualifies (date, headcount, budget) and books Marcus',
    'Logs every conversation with sentiment tags',
    'Escalates angry / unusual messages to Marcus in Slack',
  ],
  inputFields: [
    {
      key: 'channel',
      label: 'Where it came in',
      type: 'select',
      options: [
        { label: 'Instagram DM', value: 'ig' },
        { label: 'Google Business chat', value: 'gbp' },
        { label: 'Website chat', value: 'web' },
        { label: 'Phone', value: 'phone' },
      ],
    },
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'message', label: 'Their message', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'IG DM — Sunday hours',
      description: 'High-frequency FAQ, instant reply',
      values: {
        channel: 'ig',
        customerName: '@alexpwinter',
        message: 'hey are you open sundays? trying to plan brunch with friends 🥐',
      },
    },
    {
      label: 'Catering inquiry',
      description: 'Real lead — agent captures, then hands off',
      values: {
        channel: 'web',
        customerName: 'Rachel Kwan',
        message:
          'Hi! We\'re planning a small rehearsal dinner — 22 people — a Saturday in early June. Would you do a catering platter + coffee setup? Budget around $600–800.',
      },
    },
    {
      label: 'Angry review follow-up',
      description: 'Customer is upset — escalate to Marcus',
      values: {
        channel: 'gbp',
        customerName: 'Paul M.',
        message:
          'Been coming here for 2 years and today you charged me $6 for a matcha that used to be $5. What\'s going on?',
      },
    },
  ],
  brainHook:
    'The Brain tracks regulars across channels — @alexpwinter is known in the POS as "Alex W., ordering 2x/week since January, usual: oat matcha + almond croissant". The Concierge can say "Hey Alex! yes open Sunday 8–3, saving an almond croissant for you 😉" with full context.',
  generateOutput: (v, biz) => {
    const msg = v.message.toLowerCase()
    if (msg.includes('hour') || msg.includes('open') || msg.includes('sunday') || msg.includes('monday')) {
      return [
        {
          type: 'sms',
          recipient: `${v.customerName} (via ${channelLabel(v.channel)})`,
          channelLabel: `Auto-reply · ${channelLabel(v.channel)}`,
          body: `Hey! Yep — open Sundays 8am–3pm (kitchen until 2:30). Brunch menu only, no dinner service. Doggos welcome on the patio 🐾\n\nSee you soon, M`,
        },
        {
          type: 'dashboard',
          channelLabel: 'Log entry',
          body: `${v.customerName} · ${channelLabel(v.channel)} · ${new Date().toLocaleTimeString()}\nTopic: hours · Resolved: auto-reply · No follow-up needed`,
        },
      ]
    }

    if (msg.includes('cater') || msg.includes('rehearsal') || msg.includes('event') || /\d+\s*(people|pax|person|guest)/.test(msg)) {
      return [
        {
          type: 'sms',
          recipient: `${v.customerName} (via ${channelLabel(v.channel)})`,
          channelLabel: `Catering triage · ${channelLabel(v.channel)}`,
          body: `Hey ${v.customerName.split(' ')[0]}! Love a rehearsal dinner 🥂\n\nEarly June is usually open for catering — a 22-person platter + coffee setup is right in our sweet spot. Budget works.\n\nI\'ve pinged Marcus, he\'ll reply personally today with a couple date options + a rough menu. Anything dietary I should flag for him?\n\n— M (auto-assist, Marcus following up)`,
        },
        {
          type: 'email',
          recipient: biz.ownerName + ' (Marcus)',
          subject: `Catering lead — ${v.customerName}, ~22 ppl, early June`,
          body: `Details captured:
  Event: rehearsal dinner
  Headcount: 22
  Timing: Saturday, early June
  Budget: $600–800
  Ask: catering platter + coffee setup
  Channel: ${channelLabel(v.channel)}

I sent a warm hold reply on your behalf, told them you\'d get back today. Draft reply ready:

  "Hey Rachel — Marcus here! Love the idea. Two open Saturdays in early June: Jun 6 or Jun 13. I\'d do our brunch platter (croissants, yogurt parfaits, fruit) + a coffee cart for ~$720. Happy to adjust. Which date works?

  See you soon, M"

[ Approve & send ] [ Edit ]`,
      },
      ]
    }

    if (msg.includes('$') || msg.includes('price') || msg.includes('charged') || msg.includes('expensive')) {
      return [
        {
          type: 'sms',
          recipient: biz.ownerName + ' (Marcus)',
          channelLabel: '🚨 Escalation — price complaint',
          body: `@PaulM just GBP-messaged about a matcha price change ($5 → $6). Held on reply — wanted you to handle personally. His order history: regular, 4x/mo, never complained before. Draft reply ready when you\'re free.`,
        },
        {
          type: 'email',
          recipient: biz.ownerName + ' (Marcus)',
          subject: `Held message from @PaulM — price complaint, draft reply`,
          body: `Paul\'s message:
"Been coming here for 2 years and today you charged me $6 for a matcha that used to be $5. What\'s going on?"

DRAFT REPLY (your voice):
"Hey Paul — you\'re right, we bumped matcha $1 last week. Our supplier raised our ceremonial-grade cost 18% and I was eating the margin. I should\'ve put up a sign, sorry about the surprise. Next one on me — just flash this message. — M"

[ Approve & send ] [ Edit ] [ Let me call instead ]`,
      },
      ]
    }

    return [
      {
        type: 'sms',
        recipient: `${v.customerName} (via ${channelLabel(v.channel)})`,
        channelLabel: `Generic friendly reply · ${channelLabel(v.channel)}`,
        body: `Hey! Thanks for reaching out. I\'ve logged your message and we\'ll reply today. If it\'s urgent you can call us at (303) 555-0150.\n\n— M (auto-assist)`,
      },
    ]
  },
}

function channelLabel(c: string) {
  return c === 'ig' ? 'Instagram DM' : c === 'gbp' ? 'Google Business' : c === 'web' ? 'Website chat' : 'Phone'
}

// 2. AI Winback Agent
export const WINBACK_RETAIL: Demo = {
  slug: 'winback-retail',
  title: 'AI Winback Agent',
  subtitle: 'Monitors POS for lapsed regulars. Personalized winback in Marcus\'s voice.',
  category: 'winback',
  industry: 'retail',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'The regulars who drift away are the biggest leak in any cafe. This agent watches POS activity, notices when a regular hasn\'t been in, and sends a warm, specific text — "your usual oat latte\'s on us" — in Marcus\'s voice.',
  howItWorks: [
    'Reads POS: identifies "regulars" (4+ visits in trailing 60 days)',
    'Flags the ones who haven\'t been in for 2x their normal interval',
    'Drafts personal SMS: references their usual order + a small incentive',
    'Marcus approves in one tap from his phone, or edits',
    'If they come back within 14 days → tagged "winback success" for tracking',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerPhone', label: 'Phone', type: 'phone' },
    { key: 'usualOrder', label: 'Their usual order', type: 'text' },
    { key: 'avgFrequency', label: 'Average frequency', type: 'text' },
    { key: 'lastVisit', label: 'Last visit', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Lapsed regular — Linda',
      description: 'Normally in twice a week, hasn\'t been in 6 weeks',
      values: {
        customerName: 'Linda Tran',
        customerPhone: '(303) 555-0188',
        usualOrder: 'Oat matcha + almond croissant',
        avgFrequency: '2x / week',
        lastVisit: '6 weeks ago',
      },
    },
    {
      label: 'Weekend brunch regular',
      description: 'Saturday brunch family, missed 3 weekends in a row',
      values: {
        customerName: 'The Koskinen family',
        customerPhone: '(303) 555-0171',
        usualOrder: 'Big brunch — avocado toast × 2, kids\' pancake, 2 flat whites',
        avgFrequency: 'Every Saturday',
        lastVisit: '3 weekends ago',
      },
    },
  ],
  brainHook:
    'The Brain remembers Linda mentioned she was starting a new job across town 5 weeks ago — so it doesn\'t offer the "come back this week" template. It offers a weekend brunch incentive instead: "hey when you have a Saturday morning free, first matcha\'s on us". Context > template.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    return [
      {
        type: 'sms',
        recipient: `${v.customerName} · ${v.customerPhone}`,
        channelLabel: 'Winback SMS',
        body: `Hey ${first}! M from Cedar Valley. Noticed it\'s been a minute — hope life\'s been good 🌲\n\nNext time you\'re in, ${v.usualOrder.toLowerCase()} is on me. No expiry, no code, just flash this text.\n\nSee you soon,\nM`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Winback queue for Marcus',
        body: `WINBACK DRAFTS — waiting for your tap
  ────────────────────────────────────
  [ ${v.customerName} ] ${v.avgFrequency} · away ${v.lastVisit}
     Draft: "Hey ${first}! M from Cedar Valley..."
     Incentive proposed: ${v.usualOrder.split('+')[0].trim()} on the house ($5.50 cost)
     [ Send ] [ Edit ] [ Skip ] [ Archive ]`,
      },
    ]
  },
}

// 3. AI Inventory & Reorder Assistant
export const INVENTORY_RETAIL: Demo = {
  slug: 'inventory-retail',
  title: 'AI Inventory & Reorder Assistant',
  subtitle: 'Reads POS, flags low stock before runout, drafts reorder emails to suppliers.',
  category: 'inventory',
  industry: 'retail',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Running out of oat milk at 10am Saturday = a bad Yelp review. The agent watches usage rates per SKU, forecasts the next 7 days, and drafts reorder emails the day before you\'d notice yourself.',
  howItWorks: [
    'Ingests POS line items + current on-hand counts',
    'Calculates trailing velocity per SKU',
    'Forecasts 7-day usage with weekday/weekend weighting',
    'Flags "likely to run out within forecast window" items',
    'Drafts supplier emails in Marcus\'s tone — attaches PO number',
  ],
  inputFields: [
    { key: 'sku', label: 'Item', type: 'text' },
    { key: 'onHand', label: 'On hand (units)', type: 'number' },
    { key: 'weeklyUsage', label: 'Weekly usage', type: 'text' },
    { key: 'supplier', label: 'Supplier', type: 'text' },
    { key: 'leadTime', label: 'Supplier lead time', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Oat milk running low',
      description: 'Weekend approaching, 8 cartons left, usage is 14/week',
      values: {
        sku: 'Oatly Barista — 1L',
        onHand: '8',
        weeklyUsage: '14 cartons',
        supplier: 'Jackie @ Pacific Pantry Distributors',
        leadTime: '2 business days',
      },
    },
    {
      label: 'Croissant dough — tight',
      description: 'Tomorrow\'s bake needs it, still coming',
      values: {
        sku: 'Frozen butter croissant dough (pack of 36)',
        onHand: '1',
        weeklyUsage: '3 packs',
        supplier: 'Henri @ Batard Bakery',
        leadTime: 'Next-day if ordered by 3pm',
      },
    },
  ],
  brainHook:
    'The Brain notices patterns: it\'s been three weekends in a row that oat milk ran tight before Sunday brunch — it permanently bumps the reorder threshold by 20%. It also knows Jackie responds in 20 minutes on Tuesdays but takes 2 days on Fridays, so Friday orders get sent with extra urgency framing.',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'dashboard',
        channelLabel: 'Stock alert',
        body: `🟠 LIKELY TO RUN OUT: ${v.sku}
  On hand: ${v.onHand}
  Weekly usage: ${v.weeklyUsage}
  Forecast runout: ~Saturday PM (trailing 7 days weighted for weekend)
  Lead time: ${v.leadTime}

  Action drafted: reorder email to ${v.supplier}`,
      },
      {
        type: 'email',
        recipient: v.supplier,
        subject: `Reorder — ${v.sku} · PO CV-${Math.floor(Math.random() * 900 + 100)}`,
        body: `Hey ${v.supplier.split(' ')[0]} —

Running low on ${v.sku.toLowerCase()}, need to reorder before the weekend. Let\'s do:

  • ${v.sku} × 2 cases

Deliver to the usual back door off Walnut St, or I can swing by Tuesday if pickup is faster.

Let me know ETA and total, thanks!

— M
Cedar Valley Cafe`,
      },
    ]
  },
}

// 4. AI Staff Schedule Optimizer
export const SCHEDULE_OPTIMIZER: Demo = {
  slug: 'schedule-optimizer-retail',
  title: 'AI Staff Schedule Optimizer',
  subtitle: 'Reads historical foot traffic, proposes weekly schedule, flags mismatches.',
  category: 'schedule',
  industry: 'retail',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Schedule by gut feel and you over-staff slow days + understaff busy ones. The agent models foot traffic (weather, events, weekday), proposes a schedule that fits the forecast, and flags under/over-staffing before it bites.',
  howItWorks: [
    'Reads 12 months of POS transaction timestamps',
    'Models by hour/day/week with weather + events overlay',
    'Generates next week\'s proposed schedule',
    'Flags: over-staffed slow Mondays, under-staffed Saturday mornings',
    'Respects staff availability, certifications (coffee bar vs kitchen), and labor cost targets',
  ],
  inputFields: [
    { key: 'weekLabel', label: 'Week of', type: 'text' },
    { key: 'weatherForecast', label: 'Weather forecast', type: 'text' },
    { key: 'eventOverlay', label: 'Events nearby', type: 'textarea' },
    { key: 'targetLaborPct', label: 'Target labor %', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Long-weekend forecast',
      description: 'Memorial Day weekend, busy Saturday expected',
      values: {
        weekLabel: 'May 16–22',
        weatherForecast: 'Sat sunny 75°F, Sun cloudy 61°F, Mon holiday 78°F',
        eventOverlay: 'Sat: farmers\' market at the park (draws traffic). Mon: holiday closure for most shops — we stay open.',
        targetLaborPct: '26%',
      },
    },
  ],
  brainHook:
    'The Brain remembers that Jordan\'s baby is due in 3 weeks — it avoids putting Jordan on closing shifts. It also knows that the farmers\' market day spikes matcha demand specifically (because the vendor next door sends customers) so it schedules a second bar person for Saturday 9–11.',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'dashboard',
        channelLabel: `Proposed schedule — week of ${v.weekLabel}`,
        body: `PROPOSED ROSTER — ${v.weekLabel}
Labor target: ${v.targetLaborPct}   ·   Forecast revenue: $14,800

                Mon   Tue   Wed   Thu   Fri   Sat   Sun
────────────────────────────────────────────────────────
Open/Prep       Jen   Tom   Jen   Tom   Jen   Sami  Sami
Bar (AM)         -    Tom    -    Tom    Jen   Tom   Tom
Bar (PM)         -    Jen    -    Jen    Sami  Jen    -
Kitchen         Sami  Sami  Sami  Sami  Sami  Jake  Jake
Close            Tom   Jen   Tom   Jen   Tom   Jake  Sami

FLAGS:
  🟡 Saturday 9–11am: only 1 bar person scheduled, but Sat brunch usually peaks.
     → RECOMMEND adding 2nd bar (Jen, 9–11, 2 hrs = $52) — incremental rev ~$280.
  🟢 Monday 10–12: 3 staff, forecast light. Consider 2.
  🟢 Jordan (parental leave starting Jun 3) not scheduled past Jun 2.

Total hours: 178 · Projected labor cost: $3,860 (26.1% of forecast rev)`,
      },
      {
        type: 'email',
        recipient: 'All staff',
        subject: `Next week\'s schedule — please confirm by Thursday`,
        body: `Hey team —

Draft schedule for May 16–22 attached. A few notes:
  • Sat is farmers\' market + forecast sunny — we\'ll likely be slammed 9–12.
  • Monday is Memorial Day — we\'re open, most shops aren\'t, expect a coffee surge 10–2.
  • Let me know by Thursday if anything needs adjusting.

Jen — you\'re on for a 2-hour extra Sat morning if you can swing it, flag me if not.

Thanks y\'all 🌲
M`,
      },
    ]
  },
}

// 5. AI Social Content Drafter
export const SOCIAL_DRAFTER: Demo = {
  slug: 'social-drafter-retail',
  title: 'AI Social Content Drafter',
  subtitle: 'Weekly Google Business posts + Instagram captions in Marcus\'s voice. Photo → draft.',
  category: 'social-content',
  industry: 'retail',
  business: b,
  tier2Price: '$2,000 build + $175/mo',
  buildTime: '1–2 weeks',
  description:
    'Marcus hates writing captions and the IG feed shows it. This agent takes a photo he snaps at 7am and returns 3 caption options + a GBP post draft in his voice — alliteration, lowercase, dry humor, all of it.',
  howItWorks: [
    'Marcus snaps a photo, drops it in the shared album',
    'Agent analyzes the photo + pulls today\'s specials / events',
    'Drafts 3 IG caption options (tagline, personal, behind-the-scenes)',
    'Drafts a GBP post (event-driven, event hashtags, directions link)',
    'Marcus taps a winner, agent posts to all channels',
  ],
  inputFields: [
    { key: 'photoDescription', label: 'Photo shows', type: 'text' },
    { key: 'context', label: 'Context / details', type: 'textarea' },
    {
      key: 'goal',
      label: 'Post goal',
      type: 'select',
      options: [
        { label: 'Just a vibe', value: 'vibe' },
        { label: 'Drive foot traffic today', value: 'traffic' },
        { label: 'Promote an event / special', value: 'event' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Croissants just out of the oven',
      description: 'Morning bake photo, driving weekday traffic',
      values: {
        photoDescription: 'Tray of golden-brown almond croissants, steam visible, shot from above',
        context: 'Henri\'s batch from Batard just landed. We\'ll sell out by 11 like always.',
        goal: 'traffic',
      },
    },
    {
      label: 'Live acoustic Saturday',
      description: 'Event post, acoustic musician on the patio',
      values: {
        photoDescription: 'Guitar leaning on the patio chair, string lights, coffee on the table',
        context: 'Saturday 2–5pm: Ellis + Lane acoustic set, patio, free.',
        goal: 'event',
      },
    },
  ],
  brainHook:
    'The Brain keeps a voice file — examples of captions Marcus has written and loved vs rejected. Over time it stops drafting the ones he always deletes (emojis in the middle of sentences, "vibes only" as a line) and leans into what he actually posts.',
  generateOutput: (v, biz) => {
    return [
      {
        type: 'multi-channel',
        channelLabel: 'Instagram caption — option 1 (playful)',
        body: v.goal === 'traffic'
          ? `golden hour on a tuesday · henri just slid these in through the back door · we\'ll be sold out by 11, you know the drill 🥐`
          : v.goal === 'event'
            ? `saturday 2–5 · patio · ellis + lane acoustic · bring a friend, bring your dog, bring nothing just come · 🎸`
            : `tuesday mood: one croissant, one quiet window seat, rain on the awning. the good kind of slow.`,
      },
      {
        type: 'multi-channel',
        channelLabel: 'Instagram caption — option 2 (direct)',
        body: v.goal === 'traffic'
          ? `fresh almond croissants just hit the case. come early, we sell out of these by 11 every single tuesday.`
          : v.goal === 'event'
            ? `live acoustic sat 2–5. ellis & lane, patio, no cover, dogs welcome. see u there.`
            : `made our pourovers a touch darker this week — let me know if you taste it.`,
      },
      {
        type: 'multi-channel',
        channelLabel: 'Google Business post',
        body:
          v.goal === 'traffic'
            ? `Fresh almond croissants just out of the oven — available from 7am until they sell out (usually 11am). Stop in for your morning coffee + a croissant warm from the bake.\n\nDog-friendly patio, free WiFi, open till 4pm today.\n\n📍 1930 Pearl St — 2 min from Pearl Street Mall`
            : v.goal === 'event'
              ? `Live Music This Saturday 🎸\nEllis + Lane acoustic set, 2–5pm on the patio. No cover, family-friendly, dogs welcome.\n\nWe\'ll have the full brunch menu until 2:30. Reservations not needed but if it\'s sunny, come early!`
              : `Quiet weekday vibes this week — our patio is open, espresso is hot, and we pulled the darker pour-over back for spring. See you soon.`,
      },
      {
        type: 'dashboard',
        channelLabel: 'Marcus\'s approve queue',
        body: `[ Instagram · option 1 ]  ✔ Select
  [ Instagram · option 2 ]
  [ GBP post draft ]  ✔ Auto-include

  Post schedule: 7:15am (peak IG morning time for your followers)
  Hashtags auto-added: #canmore #coffee #croissants

  [ Post now ] [ Schedule ] [ Edit ] [ Redraft ]`,
      },
    ]
  },
}

// 6. AI Review Harvester (retail)
export const REVIEW_HARVESTER_RETAIL: Demo = {
  slug: 'review-harvester-retail',
  title: 'AI Review Harvester',
  subtitle: 'Post-transaction review asks, drafted replies, bad-review escalation.',
  category: 'review-harvester',
  industry: 'retail',
  business: b,
  tier2Price: '$1,800 build + $150/mo',
  buildTime: '2 weeks',
  description:
    'Retail review asks usually go out as generic receipt spam. This one fires the morning after a regular\'s visit — with a line that references their actual order — and stays quiet when they\'ve left a review in the last 6 months.',
  howItWorks: [
    'POS transaction closes → agent waits ~18 hours for peak-sentiment morning',
    'Drafts SMS/email referencing actual items ordered',
    'Positive reviews → auto-drafts Marcus-voice reply for one-tap',
    'Low-star (1–3) reviews → pauses public reply, pings Marcus first',
    'Self-throttles: max 1 review ask per customer per 180 days',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerPhone', label: 'Phone', type: 'phone' },
    { key: 'orderItems', label: 'What they ordered', type: 'text' },
    {
      key: 'visitContext',
      label: 'Visit context',
      type: 'select',
      options: [
        { label: 'Normal weekday visit', value: 'normal' },
        { label: 'Busy Saturday brunch', value: 'weekend' },
        { label: 'Had a live acoustic set on', value: 'event' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Weekend brunch regular',
      description: 'Koskinens came in Saturday, had a great time',
      values: {
        customerName: 'The Koskinen family',
        customerPhone: '(303) 555-0171',
        orderItems: 'Avocado toast ×2, kids pancake, 2 flat whites',
        visitContext: 'weekend',
      },
    },
    {
      label: 'Event night',
      description: 'Came for the acoustic set Saturday afternoon',
      values: {
        customerName: 'Mel Archer',
        customerPhone: '(303) 555-0184',
        orderItems: 'Oat latte × 2, cinnamon roll to share',
        visitContext: 'event',
      },
    },
  ],
  brainHook:
    'The Brain remembers that Mel\'s birthday was last week — the review ask becomes: "hope the birthday weekend was magic. if you had a second, a quick review would help us a ton." Specific beats template every time.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    return [
      {
        type: 'sms',
        recipient: `${v.customerName} · ${v.customerPhone}`,
        channelLabel: 'Morning-after review ask',
        body:
          v.visitContext === 'event'
            ? `Hey ${first}! M from Cedar Valley. Loved having you at the acoustic set yesterday 🎸\n\nIf the oat latte hit the spot, would you drop us a quick Google review?\n→ https://g.page/cedar-valley-cafe/review\n\nThanks either way,\nM`
            : v.visitContext === 'weekend'
              ? `Morning! Hope Saturday\'s pancakes got everyone out the door happy 🥞\n\nIf the brunch was a good one, a quick Google review would mean a lot:\n→ https://g.page/cedar-valley-cafe/review\n\nSee you next weekend,\nM`
              : `Hey ${first}! Hope the ${v.orderItems.toLowerCase()} set up a good day.\n\nA quick Google review would help us a ton (30 sec):\n→ https://g.page/cedar-valley-cafe/review\n\nSee you soon,\nM`,
      },
      {
        type: 'email',
        recipient: biz.ownerName + ' (Marcus)',
        channelLabel: '(When review posts) Reply drafted',
        subject: `${first} left a 5-star — reply drafted`,
        body: `Review:
"Best patio in Boulder for Saturday brunch. Pancakes are kid-approved, avocado toast is real. Acoustic set was a bonus. We\'ll be back."

DRAFT REPLY:
"thanks ${first} — kids-approved means a lot, tell them we\'ll hide an extra strawberry next time. see you soon, M"

[ Approve & post ] [ Edit ]`,
      },
    ]
  },
}

export const RETAIL_DEMOS: Demo[] = [
  CUSTOMER_CONCIERGE_RETAIL,
  WINBACK_RETAIL,
  INVENTORY_RETAIL,
  SCHEDULE_OPTIMIZER,
  SOCIAL_DRAFTER,
  REVIEW_HARVESTER_RETAIL,
]
