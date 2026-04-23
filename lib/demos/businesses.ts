import type { DemoBusiness } from './types'

// Fictional businesses — one per industry. Reused across every demo in that
// industry to build a consistent narrative. Chosen to feel like real local
// operators, not corporate stock.

export const HENDERSON_HVAC: DemoBusiness = {
  name: 'Henderson HVAC & Heating',
  tagline: 'Family-owned HVAC serving greater Edmonton since 2008',
  industry: 'construction',
  ownerName: 'Rick Henderson',
  ownerVoice: 'Direct, warm, no-BS. Uses short sentences. Says "we\'ll take care of it" a lot.',
  city: 'Edmonton, AB',
}

export const AURORA_DENTAL: DemoBusiness = {
  name: 'Aurora Family Dental',
  tagline: 'Gentle, judgment-free dental care for all ages',
  industry: 'appointment',
  ownerName: 'Dr. Priya Shah',
  ownerVoice: 'Calm, reassuring, uses patients\' first names. Avoids medical jargon.',
  city: 'Calgary, AB',
}

export const CEDAR_VALLEY_CAFE: DemoBusiness = {
  name: 'Cedar Valley Cafe & Roastery',
  tagline: 'Small-batch coffee and weekend brunch, pet-friendly patio',
  industry: 'retail',
  ownerName: 'Marcus Ellis',
  ownerVoice: 'Casual, playful, uses emoji sparingly. Always signs off "see you soon, M".',
  city: 'Canmore, AB',
}

export const CEDAR_SOAP_CO: DemoBusiness = {
  name: 'Cedar Soap Co.',
  tagline: 'Handcrafted small-batch soap + skincare from the Rockies',
  industry: 'ecommerce',
  ownerName: 'Lena Okafor',
  ownerVoice: 'Thoughtful, storytelling, ingredient-forward. Often mentions "our little studio in Banff".',
  city: 'Banff, AB',
}

export const WHITMAN_ROSS: DemoBusiness = {
  name: 'Whitman & Ross LLP',
  tagline: 'Boutique real estate and small-business law firm',
  industry: 'professional',
  ownerName: 'David Whitman',
  ownerVoice: 'Formal but human. Plain English, no legalese. Signs "Regards, David".',
  city: 'Vancouver, BC',
}

export const NIMBUS_DATA: DemoBusiness = {
  name: 'Nimbus Data Platform',
  tagline: 'Unified analytics for early-stage Shopify brands',
  industry: 'saas',
  ownerName: 'Jordan Kim',
  ownerVoice: 'Confident, specific, leans on numbers. Opens with context, closes with a clear ask.',
  city: 'Toronto, ON',
}

export const PEAK_PLUMBING: DemoBusiness = {
  name: 'Peak Plumbing & Heating',
  tagline: '24/7 emergency service — licensed, bonded, insured',
  industry: 'field',
  ownerName: 'Tom Delaney',
  ownerVoice: 'Plain-spoken tradesperson. Says "we\'ll have a tech out shortly" and means it.',
  city: 'Red Deer, AB',
}

export const ALDER_ASH_STUDIO: DemoBusiness = {
  name: 'Alder & Ash Studio',
  tagline: 'Wedding + editorial photography, documentary style',
  industry: 'creative',
  ownerName: 'Maya Petrov',
  ownerVoice: 'Warm, observational, a little poetic. Often references specific details from the shoot.',
  city: 'Kelowna, BC',
}

export const BUSINESSES: Record<string, DemoBusiness> = {
  construction: HENDERSON_HVAC,
  appointment: AURORA_DENTAL,
  retail: CEDAR_VALLEY_CAFE,
  ecommerce: CEDAR_SOAP_CO,
  professional: WHITMAN_ROSS,
  saas: NIMBUS_DATA,
  field: PEAK_PLUMBING,
  creative: ALDER_ASH_STUDIO,
}

export const INDUSTRY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  construction: { label: 'Construction Trades', icon: 'hammer', color: '#f59e0b' },
  appointment: { label: 'Appointment-Based', icon: 'calendar', color: '#10b981' },
  retail: { label: 'Retail', icon: 'shop', color: '#ec4899' },
  ecommerce: { label: 'E-commerce', icon: 'cart', color: '#8b5cf6' },
  professional: { label: 'Professional Services', icon: 'briefcase', color: '#0ea5e9' },
  saas: { label: 'B2B SaaS', icon: 'cloud', color: '#06b6d4' },
  field: { label: 'Field Services', icon: 'wrench', color: '#ef4444' },
  creative: { label: 'Creative', icon: 'camera', color: '#a855f7' },
}
