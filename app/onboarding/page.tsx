import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import OnboardingForm from '@/components/leads/OnboardingForm'

export const metadata: Metadata = {
  title: 'Lead Generation Onboarding | Zyph Labs',
  description:
    'Submit your business details so Zyph Labs can set up your website, lead capture, hosting, email, and marketing plan.',
  alternates: {
    canonical: '/onboarding',
  },
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#07111f] px-5 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to plans
          </Link>
          <div className="mt-10 max-w-3xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-[0_0_45px_rgba(27,124,255,0.32)]">
              <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Lead Generation Onboarding
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Send the details Zyph Labs needs to prepare your website, AI lead
              capture, local profiles, and marketing setup.
            </p>
          </div>
        </div>
      </section>
      <section className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <OnboardingForm />
        </div>
      </section>
    </div>
  )
}
