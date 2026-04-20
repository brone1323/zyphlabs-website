// Turns assessment answers into a full ReportData by picking 5 recs per tier
// from the library, synthesizing a summary, and computing the headline numbers.

import type { AssessmentAnswers, Industry, LibraryRec, Recommendation, ReportData } from './types'
import { resolve, teamSize } from './types'
import { LIBRARY } from './library'
import { LIBRARY_EXTRAS } from './library-extras'

const DEFAULT_INDUSTRIES: Industry[] = ['project-based', 'trades']

function recAppliesToIndustry(rec: LibraryRec, industry: Industry): boolean {
  const industries = rec.industries ?? DEFAULT_INDUSTRIES
  return industries.includes(industry)
}

export interface EngineConfig {
  library?: LibraryRec[]
  recsPerTier?: number
}

export function generateReport(
  answers: AssessmentAnswers,
  config: EngineConfig = {},
): ReportData {
  const library = config.library ?? [...LIBRARY, ...LIBRARY_EXTRAS]
  const N = config.recsPerTier ?? 5

  const applicable = library
    .filter((rec) => recAppliesToIndustry(rec, answers.industry))
    .filter((rec) => rec.triggers(answers))

  const byTier: Record<1 | 2 | 3, LibraryRec[]> = { 1: [], 2: [], 3: [] }
  for (const rec of applicable) byTier[rec.tier].push(rec)
  for (const tier of [1, 2, 3] as const) {
    byTier[tier].sort((a, b) => b.priority(answers) - a.priority(answers))
    byTier[tier] = byTier[tier].slice(0, N)
  }

  const recommendations: Recommendation[] = [
    ...byTier[1].map((r) => instantiate(r, answers)),
    ...byTier[2].map((r) => instantiate(r, answers)),
    ...byTier[3].map((r) => instantiate(r, answers)),
  ]

  const effortMult = (e: string) => (e === 'Easy' ? 3 : e === 'Medium' ? 1.5 : 1)
  const allPicked = [...byTier[1], ...byTier[2], ...byTier[3]]
  const topThreeIds = allPicked
    .map((r) => ({ r, score: r.priority(answers) * effortMult(r.effort) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ r }) => r.id)

  const { hoursPerWeekRecoverable, dollarsPerMonthRecoverable } = calculateHeadline(answers)

  return {
    id: answers.reportId,
    ownerName: answers.ownerName,
    ownerFirstName: answers.ownerFirstName,
    company: answers.company,
    trade: answers.trade,
    crewSize: formatTeamSize(teamSize(answers)),
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

export function calculateHeadline(a: AssessmentAnswers): {
  hoursPerWeekRecoverable: number
  dollarsPerMonthRecoverable: string
} {
  let dollars = 0
  let hours = 0

  if (a.leadsLostAfterHoursPerMonth && a.closeRate && a.avgTicket) {
    dollars += a.leadsLostAfterHoursPerMonth * a.closeRate * a.avgTicket
  }

  if (a.quotingSpeedDays && a.quotingSpeedDays >= 2 && a.leadsPerMonth && a.avgTicket) {
    const lift = Math.min((a.quotingSpeedDays - 1) * 0.02, 0.08)
    dollars += a.leadsPerMonth * lift * a.avgTicket
  }

  if (!a.asksForReviews && (a.googleReviewCount ?? 0) < 100) dollars += 3000

  if (a.leadsPerMonth && a.avgTicket) {
    if (a.leadResponseTime === 'days') dollars += a.leadsPerMonth * 0.12 * a.avgTicket
    else if (a.leadResponseTime === 'next-day') dollars += a.leadsPerMonth * 0.07 * a.avgTicket
  }

  if (!a.hasWebsite || (a.websiteAgeYears ?? 0) >= 3) dollars += 5000

  if (a.noShowRatePerWeek && (a.avgVisitValue || a.avgTicket)) {
    dollars += (a.noShowRatePerWeek * 4 * (a.avgVisitValue ?? a.avgTicket ?? 0)) / 2
  }

  if (a.industry === 'retail' && !a.onlineOrdering) dollars += 5000
  if (a.industry === 'ecommerce') dollars += 3000
  if (a.industry === 'b2b-saas' && (a.churnRatePct ?? 0) > 0.05) dollars += 6000
  if ((a.arAging60PlusPct ?? 0) > 0.15) dollars += 4000

  if (a.quotingTool === 'excel' || a.quotingTool === 'pen-paper') hours += 6
  if (a.jobMgmtTool === 'group-text' || a.jobMgmtTool === 'whiteboard') hours += 4
  if (a.chasingPayments) hours += 2
  if (teamSize(a) === 1 && a.primaryIntake === 'owner') hours += 4
  if (a.clientCommsStyle === 'reactive') hours += 3
  if (a.bookingTool === 'phone-only' || a.bookingTool === 'spreadsheet') hours += 4
  if (a.industry === 'ecommerce') hours += 3
  if (a.industry === 'appointment-based' && !a.bookingTool) hours += 3
  hours = Math.min(hours, 25)

  const low = Math.round((dollars * 0.8) / 1000)
  const high = Math.round((dollars * 1.2) / 1000)

  return {
    hoursPerWeekRecoverable: Math.max(4, Math.round(hours)),
    dollarsPerMonthRecoverable: low === high ? `$${low}k` : `$${low}k–$${high}k`,
  }
}

export function synthesizeWhatWeHeard(a: AssessmentAnswers): string {
  const size = teamSize(a)
  const sizeStr =
    size === 1
      ? 'solo'
      : size <= 5
      ? `${size}-person team`
      : size <= 15
      ? `${size}-person operation`
      : `${size}-person organization`

  const industryPhrase = ({
    'project-based': 'project-based business',
    'appointment-based': 'appointment-based practice',
    'retail': 'retail operation',
    'ecommerce': 'e-commerce store',
    'professional-services': 'professional services practice',
    'b2b-saas': 'B2B / SaaS company',
    'trades': 'field services business',
    'creative': 'creative studio',
  } as Record<Industry, string>)[a.industry]

  const chasingAmount = a.chasingPaymentsAmount
    ? '$' + (a.chasingPaymentsAmount / 1000).toFixed(0) + 'k'
    : 'open money'

  let topPain: string
  if (a.quotingSpeedDays && a.quotingSpeedDays >= 3) {
    topPain = `quotes take ${a.quotingSpeedDays} days out of ${a.quotingTool === 'excel' ? 'Excel' : a.quotingTool === 'pen-paper' ? 'pen and paper' : 'your current process'}`
  } else if (a.afterHoursHandling === 'voicemail' && (a.leadsLostAfterHoursPerMonth ?? 0) > 0) {
    topPain = `after-hours calls hit voicemail and ${a.leadsLostAfterHoursPerMonth} leads/mo slip through`
  } else if (a.chasingPayments) {
    topPain = `invoicing lags the job and you're chasing ${chasingAmount}`
  } else if (a.noShowRatePerWeek && a.noShowRatePerWeek > 0) {
    topPain = `${a.noShowRatePerWeek} no-shows/week is costing real revenue`
  } else if (a.industry === 'ecommerce') {
    topPain = 'the core product works but the conversion + retention levers aren\'t tuned'
  } else if (a.industry === 'b2b-saas') {
    topPain = 'the team is on the bicycle but the growth levers (CRM, outbound, onboarding) aren\'t pulling their weight'
  } else if (a.topPain) {
    topPain = a.topPain
  } else {
    topPain = 'the work is good but the systems around it are manual'
  }

  const closer =
    a.wantedTimeBack && a.wantedTimeBack.length > 0
      ? `${a.ownerFirstName} said it straight: if they got 5 hours a week back, they'd stop doing ${a.wantedTimeBack[0]}.`
      : `${a.ownerFirstName} wants more hours in the day and more money in the bank — this report shows where to find both.`

  return `${a.ownerFirstName} runs a ${sizeStr} ${a.trade.toLowerCase()} ${industryPhrase === a.trade.toLowerCase() ? '' : '— ' + industryPhrase}in ${a.location.split(',')[0]} with ${a.yearsInBusiness} years in. The work is quality — the bottleneck is everywhere around the work. ${topPain}. ${closer}`
}

export function identifyStrengths(a: AssessmentAnswers): string[] {
  const bullets: string[] = []

  if (a.leadSources && a.leadSources.includes('referrals')) {
    const pct = Math.round((a.yearsInBusiness > 5 ? 60 : 40))
    bullets.push(
      `${pct}%+ of your work comes from referrals — your reputation is the asset competitors can't copy. Let's build systems around it.`,
    )
  }

  if (a.accountingTool === 'quickbooks') {
    bullets.push(
      "You're already on QuickBooks Online, which means most of the invoicing and AR automations here are switches you flip, not software you buy.",
    )
  }

  if ((a.googleReviewCount ?? 0) > 0 && !a.asksForReviews) {
    bullets.push(
      `${a.googleReviewCount} Google reviews with zero active asking — imagine this number at ${(a.googleReviewCount ?? 0) + 40}+ with a 2-minute automation.`,
    )
  } else if (a.googleReviewCount === 0) {
    bullets.push(
      "You haven't started asking for reviews yet — which is actually an advantage. Zero bad ones to work around.",
    )
  }

  if ((a.closeRate ?? 0) >= 0.2) {
    bullets.push(
      `Your ${Math.round((a.closeRate ?? 0) * 100)}% close rate is above industry average (15–20%) — the problem isn't selling, it's having more qualified leads to sell to.`,
    )
  }

  if (a.yearsInBusiness >= 10) {
    bullets.push(
      `${a.yearsInBusiness} years in the trade means you've seen every edge case. The tools below are designed to scale you, not replace the judgment you've built up.`,
    )
  }

  if (a.industry === 'appointment-based' && (a.recurringClientPct ?? 0) > 0.5) {
    bullets.push(
      `${Math.round((a.recurringClientPct ?? 0) * 100)}% of your clients rebook — that's a premium retention base most competitors would kill for.`,
    )
  }

  if (a.industry === 'b2b-saas' && a.primaryChannel === 'inbound') {
    bullets.push(
      "Inbound is your primary channel — it compounds. Every lever here is about amplifying what's already working.",
    )
  }

  if (a.industry === 'creative' && a.pricingModel === 'retainer') {
    bullets.push(
      "You've already escaped the project-to-project hustle with retainers. That gives us predictable revenue to build bigger systems on.",
    )
  }

  return bullets.slice(0, 3)
}

function formatTeamSize(n: number): string {
  if (n === 1) return 'Solo operator'
  if (n <= 5) return `${n}-person team`
  if (n <= 15) return `${n}-person operation`
  return `${n}-person organization`
}

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
