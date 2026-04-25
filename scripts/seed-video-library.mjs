// Bulk-upload the 48 rendered MP4s into Vercel Blob + KV manifest.
// Run AFTER deployment, when BLOB_READ_WRITE_TOKEN + KV_REST_API_* are set.
//
// Usage:
//   ADMIN_KEY=<your_secret> BASE_URL=https://zyphlabs.com \
//   VIDEOS_DIR='/path/to/zyphlabs-demo-videos' \
//   node scripts/seed-video-library.mjs

import fs from 'node:fs'
import path from 'node:path'

const VIDEOS_DIR = process.env.VIDEOS_DIR || './zyphlabs-demo-videos'
const BASE = process.env.BASE_URL || 'https://zyphlabs.com'
const KEY = process.env.ADMIN_KEY || ''

// Mirror the demo registry: slug -> {industry, business, hook, title}
const META = {
  // Construction — Henderson HVAC, Dallas TX
  'ai-receptionist-construction':    { industry: 'construction', business: 'Henderson HVAC',          title: 'AI Receptionist',          hook: 'Your phone rings at 11pm. 22°F outside. Watch what happens.' },
  'ai-quote-construction':           { industry: 'construction', business: 'Henderson HVAC',          title: 'AI Quote + Follow-Up',     hook: "It's 9pm. You owe 5 quotes by morning. Watch this." },
  'task-tracker-construction':       { industry: 'construction', business: 'Henderson HVAC',          title: 'Autonomous Task Tracker',  hook: "A job slipped 3 days. The customer doesn't know yet. Watch this." },
  'ai-collections-construction':     { industry: 'construction', business: 'Henderson HVAC',          title: 'AI Collections Agent',     hook: '$4,200 invoice. 21 days late. Watch this email write itself.' },
  'review-harvester-construction':   { industry: 'construction', business: 'Henderson HVAC',          title: 'AI Review Harvester',      hook: "Job ended 90 minutes ago. They're still happy. Watch." },
  'on-call-triage-construction':     { industry: 'construction', business: 'Henderson HVAC',          title: 'AI On-Call Triage',        hook: '2am call. No heat. Two kids. Watch the right tech get paged.' },
  // Appointment — Aurora Family Dental, Sacramento CA
  'booking-concierge-appt':          { industry: 'appointment',  business: 'Aurora Family Dental',    title: 'AI Booking Concierge',     hook: 'Patient calls at 9:42pm. Front desk is closed. Watch this.' },
  'no-show-defender':                { industry: 'appointment',  business: 'Aurora Family Dental',    title: 'AI No-Show Defender',      hook: '3 past no-shows. $280 filling on Friday. Watch this save it.' },
  'rebooking-appt':                  { industry: 'appointment',  business: 'Aurora Family Dental',    title: 'AI Rebooking Agent',       hook: 'Last cleaning was 6 months ago. They never came back. Until now.' },
  'insurance-chaser':                { industry: 'appointment',  business: 'Aurora Family Dental',    title: 'AI Insurance Chaser',      hook: 'Claim is 30 days late. Watch the AI call the insurer.' },
  'post-visit-followup':             { industry: 'appointment',  business: 'Aurora Family Dental',    title: 'AI Post-Visit Follow-Up',  hook: '24 hours after extraction. Watch this catch a complication.' },
  'review-harvester-appt':           { industry: 'appointment',  business: 'Aurora Family Dental',    title: 'AI Review Harvester',      hook: "Kid's first dentist visit. Mom is glowing. Watch this turn into a 5-star." },
  // Retail — Cedar Valley Cafe, Boulder CO
  'customer-concierge-retail':       { industry: 'retail',       business: 'Cedar Valley Cafe',       title: 'AI Customer Concierge',    hook: 'IG DM at 11pm: "Are you open Sunday?" Watch this.' },
  'winback-retail':                  { industry: 'retail',       business: 'Cedar Valley Cafe',       title: 'AI Winback Agent',         hook: "Linda hasn't been in 6 weeks. Her oat matcha's on us. Watch." },
  'inventory-retail':                { industry: 'retail',       business: 'Cedar Valley Cafe',       title: 'AI Inventory Assistant',   hook: '8 oat milk cartons left. Saturday brunch is in 2 days.' },
  'schedule-optimizer-retail':       { industry: 'retail',       business: 'Cedar Valley Cafe',       title: 'AI Schedule Optimizer',    hook: 'Memorial Day weekend. Sunny Saturday. Watch this build the roster.' },
  'social-drafter-retail':           { industry: 'retail',       business: 'Cedar Valley Cafe',       title: 'AI Social Content Drafter', hook: 'Snap a photo at 7am. Get 3 caption options by 7:01.' },
  'review-harvester-retail':         { industry: 'retail',       business: 'Cedar Valley Cafe',       title: 'AI Review Harvester',      hook: 'Saturday brunch ended great. Watch this turn into a 5-star Sunday morning.' },
  // E-commerce — Cedar Soap Co, Bend OR
  'cs-agent-ecommerce':              { industry: 'ecommerce',    business: 'Cedar Soap Co',           title: 'AI Customer Service',      hook: 'DM at midnight: "Where\'s my order?" Watch the agent reply.' },
  'return-triage':                   { industry: 'ecommerce',    business: 'Cedar Soap Co',           title: 'AI Return / Exchange',     hook: 'Repeat returner. 4th in 5 months. Watch this push back, kindly.' },
  'winback-ecommerce':               { industry: 'ecommerce',    business: 'Cedar Soap Co',           title: 'AI Winback Agent',         hook: '10 weeks since their last bar. Watch.' },
  'review-harvester-ecommerce':      { industry: 'ecommerce',    business: 'Cedar Soap Co',           title: 'AI Review Harvester',      hook: '14 days post-delivery. Watch this turn into a product review.' },
  'fulfillment-handler':             { industry: 'ecommerce',    business: 'Cedar Soap Co',           title: 'AI Fulfillment Handler',   hook: "USPS hasn't scanned it in 4 days. Watch this email beat the complaint." },
  'ad-copy-drafter':                 { industry: 'ecommerce',    business: 'Cedar Soap Co',           title: 'AI Ad-Copy Drafter',       hook: '3 Meta ad variants in your brand voice. Drafted.' },
  // Pro Services — Whitman & Ross LLP, San Francisco CA
  'intake-professional':             { industry: 'professional', business: 'Whitman & Ross LLP',     title: 'AI Intake + Qualification', hook: 'A $3.2M deal walks in. Watch the conflict check + intake.' },
  'engagement-letter-drafter':       { industry: 'professional', business: 'Whitman & Ross LLP',     title: 'AI Engagement Letter',     hook: 'Intake call ended 5 minutes ago. Watch the engagement letter draft itself.' },
  'time-capture':                    { industry: 'professional', business: 'Whitman & Ross LLP',     title: 'AI Time Capture',          hook: '"Where did my Wednesday go?" Watch this propose every entry.' },
  'collections-professional':        { industry: 'professional', business: 'Whitman & Ross LLP',     title: 'AI Collections',           hook: '8-year client. 21 days late. Watch the soft nudge get drafted.' },
  'relationship-touch':              { industry: 'professional', business: 'Whitman & Ross LLP',     title: 'AI Relationship Touch',    hook: "Jane hasn't heard from you in 11 weeks. Watch this fix it." },
  'doc-request-nudger':              { industry: 'professional', business: 'Whitman & Ross LLP',     title: 'AI Document Nudger',       hook: '10 days to closing. 3 docs missing. Watch this nudge.' },
  // SaaS — Nimbus Data, Austin TX
  'ai-sdr':                          { industry: 'saas',         business: 'Nimbus Data',            title: 'AI SDR / Demo Scheduler',  hook: "Hot inbound at 2am. You're asleep. Watch the SDR book it." },
  'demo-prep':                       { industry: 'saas',         business: 'Nimbus Data',            title: 'AI Demo Prep',             hook: '11am demo with a Shopify Plus brand. Watch the brief get written.' },
  'trial-activation':                { industry: 'saas',         business: 'Nimbus Data',            title: 'AI Trial Activation',      hook: "Day 2 of trial. They're stuck on Klaviyo OAuth. Watch." },
  'churn-risk':                      { industry: 'saas',         business: 'Nimbus Data',            title: 'AI Churn Risk Detector',   hook: 'Usage just dropped 44%. Renewal in 60 days.' },
  'expansion-opportunity':           { industry: 'saas',         business: 'Nimbus Data',            title: 'AI Expansion Surfacer',    hook: '4 new team invites in 7 days. Watch this become $80/mo more MRR.' },
  'post-demo-followup':              { industry: 'saas',         business: 'Nimbus Data',            title: 'AI Post-Demo Follow-Up',   hook: 'Demo ended 30 min ago. Watch the follow-up referencing real moments.' },
  // Field Services — Peak Plumbing, Houston TX
  'dispatch-triage':                 { industry: 'field',        business: 'Peak Plumbing',          title: 'AI Dispatch Triage',       hook: 'Midnight call. Basement flooding. Watch the right tech get paged.' },
  'eta-portal':                      { industry: 'field',        business: 'Peak Plumbing',          title: 'AI Customer ETA Portal',   hook: '"How close is the plumber?" Domino\'s tracker — for plumbing.' },
  'instant-invoice':                 { industry: 'field',        business: 'Peak Plumbing',          title: 'AI Instant-Invoice',       hook: 'Job ended 30 minutes ago. Invoice is already in their inbox.' },
  'maintenance-plan':                { industry: 'field',        business: 'Peak Plumbing',          title: 'AI Maintenance Plan',      hook: '$372 emergency just paid. Watch this pitch the maintenance plan.' },
  'review-harvester-field':          { industry: 'field',        business: 'Peak Plumbing',          title: 'AI Review Harvester',      hook: "They were panicking 3 hours ago. Now they're dry." },
  'collections-field':               { industry: 'field',        business: 'Peak Plumbing',          title: 'AI Collections',           hook: '14 days late on a $300 invoice. Watch the warm nudge.' },
  // Creative — Alder & Ash Studio, Sonoma CA
  'inquiry-proposal':                { industry: 'creative',     business: 'Alder & Ash Studio',     title: 'AI Inquiry + Proposal',    hook: 'Wedding inquiry at 11pm. Watch the proposal draft in 10 minutes.' },
  'contract-deposit':                { industry: 'creative',     business: 'Alder & Ash Studio',     title: 'AI Contract + Deposit',    hook: 'They said yes. Watch the contract + deposit fire automatically.' },
  'pre-shoot':                       { industry: 'creative',     business: 'Alder & Ash Studio',     title: 'AI Pre-Shoot Brief',       hook: "72 hours before the wedding. Watch the brief land on Maya's phone." },
  'gallery-delivery':                { industry: 'creative',     business: 'Alder & Ash Studio',     title: 'AI Gallery Delivery',      hook: 'Gallery is ready. Watch the delivery note write itself.' },
  'rebooking-creative':              { industry: 'creative',     business: 'Alder & Ash Studio',     title: 'AI Rebooking',             hook: 'Their 1st anniversary is 6 weeks out. Watch the nudge.' },
  'testimonial-harvester':           { industry: 'creative',     business: 'Alder & Ash Studio',     title: 'AI Testimonial Harvester', hook: 'Gallery delivered 7 days ago. Watch this become a portfolio testimonial.' },
}

