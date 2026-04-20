// Shared types for the report engine.
// AssessmentAnswers comes from the chat/Retell assessment.
// LibraryRec is a recommendation template with triggers and dynamic content.
// The matcher function turns (answers, library) into a ReportData.

import type { Recommendation, ReportData } from '@/app/report/_data/sample-miller'

export type TradeCategory = 'gc' | 'remodeler' | 'trades' | 'specialty'
export type Segment = 'residential' | 'commercial' | 'mix'
export type LeadSource = 'referrals' | 'google' | 'facebook' | 'repeat' | 'angi' | 'thumbtack' | 'yard-signs'
export type IntakeTool = 'owner' | 'office' | 'assistant' | 'voicemail' | 'ai-agent'
export type AfterHours = 'voicemail' | 'forward' | 'ai' | 'office-hours-only'
export type QuotingTool = 'pen-paper' | 'excel' | 'quickbooks' | 'jobber' | 'buildertrend' | 'stack' | 'planswift' | 'procore' | 'other'
export type JobMgmtTool = 'group-text' | 'whiteboard' | 'jobber' | 'buildertrend' | 'procore' | 'housecall-pro' | 'none'
export type AccountingTool = 'quickbooks' | 'xero' | 'spreadsheet' | 'manual'
export type AdChannel = 'google' | 'facebook' | 'angi' | 'thumbtack' | 'lsa'

export interface AssessmentAnswers {
  reportId: string
  ownerName: string
  ownerFirstName: string
  company: string
  trade: string
  tradeCategory: TradeCategory
  segment: Segment
  yearsInBusiness: number
  crewSize: number
  officeSize: number
  location: string
  leadSources: LeadSource[]
  primaryIntake: IntakeTool
  afterHoursHandling: AfterHours
  leadsLostAfterHoursPerMonth: number
  leadResponseTime: 'minutes' | 'same-day' | 'next-day' | 'days'
  leadsPerMonth: number
  closeRate: number
  avgTicket: number
  quotingTool: QuotingTool
  quotingSpeedDays: number
  quoteFollowUp: 'systematic' | 'sometimes' | 'never'
  jobMgmtTool: JobMgmtTool
  changeOrderProcess: 'text' | 'email' | 'paper' | 'software' | 'verbal'
  clientCommsStyle: 'proactive' | 'reactive' | 'minimal'
  accountingTool: AccountingTool
  invoiceDelayDays: number
  chasingPayments: boolean
  chasingPaymentsAmount?: number
  hasWebsite: boolean
  websiteAgeYears: number
  googleReviewCount: number
  asksForReviews: boolean
  runsAds: AdChannel[]
  wantedTimeBack: string[]
  keepsUpAtNight: string[]
  leavingMoneyOnTable: string[]
  softwareThatFlopped: string[]
}

export type Dyn<T> = T | ((a: AssessmentAnswers) => T)

export interface LibraryRec {
  id: string
  tier: 1 | 2 | 3
  category: 'intake' | 'quoting' | 'jobs' | 'office' | 'marketing' | 'ops' | 'general'
  title: string
  pitch: string
  effort: 'Easy' | 'Medium' | 'Big'
  setupHours: string
  cost: Dyn<string>
  priceAnchor?: Dyn<string>
  whatYouGet?: string[]
  diyGuide?: { tools: string[]; steps: string[] }
  cta?: 'calendly-scope' | 'calendly-strategy' | null
  fixes: Dyn<string>
  roi: Dyn<Recommendation['roi']>
  triggers: (a: AssessmentAnswers) => boolean
  priority: (a: AssessmentAnswers) => number
}

export function resolve<T>(v: Dyn<T>, a: AssessmentAnswers): T {
  return typeof v === 'function' ? (v as (a: AssessmentAnswers) => T)(a) : v
}

export type { Recommendation, ReportData }
