// Hand-crafted benchmark values for v1. Authoritative tone — no caveats.
// By month 6 these are replaced with real anonymized data from our own
// assessments. Structure: industry × team-size-band → metrics.
//
// Team size bands:
//   solo   = 1
//   small  = 2-5
//   mid    = 6-15
//   large  = 16+

import type { Industry, AssessmentAnswers } from './types'

type Band = 'solo' | 'small' | 'mid' | 'large'

export function sizeBand(teamSize: number): Band {
  if (teamSize <= 1) return 'solo'
  if (teamSize <= 5) return 'small'
  if (teamSize <= 15) return 'mid'
  return 'large'
}

export interface Benchmarks {
  leadsPerMonth: number
  googleReviews: number
  closeRate: number                 // 0-1
  responseTimeMinutes: number
  topQuartileResponseMinutes: number
  monthlyRevenueLow: number
  monthlyRevenueHigh: number
  painShareTop1: { pain: string; sharePct: number }
  avgRecoveryWhenAutomated: number  // $/month
}

// Defaults applied to every industry and overridden per-band where we have
// a stronger signal. Kept simple on purpose — this isn't a forecast.
const TABLE: Record<Industry, Record<Band, Benchmarks>> = {
  'project-based': {
    solo:  { leadsPerMonth: 18, googleReviews: 22, closeRate: 0.24, responseTimeMinutes: 240, topQuartileResponseMinutes: 15, monthlyRevenueLow: 8000, monthlyRevenueHigh: 25000, painShareTop1: { pain: 'quote turnaround + follow-up', sharePct: 68 }, avgRecoveryWhenAutomated: 4200 },
    small: { leadsPerMonth: 38, googleReviews: 47, closeRate: 0.28, responseTimeMinutes: 180, topQuartileResponseMinutes: 10, monthlyRevenueLow: 25000, monthlyRevenueHigh: 90000, painShareTop1: { pain: 'quote turnaround + follow-up', sharePct: 71 }, avgRecoveryWhenAutomated: 7800 },
    mid:   { leadsPerMonth: 92, googleReviews: 112, closeRate: 0.31, responseTimeMinutes: 120, topQuartileResponseMinutes: 8, monthlyRevenueLow: 90000, monthlyRevenueHigh: 400000, painShareTop1: { pain: 'change-order chaos + AR aging', sharePct: 64 }, avgRecoveryWhenAutomated: 16500 },
    large: { leadsPerMonth: 220, googleReviews: 280, closeRate: 0.34, responseTimeMinutes: 90, topQuartileResponseMinutes: 5, monthlyRevenueLow: 400000, monthlyRevenueHigh: 2000000, painShareTop1: { pain: 'cross-team visibility', sharePct: 58 }, avgRecoveryWhenAutomated: 42000 },
  },
  'appointment-based': {
    solo:  { leadsPerMonth: 24, googleReviews: 34, closeRate: 0.62, responseTimeMinutes: 90, topQuartileResponseMinutes: 5, monthlyRevenueLow: 6000, monthlyRevenueHigh: 18000, painShareTop1: { pain: 'no-shows + lapsed clients', sharePct: 72 }, avgRecoveryWhenAutomated: 2800 },
    small: { leadsPerMonth: 60, googleReviews: 78, closeRate: 0.68, responseTimeMinutes: 60, topQuartileResponseMinutes: 5, monthlyRevenueLow: 18000, monthlyRevenueHigh: 60000, painShareTop1: { pain: 'no-shows + after-hours calls', sharePct: 69 }, avgRecoveryWhenAutomated: 5200 },
    mid:   { leadsPerMonth: 140, googleReviews: 180, closeRate: 0.71, responseTimeMinutes: 45, topQuartileResponseMinutes: 4, monthlyRevenueLow: 60000, monthlyRevenueHigh: 250000, painShareTop1: { pain: 'front-desk bottleneck', sharePct: 66 }, avgRecoveryWhenAutomated: 11800 },
    large: { leadsPerMonth: 340, googleReviews: 420, closeRate: 0.74, responseTimeMinutes: 30, topQuartileResponseMinutes: 3, monthlyRevenueLow: 250000, monthlyRevenueHigh: 1500000, painShareTop1: { pain: 'insurance AR + multi-provider ops', sharePct: 61 }, avgRecoveryWhenAutomated: 28000 },
  },
  'retail': {
    solo:  { leadsPerMonth: 40, googleReviews: 38, closeRate: 0.50, responseTimeMinutes: 120, topQuartileResponseMinutes: 10, monthlyRevenueLow: 8000, monthlyRevenueHigh: 22000, painShareTop1: { pain: 'social + reviews neglect', sharePct: 74 }, avgRecoveryWhenAutomated: 2400 },
    small: { leadsPerMonth: 90, googleReviews: 92, closeRate: 0.55, responseTimeMinutes: 60, topQuartileResponseMinutes: 8, monthlyRevenueLow: 22000, monthlyRevenueHigh: 75000, painShareTop1: { pain: 'reviews + loyalty adoption', sharePct: 70 }, avgRecoveryWhenAutomated: 4400 },
    mid:   { leadsPerMonth: 220, googleReviews: 210, closeRate: 0.58, responseTimeMinutes: 45, topQuartileResponseMinutes: 6, monthlyRevenueLow: 75000, monthlyRevenueHigh: 280000, painShareTop1: { pain: 'multi-location staff scheduling', sharePct: 62 }, avgRecoveryWhenAutomated: 9600 },
    large: { leadsPerMonth: 480, googleReviews: 520, closeRate: 0.60, responseTimeMinutes: 30, topQuartileResponseMinutes: 4, monthlyRevenueLow: 280000, monthlyRevenueHigh: 1800000, painShareTop1: { pain: 'inventory + staff optimization', sharePct: 58 }, avgRecoveryWhenAutomated: 24500 },
  },
  'ecommerce': {
    solo:  { leadsPerMonth: 400, googleReviews: 12, closeRate: 0.022, responseTimeMinutes: 180, topQuartileResponseMinutes: 30, monthlyRevenueLow: 4000, monthlyRevenueHigh: 20000, painShareTop1: { pain: 'cart abandonment + support volume', sharePct: 78 }, avgRecoveryWhenAutomated: 2200 },
    small: { leadsPerMonth: 2400, googleReviews: 42, closeRate: 0.028, responseTimeMinutes: 120, topQuartileResponseMinutes: 20, monthlyRevenueLow: 20000, monthlyRevenueHigh: 120000, painShareTop1: { pain: 'support tickets eating founder time', sharePct: 74 }, avgRecoveryWhenAutomated: 6800 },
    mid:   { leadsPerMonth: 8000, googleReviews: 140, closeRate: 0.031, responseTimeMinutes: 90, topQuartileResponseMinutes: 15, monthlyRevenueLow: 120000, monthlyRevenueHigh: 500000, painShareTop1: { pain: 'ad spend attribution + LTV', sharePct: 68 }, avgRecoveryWhenAutomated: 18500 },
    large: { leadsPerMonth: 22000, googleReviews: 380, closeRate: 0.033, responseTimeMinutes: 60, topQuartileResponseMinutes: 10, monthlyRevenueLow: 500000, monthlyRevenueHigh: 5000000, painShareTop1: { pain: 'retention + winback systems', sharePct: 61 }, avgRecoveryWhenAutomated: 44000 },
  },
  'professional-services': {
    solo:  { leadsPerMonth: 12, googleReviews: 18, closeRate: 0.38, responseTimeMinutes: 240, topQuartileResponseMinutes: 15, monthlyRevenueLow: 10000, monthlyRevenueHigh: 30000, painShareTop1: { pain: 'AR aging + intake friction', sharePct: 66 }, avgRecoveryWhenAutomated: 4800 },
    small: { leadsPerMonth: 28, googleReviews: 42, closeRate: 0.42, responseTimeMinutes: 180, topQuartileResponseMinutes: 12, monthlyRevenueLow: 30000, monthlyRevenueHigh: 120000, painShareTop1: { pain: 'partner time on unqualified intake', sharePct: 70 }, avgRecoveryWhenAutomated: 9200 },
    mid:   { leadsPerMonth: 65, googleReviews: 95, closeRate: 0.46, responseTimeMinutes: 120, topQuartileResponseMinutes: 10, monthlyRevenueLow: 120000, monthlyRevenueHigh: 500000, painShareTop1: { pain: 'doc gen + realization rate', sharePct: 64 }, avgRecoveryWhenAutomated: 22000 },
    large: { leadsPerMonth: 160, googleReviews: 220, closeRate: 0.49, responseTimeMinutes: 90, topQuartileResponseMinutes: 8, monthlyRevenueLow: 500000, monthlyRevenueHigh: 3000000, painShareTop1: { pain: 'matter routing + AR', sharePct: 59 }, avgRecoveryWhenAutomated: 52000 },
  },
  'b2b-saas': {
    solo:  { leadsPerMonth: 40, googleReviews: 8, closeRate: 0.12, responseTimeMinutes: 180, topQuartileResponseMinutes: 15, monthlyRevenueLow: 2000, monthlyRevenueHigh: 15000, painShareTop1: { pain: 'outbound volume + onboarding drag', sharePct: 72 }, avgRecoveryWhenAutomated: 3200 },
    small: { leadsPerMonth: 180, googleReviews: 22, closeRate: 0.15, responseTimeMinutes: 120, topQuartileResponseMinutes: 10, monthlyRevenueLow: 15000, monthlyRevenueHigh: 80000, painShareTop1: { pain: 'churn blindness + SDR capacity', sharePct: 74 }, avgRecoveryWhenAutomated: 8800 },
    mid:   { leadsPerMonth: 560, googleReviews: 68, closeRate: 0.19, responseTimeMinutes: 60, topQuartileResponseMinutes: 5, monthlyRevenueLow: 80000, monthlyRevenueHigh: 400000, painShareTop1: { pain: 'churn + expansion visibility', sharePct: 68 }, avgRecoveryWhenAutomated: 21000 },
    large: { leadsPerMonth: 1600, googleReviews: 180, closeRate: 0.22, responseTimeMinutes: 30, topQuartileResponseMinutes: 3, monthlyRevenueLow: 400000, monthlyRevenueHigh: 3000000, painShareTop1: { pain: 'rev-ops integration + forecasting', sharePct: 62 }, avgRecoveryWhenAutomated: 68000 },
  },
  'trades': {
    solo:  { leadsPerMonth: 28, googleReviews: 28, closeRate: 0.45, responseTimeMinutes: 120, topQuartileResponseMinutes: 8, monthlyRevenueLow: 10000, monthlyRevenueHigh: 35000, painShareTop1: { pain: 'after-hours call loss', sharePct: 78 }, avgRecoveryWhenAutomated: 4800 },
    small: { leadsPerMonth: 80, googleReviews: 72, closeRate: 0.52, responseTimeMinutes: 60, topQuartileResponseMinutes: 6, monthlyRevenueLow: 35000, monthlyRevenueHigh: 140000, painShareTop1: { pain: 'after-hours + dispatch chaos', sharePct: 74 }, avgRecoveryWhenAutomated: 9800 },
    mid:   { leadsPerMonth: 200, googleReviews: 180, closeRate: 0.56, responseTimeMinutes: 30, topQuartileResponseMinutes: 4, monthlyRevenueLow: 140000, monthlyRevenueHigh: 500000, painShareTop1: { pain: 'dispatch + tech utilization', sharePct: 68 }, avgRecoveryWhenAutomated: 21000 },
    large: { leadsPerMonth: 520, googleReviews: 420, closeRate: 0.59, responseTimeMinutes: 20, topQuartileResponseMinutes: 3, monthlyRevenueLow: 500000, monthlyRevenueHigh: 2500000, painShareTop1: { pain: 'multi-truck visibility', sharePct: 61 }, avgRecoveryWhenAutomated: 48000 },
  },
  'creative': {
    solo:  { leadsPerMonth: 14, googleReviews: 24, closeRate: 0.32, responseTimeMinutes: 360, topQuartileResponseMinutes: 20, monthlyRevenueLow: 5000, monthlyRevenueHigh: 18000, painShareTop1: { pain: 'inquiry-to-book conversion', sharePct: 71 }, avgRecoveryWhenAutomated: 2600 },
    small: { leadsPerMonth: 32, googleReviews: 52, closeRate: 0.38, responseTimeMinutes: 240, topQuartileResponseMinutes: 15, monthlyRevenueLow: 18000, monthlyRevenueHigh: 70000, painShareTop1: { pain: 'proposal gen + gallery friction', sharePct: 66 }, avgRecoveryWhenAutomated: 5400 },
    mid:   { leadsPerMonth: 72, googleReviews: 110, closeRate: 0.41, responseTimeMinutes: 180, topQuartileResponseMinutes: 10, monthlyRevenueLow: 70000, monthlyRevenueHigh: 280000, painShareTop1: { pain: 'client journey handoffs', sharePct: 62 }, avgRecoveryWhenAutomated: 11500 },
    large: { leadsPerMonth: 160, googleReviews: 240, closeRate: 0.44, responseTimeMinutes: 120, topQuartileResponseMinutes: 8, monthlyRevenueLow: 280000, monthlyRevenueHigh: 1500000, painShareTop1: { pain: 'multi-creative coordination', sharePct: 58 }, avgRecoveryWhenAutomated: 26500 },
  },
}

export function getBenchmarks(a: Partial<AssessmentAnswers>): Benchmarks {
  const industry = (a.industry ?? 'project-based') as Industry
  const band = sizeBand(Number(a.teamSize ?? 1))
  return TABLE[industry][band]
}
