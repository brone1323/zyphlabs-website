// Report v2.2 shape (2026-04-22 revised per spec):
//   1. Business Profile
//   2. What We're Picking Up (live signal, no fake benchmarks)
//   3. What's Eating Your Week (quantified leak)
//   4. Automation Opportunities — stacked vertically:
//        - Tier 1 (DIY free rec + paid setup help $100/hr)
//        - Tier 2 cards (2-4 AI builds, $1.8k-$4.5k each)
//        - Tier 3 Full System with bundle math
//        - Questions Call (15-min no-pitch)
//   5. What Happens Next

import type { AssessmentAnswers, Industry } from './types'

export interface BenchmarkLine {
  label: string
  value: string
  youAre?: string
  gap?: string
  tone: 'win' | 'gap' | 'neutral'
}

// ─── Tier 1 — DIY (free tool rec) + Paid setup ──────────────────────

export interface Tier1Card {
  kind: 'tier-1'
  free: {
    toolName: string
    toolUrl?: string
    oneLiner: string
    why: string
    isFree: boolean
  }
  paid: {
    rate: string
    tasks: string[]
  }
  paidCta: { label: string; href: string }   // /checkout/tier-1-setup
}

// ─── Tier 2 — Single AI automation (one of several per industry) ────

export interface Tier2Card {
  kind: 'tier-2'
  id: string                     // stable offering id
  title: string
  pitch: string
  whatItDoes: string[]
  integratesWith: string[]       // merged with user's actual stack if known
  priceBand: string              // display-friendly, e.g. "$3,500 + $250/mo"
  price: number                  // base build, CAD
  retainer: number               // monthly retainer, CAD
  timeToLive: string
  expectedImpact: string
  cta: { label: string; href: string }   // /checkout/tier-2?offeringId=X
}

// ─── Tier 3 — Full System with bundle math ──────────────────────────

export interface Tier3Card {
  kind: 'tier-3'
  title: string
  pitch: string
  pipeline: string[]
  brain: {
    summary: string
    examples: string[]
  }
  priceBand: string              // "$18k + $1.2k/mo"
  buildPrice: number
  retainer: number
  timeToLive: string
  expectedImpact: string
  bundleMath?: {
    tier2Sum: number             // e.g. 8300 (sum of surfaced Tier 2 base prices)
    tier2Names: string[]         // for display in the math line
    narrative: string            // "Instead of $8.3k for the three above, get all of them + the Brain for $18k."
  }
  cta: { label: string; href: string }   // strategy call
}

// ─── Questions call ─────────────────────────────────────────────────

export interface QuestionsCallCard {
  kind: 'questions'
  title: string
  pitch: string
  cta: { label: string; href: string }
}

// ─── Legacy QuickWinCard / FullSystemCard kept temporarily for compat ─

export interface QuickWinCard {
  kind: 'tier-2'
  title: string
  pitch: string
  whatItDoes: string[]
  integratesWith: string[]
  priceBand: string
  timeToLive: string
  expectedImpact: string
  cta: { label: string; href: string }
}

export interface FullSystemCard {
  kind: 'tier-3'
  title: string
  pitch: string
  pipeline: string[]
  brain: { summary: string; examples: string[] }
  priceBand: string
  timeToLive: string
  expectedImpact: string
  cta: { label: string; href: string }
}

export type OpportunityCard = Tier1Card | Tier2Card | Tier3Card | QuestionsCallCard

// ─── Top-level report shape ─────────────────────────────────────────

export interface ReportV2 {
  id: string
  company: string
  trade: string
  industry: Industry
  ownerName: string
  ownerFirstName: string
  teamSize: number
  generatedAt: string

  businessProfile: {
    paragraph: string
    stats: { label: string; value: string }[]
  }

  whereYouStand: BenchmarkLine[]   // honest live-signal entries, not industry benchmarks

  whatsEatingYourWeek: {
    statedPain: string
    quantifiedLeak: string
    narrative: string
  }

  opportunities: {
    tier1: Tier1Card | null
    tier2Cards: Tier2Card[]        // 2-4 surfaced from the industry menu
    tier3: Tier3Card | null
    questionsCall: QuestionsCallCard
  }

  whatHappensNext: {
    paragraph: string
    signoff: string
  }

  // Staged reveal flags — now per-section + per-tier-card
  readiness?: {
    businessProfile: boolean
    whereYouStand: boolean
    whatsEatingYourWeek: boolean
    tier1: boolean
    tier2CountShown: number        // 0-4, grows as user answers Q6-Q8
    tier3: boolean
    opportunities: boolean         // convenience = tier1 || tier2CountShown > 0 || tier3
    whatHappensNext: boolean
    ctasUnlocked: boolean          // requires email at Q10
  }
}

export type { AssessmentAnswers, Industry }
