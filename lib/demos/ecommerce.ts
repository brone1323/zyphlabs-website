import type { Demo } from './types'
import { CEDAR_SOAP_CO } from './businesses'

const b = CEDAR_SOAP_CO

// 1. AI Customer Service Agent
export const CS_AGENT_ECOMM: Demo = {
  slug: 'cs-agent-ecommerce',
  title: 'AI Customer Service Agent',
  subtitle: 'Handles 60–80% of tickets (WISMO, returns, sizing) across email/chat/Instagram DM.',
  category: 'customer-service',
  industry: 'ecommerce',
  business: b,
  tier2Price: '$4,000 build + $300/mo',
  buildTime: '2 weeks',
  description:
    'Lena was drowning in DMs. This agent reads every inbound question, pulls the customer\'s order + tracking, and replies in her brand voice — storytelling, ingredient-forward. Edge cases and real problems get escalated with full context.',
  howItWorks: [
    'Connected to email, Shopify chat, Instagram DMs, and the contact form',
    'Pulls order data on every question (WISMO, returns, exchanges, sizing, ingredients)',
    'Replies inline for 60–80% of tickets within minutes',
    'Escalates: refund disputes, allergic reactions, bulk/wholesale, anything emotional',
    'Learns Lena\'s editorial voice — storytelling openings, ingredient-first answers',
  ],
  inputFields: [
    {
      key: 'channel',
      label: 'Channel',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Instagram DM', value: 'ig' },
        { label: 'Website chat', value: 'web' },
      ],
    },
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'orderNumber', label: 'Order # (if referenced)', type: 'text' },
    { key: 'message', label: 'Their message', type: 'textarea' },
  ],
  scenarios: [
    {
      label: 'WISMO — where\'s my order',
      description: 'Customer bought 4 days ago, hasn\'t seen a tracking update',
      values: {
        channel: 'email',
        customerName: 'Kate Simons',
        orderNumber: '#28412',
        message: 'Hi, I ordered the Cedar + Juniper bar set Friday and haven\'t received a tracking email yet. Can you let me know when it ships? Thanks!',
      },
    },
    {
      label: 'Sensitive skin question',
      description: 'Customer asking about an ingredient, nervous about reactions',
      values: {
        channel: 'ig',
        customerName: '@hannahruthr',
        orderNumber: '',
        message: 'hi! i have very sensitive skin — eczema — is your tallow balm ok for that? worried about the rosemary',
      },
    },
    {
      label: 'Refund request after 60 days',
      description: 'Outside normal return window — escalate to Lena',
      values: {
        channel: 'email',
        customerName: 'Marisol Chen',
        orderNumber: '#27845',
        message:
          'I bought the full-size body oil 62 days ago. It caused a reaction on my forearms (photo attached). I\'d like a refund please. Yes I know it\'s outside your return policy but this shouldn\'t be a normal thing.',
      },
    },
  ],
  brainHook:
    'The Brain knows Marisol has ordered 4 times before without issue and has a tester kit listed in her profile — making the reaction probably a batch-specific issue, not a personal sensitivity. Lena\'s response prompt includes that context plus: "she\'s a high-LTV repeat customer, do right by her".',
  generateOutput: (v, biz) => {
    const first = v.customerName.replace('@', '').split(' ')[0]
    const msg = v.message.toLowerCase()

    if (msg.includes('ship') || msg.includes('track') || msg.includes('where')) {
      return [
        {
          type: 'email',
          recipient: `${v.customerName}`,
          subject: `Your Cedar + Juniper set — shipping update`,
          body: `Hi ${first}!

Thanks for the nudge — ${v.orderNumber || 'your order'} is packed and leaving our little Bend studio today. USPS is picking up around 3pm, and you\'ll get a tracking number automatically once it\'s scanned.

Couple notes on timing:
  • OR/WA: usually 2–3 business days from pickup
  • Elsewhere in the US: 4–6 days
  • Our postal outlet is slower on Fridays, so we bumped this one to Monday pickup to avoid the weekend slowdown

The Cedar + Juniper bars are fresh — cut Tuesday — so they\'ve had a good cure. Let me know how they treat you.

Warmly,
Lena
Cedar Soap Co. · bend`,
        },
        {
          type: 'dashboard',
          channelLabel: 'Log',
          body: `WISMO · ${v.customerName} · ${v.orderNumber || 'no order #'} · auto-resolved · Lena not needed`,
        },
      ]
    }

    if (msg.includes('sensitive') || msg.includes('eczema') || msg.includes('rosemary') || msg.includes('ingredient')) {
      return [
        {
          type: 'multi-channel',
          channelLabel: 'IG DM reply',
          body: `hi ${first}! 💛 totally hear the sensitivity concern.\n\nour tallow balm has grass-fed beef tallow, cold-pressed jojoba, a drop of vitamin E, and yes — rosemary extract — but at a really low level (0.1%) purely as a natural preservative, not for scent. most eczema-prone customers do well with it because the formula is otherwise very clean.\n\nBUT — because you flagged eczema specifically, I want you to test safely:\n  1. grab our $8 sampler tin (20g)\n  2. patch test on your inner arm for 48 hrs\n  3. if all good, the full size is yours\n\nif you react at all, we\'ll refund the sampler no questions.\n\nalso — we have a rosemary-free version in small batch, i can hold one for you if you want to try that route instead. just tell me 🙂\n\n— lena`,
        },
      ]
    }

    // refund escalation
    return [
      {
        type: 'email',
        recipient: biz.ownerName + ' (Lena)',
        channelLabel: '🚨 Escalation — reaction + out-of-window refund',
        subject: `${v.customerName} — reaction reported, draft response ready`,
        body: `Ticket type: refund + reported reaction (photo attached)
Customer: ${v.customerName} (${v.orderNumber})
Order history: 4 previous orders, no prior complaints, lifetime spend $312

Their message:
"${v.message}"

I did NOT reply — holding for you. Based on their history (great customer, never complained) and the photo (looks like contact dermatitis, consistent), this is almost certainly a batch issue not a personal-sensitivity issue. I checked — order #${v.orderNumber} came from batch 0412, same batch as 3 other orders that shipped that week. No other complaints so far.

DRAFT REPLY (your voice):

  "Hi Marisol,

  I\'m really sorry — that reaction is not ok, and I appreciate you sending the photo. Full refund incoming today, no questions.

  I\'m going to pull the rest of batch 0412 from inventory and test it today. If you\'re open to it, I\'d love to send you the reformulated version when it\'s back — my treat, obviously. And I\'d love to understand what you used it with (other products on the same day, skin anywhere else).

  Thank you for telling me. This kind of feedback is how we actually get better.

  — Lena"

[ Send as-is ] [ Edit ] [ Call her instead ]`,
      },
    ]
  },
}

