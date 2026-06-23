import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Globe2,
  Mail,
  Megaphone,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import LeadsPricingCard from '@/components/leads/PricingCard'
import RevenueCalculator from '@/components/leads/RevenueCalculator'
import { leadsPlans } from '@/lib/leads-plans'

export const metadata: Metadata = {
  title: 'Get More Leads | Zyph Labs',
  description:
    'Monthly lead generation packages for local businesses with websites, AI lead capture, hosting, email, Google Business optimization, social media, and paid advertising.',
  alternates: {
    canonical: '/leads',
  },
}

const trustIndicators = [
  'High-Converting Website',
  'AI Lead Capture',
  'Hosting Included',
  'Business Email Included',
  'No Long-Term Contract',
]

const comparisonRows = [
  ['Professional Website', 'Yes', 'Yes', 'Yes'],
  ['Hosting Included', 'Yes', 'Usually Extra', 'Yes'],
  ['Domain Included', 'Extra', 'Usually Extra', 'Yes'],
  ['Business Email', 'Extra', 'Usually Extra', 'Yes'],
  ['AI Lead Capture', 'No', 'Rare', 'Yes'],
  ['Google Business Optimization', 'No', 'Extra', 'Yes'],
  ['Social Media Content', 'No', 'Extra', 'Yes'],
  ['Advertising Support', 'No', 'Extra', 'Yes'],
  ['Typical Monthly Cost', '$30-$80', '$500-$3000+', 'Starting at $99'],
]

const exampleOutcomes = [
  {
    quote:
      'The process was simple, the website looked great, and we started receiving inquiries almost immediately.',
    name: 'Shirley at Baton Roofing',
  },
  {
    quote:
      'For less than what we were spending on coffee each week, we finally have a professional online presence.',
    name: 'Zach at Commercial Construction',
  },
  {
    quote:
      "The AI lead capture answered questions when we couldn't. It has already generated leads.",
    name: 'John at Johns Plumbing',
  },
]

