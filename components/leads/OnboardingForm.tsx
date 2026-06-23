'use client'

import { useMemo, useState } from 'react'
import { Send } from 'lucide-react'
import { leadsPlans } from '@/lib/leads-plans'

type OnboardingState = {
  businessName: string
  contactName: string
  email: string
  phone: string
  currentWebsite: string
  desiredDomain: string
  googleBusinessProfileUrl: string
  facebookUrl: string
  instagramUrl: string
  primaryService: string
  serviceArea: string
  targetCustomer: string
  specialOffers: string
  additionalNotes: string
  selectedPlan: string
}

const initialState: OnboardingState = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  currentWebsite: '',
  desiredDomain: '',
  googleBusinessProfileUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  primaryService: '',
  serviceArea: '',
  targetCustomer: '',
  specialOffers: '',
  additionalNotes: '',
  selectedPlan: '',
}

const optionalUrlFields: Array<keyof OnboardingState> = [
  'currentWebsite',
  'googleBusinessProfileUrl',
  'facebookUrl',
  'instagramUrl',
]

function isValidUrl(value: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function OnboardingForm() {
  const [values, setValues] = useState<OnboardingState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = useMemo(() => {
    const next: Partial<Record<keyof OnboardingState, string>> = {}

    if (!values.businessName.trim()) next.businessName = 'Business name is required.'
    if (!values.contactName.trim()) next.contactName = 'Contact name is required.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (!values.phone.trim()) next.phone = 'Phone is required.'
    if (!values.primaryService.trim()) next.primaryService = 'Primary service is required.'
    if (!values.serviceArea.trim()) next.serviceArea = 'Service area is required.'
    if (!values.targetCustomer.trim()) next.targetCustomer = 'Target customer is required.'
    if (!values.selectedPlan) next.selectedPlan = 'Choose the plan you purchased or want to start.'

    optionalUrlFields.forEach((field) => {
      if (!isValidUrl(values[field])) {
        next[field] = 'Enter a full URL starting with https://.'
      }
    })

    return next
  }, [values])

  function updateValue(id: keyof OnboardingState, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
  }

  function showError(id: keyof OnboardingState) {
    return (submitted || touched[id]) && errors[id]
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (Object.keys(errors).length === 0) {
      event.currentTarget.reset()
      setValues(initialState)
      setTouched({})
      window.alert(
        'Thanks. Your onboarding details are ready to be connected to your CRM or email workflow.'
      )
      setSubmitted(false)
    }
  }

  const inputClass =
    'min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15'

  const textFields: Array<[keyof OnboardingState, string, string, boolean]> = [
    ['businessName', 'Business Name', 'text', true],
    ['contactName', 'Contact Name', 'text', true],
    ['email', 'Email', 'email', true],
    ['phone', 'Phone', 'tel', true],
    ['currentWebsite', 'Current Website', 'url', false],
    ['desiredDomain', 'Desired Domain Name', 'text', false],
    ['googleBusinessProfileUrl', 'Google Business Profile URL', 'url', false],
    ['facebookUrl', 'Facebook URL', 'url', false],
    ['instagramUrl', 'Instagram URL', 'url', false],
    ['primaryService', 'Primary Service', 'text', true],
    ['serviceArea', 'Service Area', 'text', true],
    ['targetCustomer', 'Target Customer', 'text', true],
    ['specialOffers', 'Special Offers', 'text', false],
  ]

  return (
    <form
      className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-2xl sm:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5 md:grid-cols-2">
        {textFields.map(([id, label, type, required]) => (
          <div key={id} className="grid gap-2">
            <label htmlFor={id} className="text-sm font-bold text-slate-900">
              {label}
              {required ? <span className="text-blue-600"> *</span> : null}
            </label>
            <input
              id={id}
              name={id}
              type={type}
              value={values[id]}
              onBlur={() => setTouched((current) => ({ ...current, [id]: true }))}
              onChange={(event) => updateValue(id, event.target.value)}
              aria-invalid={Boolean(showError(id))}
              className={inputClass}
            />
            {showError(id) ? (
              <p className="text-sm font-semibold text-red-600">{errors[id]}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-2">
        <label htmlFor="selectedPlan" className="text-sm font-bold text-slate-900">
          Selected Plan <span className="text-blue-600">*</span>
        </label>
        <select
          id="selectedPlan"
          name="selectedPlan"
          value={values.selectedPlan}
          onBlur={() => setTouched((current) => ({ ...current, selectedPlan: true }))}
          onChange={(event) => updateValue('selectedPlan', event.target.value)}
          aria-invalid={Boolean(showError('selectedPlan'))}
          className={inputClass}
        >
          <option value="">Select a plan</option>
          {leadsPlans.map((plan) => (
            <option key={plan.id} value={plan.title}>
              {plan.title} - ${plan.monthlyPrice}/month
            </option>
          ))}
        </select>
        {showError('selectedPlan') ? (
          <p className="text-sm font-semibold text-red-600">{errors.selectedPlan}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="additionalNotes" className="text-sm font-bold text-slate-900">
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={5}
          value={values.additionalNotes}
          onChange={(event) => updateValue('additionalNotes', event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
        />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-base font-black text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/30"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        Submit Onboarding
      </button>
    </form>
  )
}