// 2. AI Return/Exchange Triage
export const RETURN_TRIAGE: Demo = {
  slug: 'return-triage',
  title: 'AI Return / Exchange Triage',
  subtitle: 'Routes returns by type ("regret buyer" vs "defective") with different workflows.',
  category: 'returns',
  industry: 'ecommerce',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Every return is not equal. The agent reads the return reason, looks at LTV and order history, and routes: auto-approve low-risk, offer swap instead of refund for regret buyers, escalate defects, push back politely on fraud signals.',
  howItWorks: [
    'Customer fills return form → agent classifies reason',
    'Regret buy → offers exchange or store credit first',
    'Defect → auto-approves refund, captures defect details, flags batch',
    'Wrong size/color → prepaid label + replacement shipped same day',
    'Fraud signals (4+ returns in 6 mo, bulk reorder patterns) → escalate',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'orderNumber', label: 'Order #', type: 'text' },
    { key: 'product', label: 'Product returned', type: 'text' },
    { key: 'reasonStated', label: 'Customer\'s reason', type: 'textarea' },
    {
      key: 'signal',
      label: 'Key signal',
      type: 'select',
      options: [
        { label: 'First-time customer, regret buy', value: 'regret' },
        { label: 'Defective product', value: 'defect' },
        { label: 'Repeat customer, first return', value: 'loyal' },
        { label: 'High return rate (3+ in 6mo)', value: 'risky' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Defect — auto-approve + flag batch',
      description: 'Soap crumbled in transit, repeat customer, no suspicion',
      values: {
        customerName: 'Andy Romano',
        orderNumber: '#28104',
        product: 'Lavender & Charcoal Bar (2-pack)',
        reasonStated: 'Both bars arrived cracked in half, packaging was intact. Photos attached.',
        signal: 'defect',
      },
    },
    {
      label: 'Regret — offer exchange',
      description: 'First-timer, bought a scent she doesn\'t like',
      values: {
        customerName: 'Tess Yardley',
        orderNumber: '#28221',
        product: 'Rose Geranium & Clay Bar',
        reasonStated: 'The scent is too strong for me — really floral. Would love to return.',
        signal: 'regret',
      },
    },
    {
      label: 'Repeat returner — push back politely',
      description: '4 returns in 5 months — might be a serial returner',
      values: {
        customerName: 'D. Tremblay',
        orderNumber: '#28298',
        product: 'Full-size Body Oil',
        reasonStated: 'Just didn\'t like it.',
        signal: 'risky',
      },
    },
  ],
  brainHook:
    'The Brain tracks return patterns across the base — it noticed the Rose Geranium bar has a 14% return rate vs 3% average. That signals a packaging or description issue (scent-forward customers aren\'t being warned it\'s intense). It drafts a note to Lena: "consider updating the product copy to set expectations".',
  generateOutput: (v, biz) => {
    const first = v.customerName.replace('.', '').split(' ')[0]

    if (v.signal === 'defect') {
      return [
        {
          type: 'email',
          recipient: v.customerName,
          subject: `Return approved + refund processing — ${v.orderNumber}`,
          body: `Hi ${first},

Really sorry about the broken bars — that shouldn\'t happen with our packaging. Refund is on its way (3–5 business days to your card).

No need to send them back — keep the pieces for decoration or toss them. We\'ve also queued a replacement 2-pack to ship tomorrow, on us.

Warm regards,
Lena`,
        },
        {
          type: 'dashboard',
          channelLabel: 'Internal flag — batch investigation',
          body: `🟠 DEFECT REPORT — Lavender & Charcoal Bar (2-pack)
  Order: ${v.orderNumber}
  Photos: received, both bars cracked, packaging intact

  THIS IS THE 2nd CRACKED-SOAP RETURN FROM BATCH 0408 IN 10 DAYS.

  Recommended action:
    • Pull remaining batch 0408 from shelves (47 units in stock)
    • Test drop from shipping height — may be a cure issue
    • Hold review queue for any more batch 0408 order complaints`,
        },
      ]
    }

    if (v.signal === 'regret') {
      return [
        {
          type: 'email',
          recipient: v.customerName,
          subject: `Let\'s find you something you\'ll love`,
          body: `Hi ${first},

Totally fair — rose geranium is one of our more intense scents (some people adore it, some people feel like they\'re in a garden center).

Instead of a straight return, would you let me send you two different bars as a swap? I\'d suggest:
  • Cedar + Juniper (warm, soft, not floral)
  • Oatmilk + Honey (sweet, mild, basically a hug)

Just reply with a yes and I\'ll ship them out free — and you can keep the rose geranium for the bathroom (or regift it).

Also — if you just want a straight refund, that\'s fine too. Zero pressure.

— Lena`,
        },
        {
          type: 'dashboard',
          channelLabel: 'Log',
          body: `${v.customerName} · regret buy · swap offered (not refund) · ${v.product} · LTV tag: new`,
        },
      ]
    }

    if (v.signal === 'risky') {
      return [
        {
          type: 'email',
          recipient: biz.ownerName + ' (Lena)',
          channelLabel: '🟠 Policy escalation — repeat returner',
          subject: `${v.customerName} — 4th return in 5 months, draft firm-but-fair reply`,
          body: `Return history:
  ${v.orderNumber} — "Just didn\'t like it" (current)
  #28102 — "Not for me"
  #27710 — "Scent was off"
  #27340 — "Changed mind"

Returning to this level is outside our normal pattern. I\'m recommending we move this customer to exchange-only (no refunds).

DRAFT REPLY:

"Hi D.,

Thanks for the note on ${v.product.toLowerCase()}. We\'ve seen quite a few returns from you recently — which suggests our products might not be quite the right fit. Instead of a refund, I\'d love to offer an exchange or store credit this time. We want you to end up with something you actually love.

If scent is the tricky part, our $8 sampler set is a great way to test 5 bars before committing — happy to throw one in at no charge.

Let me know what works.

— Lena"

[ Send as-is ] [ Issue refund anyway ] [ I\'ll handle directly ]`,
      },
      ]
    }

    return [
      {
        type: 'email',
        recipient: v.customerName,
        subject: `Return received — thanks for the note`,
        body: `Hi ${first} — refund processing, 3–5 business days. — Lena`,
      },
    ]
  },
}

// 3. AI Winback Agent (ecomm)
export const WINBACK_ECOMM: Demo = {
  slug: 'winback-ecommerce',
  title: 'AI Winback Agent',
  subtitle: 'Personalized winback sequences based on purchase history.',
  category: 'winback',
  industry: 'ecommerce',
  business: b,
  tier2Price: '$2,500 build + $200/mo',
  buildTime: '2 weeks',
  description:
    'The single biggest untapped revenue source in most Shopify stores is lapsed one-time buyers. The agent reads purchase history, predicts the right re-engagement window per SKU, and sends a winback in Lena\'s storytelling voice.',
  howItWorks: [
    'Reads Shopify order history + product consumption cycle (bar soap ≈ 6 weeks)',
    'Predicts "should\'ve run out by now" window per customer',
    'Sends a personalized nudge 1.2x past expected runout',
    'Tier 1 nudge: story-led, no discount',
    'Tier 2 (if silent 21 days): soft incentive, free shipping',
    'Tracks winback reactivation rate',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Email', type: 'text' },
    { key: 'lastProduct', label: 'Last product bought', type: 'text' },
    { key: 'lastOrderDate', label: 'Last order', type: 'text' },
    { key: 'expectedRunout', label: 'Expected runout', type: 'text' },
  ],
  scenarios: [
    {
      label: 'Lapsed bar-soap buyer',
      description: 'Bought 2 bars 10 weeks ago, well past re-up',
      values: {
        customerName: 'Anton Vega',
        customerEmail: 'anton.vega@example.com',
        lastProduct: 'Cedar + Juniper Bar (2-pack)',
        lastOrderDate: '10 weeks ago',
        expectedRunout: '6 weeks ago',
      },
    },
    {
      label: 'Gift buyer — nudge with a new angle',
      description: 'Bought once as a gift, might buy again for birthday',
      values: {
        customerName: 'Priya Ramnath',
        customerEmail: 'priya.r@example.com',
        lastProduct: 'Gift box (3 bars + balm)',
        lastOrderDate: '11 months ago',
        expectedRunout: 'N/A — gift',
      },
    },
  ],
  brainHook:
    'The Brain remembers Priya\'s order shipped to an address in Portland, not her billing address in Seattle — classic gift pattern. The winback skips "run out?" messaging and instead pitches: "Mother\'s Day is in 3 weeks, want me to hold a gift box with your name on it?"',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    const isGift = v.expectedRunout.toLowerCase().includes('gift')

    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: isGift ? `mother\'s day is closer than you think` : `still using the ${v.lastProduct.split('+')[0].trim().toLowerCase()}?`,
        body: isGift
          ? `Hi ${first},

Totally not pushing, but — mother\'s day is 3 weeks out, and the gift box you sent last year was one of our most-loved.

We\'ve got a new seasonal in the lineup (rose hip + sea salt) that just came back this spring. If you want to send another this year, I can hold one with your name on it and ship it anywhere.

Reply with "hold one" and we\'ll set it up. Or "no thanks" and I\'ll stop bugging you 💛

Warmly,
Lena
Cedar Soap Co. · our little studio in bend`
          : `Hi ${first},

Quick note from the studio — your cedar + juniper bars were cut back in February and would typically last a person 8–10 weeks of daily showers. Got me thinking you might be down to a sliver by now 🪵

We cut a fresh batch last week. The cedar came in earlier than usual this year and it\'s honestly the best batch I\'ve made.

No discount, no urgency — just wanted to say we\'re here when you\'re ready for the re-up.

Warmly,
Lena
Cedar Soap Co.`,
      },
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        channelLabel: '(21 days later) Soft incentive — queued',
        subject: `free shipping on your next re-up`,
        body: `Hi ${first} —

Still thinking about you. If a small push helps: free shipping on your next order through the end of the month, no code needed (just click the link in this email).

If now\'s not the time, zero worries, and I\'ll give you some quiet space going forward 💛

— Lena`,
      },
    ]
  },
}

