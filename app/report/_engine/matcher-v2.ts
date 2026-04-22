// generateReportV2 — produces the new 5-section report shape.
// Deterministic: no LLM required. Pulls from offerings tables.
// Supports partial AssessmentAnswers for the live-build UI (readiness flags
// tell the UI which sections to reveal).
//
// v2.1 (2026-04-22): removed fake industry benchmarks from the "What we're
// picking up" section — every observation is now grounded in what the user
// actually said. No fabricated numbers.

import type { AssessmentAnswers, Industry } from './types'
import type {
  ReportV2, BenchmarkLine, QuickWinCard, FullSystemCard, QuestionsCallCard,
} from './types-v2'
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

function teamSizeBandLabel(n: number): string {
  if (n <= 1) return 'solo'
  if (n <= 5) return 'small team'
  if (n <= 15) return 'mid-size operation'
  return 'larger organization'
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

  const howPaidPhrase: Record<string, string> = {
    'per-project': 'by the project',
    'per-visit': 'by the visit',
    'subscription': 'on subscription',
    'transactional': 'transactionally',
    'hourly': 'by the hour',
  }
  const paid = howPaidPhrase[a.revenueModel ?? 'per-project'] ?? 'by the project'
  const customer = a.customerType === 'business' ? 'businesses' : a.customerType === 'both' ? 'a mix of consumers and businesses' : 'consumers'

  // Section 1 — Business Profile
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

  // Section 2 — "What we're picking up" (honest observations only)
  // Every line is derived from something the user actually said.
  const whereYouStand: BenchmarkLine[] = []

  if (a.company && a.trade) {
    whereYouStand.push({
      label: 'From what you told us',
      value: `${company} \u2014 ${trade}`,
      youAre: a.industry ? `Filed as ${INDUSTRY_PHRASE[industry]}` : 'Classifying the shape of your business next\u2026',
      tone: 'neutral',
    })
  }

  if (a.teamSize && a.industry) {
    whereYouStand.push({
      label: 'Team signal',
      value: `${formatTeamSize(teamSize)} \u2014 ${teamSizeBandLabel(teamSize)}`,
      youAre: `At this size in a ${INDUSTRY_PHRASE[industry]}, the owner is usually still the bottleneck on at least 2\u20133 recurring tasks.`,
      tone: 'neutral',
    })
  }

  if (a.customerType && a.revenueModel) {
    whereYouStand.push({
      label: 'Revenue shape',
      value: `${paid.charAt(0).toUpperCase() + paid.slice(1)}, serving ${customer}`,
      youAre:
        a.revenueModel === 'per-project' ? 'Cash flow moves in lumps \u2014 quoting speed + follow-up rigor compound here.' :
        a.revenueModel === 'per-visit' ? 'Cash flow follows appointment density \u2014 no-shows and gaps compound.' :
        a.revenueModel === 'subscription' ? 'Retention math dominates \u2014 churn and upgrade triggers matter most.' :
        a.revenueModel === 'transactional' ? 'Volume + basket-size compound \u2014 repeat purchase triggers matter most.' :
        'Utilization is the lever \u2014 non-billable admin hours are the silent leak.',
      tone: 'neutral',
    })
  }

  if (a.topPain) {
    whereYouStand.push({
      label: 'What you named as the main drain',
      value: `"${truncate(a.topPain, 110)}"`,
      youAre: `This is exactly the kind of friction we quantify and fix below.`,
      tone: 'gap',
    })
  }

  // Section 3 — What's Eating Your Week (only populate when we have the pain)
  const statedPain = a.topPain || ''
  const whatsEatingYourWeek = {
    statedPain,
    quantifiedLeak: statedPain
      ? `Hours/week and $/month recoverable \u2014 we\u2019ll quantify in the strategy call with your real numbers.`
      : '',
    narrative: statedPain
      ? `You told us: "${truncate(statedPain, 120)}". The recommendations below are ordered biggest-impact-first, specifically for the shape of business you just described.`
      : '',
  }

  // Section 4 — Automation Opportunities
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

  // Section 5 — What Happens Next
  const whatHappensNext = {
    paragraph:
      `${ownerFirstName}, here's how this usually goes. ` +
      `If one of the automations above feels like the obvious next step \u2014 book a strategy call and we'll scope it in 30 minutes. ` +
      `If you're still sizing it up, the 15-minute questions call exists for exactly that. ` +
      `Either way, we'll build this for you, not hand you a config.`,
    signoff: '\u2014 Alex, Zyph Labs',
  }

  // Readiness (for live-build UI) — every section only shows when ALL the
  // fields it uses have been explicitly answered (no fabricated defaults).
  const readiness = {
    businessProfile: !!(a.company && a.industry && a.teamSize && a.customerType && a.revenueModel),  // after Q5
    whereYouStand: !!(a.company && (a.trade || a.industry)),          // starts populating at Q1
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