const faqs = [
  {
    question: 'Do I own the website?',
    answer:
      'Your business owns the content, domain, and customer leads. Zyph Labs manages the technical system while your subscription is active.',
  },
  {
    question: 'Can I use my existing domain?',
    answer:
      'Yes. You can use an existing domain or we can help set up a new one for your business.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Most starter sites can be prepared quickly after onboarding details are submitted. More advanced plans depend on ad account and profile access.',
  },
  {
    question: 'Are there contracts?',
    answer: 'No long-term contract is required. Plans are monthly subscriptions.',
  },
  {
    question: 'What if I already have a website?',
    answer:
      'We can review your current site, improve conversion paths, or replace it with a lead-focused system.',
  },
  {
    question: 'Can I upgrade later?',
    answer:
      'Yes. You can start with Starter and move into Growth, Accelerate, or Dominate as your business needs more marketing support.',
  },
]

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative isolate overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(27,124,255,0.36),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(255,138,28,0.22),transparent_26%),linear-gradient(135deg,#07111f_0%,#0b1730_48%,#050814_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-blue-100 shadow-[0_0_45px_rgba(27,124,255,0.32)] backdrop-blur">
              <Sparkles className="h-4 w-4 text-orange-400" aria-hidden="true" />
              Local lead generation packages
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Get More Leads For Less Than $4 Per Day
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Professional website, AI lead capture, hosting, email, and
              marketing tools designed to help your business generate more
              customers.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#plans"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-black text-white shadow-[0_0_45px_rgba(27,124,255,0.32)] transition hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/35"
              >
                View Plans
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <Link
                href="/lead-audit"
                className="inline-flex min-h-[52px] items-center justify-center rounded-lg border border-white/20 px-6 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                Free Lead Audit
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              {trustIndicators.map((indicator) => (
                <div
                  key={indicator}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-2 text-sm font-bold text-slate-100 backdrop-blur"
                >
                  <Check className="h-4 w-4 text-blue-300" aria-hidden="true" />
                  {indicator}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[520px]" aria-hidden="true">
            <div className="absolute inset-x-0 top-4 mx-auto max-w-md rounded-lg border border-white/14 bg-white/10 p-4 shadow-[0_0_45px_rgba(27,124,255,0.32)] backdrop-blur-xl sm:p-5 lg:left-auto lg:right-0">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-bold text-slate-300">Lead Pipeline</p>
                  <p className="mt-1 text-3xl font-black">+184%</p>
                </div>
                <BarChart3 className="h-10 w-10 text-blue-300" />
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ['Website lead', 'Booked estimate', 'bg-blue-500'],
                  ['Google Business', 'New call', 'bg-orange-400'],
                  ['Meta ad', 'Quote request', 'bg-emerald-400'],
                ].map(([source, status, color]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between gap-4 rounded-lg bg-white/10 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${color}`} />
                      <span className="truncate font-bold text-white">{source}</span>
                    </div>
                    <span className="shrink-0 text-right text-sm text-slate-300">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 mx-auto grid max-w-md grid-cols-2 gap-3 sm:bottom-8 lg:left-6 lg:right-auto">
              {[
                { label: 'AI capture', icon: Bot },
                { label: 'Hosting', icon: Server },
                { label: 'Domain', icon: Globe2 },
                { label: 'Email', icon: Mail },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur-xl"
                >
                  <item.icon className="h-6 w-6 text-blue-300" />
                  <p className="mt-3 text-sm font-black">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RevenueCalculator />

      <section id="plans" className="bg-white px-5 py-20 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
              Monthly Packages
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Choose The Growth Plan That Fits Your Business
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Whether you&apos;re just getting online or actively scaling your
              company, there&apos;s a plan designed to match your goals.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {leadsPlans.map((plan) => (
              <LeadsPricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
              Compare The Options
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Why Businesses Choose Zyph Labs
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    {[
                      'Feature',
                      'DIY Website Builder',
                      'Traditional Agency',
                      'Zyph Labs',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([feature, diy, agency, zyph]) => (
                    <tr key={feature} className="border-t border-slate-200">
                      <th className="px-5 py-4 text-sm font-black text-slate-950">
                        {feature}
                      </th>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                        {diy}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                        {agency}
                      </td>
                      <td className="bg-blue-600/5 px-5 py-4 text-sm font-black text-slate-950">
                        {zyph === 'Yes' ? (
                          <span className="inline-flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            Yes
                          </span>
                        ) : (
                          zyph
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 rounded-lg bg-slate-950 p-8 text-white sm:p-10">
            <h3 className="text-3xl font-black tracking-tight">
              More Than Just A Website
            </h3>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Most providers sell websites. We build systems designed to
              attract, capture, and convert potential customers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
              Example Customer Outcomes
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              What Business Owners Are Saying
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              These are example outcomes that reflect the kind of feedback a
              business should expect from a smooth launch and stronger lead
              capture system.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {exampleOutcomes.map((item) => (
              <article
                key={item.name}
                className="rounded-lg border border-slate-200 bg-white p-7 shadow-2xl"
              >
                <div className="flex gap-1 text-orange-400" aria-label="Five stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-5 text-base leading-7 text-slate-700">
                  &quot;{item.quote}&quot;
                </p>
                <p className="mt-5 text-sm font-black text-slate-950">
                  - {item.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Questions Before You Start
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none text-lg font-black text-slate-950 marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-orange-400">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Ready to launch
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Ready To Get More Leads?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Choose a plan and get started today. Or request a free website
              and lead generation review.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="#plans"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-orange-400 px-6 text-base font-black text-slate-950 transition hover:bg-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/35"
            >
              Get Started
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </a>
            <Link
              href="/lead-audit"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 text-base font-black text-white transition hover:border-white/40 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Free Lead Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
