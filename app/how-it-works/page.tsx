import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works | Zyph Labs — The Frictionless Web Service',
  description:
    'From order to live website in 7–14 days. We build, host, deploy, and maintain your website — you never touch a server. Here is how it works.',
}

const steps = [
  {
    num: '01',
    icon: '🛒',
    title: 'You Order',
    headline: 'Pick your package. One checkout. Done.',
    body: `Browse our niche service pages, choose your build tier (Basic, Standard, or Premium), and select your monthly hosting plan. Secure Stripe checkout — card, Apple Pay, or Google Pay. No calls required to get started. Once you check out, the project officially begins.`,
    note: 'Your 30-day free hosting trial starts at checkout — no hosting charge until your site is live.',
  },
  {
    num: '02',
    icon: '📋',
    title: 'We Onboard You',
    headline: 'A quick call or questionnaire — we gather everything we need.',
    body: `Within 24 hours of your order, we send you a simple onboarding questionnaire (or schedule a 30-minute call if you prefer). We collect your logo, brand colors, photos, service descriptions, target area, and any specific requirements. You don't need to write copy — we handle that too.`,
    note: 'Most clients complete onboarding in under an hour. No technical knowledge needed.',
  },
  {
    num: '03',
    icon: '⚙️',
    title: 'We Design & Build',
    headline: 'Custom website built for your industry and your brand.',
    body: `Our team designs your site from scratch — no templates. Every page is written, designed, and optimized for your specific niche and goals. When we're done, you receive a preview link to review the site before it goes live. You can request revisions at this stage, and we incorporate your feedback. Nothing launches without your approval.`,
    note: 'Turnaround: 7–14 days for most builds. Premium builds may take up to 21 days.',
  },
  {
    num: '04',
    icon: '🚀',
    title: 'We Deploy & Host',
    headline: 'Your site goes live — we handle every technical detail.',
    body: `Once you approve the design, we handle deployment completely. We configure your custom domain, set up SSL (HTTPS), connect the CDN for fast global loading, and push the site live. You get a "your site is live!" email with your URL and a quick walkthrough. You never touch a hosting dashboard.`,
    note: 'We handle domain DNS configuration — even if you bought your domain elsewhere.',
  },
  {
    num: '05',
    icon: '🛡️',
    title: 'We Maintain & Support',
    headline: 'Ongoing hosting, security, and updates — every month.',
    body: `This is the part that makes Zyph Labs different. After launch, we don't disappear. Your monthly hosting plan covers: managed hosting infrastructure, SSL renewal, security monitoring, uptime tracking, monthly backups, and content updates (depending on your plan tier). Need to change your phone number? Update a photo? Add a new service? Just email us — we'll handle it.`,
    note: 'Professional plan: up to 2 updates/month. Business plan: up to 5 updates/month.',
  },
]

const comparisonRows = [
  ['You Order', '1 checkout', 'Fiverr gig', 'Research, message, negotiate'],
  ['Onboarding', 'Questionnaire or call', 'Freelancer', 'Email back-and-forth, unclear scope'],
  ['Build time', '7–14 days', 'Fiverr/freelancer', '2–8 weeks with revisions'],
  ['Hosting setup', 'We do it', 'You', 'Find a host, buy plan, configure DNS...'],
  ['Going live', 'We handle it', 'You', 'Troubleshoot deployment yourself'],
  ['After launch', 'We maintain it', 'Freelancer', 'They\'re gone — you\'re on your own'],
]

const faq = [
  {
    q: 'What if I already have a website?',
    a: "No problem — we'll replace it with your new Zyph Labs site. If you have content or photos on your current site you want to keep, just let us know during onboarding and we'll migrate what's useful.",
  },
  {
    q: 'What if I don\'t have a domain yet?',
    a: "We can register one for you (pass-through cost + $10 handling fee) or guide you to purchase one yourself. Either way, we configure everything.",
  },
  {
    q: 'Can I cancel my hosting?',
    a: "Yes, anytime. When you cancel, we notify you 30 days in advance and deliver your site files so you can host them elsewhere if you choose. You're not trapped — but most clients stay because the value is obvious.",
  },
  {
    q: 'What if I need major changes after launch?',
    a: "Minor updates (text, photos, hours, contact info) are included in your hosting plan. Major changes like new pages, new features, or a redesign are available at a discounted hourly rate exclusive to hosting clients.",
  },
  {
    q: 'Do you work with clients outside Canada/US?',
    a: 'Yes. Zyph Labs works with clients globally. Stripe handles multi-currency, and we can work across time zones for onboarding and support.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(108,92,231,0.12) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            The frictionless<br />
            <span className="gradient-text">web service.</span>
          </h1>
          <p className="text-lg text-[#8888aa] max-w-2xl mx-auto">
            From order to fully live, hosted, and maintained website — in 7–14 days.
            Here's exactly what happens at every step.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, i) => (
            <div key={step.num} className="glass p-8 md:p-10 rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#6c5ce7]/15 border border-[#6c5ce7]/30 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-[#6c5ce7] uppercase tracking-wider">{step.num}</span>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#6c5ce7] font-semibold uppercase tracking-widest mb-1">
                    Step {i + 1}
                  </p>
                  <h2
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {step.title}
                  </h2>
                  <p className="text-[#a29bfe] font-medium mb-4">{step.headline}</p>
                  <p className="text-[#8888aa] leading-relaxed mb-4">{step.body}</p>
                  <div className="flex items-start gap-2 bg-[#6c5ce7]/8 border border-[#6c5ce7]/20 rounded-lg px-4 py-3">
                    <span className="text-[#00cec9] flex-shrink-0">💡</span>
                    <span className="text-sm text-[#a29bfe]">{step.note}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Comparison: Zyph Labs vs alternatives */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Compare the experience
            </h2>
            <p className="text-[#8888aa]">
              What it's like to get a website built the Zyph Labs way vs. the traditional way.
            </p>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/4 px-6 py-4 text-xs text-[#8888aa] uppercase tracking-widest border-b border-white/8">
              <span>Stage</span>
              <span className="text-center text-[#a29bfe]">Zyph Labs</span>
              <span className="text-center text-[#555577]">Traditional Route</span>
            </div>
            {comparisonRows.map(([stage, zyph, who, trad], i) => (
              <div
                key={stage}
                className={`grid grid-cols-3 px-6 py-4 text-sm items-start gap-4 ${
                  i < comparisonRows.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <span className="text-[#ccccdd] font-medium">{stage}</span>
                <span className="text-center text-[#00cec9]">{zyph}</span>
                <span className="text-center text-[#555577]">{trad}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Questions about the process
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="glass p-6 rounded-xl">
                <h3
                  className="text-base font-semibold text-white mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {item.q}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to get started?
          </h2>
          <p className="text-[#8888aa] mb-10">
            Pick your niche and package below — or email us if you have questions before committing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              { label: 'Contractors', href: '/services/contractors' },
              { label: 'E-Commerce', href: '/services/ecommerce' },
              { label: 'Real Estate', href: '/services/real-estate' },
              { label: 'Law Firms', href: '/services/law-firms' },
            ].map((n) => (
              <Link key={n.href} href={n.href} className="btn-secondary text-sm py-3">
                {n.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
