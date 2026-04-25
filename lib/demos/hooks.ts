// Hook copy for the social video version of each demo. One short, punchy
// line that frames the customer scenario and creates curiosity in the
// first 3 seconds. Used at the top of /demos/[slug]/video pages.

export const VIDEO_HOOKS: Record<string, string> = {
  // Construction — Henderson HVAC, Dallas TX
  'ai-receptionist-construction': 'Your phone rings at 11pm. 22°F outside. Watch what happens.',
  'ai-quote-construction': "It's 9pm. You owe 5 quotes by morning. Watch this.",
  'task-tracker-construction': "A job slipped 3 days. The customer doesn't know yet. Watch this.",
  'ai-collections-construction': '$4,200 invoice. 21 days late. Watch this collection email write itself.',
  'review-harvester-construction': "Job ended 90 minutes ago. They're still happy. Watch.",
  'on-call-triage-construction': '2am call. No heat. Two kids. Watch the right tech get paged.',

  // Appointment — Aurora Family Dental, Sacramento CA
  'booking-concierge-appt': 'Patient calls at 9:42pm. Front desk is closed. Watch this.',
  'no-show-defender': '3 past no-shows. $280 filling on Friday. Watch this save it.',
  'rebooking-appt': 'Last cleaning was 6 months ago. They never came back. Until now.',
  'insurance-chaser': 'Claim is 30 days late. Watch the AI call the insurer.',
  'post-visit-followup': '24 hours after extraction. Watch this catch a complication.',
  'review-harvester-appt': "Kid's first dentist visit. Mom is glowing. Watch this turn into a 5-star.",

  // Retail — Cedar Valley Cafe, Boulder CO
  'customer-concierge-retail': 'IG DM at 11pm: "Are you open Sunday?" Watch this.',
  'winback-retail': "Linda hasn't been in 6 weeks. Her oat matcha's on us. Watch.",
  'inventory-retail': '8 oat milk cartons left. Saturday brunch is in 2 days. Watch.',
  'schedule-optimizer-retail': 'Memorial Day weekend. Sunny Saturday. Watch this build the roster.',
  'social-drafter-retail': 'Snap a photo at 7am. Get 3 caption options by 7:01.',
  'review-harvester-retail': 'Saturday brunch ended great. Watch this turn into a 5-star Sunday morning.',

  // E-commerce — Cedar Soap Co, Bend OR
  'cs-agent-ecommerce': 'DM at midnight: "Where\'s my order?" Watch the agent reply.',
  'return-triage': 'Repeat returner. 4th in 5 months. Watch this push back, kindly.',
  'winback-ecommerce': 'It has been 10 weeks since their last bar. They should be running out. Watch.',
  'review-harvester-ecommerce': '14 days post-delivery. Watch this turn into a product review.',
  'fulfillment-handler': "USPS hasn't scanned it in 4 days. Watch this email beat the complaint.",
  'ad-copy-drafter': '3 Meta ad variants in your brand voice. Watch them get drafted.',

  // Professional Services — Whitman & Ross LLP, San Francisco CA
  'intake-professional': 'A $3.2M deal walks in. Watch the conflict check + intake.',
  'engagement-letter-drafter': 'Intake call ended 5 minutes ago. Watch the engagement letter draft itself.',
  'time-capture': '"Where did my Wednesday go?" Watch this propose every entry.',
  'collections-professional': '8-year client. 21 days late. Watch the soft nudge get drafted.',
  'relationship-touch': "Jane hasn't heard from you in 11 weeks. Watch this fix it.",
  'doc-request-nudger': '10 days to closing. 3 docs missing. Watch this nudge.',

  // B2B SaaS — Nimbus Data, Austin TX
  'ai-sdr': "Hot inbound at 2am. You're asleep. Watch the SDR book it.",
  'demo-prep': '11am demo with a Shopify Plus brand. Watch the brief get written.',
  'trial-activation': "Day 2 of trial. They're stuck on Klaviyo OAuth. Watch this.",
  'churn-risk': 'Usage just dropped 44%. Renewal in 60 days. Watch this save it.',
  'expansion-opportunity': '4 new team invites in 7 days. Watch this become $80/mo more MRR.',
  'post-demo-followup': 'Demo ended 30 min ago. Watch the follow-up referencing real moments.',

  // Field Services — Peak Plumbing, Houston TX
  'dispatch-triage': 'Midnight call. Basement flooding. Watch the right tech get paged.',
  'eta-portal': '"How close is the plumber?" The Domino\'s tracker — for plumbing.',
  'instant-invoice': "Job ended 30 minutes ago. Invoice is already in their inbox.",
  'maintenance-plan': '$372 emergency just paid. Watch this pitch the maintenance plan.',
  'review-harvester-field': "They were panicking 3 hours ago. Now they're dry. Watch this.",
  'collections-field': '14 days late on a $300 invoice. Watch the warm nudge.',

  // Creative — Alder & Ash Studio, Sonoma CA
  'inquiry-proposal': 'Wedding inquiry at 11pm. Watch the proposal draft in 10 minutes.',
  'contract-deposit': 'They said yes. Watch the contract + deposit fire automatically.',
  'pre-shoot': "72 hours before the wedding. Watch the brief land on Maya's phone.",
  'gallery-delivery': 'Gallery is ready. Watch the delivery note write itself.',
  'rebooking-creative': 'Their 1st anniversary is 6 weeks out. Watch the nudge.',
  'testimonial-harvester': 'Gallery delivered 7 days ago. Watch this become a portfolio testimonial.',
}

export function getVideoHook(slug: string, fallback: string): string {
  return VIDEO_HOOKS[slug] ?? fallback
}
