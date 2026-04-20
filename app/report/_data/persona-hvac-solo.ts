import type { AssessmentAnswers } from '@/app/report/_engine/types'

// Sample persona: Jake, solo HVAC service tech in Saskatoon.
// Industry: trades. Revenue model: per-visit (service calls).

export const hvacSoloAnswers: AssessmentAnswers = {
  reportId: 'sample-hvac-solo',
  ownerName: 'Jake Reeves',
  ownerFirstName: 'Jake',

  company: 'Reeves HVAC',
  trade: 'Residential HVAC service, repair, install',
  industry: 'trades',
  customerType: 'consumer',
  revenueModel: 'per-visit',
  yearsInBusiness: 6,
  teamSize: 1,
  officeSize: 0,
  location: 'Saskatoon, SK',
  topPain: 'paperwork + answering calls while on jobs',

  tradeCategory: 'trades',
  segment: 'residential',

  leadSources: ['google', 'referrals', 'repeat'],
  primaryIntake: 'owner',
  afterHoursHandling: 'voicemail',
  leadsLostAfterHoursPerMonth: 4,
  leadResponseTime: 'same-day',
  leadsPerMonth: 35,
  closeRate: 0.4,
  avgTicket: 450,

  quotingTool: 'pen-paper',
  quotingSpeedDays: 1,
  quoteFollowUp: 'never',

  jobMgmtTool: 'none',
  changeOrderProcess: 'verbal',
  clientCommsStyle: 'proactive',

  accountingTool: 'spreadsheet',
  invoiceDelayDays: 3,
  chasingPayments: false,

  hasWebsite: false,
  websiteAgeYears: 0,
  googleReviewCount: 8,
  asksForReviews: false,
  runsAds: [],

  maintenancePct: 0.2,
  truckCount: 1,
  onCallRotation: false,

  wantedTimeBack: ['paperwork', 'phone-calls'],
  keepsUpAtNight: ['missing-calls-while-on-jobs', 'slow-season-cash-flow'],
  leavingMoneyOnTable: ['missed-leads', 'no-maintenance-plans', 'no-website'],
  softwareThatFlopped: [],

  crewSize: 1,
}
