export type LeadsPlan = {
  id: string
  name: string
  price: string
  amount: number
  description: string
  features: string[]
  button: string
  popular?: boolean
}

export const leadsPlans: LeadsPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$99/month',
    amount: 9900,
    description:
      'Perfect for businesses that need a professional online presence and lead capture.',
    features: [
      'High-converting website',
      'Lead capture forms',
      'AI website assistant',
      'Free hosting',
      'Free domain',
      'Business email included',
    ],
    button: 'Start For $99',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$249/month',
    amount: 24900,
    description: 'Increase visibility and improve local search performance.',
    features: [
      'Everything in Starter plus:',
      'Google Business Profile audit',
      'Google Business optimization',
      'Social media audit',
      'Social media optimization',
      '30 days of social media content',
    ],
    button: 'Start For $249',
  },
  {
    id: 'accelerate',
    name: 'Accelerate',
    price: '$499/month',
    amount: 49900,
    description: 'Add paid advertising to generate more qualified leads.',
    features: [
      'Everything in Growth plus:',
      'Google Ads setup',
      'Meta Ads setup',
      'Campaign management',
      'Lead tracking',
      'Monthly reporting',
    ],
    button: 'Start For $499',
  },
  {
    id: 'dominate',
    name: 'Dominate',
    price: '$999/month',
    amount: 99900,
    description: 'Aggressive lead generation for businesses ready to scale.',
    features: [
      'Everything in Accelerate plus:',
      'Larger ad budget management',
      'Additional ad creative',
      'Split testing',
      'Advanced optimization',
      'Priority support',
      'Advanced reporting',
    ],
    button: 'Start For $999',
    popular: true,
  },
]

export function getLeadsPlan(planId: string) {
  return leadsPlans.find((plan) => plan.id === planId)
}
