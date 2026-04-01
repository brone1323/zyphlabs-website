import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Welcome to Zyph Labs! — Your Order is Confirmed',
  description: 'Your website project is confirmed. Here is what happens next.',
}

const nextSteps = [
  {
    step: '01',
    icon: '📧',
    title: 'Check your email',
    desc: "You'll receive an order confirmation from Stripe and a welcome email from us within the next hour. Check your spam folder if you don't see it.",
    time: 'Within 1 hour',
  },
  {
    step: '02',
    icon: '📋',
    title: 'Complete your questionnaire',
    desc: "Fill out our short onboarding questionnaire — logo, brand colors, photos, service descriptions, and any specific requests. Most clients finish in under 15 minutes.",
    time: 'Within 24 hours',
  },
  {
    step: '03',
    icon: '⚙️',
    title: 'We build your site',
    desc: "Our team gets to work on your custom website. We'll send you a preview link for review and approval before anything goes live. Revisions included.",
    time: '7–14 days',
  },
  {
    step: '04',
    icon: '🚀',
    title: 'Your site goes live',
    desc: "Once you approve the design, we deploy to your domain, configure SSL, and your site is live. You'll receive a 'you're live!' email with everything you need.",
    time: 'After approval',
  },
]

export default function WelcomePage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(0,206,201,0.12) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Success icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00cec9]/20 to-[#6c5ce7]/20 border border-[#00cec9]/30 flex items-center justify-center mx-auto mb-8 animate-pulseGlow">
            <span className="text-5xl">✓</span>
          </div>

          <p className="text-[#00cec9] text-sm font-semibold uppercase tracking-widest mb-3">
            Order Confirmed
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Welcome to<br />
            <span className="gradient-text">Zyph Labs!</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-xl mx-auto">
            Your order is confirmed and your project is in the queue. Here's exactly what happens next —
            no guessing, no waiting in the dark.
          </p>

          {searchParams.session_id && (
            <p className="text-xs text-[#444466] mt-4">
              Reference: {searchParams.session_id.slice(0, 24)}...
            </p>
          )}
        </div>
      </section>

      {/* What happens next */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-8 text-center"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            What happens next
          </h2>
          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <div key={step.step} className="glass p-6 rounded-xl flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#6c5ce7]/15 border border-[#6c5ce7]/30 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-[#6c5ce7] uppercase">{step.step}</span>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1.5">
                    <h3
                      className="text-base font-semibold text-white"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <span className="text-xs text-[#6c5ce7] bg-[#6c5ce7]/10 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-[#8888aa] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important info */}
      <section className="py-12 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-6 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3
                className="text-sm font-semibold text-white mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                30-Day Hosting Trial
              </h3>
              <p className="text-xs text-[#8888aa]">
                Your hosting subscription starts today but the first charge is 30 days away — giving us time
                to build and launch your site first.
              </p>
            </div>
            <div className="glass p-6 text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3
                className="text-sm font-semibold text-white mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Need to reach us?
              </h3>
              <p className="text-xs text-[#8888aa]">
                Email us anytime at{' '}
                <span className="text-[#a29bfe]">contact@zyphlabs.com</span>. We respond within 24 hours,
                faster on Professional and Business plans.
              </p>
            </div>
            <div className="glass p-6 text-center">
              <div className="text-3xl mb-3">💳</div>
              <h3
                className="text-sm font-semibold text-white mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Manage Billing
              </h3>
              <p className="text-xs text-[#8888aa]">
                View invoices, update your payment method, or manage your subscription anytime through
                your Stripe customer portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Questionnaire CTA */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto glass p-8 rounded-2xl">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            Ready to get started?
          </p>
          <h2
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Complete your onboarding questionnaire
          </h2>
          <p className="text-sm text-[#8888aa] mb-6">
            Takes about 15 minutes. Share your logo, brand colors, photos, services, and goals —
            and we'll take it from there.
          </p>
          <Link href="/questionnaire" className="btn-primary inline-block px-10 py-4 text-base">
            Start Questionnaire →
          </Link>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-sm text-[#444466] hover:text-[#8888aa] transition-colors">
            ← Back to Zyph Labs
          </Link>
        </div>
      </section>
    </div>
  )
}
