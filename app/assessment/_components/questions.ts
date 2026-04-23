// Deterministic question flow — 10 questions total.
// Classification via industry-select question; no LLM inference.

import type { Industry } from '@/app/report/_engine/types'

export type Question =
  | { id: string; kind: 'text'; label: string; placeholder?: string; field: string; sublabel?: string }
  | { id: string; kind: 'buttons'; label: string; field: string; options: { value: string; label: string; emoji?: string }[]; sublabel?: string }
  | { id: string; kind: 'stepper'; label: string; field: string; min: number; max: number; suffix?: string; sublabel?: string }
  | { id: string; kind: 'number-band'; label: string; field: string; bands: { value: string; label: string }[]; sublabel?: string }
  | { id: string; kind: 'text+tags'; label: string; field: string; placeholder?: string; tagField: string; tags: string[]; sublabel?: string }
  | { id: string; kind: 'email'; label: string; field: string; sublabel?: string }

export const QUESTIONS: Question[] = [
  // Q1 — Owner's first name
  {
    id: 'q1',
    kind: 'text',
    label: "First, what should we call you?",
    placeholder: 'e.g. Brian',
    field: 'ownerName',
    sublabel: "Your first name is plenty \u2014 we'll use it on your report.",
  },
  // Q2 — Business name + what you do
  {
    id: 'q2',
    kind: 'text',
    label: "What's the name of your business and what do you do?",
    placeholder: 'e.g. Miller Electric \u2014 residential electrical, Calgary',
    field: 'businessNameAndTrade',
    sublabel: "Just a sentence or two \u2014 we'll figure out your industry from this.",
  },
  // Q3 — Industry
  {
    id: 'q3',
    kind: 'buttons',
    label: "Which of these sounds most like your business?",
    field: 'industry',
    options: [
      { value: 'trades',                label: 'Field services / construction (HVAC, plumbing, electrical, GC, remodels)', emoji: '\uD83D\uDD27' },
      { value: 'appointment-based',     label: 'Appointment-based (medical, salon, fitness, therapy)', emoji: '\uD83D\uDCC5' },
      { value: 'retail',                label: 'Retail (shop, cafe, restaurant, gym)', emoji: '\uD83D\uDED2' },
      { value: 'ecommerce',             label: 'E-commerce (Shopify, Amazon, Etsy, DTC)', emoji: '\uD83D\uDCE6' },
      { value: 'professional-services', label: 'Professional services (law, accounting, advisory)', emoji: '\u2696\uFE0F' },
      { value: 'creative',              label: 'Creative (photo, video, design)', emoji: '\uD83C\uDFA8' },
    ],
  },
  // Q4 — Team size
  {
    id: 'q4',
    kind: 'buttons',
    label: 'How big is the team?',
    field: 'teamSize',
    options: [
      { value: '1',   label: 'Just me' },
      { value: '3',   label: '2\u20135 people' },
      { value: '10',  label: '6\u201315 people' },
      { value: '25',  label: '16+ people' },
    ],
  },
  // Q5 — Customer type
  {
    id: 'q5',
    kind: 'buttons',
    label: 'Main customer',
    field: 'customerType',
    options: [
      { value: 'consumer', label: 'Consumers (B2C)' },
      { value: 'business', label: 'Businesses (B2B)' },
      { value: 'both',     label: 'A mix' },
    ],
  },
  // Q6 — Revenue model
  {
    id: 'q6',
    kind: 'buttons',
    label: 'How do people pay you?',
    field: 'revenueModel',
    options: [
      { value: 'per-project',   label: 'Per project' },
      { value: 'per-visit',     label: 'Per visit' },
      { value: 'subscription',  label: 'Subscription' },
      { value: 'transactional', label: 'At the register / online' },
      { value: 'hourly',        label: 'By the hour' },
    ],
  },
  // Q7 — Biggest pain
  {
    id: 'q7',
    kind: 'text+tags',
    label: "What's eating your time or driving you nuts right now?",
    field: 'topPain',
    tagField: 'painTag',
    placeholder: 'Tell it straight \u2014 what are you sick of doing yourself?',
    tags: ['Missed calls', 'Quoting', 'Chasing money', 'Reviews / marketing', 'Admin / paperwork', 'Staff / team', 'Other'],
  },
  // Q8 — Tool stack
  {
    id: 'q8',
    kind: 'text',
    label: 'Quick tool check \u2014 what are you running today?',
    field: 'toolStack',
    placeholder: 'e.g. Jobber + QuickBooks + Gmail',
    sublabel: "Whatever comes to mind. Helps us see what we'd plug into.",
  },
  // Q9 — What would you stop doing
  {
    id: 'q9',
    kind: 'buttons',
    label: 'If I gave you 5 hours back a week \u2014 what would you stop doing yourself?',
    field: 'wantedTimeBack',
    options: [
      { value: 'chasing-payments',   label: 'Chasing payments' },
      { value: 'answering-calls',    label: 'Answering calls' },
      { value: 'quoting',            label: 'Writing quotes' },
      { value: 'admin',              label: 'Admin / paperwork' },
      { value: 'marketing',          label: 'Marketing / social' },
      { value: 'being-bottleneck',   label: 'Being the bottleneck for everything' },
    ],
  },
  // Q10 — Email
  {
    id: 'q10',
    kind: 'email',
    label: "Last one \u2014 where should we send your report?",
    field: 'ownerEmail',
    sublabel: 'Report lands in under a minute. Our team will follow up within 24 hrs \u2014 no spam.',
  },
]

// Maps raw form answers to the AssessmentAnswers schema.
export function toAssessmentAnswers(raw: Record<string, any>): any {
  const tradeParts = (raw.businessNameAndTrade || '').split(/[\u2014\u2013-]/)
  const company = (tradeParts[0] || '').trim() || (raw.businessNameAndTrade ? 'Your Business' : '')
  const trade = (tradeParts.slice(1).join(' \u2014 ') || raw.businessNameAndTrade || '').trim() || company

  return {
    reportId: `web-${Date.now()}`,
    ownerName: raw.ownerName || undefined,
    ownerFirstName: raw.ownerName ? raw.ownerName.split(' ')[0] : undefined,
    company: company || undefined,
    trade: trade || undefined,
    industry: raw.industry || undefined,
    customerType: raw.customerType || undefined,
    revenueModel: raw.revenueModel || undefined,
    teamSize: raw.teamSize ? Number(raw.teamSize) : undefined,
    yearsInBusiness: 0,
    location: raw.location || '',
    topPain: raw.topPain || raw.painTag || '',
    wantedTimeBack: raw.wantedTimeBack ? [String(raw.wantedTimeBack)] : [],
    ownerEmail: raw.ownerEmail || '',
    _toolStack: raw.toolStack,
    _painTag: raw.painTag,
  }
}
