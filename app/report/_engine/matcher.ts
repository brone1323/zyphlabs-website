// Turns assessment answers into a full ReportData by picking 5 recs per tier
// from the library, synthesizing a summary, and computing the headline numbers.

import type { AssessmentAnswers, LibraryRec, Recommendation, ReportData } from './types'
import { resolve } from './types'
import { LIBRARY } from './library'

export interface EngineConfig {
  library?: LibraryRec[]
  recsPerTier?: number
}

export function generateReport(
  answers: AssessmentAnswers,
  config: EngineConfig = {},
): ReportData {
  const library = config.library ?? LIBRARY
  const N = config.recsPerTier ?? 5

  // 1. Filter to applicable recs, sort by priority within each tier
  const applicable = library.filter((rec) => rec.triggers(answers))
  const byTier: Record<1 | 2 | 3, LibraryRec[]> = { 1: [], 2: [], 3: [] }
  for (const rec of applicable) byTier[rec.tier].push(rec)
  for (const tier of [1, 2, 3] as const) {
    byTier[tier].sort((a, b) => b.priority(answers) - a.priority(answers))
    byTier[tier] = byTier[tier].slice(0, N)
  }

  // 2. Render each picked rec against the answers
  const recommendations: Recommendation[] = [
    ...byTier[1].map((r) => instantiate(r, answers)),
    ...byTier[2].map((r) => instantiate(r, answers)),
    ...byTier[3].map((r) => instantiate(r, answers)),
  ]

  // 3. Pick Top 3 for Starting Point — prioritize high-ROI + low-effort.
  // Effort multiplier: Easy = 3x, Medium = 1.5x, Big = 1x.
  const effortMult = (e: string) => (e === 'Easy' ? 3 : e === 'Medium' ? 1.5 : 1)
  const allPicked = [...byTier[1], ...byTier[2], ...byTier[3]]
  const topThreeIds = allPicked
    .map((r) => ({ r, score: r.priority(answers) * effortMult(r.effort) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ r }) => r.id)

  // 4. Compute headline numbers
  const { hoursPerWeekRecoverable, dollarsPerMonthRecoverable } = calculateHeadline(answers)

  // 5. Compose the final ReportData
  return {
    id: answers.reportId,
    ownerName: answers.ownerName,
    ownerFirstName: answers.ownerFirstName,
    company: answers.company,
    trade: answers.trade,
    crewSize: formatCrewSize(answers.crewSize),
    location: answers.location,
    yearsInBusiness: answers.yearsInBusiness,
    hoursPerWeekRecoverable,
    dollarsPerMonthRecoverable,
    whatWeHeard: synthesizeWhatWeHeard(answers),
    doingRight: identifyStrengths(answers),
    recommendations,
    topThreeIds,
    reviews: ZYPH_SOCIAL_PROOF,
  }
}

function instantiate(lib: LibraryRec, a: AssessmentAnswers): Recommendation {
  return {
    id: lib.id,
    tier: lib.tier,
    title: lib.title,
    pitch: lib.pitch,
    fixes: resolve(lib.fixes, a),
    effort: lib.effort,
    setupHours: lib.setupHours,
    cost: resolve(lib.cost, a),
    priceAnchor: lib.priceAnchor ? resolve(lib.priceAnchor, a) : undefined,
    roi: resolve(lib.roi, a),
    whatYouGet: lib.whatYouGet,
    diyGuide: lib.diyGuide,
    cta: lib.cta,
  }
}

// ─────────────────────────────────────────────────────────────────
// Headline ROI — the "$X/mo and Y hrs/week sitting on the table" number
// ─────────────────────────────────────────────────────────────────

export function calculateHeadline(a: AssessmentAnswers): {
  hoursPerWeekRecoverable: number
  dollarsPerMonthRecoverable: string
} {
  let dollars = 0
  let hours = 0

  // Missed after-hours leads
  dollars += a.leadsLostAfterHoursPerMonth * a.closeRate * a.avgTicket

  // Slow quoting → estimated close rate lift of 5–8pp when quotes are same-day
  if (a.quotingSpeedDays >= 2) {
    const lift = Math.min((a.quotingSpeedDays - 1) * 0.02, 0.08) // capped at 8pp
    dollars += a.leadsPerMonth * lift * a.avgTicket
  }

  // No review asking → ~$3k/mo opportunity at typical volume
  if (!a.asksForReviews && a.googleReviewCount < 100) dollars += 3000

  // Slow lead response → 8–15pp close rate penalty
  if (a.leadResponseTime === 'days') dollars += a.leadsPerMonth * 0.12 * a.avgTicket
  else if (a.leadResponseTime === 'next-day') dollars += a.leadsPerMonth * 0.07 * a.avgTicket

  // No / old website → organic lead opportunity
  if (!a.hasWebsite || a.websiteAgeYears >= 3) dollars += 8000

  // Hours recovery
  if (a.quotingTool === 'excel' || a.quotingTool === 'pen-paper') hours += 6
  if (a.jobMgmtTool === 'group-text' || a.jobMgmtTool === 'whiteboard') hours += 4
  if (a.chasingPayments) hours += 2
  if (a.crewSize === 1 && a.primaryIntake === 'owner') hours += 4 // phone-tag tax
  if (a.clientCommsStyle === 'reactive') hours += 3
  hours = Math.min(hours, 25) // realism cap

  // Format as a "$12k–$18k" range for the UI
  const low = Math.round((dollars * 0.8) / 1000)
  const high = Math.round((dollars * 1.2) / 1000)

  return {
    hoursPerWeekRecoverable: Math.max(4, Math.round(hours)),
    dollarsPerMonthRecoverable: `$${low}k–$${high}k`,
  }
}

