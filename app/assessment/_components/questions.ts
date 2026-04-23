// Deterministic question flow — 10 questions total.
// Classification via industry-select question; no LLM inference.

import type { Industry } from '@/app/report/_engine/types'

export type Question =
  | { id: string; kind: 'text'; label: string; placeholder?: string; field: string; sublabel?: string }
  | { id: string; kind: 'buttons'; label: string; field: string; options: { value: string; label: string; emoji?: string }[]; sublabel?: string }
  | { id: string; kind: 'checkboxes'; label: string; field: string; options: { value: string; label: string; emoji?: string }[]; sublabel?: string }
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
  // Q7 — Project management tools (multi-select)
  {
    id: 'q7',
    kind: 'checkboxes',
    label: "How do you manage your projects so everyone on your team and your customer knows what\u2019s going on?",
    field: 'projectMgmtTools',
    sublabel: "Check all that apply.",
    options: [
      { value: 'crm',          label: 'CRM',                  emoji: '\uD83D\uDCC7' },
      { value: 'excel',        label: 'Excel',                emoji: '\uD83D\uDCCA' },
      { value: 'email',        label: 'Email',                emoji: '\u2709\uFE0F' },
      { value: 'phone',        label: 'Phone calls',          emoji: '\uD83D\uDCDE' },
      { value: 'sms',          label: 'Text / SMS',           emoji: '\uD83D\uDCAC' },
      { value: 'spreadsheets', label: 'Shared spreadsheets',  emoji: '\uD83D\uDCD1' },
      { value: 'whiteboard',   label: 'Whiteboard / paper',   emoji: '\uD83D\uDCDD' },
      { value: 'other',        label: 'Other',                emoji: '\u2795' },
    ],
  },
  // Q8 — Time spent dealing with this info
  {
    id: 'q8',
    kind: 'text',
    label: "How much time does your team spend in a week dealing with this information \u2014 inputs, calls, emails, updates?",
    field: 'infoHoursPerWeek',
    placeholder: 'e.g. 15 hours/week',
    sublabel: "A rough estimate across the whole team is fine.",
  },
  // Q9 — Interest level
  {
    id: 'q9',
    kind: 'buttons',
    label: "If we could give you 90% of that time back \u2014 plus real-time visibility of progress, costs, and margins \u2014 so your team can focus on selling, managing, or anything else, would you be interested?",
    field: 'interestLevel',
    options: [
      { value: 'yes',   label: "Yes \u2014 let\u2019s talk",      emoji: '\u2705' },
      { value: 'maybe', label: 'Maybe \u2014 tell me more',       emoji: '\uD83E\uDD14' },
      { value: 'no',    label: 'Not right now',                    emoji: '\u23F8\uFE0F' },
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
    _projectMgmtTools: Array.isArray(raw.projectMgmtTools) ? raw.projectMgmtTools : [],
    _infoHoursPerWeek: raw.infoHoursPerWeek || '',
    _interestLevel: raw.interestLevel || '',
  }
}
