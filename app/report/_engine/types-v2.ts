// New report shape per Brian's spec (2026-04-22):
//   1. Business Profile
//   2. Where You Stand (benchmarks)
//   3. What's Eating Your Week (quantified leak)
//   4. Automation Opportunities (3 cards: Tier 2 Quick Win / Tier 3 Full System / 15-min Call)
//   5. What Happens Next
//
// V2 reports are produced by generateReportV2() in matcher-v2.ts. The older
// v1 shape (Tier 1/2/3 rec lists) lives on in types.ts and still backs the
// 9 sample /report/<slug> URLs; v2 is used by /report/dynamic and the new
// /assessment live-build.

import type { AssessmentAnswers, Industry } from './types'

export interface BenchmarkLine {
  label: string          // e.g. "Businesses your size average"
  value: string          // e.g. "47 Google reviews"
  youAre?: string        // e.g. "You mentioned 12"
  gap?: string           // e.g. "35-review gap"
  tone: 'win' | 'gap' | 'neutral'
}

export interface QuickWinCard {
  kind: 'tier-2'
  title: string                  // e.g. "AI Receptionist + Quote Starter"
  pitch: string                  // 1-2 sentence positioning
  whatItDoes: string[]           // 3-5 bullets, plain English
  integratesWith: string[]       // e.g. ["Jobber", "QuickBooks", "Twilio"]
  priceBand: string              // e.g. "$3k–$4k"
  timeToLive: string             // e.g. "1–2 weeks"
  expectedImpact: string         // e.g. "Recovers ~$3–5k/mo in missed after-hours leads"
  cta: { label: string; href: string }
}

export interface FullSystemCard {
  kind: 'tier-3'
  title: string                  // e.g. "The Construction Full System"
  pitch: string                  // one-liner positioning
  pipeline: string[]             // the workflow sequence (5-8 steps)
  brain: {
    summary: string              // what the Brain does in this industry
    examples: string[]           // 2-3 briefing examples
  }
  priceBand: string              // e.g. "$18k build + $1.2k/mo"
  timeToLive: string             // e.g. "4 weeks"
  expectedImpact: string         // e.g. "~half an employee of cost, scales every employee you have"
  cta: { label: string; href: string }
}

export interface QuestionsCallCard {
  kind: 'questions'
  title: string                  // "Still figuring it out?"
  pitch: string                  // "15 minutes, no pitch"
  cta: { label: string; href: string }
}

export type OpportunityCard = QuickWinCard | FullSystemCard | QuestionsCallCard

export interface ReportV2 {
  id: string
  company: string
  trade: string
  industry: Industry
  ownerName: string
  ownerFirstName: string
  teamSize: number
  generatedAt: string            // ISO date

  // Section 1 — Business Profile
  businessProfile: {
    paragraph: string
    stats: { label: string; value: string }[]  // e.g. Team, Tenure, How they get paid
  }

  // Section 2 — Where You Stand
  whereYouStand: BenchmarkLine[]

  // Section 3 — What's Eating Your Week
  whatsEatingYourWeek: {
    statedPain: string
    quantifiedLeak: string       // e.g. "~$3–5k/mo in missed leads + 6 hrs/week on quoting"
    narrative: string            // 2-3 sentence reflection
  }

  // Section 4 — Automation Opportunities (always 3 cards: Quick Win, Full System, Questions Call)
  opportunities: {
    quickWin: QuickWinCard
    fullSystem: FullSystemCard
    questionsCall: QuestionsCallCard
  }

  // Section 5 — What Happens Next
  whatHappensNext: {
    paragraph: string
    signoff: string              // e.g. "— Brian, Zyph Labs"
  }

  // For the live-build UI: which sections are ready to reveal based on partial answers
  readiness?: {
    businessProfile: boolean
    whereYouStand: boolean
    whatsEatingYourWeek: boolean
    opportunities: boolean
    whatHappensNext: boolean
  }
}

// Convenience re-export so consumers don't need to import from multiple files
export type { AssessmentAnswers, Industry }
