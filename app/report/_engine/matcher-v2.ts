// generateReportV2 — produces the new 5-section report shape.
// Deterministic: no LLM required. Pulls from benchmarks + offerings tables.
// Supports partial AssessmentAnswers for the live-build UI (readiness flags tell
// the UI which sections to reveal).

import type { AssessmentAnswers, Industry } from './types'
import type {
  ReportV2, BenchmarkLine, QuickWinCard, FullSystemCard, QuestionsCallCard,
} from './types-v2'
import { getBenchmarks, sizeBand } from './benchmarks'
import { getOffering } from './offerings'

const INDUSTRY_PHRASE: Record<Industry, string> = {
  'project-based':         'project-based business',
  'appointment-based':     'appointment-based practice',
  'retail':                'retail operation',
  'ecommerce':             'e-commerce store',
  'professional-services': 'professional services firm',
  'b2b-saas':              'B2B software company',
  'trades':                'field services business',
  'creative':              'creative studio',
}

function formatTeamSize(n: number): string {
  if (n <= 1) return 'solo operator'
  if (n <= 5) return `${n}-person team`
  if (n <= 15) return `${n}-person operation`
  return `${n}-person organization`
}

function fmtDollar(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 100) / 10}k`
  return `$${n}`
}

export function generateReportV2(a: Partial<AssessmentAnswers>): ReportV2 {
  const industry = (a.industry ?? 'project-based') as Industry
  const teamSize = Number(a.teamSize ?? 1)
  const ownerFirstName = a.ownerFirstName || a.ownerName?.split(' ')[0] || 'there'
  const company = a.company || 'Your Business'
  const trade = a.trade || 'your business'
  const bench = getBenchmarks(a)
  const band = sizeBand(teamSize)

  // ─── Section 1 — Business Profile ──────────────────────────────
  const howPaidPhrase: Record<string, string> = {
    'per-project': 'by the project',
    'per-visit': 'by the visit',
    'subscription': 'on subscription',
    'transactional': 'transactionally',
    'hourly': 'by the hour',
  }
  const paid = howPaidPhrase[a.revenueModel ?? 'per-project'] ?? 'by the project'
  const customer = a.customerType === 'business' ? 'businesses' : a.customerType === 'both' ? 'a mix of consumers and businesses' : 'consumers'

  const businessProfile = {
    paragraph:
      `${company} is a ${formatTeamSize(teamSize)} ${trade.toLowerCase()} — ` +
      `a ${INDUSTRY_PHRASE[industry]} serving ${customer}, paid ${paid}. ` +
      `The work is quality. The systems around the work are what we look at next.`,
    stats: [
      { label: 'Industry', value: INDUSTRY_PHRASE[industry] },
      { label: 'Team size', value: formatTeamSize(teamSize) },
      { label: 'Revenue model', value: paid.charAt(0).toUpperCase() + paid.slice(1) },
      { label: 'Main customer', value: customer.charAt(0).toUpperCase() + customer.slice(1) },
    ],
  }

  // ─── Section 2 — Where You Stand ────────────────────────────────
  const whereYouStand: BenchmarkLine[] = []

  // Review count vs benchmark
  const theirReviews = a.googleReviewCount ?? null
  if (theirReviews != null) {
    const delta = theirReviews - bench.googleReviews
    whereYouStand.push({
      label: `Businesses your size in ${INDUSTRY_PHRASE[industry]}s average`,
      value: `${bench.googleReviews} Google reviews`,
      youAre: `You mentioned ${theirReviews}`,
      gap: delta < 0 ? `${Math.abs(delta)}-review gap we can close in 60 days` : 'You\'re ahead of the average',
      tone: delta < 0 ? 'gap' : 'win',
    })
  } else {
    whereYouStand.push({
      label: `Businesses your size in ${INDUSTRY_PHRASE[industry]}s average`,
      value: `${bench.googleReviews} Google reviews`,
      tone: 'neutral',
    })
  }

  // Lead response time
  whereYouStand.push({
    label: 'The top 20% of businesses in your industry respond to new leads in',
    value: `under ${bench.topQuartileResponseMinutes} minutes`,
    youAre: a.leadResponseTime ? `You mentioned "${a.leadResponseTime}"` : undefined,
    gap: a.leadResponseTime && a.leadResponseTime !== 'minutes' ? 'Closing this gap alone typically recovers 8–15% of lost leads' : undefined,
    tone: a.leadResponseTime === 'minutes' ? 'win' : 'gap',
  })

  // Pain frequency
  whereYouStand.push({
    label: `${bench.painShareTop1.sharePct}% of ${INDUSTRY_PHRASE[industry]} owners say`,
    value: `"${bench.painShareTop1.pain}" is their #1 time drain`,
    youAre: a.topPain ? `You told us: "${truncate(a.topPain, 70)}"` : undefined,
    tone: 'neutral',
  })

  // Revenue recovery estimate
  whereYouStand.push({
    label: `Businesses your size that automate this recover an average of`,
    value: `${fmtDollar(bench.avgRecoveryWhenAutomated)}/month`,
    tone: 'win',
  })

  // ─── Section 3 — What's Eating Your Week ────────────────────────
  const statedPain = a.topPain || `${bench.painShareTop1.pain}`
  const quantifiedLeak = `~${fmtDollar(bench.avgRecoveryWhenAutomated)}/month in recoverable revenue + 6–12 hrs/week of owner time`
  const whatsEatingYourWeek = {
    statedPain,
    quantifiedLeak,
    narrative:
      `You told us: "${truncate(statedPain, 90)}". ` +
      `Owners who fix this recover an average of ${fmtDollar(bench.avgRecoveryWhenAutomated)}/month or 6–12 hrs/week. ` +
      `The recommendations below are ordered by biggest-impact-first — specifically for your shape of business.`,
  }

  // ─── Section 4 — Automation Opportunities ───────────────────────
  const offering = getOffering(industry)

  const quickWin: QuickWinCard = {
    ...offering.tier2,
    cta: { label: 'Get This Automation', href: `/checkout/tier-2?industry=${industry}` },
  }

  const fullSystem: FullSystemCard = {
    ...offering.tier3,
    cta: { label: 'Book a 30-min Strategy Session', href: '/book/strategy' },
  }

  const questionsCall: QuestionsCallCard = {
    kind: 'questions',
    title: 'Still figuring it out?',
    pitch: 'Let\'s talk it through. 15 minutes, no pitch — just a direct conversation about what would move the needle for you.',
    cta: { label: 'Book a 15-min Questions Call', href: '/book/questions' },
  }

  // ─── Section 5 — What Happens Next ──────────────────────────────
  const whatHappensNext = {
    paragraph:
      `${ownerFirstName}, here\'s how this usually goes. ` +
      `If one of the automations above feels like the obvious next step — book a strategy call and we\'ll scope it in 30 minutes. ` +
      `If you\'re still sizing it up, the 15-minute questions call exists for exactly that. ` +
      `Either way, we\'ll build this for you, not hand you a config.`,
    signoff: '— Alex, Zyph Labs',
  }

  // ─── Readiness (for live-build UI) ──────────────────────────────
  // Staged so each question visibly moves the report forward.
  const readiness = {
    businessProfile: !!(a.company && a.industry),                                // Q1 + Q2
    whereYouStand: !!(a.industry && a.teamSize && a.customerType),              // Q2 + Q3 + Q4
    whatsEatingYourWeek: !!(a.industry && a.teamSize && a.topPain),             // + Q6
    opportunities: !!(a.industry && a.topPain),                                  // + Q6
    whatHappensNext: !!(a.industry && a.topPain),                                // + Q6
  }

  return {
    id: a.reportId || `web-${Date.now()}`,
    company,
    trade,
    industry,
    ownerName: a.ownerName || 'Owner',
    ownerFirstName,
    teamSize,
    generatedAt: new Date().toISOString(),
    businessProfile,
    whereYouStand,
    whatsEatingYourWeek,
    