// 4. AI Review Harvester (ecomm)
export const REVIEW_HARVESTER_ECOMM: Demo = {
  slug: 'review-harvester-ecommerce',
  title: 'AI Review Harvester',
  subtitle: 'Post-delivery + 14-day review asks. Product-specific. Reply drafting for one-tap.',
  category: 'review-harvester',
  industry: 'ecommerce',
  business: b,
  tier2Price: '$2,000 build + $175/mo',
  buildTime: '2 weeks',
  description:
    'Most Shopify review requests are an email blast with zero personality. This one waits 14 days (long enough they\'ve tried it, short enough they remember), references the specific product, and asks for a line about the scent/feel.',
  howItWorks: [
    'Carrier marks "delivered" → agent schedules ask for 14 days later',
    'Product-specific ask: "the cedar + juniper especially" language',
    'Review posts → agent drafts Lena-voice reply',
    'Low stars → pause public reply, alert Lena',
    'Positive reviews with photos → requests consent to feature on product page',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'customerEmail', label: 'Email', type: 'text' },
    { key: 'product', label: 'Product', type: 'text' },
    { key: 'daysSinceDelivery', label: 'Days since delivery', type: 'number', defaultValue: '14' },
  ],
  scenarios: [
    {
      label: '14 days post-delivery',
      description: 'Standard ask for a single bar',
      values: {
        customerName: 'Kate Simons',
        customerEmail: 'kate.simons@example.com',
        product: 'Cedar + Juniper Bar (2-pack)',
        daysSinceDelivery: '14',
      },
    },
  ],
  brainHook:
    'The Brain tracks individual product review velocity — it knows the Cedar + Juniper bar converts 18% to review (above average), so asks go out with slight warmth vs. a stiffer default. A product with low review velocity gets an extra nudge and a small incentive.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]
    return [
      {
        type: 'email',
        recipient: `${v.customerName} <${v.customerEmail}>`,
        subject: `how\'s the ${v.product.split('+')[0].trim().toLowerCase()} treating you?`,
        body: `Hi ${first},

Two weeks in — the cedar + juniper bars should be lathering nicely by now (our soaps cure for 4+ weeks before shipping, so they\'re at their best in the first month of use).

If you have 30 seconds, would you leave a review? Even a single line about the scent or feel helps other people pick their first bar — and it means a lot to a small studio like ours.

  → Leave a review: https://cedarsoap.co/reviews/${v.product.split(' ')[0].toLowerCase()}

Thanks ${first},
— Lena`,
      },
      {
        type: 'email',
        recipient: biz.ownerName + ' (Lena)',
        channelLabel: '(When review posts) Draft reply',
        subject: `${first} left you a 5-star on Cedar + Juniper`,
        body: `"Opened the box and the smell alone was worth it — warm, piney, not perfumey. Lathers beautifully and doesn\'t leave my skin tight. I\'m ordering the 4-pack."

DRAFT REPLY:
"Thank you ${first} — the cedar this batch came from a windfall up by Deschutes River, you could smell the whole studio while the soap was curing. So glad you loved it. — Lena"

[ Approve & post ] [ Edit ]`,
      },
    ]
  },
}

