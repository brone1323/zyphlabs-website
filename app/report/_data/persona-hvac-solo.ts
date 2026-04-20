import type { AssessmentAnswers } from '@/app/report/_engine/types'

// Sample persona: Jake, solo HVAC service tech in Saskatoon.
// Demonstrates a completely different assessment shape from Miller Remodeling:
// - solo operator (not 8-person crew)
// - service/repair trade (not remodeling)
// - smaller ticket, higher volume
// - no office staff, no job management software

export const hvacSoloAnswers: AssessmentAnswers = {
  reportId: 'sample-hvac-solo',
  ownerName: 'Jake Reeves',
  ownerFirstName: 'Jake',

  company: 'Reeves HVAC',
  trade: 'Residential HVAC service, repair, install',
  tradeCategory: 'trades',
  segment: 'residential',
  yearsInBusiness: 6,
  crewSize: 1,
  officeSize: 0,
  location: 'Saskatoon, SK',

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

  wantedTimeBack: ['paperwork', 'phone-calls'],
  keepsUpAtNight: ['missing-calls-while-on-jobs', 'slow-season-cash-flow'],
  leavingMoneyOnTable: ['missed-leads', 'no-maintenance-plans', 'no-website'],
  softwareThatFlopped: [],
}
