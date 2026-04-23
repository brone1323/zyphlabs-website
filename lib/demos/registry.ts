import type { Demo } from './types'
import { CONSTRUCTION_DEMOS } from './construction'
import { APPOINTMENT_DEMOS } from './appointment'
import { RETAIL_DEMOS } from './retail'
import { ECOMMERCE_DEMOS } from './ecommerce'
import { PROFESSIONAL_DEMOS } from './professional'
import { SAAS_DEMOS } from './saas'
import { FIELD_DEMOS } from './field'
import { CREATIVE_DEMOS } from './creative'

// Master registry — single source of truth for every demo on the site.
export const ALL_DEMOS: Demo[] = [
  ...CONSTRUCTION_DEMOS,
  ...APPOINTMENT_DEMOS,
  ...RETAIL_DEMOS,
  ...ECOMMERCE_DEMOS,
  ...PROFESSIONAL_DEMOS,
  ...SAAS_DEMOS,
  ...FIELD_DEMOS,
  ...CREATIVE_DEMOS,
]

export function getDemoBySlug(slug: string): Demo | undefined {
  return ALL_DEMOS.find((d) => d.slug === slug)
}

export function getDemosByIndustry(industry: string): Demo[] {
  return ALL_DEMOS.filter((d) => d.industry === industry)
}

export function getDemosByCategory(category: string): Demo[] {
  return ALL_DEMOS.filter((d) => d.category === category)
}