// ─────────────────────────────────────────────────────────────────
// "What we heard" — one-paragraph synthesis of their situation
// ─────────────────────────────────────────────────────────────────

export function synthesizeWhatWeHeard(a: AssessmentAnswers): string {
  const crew =
    a.crewSize === 1
      ? 'solo'
      : a.crewSize <= 5
      ? `${a.crewSize}-person crew`
      : a.crewSize <= 15
      ? `${a.crewSize}-person outfit`
      : `${a.crewSize}-person operation`

  const topPain =
    a.wantedTimeBack.includes('quoting') || a.quotingSpeedDays >= 3
      ? `Quotes take ${a.quotingSpeedDays}${a.quotingSpeedDays === 1 ? ' day' : ' days'} out of ${a.quotingTool === 'excel' ? 'Excel' : a.quotingTool === 'pen-paper' ? 'pen and paper' : 'your current process'}`
      : a.afterHoursHandling === 'voicemail'
      ? `after-hours calls hit voicemail and ${a.leadsLostAfterHoursPerMonth} leads/mo slip through`
      : a.chasingPayments
      ? `invoicing lags the job and you're chasing ${a.chasingPaymentsAmount ? \`$${(a.chasingPaymentsAmount / 1000).toFixed(0)}k\` : 'open money'}`
      : 'the work is good but the systems around it are manual'

  const reputationNote =
    a.leadSources.includes('referrals')
      ? `${a.yearsInBusiness} years of reputation built on ${a.leadSources.includes('repeat') ? 'referrals and repeat customers' : 'referrals'}`
      : `${a.yearsInBusiness} years in business`

  const closer =
    a.wantedTimeBack.length > 0
      ? `${a.ownerFirstName} said it straight: if they got 5 hours a week back, they'd stop doing ${a.wantedTimeBack[0]}.`
      : `${a.ownerFirstName} wants more hours in the day and more money in the bank — this report shows where to find both.`

  return `${a.ownerFirstName} runs a ${crew} ${a.trade.toLowerCase()} outfit in ${a.location.split(',')[0]} with ${reputationNote}. The work is quality — the bottleneck is everywhere around the work. ${topPain}. ${closer}`
}

// ─────────────────────────────────────────────────────────────────
// "What you're doing right" — warm bullets + upsell angle
// ─────────────────────────────────────────────────────────────────

export function identifyStrengths(a: AssessmentAnswers): string[] {
  const bullets: string[] = []

  if (a.leadSources.includes('referrals')) {
    bullets.push(
      `${Math.round((a.leadSources.includes('referrals') ? 0.5 : 0) * 100 + (a.yearsInBusiness > 5 ? 20 : 10))}%+ of your work comes from referrals — your reputation is the asset competitors can't copy. Let's build systems around it.`,
    )
  }

  if (a.accountingTool === 'quickbooks') {
    bullets.push(
      "You're already on QuickBooks Online, which means most of the invoicing and AR automations on this report are switches you flip, not software you buy.",
    )
  }

  if (a.googleReviewCount > 0 && !a.asksForReviews) {
    bullets.push(
      `${a.googleReviewCount} Google reviews with zero active asking — imagine this number at ${a.googleReviewCount + 40}+ with a 2-minute automation.`,
    )
  } else if (a.googleReviewCount === 0) {
    bullets.push(
      'You haven\'t started asking for reviews yet — which is actually an advantage. Zero bad ones to work around.',
    )
  }

  if (a.closeRate >= 0.2) {
    bullets.push(
      `Your ${Math.round(a.closeRate * 100)}% close rate is above industry average (15–20%) — the problem isn't selling, it's having more qualified leads to sell to.`,
    )
  }

  if (a.yearsInBusiness >= 10) {
    bullets.push(
      `${a.yearsInBusiness} years in the trade means you've seen every edge case. The tools below are designed to scale you, not replace the judgment you've built up.`,
    )
  }

  return bullets.slice(0, 3) // keep to 3
}

function formatCrewSize(n: number): string {
  if (n === 1) return 'Solo operator'
  if (n <= 5) return `${n}-person crew`
  if (n <= 15) return `${n}-person outfit`
  return `${n}-person operation`
}

// ─────────────────────────────────────────────────────────────────
// Social proof — shown on every report for now.
// Later: pull from a CMS or CRM based on trade type.
// ─────────────────────────────────────────────────────────────────

export const ZYPH_SOCIAL_PROOF = [
  {
    quote:
      'Zyph Labs rebuilt our website and set up our review system in 3 weeks. We went from 22 to 67 Google reviews in 5 months. Full stop.',
    author: 'Mark T.',
    role: 'Owner, Pacific HVAC',
  },
  {
    quote:
      'The AI voice agent paid for itself in month 2. We stopped losing the weekend leads we used to lose.',
    author: 'Sarah K.',
    role: 'Owner, Keystone Roofing',
  },
]