const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'))
console.log(`Seeding ${files.length} files from ${VIDEOS_DIR}`)

let done = 0, failed = 0
for (const file of files) {
  const slug = file.replace(/\.mp4$/, '')
  const meta = META[slug] || { industry: 'other', title: slug }
  const filepath = path.join(VIDEOS_DIR, file)
  const buf = fs.readFileSync(filepath)

  done++
  process.stdout.write(`[${done}/${files.length}] ${slug} (${(buf.length / 1024 / 1024).toFixed(1)}MB)... `)

  try {
    // Step 1: ask the server for an upload URL via handleUpload
    const blobUrl = `${BASE}/api/admin/videos/upload${KEY ? `?key=${KEY}` : ''}`

    // The @vercel/blob/client `upload()` is browser-only. From Node, we
    // call the upload route directly with the file in a multipart-style
    // payload. Easiest: use the public Vercel Blob `put` directly with
    // the BLOB_READ_WRITE_TOKEN, then POST manifest-only to a small
    // server endpoint. But that requires the token.
    //
    // To keep this seed simple AND work without the token locally, we
    // hit a dedicated admin-only seed endpoint that accepts the file
    // directly. (See /api/admin/videos/seed below.)
    const r = await fetch(`${BASE}/api/admin/videos/seed${KEY ? `?key=${KEY}` : ''}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/octet-stream',
        'x-video-slug': slug,
        'x-video-title': encodeURIComponent(meta.title),
        'x-video-hook': encodeURIComponent(meta.hook || ''),
        'x-video-industry': meta.industry,
        'x-video-business': encodeURIComponent(meta.business || ''),
        'x-video-demo-slug': slug,
      },
      body: buf,
    })
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
    process.stdout.write('✓\n')
  } catch (e) {
    failed++
    process.stdout.write(`✗ ${e.message}\n`)
  }
}

console.log(`\nDone: ${done - failed}/${files.length} uploaded, ${failed} failed.`)
