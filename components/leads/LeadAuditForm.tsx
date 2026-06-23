'use client'

import { useMemo, useState } from 'react'
import { Send } from 'lucide-react'

type AuditState = {
  businessName: string
  contactName: string
  email: string
  phone: string
  website: string
  serviceArea: string
  notes: string
}

const initialState: AuditState = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  serviceArea: '',
  notes: '',
}

function isValidUrl(value: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function LeadAuditForm() {
  const [values, setValues] = useState<AuditState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = useMemo(() => {
    const next: Partial<Record<keyof AuditState, string>> = {}

    if (!values.businessName.trim()) next.businessName = 'Business name is required.'
    if (!values.contactName.trim()) next.contactName = 'Contact name is required.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!values.phone.trim()) next.phone = 'Phone is required.'
    if (!values.serviceArea.trim()) next.serviceArea = 'Service area is required.'
    if (!isValidUrl(values.website)) {
      next.website = 'Enter a full URL starting with https://.'
    }

    return next
  }, [values])

  function updateValue(id: keyof AuditState, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
  }

  function showError(id: keyof AuditState) {
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
        'Thanks. Your lead audit request is ready to be connected to your CRM or email workflow.'
      )
      setSubmitted(false)
    }
  }

  const inputClass =
    'min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15'

  return (
    <form
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-2xl sm:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ['businessName', 'Business Name'],
          ['contactName', 'Contact Name'],
          ['email', 'Email'],
          ['phone', 'Phone'],
          ['website', 'Current Website'],
          ['serviceArea', 'Service Area'],
        ].map(([id, label]) => (
          <div key={id} className="grid gap-2">
            <label htmlFor={id} className="text-sm font-bold text-slate-900">
              {label}
              {id !== 'website' ? <span className="text-blue-600"> *</span> : null}
            </label>
            <input
              id={id}
              name={id}
              type={
                id === 'email'
                  ? 'email'
                  : id === 'phone'
                    ? 'tel'
                    : id === 'website'
                      ? 'url'
                      : 'text'
              }
              value={values[id as keyof AuditState]}
              onBlur={() => setTouched((current) => ({ ...current, [id]: true }))}
              onChange={(event) =>
                updateValue(id as keyof AuditState, event.target.value)
              }
              aria-invalid={Boolean(showError(id as keyof AuditState))}
              className={inputClass}
            />
            {showError(id as keyof AuditState) ? (
              <p className="text-sm font-semibold text-red-600">
                {errors[id as keyof AuditState]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-2">
        <label htmlFor="notes" className="text-sm font-bold text-slate-900">
          What do you want reviewed?
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          value={values.notes}
          onChange={(event) => updateValue('notes', event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
        />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-base font-black text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/30"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        Request Free Lead Audit
      </button>
    </form>
  )
}
