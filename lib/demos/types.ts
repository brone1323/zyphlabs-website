// Shared types for the /demos showcase.
// Every Tier-2 automation in the Zyph offering matrix has a matching Demo.
// A Demo takes structured sample input, runs an "AI" step, and produces
// a draft output that we actually email to maya@zyphlabs.com so prospects
// can see a real thread.

export type Industry =
  | 'construction'
  | 'appointment'
  | 'retail'
  | 'ecommerce'
  | 'professional'
  | 'saas'
  | 'field'
  | 'creative'

export type AutomationCategory =
  | 'receptionist'
  | 'quote'
  | 'task-tracker'
  | 'collections'
  | 'review-harvester'
  | 'on-call-triage'
  | 'booking'
  | 'no-show'
  | 'rebooking'
  | 'billing-chaser'
  | 'post-visit'
  | 'concierge'
  | 'winback'
  | 'inventory'
  | 'schedule'
  | 'social-content'
  | 'customer-service'
  | 'returns'
  | 'fulfillment'
  | 'ad-copy'
  | 'intake'
  | 'engagement-letter'
  | 'time-capture'
  | 'relationship-touch'
  | 'document-nudger'
  | 'sdr'
  | 'demo-prep'
  | 'trial-activation'
  | 'churn-risk'
  | 'expansion'
  | 'post-demo'
  | 'eta-portal'
  | 'instant-invoice'
  | 'maintenance-plan'
  | 'inquiry-proposal'
  | 'contract-deposit'
  | 'pre-shoot'
  | 'gallery-delivery'
  | 'testimonial'

export interface DemoBusiness {
  name: string
  tagline: string
  industry: Industry
  ownerName: string
  ownerVoice: string // short description of owner's tone
  city: string
}

export interface DemoInputField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'phone'
  placeholder?: string
  defaultValue?: string
  options?: { label: string; value: string }[]
  helperText?: string
}

export interface DemoScenario {
  label: string
  description: string
  values: Record<string, string>
}

export interface DemoOutputPreview {
  type: 'email' | 'sms' | 'dashboard' | 'call-summary' | 'multi-channel'
  subject?: string
  recipient?: string
  channelLabel?: string
  body: string // plain text, \n separated
  htmlBody?: string // optional html render
}

export interface Demo {
  slug: string // url slug e.g. "ai-receptionist-construction"
  title: string // "AI Receptionist"
  subtitle: string // one-liner
  category: AutomationCategory
  industry: Industry
  business: DemoBusiness
  tier2Price: string // e.g. "$3,500 build + $250/mo"
  buildTime: string // "2 weeks"
  description: string // 2-3 sentence pitch
  howItWorks: string[] // 3-5 steps
  inputFields: DemoInputField[]
  scenarios: DemoScenario[] // pre-filled example scenarios
  generateOutput: (inputs: Record<string, string>, business: DemoBusiness) => DemoOutputPreview[]
  brainHook?: string // optional: what the Brain adds to this automation
}
