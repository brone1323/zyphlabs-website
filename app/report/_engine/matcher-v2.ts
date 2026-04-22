// generateReportV2 — deterministic, no LLM. Produces the v2.2 report shape.
// Supports partial AssessmentAnswers for the live-build UI via readiness flags.
// All paid offerings come from offerings.ts per Brian's spec.

import type { AssessmentAnswers, Industry } from './types'
import type {
  ReportV2, BenchmarkLine, Tier1Card, Tier2Card, Tier3Card, QuestionsCallCard,
} from './types-v2'
import { OFFERINGS, getOffering, painSignals, matchTier2, sumTier2 } from './offerings'

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

function aOrAn(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a'
}

function truncate(s: string, n: number): string {
  if (!s) return ''
  return s.length <= n ? s : s.slice(0, n - 1) + '\u2026'
}

function fmtMoney(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 100) / 10}k`
  return `$${n}`
}

function fmtDollars(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}

// Merge a user's tool stack (free-text) with the offer's integration hints.
function mergeIntegrations(offerIntegrations: string[], userStack: string): string[] {
  if (!userStack) return offerIntegrations
  const tokens = userStack
    .split(/[,+/]| and |;|\n/)
    .map((t) => t.trim())
    .filter((t) => t && t.length < 40)
  const merged = [...offerIntegrations]
  for (const tok of tokens) {
    if (!merged.some((m) => m.toLowerCase().includes(tok.toLowerCase()) || tok.toLowerCase().includes(m.toLowerCase()))) {
      merged.push(tok)
    }
  }
  return merged.slice(0, 6)
}

export function generateReportV2(a: Partial<AssessmentAnswers> & { _toolStack?: string; _painTag?: string }): ReportV2 {
  const industry = (a.industry ?? 'project-based') as Industry
  const teamSize = Number(a.teamSize ?? 1)
  // Pull first name from ownerName OR the email's local part (humanize `bri@…` → `Bri`).
  function firstFromEmail(e?: string): string | undefined {
    if (!e) return undefined
    const local = e.split('@')[0] || ''
    const token = local.split(/[._\-+]/)[0] || ''
    if (!token || /^\d+$/.test(token) || token.length < 2) return undefined
    return token.charAt(0).toUpperCase() + token.slice(1)
  }
  const ownerFirstName =
    a.ownerFirstName ||
    a.ownerName?.split(' ')[0] ||
    firstFromEmail(a.ownerEmail) ||
    'there'
  const company = a.company || 'Your Business'
  const trade = a.trade || 'your business'
  const industryPhrase = INDUSTRY_PHRASE[industry]

  const howPaidPhrase: Record<string, string> = {
    'per-project': 'by the project',
    'per-visit': 'by the visit',
    'subscription': 'on subscription',
    'transactional': 'transactionally',
    'hourly': 'by the hour',
  }
  const paid = howPaidPhrase[a.revenueModel ?? 'per-project'] ?? 'by the project'
  const customer = a.customerType === 'business' ? 'businesses' : a.customerType === 'both' ? 'a mix of consumers and businesses' : 'consumers'

  // ─── Section 1 — Business Profile ─────────────────────────────────
  const businessProfile = {
    paragraph:
      `${company} is a ${formatTeamSize(teamSize)} ${trade} \u2014 ` +
      `${aOrAn(industryPhrase)} ${industryPhrase} serving ${customer}, paid ${paid}. ` +
      `The work is quality. The systems around the work are what we look at next.`,
    stats: [
      { label: 'Industry', value: industryPhrase },
      { label: 'Team size', value: formatTeamSize(teamSize) },
      { label: 'Revenue model', value: paid.charAt(0).toUpperCase() + paid.slice(1) },
      { label: 'Main customer', value: customer.charAt(0).toUpperCase() + customer.slice(1) },
    ],
  }

  // ─── Section 2 — What We're Picking Up (honest observations only) ──
  const whereYouStand: BenchmarkLine[] = []

  if (a.company && a.trade) {
    whereYouStand.push({
      label: 'From what you told us',
      value: `${company} \u2014 ${trade}`,
      youAre: a.industry ? `Filed as ${industryPhrase}` : 'Classifying the shape of your business next\u2026',
      tone: 'neutral',
    })
  }

  if (a.teamSize && a.industry) {
    whereYouStand.push({
      label: 'Team signal',
      value: `${formatTeamSize(teamSize)} \u2014 ${teamSizeBandLabel(teamSize)}`,
      youAre: `At this size in ${aOrAn(industryPhrase)} ${industryPhrase}, the owner is usually still the bottleneck on at least 2\u20133 recurring tasks.`,
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

  if (a._toolStack) {
    whereYouStand.push({
      label: 'Your current tool stack',
      value: truncate(a._toolStack, 90),
      youAre: `We'll wire the automations below into these \u2014 not replace them.`,
      tone: 'neutral',
    })
  }

  if ((a as any).wantedTimeBack && (Array.isArray((a as any).wantedTimeBack) ? (a as any).wantedTimeBack.length : true)) {
    const wantStr = Array.isArray((a as any).wantedTimeBack) ? (a as any).wantedTimeBack[0] : (a as any).wantedTimeBack
    const WANT_LABEL: Record<string, string> = {
      'chasing-payments': 'chasing payments',
      'answering-calls': 'answering the phone',
      'quoting': 'writing quotes',
      'admin': 'admin + paperwork',
      'marketing': 'marketing + social',
      'being-bottleneck': 'being the bottleneck for everything',
    }
    whereYouStand.push({
      label: 'If we gave you 5 hours back',
      value: `You\u2019d stop ${WANT_LABEL[wantStr] || wantStr}`,
      youAre: 'Ranking the recommendations below by how directly they free that up.',
      tone: 'win',
    })
  }

  // ─── Section 3 — What's Eating Your Week ──────────────────────────
  const statedPain = a.topPain || ''
  const whatsEatingYourWeek = {
    statedPain,
    quantifiedLeak: statedPain
      ? `We\u2019ll size the hours/week and $/month recoverable with you on the strategy call \u2014 using your real numbers, not ours.`
      : '',
    narrative: statedPain
      ? `You told us: "${truncate(statedPain, 120)}". The recommendations below are ordered biggest-impact-first for the shape of business you described.`
      : '',
  }

  // ─── Section 4 — Automation Opportunities (stacked) ──────────────

  // Tier 1 — DIY free tool + paid setup
  const offering = getOffering(industry)
  const tier1: Tier1Card = {
    kind: 'tier-1',
    free: {
      toolName: offering.tier1.free.toolName,
      toolUrl: offering.tier1.free.toolUrl,
      oneLiner: offering.tier1.free.oneLiner,
      why: offering.tier1.free.why,
      isFree: offering.tier1.free.free,
    },
    paid: {
      rate: offering.tier1.paid.rate,
      tasks: offering.tier1.paid.tasks,
    },
    paidCta: { label: 'Book Setup Help \u2014 $100/hr', href: '/book/setup' },
  }

  // Tier 2 — matched picks
  const signals = painSignals({
    topPain: a.topPain,
    painTag: (a as any)._painTag,
    wantedTimeBack: (a as any).wantedTimeBack,
  })
  const picks = matchTier2(industry, signals)
  const tier2Cards: Tier2Card[] = picks.map((o) => ({
    kind: 'tier-2',
    id: o.id,
    title: o.title,
    pitch: o.pitch,
    whatItDoes: o.whatItDoes,
    integratesWith: mergeIntegrations(o.integratesWith, a._toolStack || ''),
    priceBand: `${fmtDollars(o.price)} + ${fmtDollars(o.retainer)}/mo`,
    price: o.price,
    retainer: o.retainer,
    timeToLive: o.timeToLive,
    expectedImpact: o.expectedImpact,
    cta: { label: 'Get This Automation', href: `/checkout/tier-2?offeringId=${o.id}` },
  }))

  // Tier 3 — Full System with bundle math
  const tier2Sum = sumTier2(picks)
  const tier3: Tier3Card = {
    kind: 'tier-3',
    title: offering.tier3.title,
    pitch: offering.tier3.pitch,
    pipeline: offering.tier3.pipeline,
    brain: offering.tier3.brain,
    priceBand: `${fmtMoney(offering.tier3.buildPrice)} + ${fmtMoney(offering.tier3.retainer)}/mo`,
    buildPrice: offering.tier3.buildPrice,
    retainer: offering.tier3.retainer,
    timeToLive: offering.tier3.timeToLive,
    expectedImpact: offering.tier3.expectedImpact,
    bundleMath: picks.length >= 2 ? {
      tier2Sum,
      tier2Names: picks.map((p) => p.title),
      narrative: `Instead of ${fmtDollars(tier2Sum)} for the ${picks.length} automations above, get all of them plus the Brain for ${fmtMoney(offering.tier3.buildPrice)} + ${fmtMoney(offering.tier3.retainer)}/mo. One build, four weeks, one connected system.`,
    } : undefined,
    cta: { label: 'Book a 30-min Strategy Session', href: '/book/strategy' },
  }

  const questionsCall: QuestionsCallCard = {
    kind: 'questions',
    title: 'Still figuring it out?',
    pitch: "15 minutes, no pitch \u2014 just a direct conversation about what would move the needle for you.",
    cta: { label: 'Book a 15-min Questions Call', href: '/book/questions' },
  }

  // ─── Section 5 — What Happens Next (personalized by wantedTimeBack) ──
  const wantStr = Array.isArray((a as any).wantedTimeBack) ? (a as any).wantedTimeBack[0] : (a as any).wantedTimeBack
  const personalized = wantStr
    ? ` The automations above are ordered so the one that frees you from ${wantStr.replace(/-/g, ' ')} is first.`
    : ''
  const whatHappensNext = {
    paragraph:
      `${ownerFirstName}, here's how this usually goes. ` +
      `If one of the automations above feels like the obvious next step \u2014 book a strategy call and we'll scope it in 30 minutes. ` +
      `If you're still sizing it up, the 15-minute questions call exists for exactly that.${personalized} ` +
      `Either way, we'll build this for you, not hand you a config.`,
    signoff: '\u2014 Alex, Zyph Labs',
  }

  // ─── Readiness (staged to pace Q1-Q10) ────────────────────────────
  // Q1: company + trade
  // Q2: industry
  // Q3: teamSize
  // Q4: customerType
  // Q5: revenueModel
  // Q6: topPain + painTag
  // Q7: painDetailA (adds context)
  // Q8: toolStack
  // Q9: wantedTimeBack
  // Q10: ownerEmail (unlocks CTAs)
  const hasQ1_5 = !!(a.company && a.industry && a.teamSize && a.customerType && a.revenueModel)
  const hasQ6 = !!(a.topPain || (a as any)._painTag)
  const hasQ7 = !!(a as any)._painDetailA
  const hasQ8 = !!a._toolStack
  const hasQ9 = !!((a as any).wantedTimeBack && (Array.isArray((a as any).wantedTimeBack) ? (a as any).wantedTimeBack.length : true))
  const hasQ10 = !!a.ownerEmail

  // Tier 2 cards pace in: Q6 reveals 1, Q7 reveals 2nd+3rd, Q8 caps at 4.
  const tier2CountShown = !hasQ6 ? 0 : !hasQ7 ? Math.min(1, tier2Cards.length) : !hasQ8 ? Math.min(3, tier2Cards.length) : Math.min(4, tier2Cards.length)

  const readiness = {
    businessProfile: hasQ1_5,
    whereYouStand: !!(a.company && (a.trade || a.industry)),
    whatsEatingYourWeek: !!(a.industry && a.teamSize && a.topPain),
    tier1: hasQ1_5,                                         // appears after Q5 — orientation first
    tier2CountShown,
    tier3: hasQ6 && tier2Cards.length >= 2,                 // Tier 3 shows once bundle math is meaningful
    opportunities: hasQ1_5 || (hasQ6 && tier2Cards.length > 0),  // LiveReportPane trigger
    whatHappensNext: hasQ9,                                  // personalized by wantedTimeBack
    ctasUnlocked: hasQ10,                                   // email required to enable purchase CTAs
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
    opportunities: { tier1, tier2Cards, tier3, questionsCall },
    whatHappensNext,
    readiness,
  }
}
