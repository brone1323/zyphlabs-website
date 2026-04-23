// Shared types for the report engine.
// AssessmentAnswers is industry-agnostic: Layer 1 fields are always set,
// industry-specific fields are optional and only set when relevant.

import type { Recommendation, ReportData } from '@/app/report/_data/sample-miller'

export type Industry =
  | 'project-based'
  | 'appointment-based'
  | 'retail'
  | 'ecommerce'
  | 'professional-services'
  | 'b2b-saas'
  | 'trades'
  | 'creative'

export type CustomerType = 'consumer' | 'business' | 'both'
export type RevenueModel =
  | 'per-project'
  | 'per-visit'
  | 'subscription'
  | 'transactional'
  | 'hourly'

export type TradeCategory = 'gc' | 'remodeler' | 'trades' | 'specialty'
export type Segment = 'residential' | 'commercial' | 'mix'
export type LeadSource = 'referrals' | 'google' | 'facebook' | 'repeat' | 'angi' | 'thumbtack' | 'yard-signs' | 'walk-in' | 'social-organic' | 'directory' | 'partner'
export type IntakeTool = 'owner' | 'office' | 'assistant' | 'voicemail' | 'ai-agent'
export type AfterHours = 'voicemail' | 'forward' | 'ai' | 'office-hours-only'
export type QuotingTool = 'pen-paper' | 'excel' | 'quickbooks' | 'jobber' | 'buildertrend' | 'stack' | 'planswift' | 'procore' | 'other'
export type JobMgmtTool = 'group-text' | 'whiteboard' | 'jobber' | 'buildertrend' | 'procore' | 'housecall-pro' | 'none'
export type AccountingTool = 'quickbooks' | 'xero' | 'spreadsheet' | 'manual' | 'wave' | 'freshbooks'
export type AdChannel = 'google' | 'facebook' | 'angi' | 'thumbtack' | 'lsa' | 'instagram' | 'tiktok' | 'linkedin' | 'meta' | 'email'

export type BookingTool =
  | 'phone-only'
  | 'calendly'
  | 'square-appts'
  | 'acuity'
  | 'setmore'
  | 'mindbody'
  | 'janeapp'
  | 'dentrix'
  | 'other-ehr'
  | 'spreadsheet'
export type PosSystem = 'square' | 'clover' | 'toast' | 'shopify-pos' | 'lightspeed' | 'other' | 'none'
export type EcomPlatform = 'shopify' | 'woocommerce' | 'amazon' | 'etsy' | 'wix' | 'bigcommerce' | 'custom'
export type BillingModel = 'hourly' | 'retainer' | 'flat-fee' | 'contingency' | 'hybrid'
export type SaasStage = 'pre-revenue' | 'under-50k-mrr' | '50k-500k-mrr' | '500k-plus-mrr'
export type CrmTool = 'hubspot' | 'salesforce' | 'pipedrive' | 'close' | 'zoho' | 'spreadsheet' | 'none'
export type PrimaryChannel = 'outbound' | 'inbound' | 'plg' | 'partner' | 'mixed'
export type PricingModel = 'day-rate' | 'project' | 'retainer' | 'hourly' | 'package'
export type RevenueBand = 'under-10k' | '10k-50k' | '50k-250k' | '250k-1m' | '1m-plus'

export interface AssessmentAnswers {
  reportId: string
  ownerName: string
  ownerFirstName: string
  ownerEmail?: string // caller/owner email — captured at Q10 on web or spoken on phone
  company: string
  trade: string
  industry: Industry
  customerType: CustomerType
  revenueModel: RevenueModel
  yearsInBusiness: number
  teamSize: number
  location: string
  topPain: string

  leadSources?: LeadSource[]
  primaryIntake?: IntakeTool
  afterHoursHandling?: AfterHours
  leadsLostAfterHoursPerMonth?: number
  leadResponseTime?: 'minutes' | 'same-day' | 'next-day' | 'days'
  leadsPerMonth?: number
  closeRate?: number
  avgTicket?: number

  quotingTool?: QuotingTool
  quotingSpeedDays?: number
  quoteFollowUp?: 'systematic' | 'sometimes' | 'never'
  jobMgmtTool?: JobMgmtTool
  changeOrderProcess?: 'text' | 'email' | 'paper' | 'software' | 'verbal'
  clientCommsStyle?: 'proactive' | 'reactive' | 'minimal'
  tradeCategory?: TradeCategory
  segment?: Segment

  accountingTool?: AccountingTool
  invoiceDelayDays?: number
  chasingPayments?: boolean
  chasingPaymentsAmount?: number
  officeSize?: number

  hasWebsite?: boolean
  websiteAgeYears?: number
  googleReviewCount?: number
  asksForReviews?: boolean
  runsAds?: AdChannel[]

  bookingTool?: BookingTool
  noShowRatePerWeek?: number
  recurringClientPct?: number
  visitsPerWeek?: number
  avgVisitValue?: number
  serviceAreaRadiusKm?: number

  posSystem?: PosSystem
  walkInPct?: number
  onlineOrdering?: boolean
  loyaltyProgram?: boolean
  transactionsPerDay?: number
  peakHours?: string

  ecomPlatform?: EcomPlatform
  monthlyRevenueBand?: RevenueBand
  aov?: number
  returnRate?: number
  adSpendPct?: number
  fulfillment?: 'self' | '3pl' | 'fba' | 'dropship'

  billingModel?: BillingModel
  timeTrackingTool?: 'harvest' | 'toggl' | 'clio' | 'timesolv' | 'spreadsheet' | 'manual' | 'other'
  arAging60PlusPct?: number
  newClientFlow?: 'referral-only' | 'content' | 'networking' | 'ads' | 'mixed'

  stage?: SaasStage
  salesCycleDays?: number
  crm?: CrmTool
  demoCloseRate?: number
  primaryChannel?: PrimaryChannel
  churnRatePct?: number

  dispatchTool?: JobMgmtTool | 'housecall-pro' | 'servicetitan' | 'other'
  maintenancePct?: number
  truckCount?: number
  onCallRotation?: boolean

  pricingModel?: PricingModel
  bookingLeadDays?: number
  portfolioPlatform?: 'squarespace' | 'wordpress' | 'custom' | 'wix' | 'instagram' | 'behance' | 'none'
  assetDeliveryTool?: 'email' | 'dropbox' | 'gdrive' | 'wetransfer' | 'pixieset' | 'pic-time' | 'other'

  wantedTimeBack?: string[]
  keepsUpAtNight?: string[]
  leavingMoneyOnTable?: string[]
  softwareThatFlopped?: string[]

  crewSize?: number
}

export type Dyn<T> = T | ((a: AssessmentAnswers) => T)

export interface LibraryRec {
  id: string
  tier: 1 | 2 | 3
  category:
    | 'intake'
    | 'quoting'
    | 'jobs'
    | 'office'
    | 'marketing'
    | 'ops'
    | 'general'
    | 'booking'
    | 'pos'
    | 'ecom'
    | 'billing'
    | 'sales'
    | 'content'
    | 'delivery'

  industries?: Industry[]

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

export function teamSize(a: AssessmentAnswers): number {
  return a.teamSize ?? a.crewSize ?? 1
}

export type { Recommendation, ReportData }
