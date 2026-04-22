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

function truncate(s: string, n: number): string {
  if (!s) return ''
  return s.length <= n ? s : s.slice(0, n - 1) + '\u2026'
}

export function generateReportV2(a: Partial<AssessmentAnswers>): ReportV2 {
  const industry = (a.industry ?? 'project-based') as Industry
  const teamSize = Number(a.teamSize ?? 1)
  const ownerFirstName = a.ownerFirstName || a.ownerName?.split(' ')[0] || 'there'
  const company = a.company || 'Your Business'
  const trade = a.trade || 'your business'
  const bench = getBenchmarks(a)
  const band = sizeBand(teamSize)

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
      `${company} is a ${formatTeamSize(teamSize)} ${trade.toLowerCase()} \u2014 ` +
      `a ${INDUSTRY_PHRASE[industry]} serving ${customer}, paid ${paid}. ` +
      `The work is quality. The systems around the work are what we look at next.`,
    stats: [
      { label: 'Industry', value: INDUSTRY_PHRASE[industry] },
      { label: 'Team size', value: formatTeamSize(teamSize) },
      { label: 'Revenue model', value: paid.charAt(0).toUpperCase() + paid.slice(1) },
      { label: 'Main customer', value: customer.charAt(0).toUpperCase() + customer.slice(1) },
    ],
  }

  const whereYouStand: BenchmarkLine[] = []
  const theirReviews = (a as any).googleReviewCount ?? null
  if (theirReviews != null) {
    const delta = theirReviews - bench.googleReviews
    whereYouStand.push({
      label: `Businesses your size in ${INDUSTRY_PHRASE[industry]}s average`,
      value: `${bench.googleReviews} Google reviews`,
      youAre: `You mentioned ${theirReviews}`,
      gap: delta < 0 ? `${Math.abs(delta)}-review gap we can close in 60 days` : "You're ahead of the average",
      tone: delta < 0 ? 'gap' : 'win',
    })
  } else {
    whereYouStand.push({
      label: `Businesses your size in ${INDUSTRY_PHRASE[industry]}s average`,
      value: `${bench.googleReviews} Google reviews`,
      tone: 'neutral',
    })
  }

  whereYouStand.push({
    label: 'The top 20% of businesses in your industry respond to new leads in',
    value: `under ${bench.topQuartileResponseMinutes} minutes`,
    youAre: (a as any).leadResponseTime ? `You mentioned "${(a as any).leadResponseTime}"` : undefined,
    gap: (a as any).leadResponseTime && (a as any).leadResponseTime !== 'minutes' ? 'Closing this gap alone typically recovers 8\u201315% of lost leads' : undefined,
    tone: (a as any).leadResponseTime === 'minutes' ? 'win' : 'gap',
  })

  whereYouStand.push({
    label: `${bench.painShareTop1.sharePct}% of ${INDUSTRY_PHRASE[industry]} owners say`,
    value: `"${bench.painShareTop1.pain}" is their #1 time drain`,
    youAre: a.topPain ? `You told us: "${truncate(a.topPain, 70)}"` : undefined,
    tone: 'neutral',
  })

  whereYouStand.push({
    label: `Businesses your size that automate this recover an average of`,
    value: `${fmtDollar(bench.avgRecoveryWhenAutomated)}/month`,
    tone: 'win',
  })

  const statedPain = a.topPain || `${bench.painShareTop1.pain}`
  const whatsEatingYourWeek = {
    statedPain,
    quantifiedLeak: `~${fmtDollar(bench.avgRecoveryWhenAutomated)}/month in recoverable revenue + 6\u201312 hrs/week of owner time`,
    narrative:
      `You told us: "${truncate(statedPain, 90)}". ` +
      `Owners who fix this recover an average of ${fmtDollar(bench.avgRecoveryWhenAutomated)}/month or 6\u201312 hrs/week. ` +
      `The recommendations below are ordered by biggest-impact-first \u2014 specifically for your shape of business.`,
  }

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
    pitch: "Let's talk it through. 15 minutes, no pitch \u2014 just a direct conversation about what would move the needle for you.",
    cta: { label: 'Book a 15-min Questions Call', href: '/book/questions' },
  }

  const whatHappensNext = {
    paragraph:
      `${ownerFirstName}, here's how this usually goes. ` +
      `If one of the automations above feels like the obvious next step \u2014 book a strategy call and we'll scope it in 30 minutes. ` +
      `If you're still sizing it up, the 15-minute questions call exists for exactly that. ` +
      `Either way, we'll build this for you, not hand you a config.`,
    signoff: '\u2014 Alex, Zyph Labs',
  }

  // Readiness (for live-build UI) — staged so each question moves the report
  const readiness = {
    businessProfile: !!(a.company && a.industry),                     // Q1 + Q2
    whereYouStand: !!(a.industry && a.teamSize && a.customerType),    // Q2 + Q3 + Q4
    whatsEatingYourWeek: !!(a.industry && a.teamSize && a.topPain),   // + Q6
    opportunities: !!(a.industry && a.topPain),                        // + Q6
    whatHappensNext: !!(a.industry && a.topPain),                      // + Q6
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
    opportunities: { quickWin, fullSystem, questionsCall },
    whatHappensNext,
    readiness,
  }
}