// 5. AI Fulfillment Exception Handler
export const FULFILLMENT_HANDLER: Demo = {
  slug: 'fulfillment-handler',
  title: 'AI Fulfillment Exception Handler',
  subtitle: 'Watches for late packages, address issues, lost shipments. Proactively contacts customer.',
  category: 'fulfillment',
  industry: 'ecommerce',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'The best customer service move is reaching out before the customer has to. This agent watches every order, detects delays and delivery exceptions, and sends an apology + resolution before the customer notices — cutting WISMO tickets and refund requests.',
  howItWorks: [
    'Monitors Shopify orders + carrier tracking events',
    'Flags: stalled 3+ days, returned to sender, delivery exception, wrong address',
    'Drafts proactive outreach in Lena\'s voice ("heads up, your package is…")',
    'For lost shipments → auto-approves reship without asking',
    'Dashboards the exception rate per carrier (USPS vs Purolator)',
  ],
  inputFields: [
    { key: 'customerName', label: 'Customer', type: 'text' },
    { key: 'orderNumber', label: 'Order #', type: 'text' },
    { key: 'lastTrackingEvent', label: 'Last carrier event', type: 'text' },
    { key: 'daysStalled', label: 'Days since last event', type: 'number' },
    {
      key: 'exceptionType',
      label: 'Exception type',
      type: 'select',
      options: [
        { label: 'Stalled in transit', value: 'stalled' },
        { label: 'Delivery exception (no access)', value: 'exception' },
        { label: 'Returned to sender — bad address', value: 'rts' },
        { label: 'Likely lost (7+ days no update)', value: 'lost' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Stalled 4 days',
      description: 'Scanned in Phoenix, no update since',
      values: {
        customerName: 'Andy Romano',
        orderNumber: '#28104',
        lastTrackingEvent: 'Received at Portland sort facility',
        daysStalled: '4',
        exceptionType: 'stalled',
      },
    },
    {
      label: 'Bad address — RTS',
      description: 'Customer typo\'d zip, package came back',
      values: {
        customerName: 'Julia Park',
        orderNumber: '#28198',
        lastTrackingEvent: 'Returned to sender — undeliverable',
        daysStalled: '1',
        exceptionType: 'rts',
      },
    },
  ],
  brainHook:
    'The Brain notices patterns — if Purolator has 4x our normal exception rate this week in the Pacific Northwest, it pre-emptively flags all in-flight shipments in that region and bumps them to priority if we re-ship.',
  generateOutput: (v, biz) => {
    const first = v.customerName.split(' ')[0]

    if (v.exceptionType === 'stalled') {
      return [
        {
          type: 'email',
          recipient: v.customerName,
          subject: `heads up on your cedar soap order (${v.orderNumber})`,
          body: `Hi ${first},

Just noticed your package has been sitting at the Portland sort facility for 4 days without a tracking update — a little longer than we\'d expect. USPS usually moves things in 24–48 hrs.

I\'ve opened a trace with them. In the meantime, here\'s what I\'m doing:
  1. Giving them until end of day Monday to move it
  2. If nothing by Tuesday morning, I\'ll ship you a replacement — no need to return the original if it shows up later

No action needed from you. I\'ll email again Tuesday with either a tracking update or a reship notification.

Sorry about the wait — hate when shipping doesn\'t match the care that went into the batch.

Warmly,
Lena`,
        },
      ]
    }

    if (v.exceptionType === 'rts') {
      return [
        {
          type: 'email',
          recipient: v.customerName,
          subject: `your package came back to us — address hiccup?`,
          body: `Hi ${first},

USPS returned your order to our studio today — they flagged the address as undeliverable. Looking at the label, the postal code reads "97701-A" which doesn\'t match the street address you gave.

Can you reply with the correct postal code and I\'ll reship tomorrow? No extra cost, obviously.

Warmly,
Lena`,
        },
      ]
    }

    return [
      {
        type: 'email',
        recipient: v.customerName,
        subject: `reshipping your order, sorry about this`,
        body: `Hi ${first},

Your order has been stuck in transit for ${v.daysStalled} days with no movement — calling it lost and reshipping. New tracking coming within 24hrs.

If the original surfaces, please keep it with our apologies.

— Lena`,
      },
    ]
  },
}

// 6. AI Ad-Copy + Creative Drafter
export const AD_COPY_DRAFTER: Demo = {
  slug: 'ad-copy-drafter',
  title: 'AI Ad-Copy + Creative Drafter',
  subtitle: 'Pulls winning-product data, drafts ad variants in brand voice for review.',
  category: 'ad-copy',
  industry: 'ecommerce',
  business: b,
  tier2Price: '$3,000 build + $250/mo',
  buildTime: '2 weeks',
  description:
    'Meta ads eat time and budget. The agent reads which products have the best LTV / repeat rate / margin, then drafts ad copy variants in Lena\'s voice — hook, body, CTA — for Meta + Google + email, ready for review and launch.',
  howItWorks: [
    'Weekly: reads Shopify product performance (LTV, repeat rate, margin)',
    'Identifies the "push harder" candidates and any emerging winners',
    'Drafts 3 ad variants per product in brand voice',
    'Includes hook, image direction, CTA + landing page angle',
    'Drops into a review queue for Lena to approve/edit',
  ],
  inputFields: [
    { key: 'product', label: 'Product', type: 'text' },
    { key: 'angle', label: 'Angle', type: 'text' },
    {
      key: 'channel',
      label: 'Channel',
      type: 'select',
      options: [
        { label: 'Meta (Facebook / Instagram)', value: 'meta' },
        { label: 'Google search', value: 'google' },
        { label: 'Email campaign', value: 'email' },
      ],
    },
  ],
  scenarios: [
    {
      label: 'Meta ad — Cedar + Juniper',
      description: 'Push the best-LTV bar with a sensory hook',
      values: {
        product: 'Cedar + Juniper Bar',
        angle: 'Sensory — the smell sells it',
        channel: 'meta',
      },
    },
    {
      label: 'Mother\'s Day gift box',
      description: 'Seasonal push via email',
      values: {
        product: 'Mother\'s Day Gift Box',
        angle: 'Ready-to-ship, handwritten note, no assembly',
        channel: 'email',
      },
    },
  ],
  brainHook:
    'The Brain tracks every ad\'s CTR + ROAS tied back to creative — it stops suggesting angles that underperformed 3x in a row and doubles down on proven hooks ("made in a 400 sq ft studio" consistently outperforms "small batch").',
  generateOutput: (v, biz) => {
    if (v.channel === 'meta') {
      return [
        {
          type: 'multi-channel',
          channelLabel: 'Meta ad — Variant A (sensory hook)',
          body: `HOOK: "the whole studio smells like cedar for a week after i cut this batch."

BODY:
our cedar + juniper bar starts with ethically sourced cedarwood oil and juniper berries — warm, piney, nothing synthetic. lathers soft, rinses clean, won\'t dry you out.

cured 6 weeks in a bend garage. made by two people.

CTA: "try the 2-pack →"
VISUAL: top-down of fresh-cut bars on the butcher block, steam from the cure rack visible. Natural light. No filter.`,
        },
        {
          type: 'multi-channel',
          channelLabel: 'Meta ad — Variant B (studio story)',
          body: `HOOK: "made in a 400 sq ft studio in bend, by two people."

BODY:
no factory, no contract manufacturer, no "artisan-inspired" marketing language. just two sisters, a cold-process saponification setup, and an obsession with cedar.

if the product page matters more than the influencer post — this is for you.

CTA: "meet the bar →"
VISUAL: behind-the-scenes photo of Lena and co-founder cutting loaves. Phone photo, slightly grainy. Honest.`,
        },
        {
          type: 'multi-channel',
          channelLabel: 'Meta ad — Variant C (direct-to-skeptic)',
          body: `HOOK: "if you\'ve been disappointed by \'small-batch\' soap before, read this."

BODY:
most \'small batch\' is just marketing on a 50,000-unit run. ours is 180 bars per cut, poured by hand, cured 6 weeks before it leaves the studio.

if you want to see the difference, here\'s the $8 sampler — three 20g bars, patch-test friendly.

CTA: "grab the sampler →"
VISUAL: three unwrapped bars on a linen cloth, macro shot, visible texture.`,
        },
      ]
    }
    return [
      {
        type: 'multi-channel',
        channelLabel: 'Email — subject lines',
        body: `3 subject line options:
  1. "a small studio, a handwritten note, a box that ships tomorrow"
  2. "mother\'s day gift boxes — now open for orders"
  3. "she\'ll open it and go 'where did you find this?'"

Open-rate leaders historically: personal voice #1 > specific #3 > event-driven #2.`,
      },
      {
        type: 'multi-channel',
        channelLabel: 'Email body draft',
        body: `Hey [firstname],

Quick note from the studio — mother\'s day gift boxes are ready to ship. Each one has:
  • 3 full-size bars (cedar + juniper, oatmilk + honey, rose geranium)
  • 1 travel-size balm
  • A card you can personalize (I write them by hand, nothing printed)

We ship within 24 hours of order, and tracking lands in the inbox the second it\'s scanned.

Reserve one below — once we\'re out, we\'re out (400 boxes this season).

→ [Reserve a box]

Warmly,
Lena`,
      },
    ]
  },
}

export const ECOMMERCE_DEMOS: Demo[] = [
  CS_AGENT_ECOMM,
  RETURN_TRIAGE,
  WINBACK_ECOMM,
  REVIEW_HARVESTER_ECOMM,
  FULFILLMENT_HANDLER,
  AD_COPY_DRAFTER,
]
