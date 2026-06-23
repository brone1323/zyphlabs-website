import { Check } from 'lucide-react'
import type { LeadsPlan } from '@/lib/leads-plans'

type PricingCardProps = {
  plan: LeadsPlan
}

export default function LeadsPricingCard({ plan }: PricingCardProps) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-lg border p-6 shadow-2xl transition duration-300 hover:-translate-y-1 ${
        plan.popular
          ? 'border-orange-400 bg-slate-950 text-white shadow-orange-500/20'
          : 'border-slate-200 bg-white text-slate-950 hover:border-blue-500/40'
      }`}
    >
      {plan.popular ? (
        <div className="absolute right-5 top-5 rounded-full bg-orange-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
          Most Popular
        </div>
      ) : null}
      <div className="pr-24">
        <h3 className="text-2xl font-black">{plan.name}</h3>
        <p className="mt-4 text-4xl font-black tracking-tight">{plan.price}</p>
      </div>
      <p
        className={`mt-4 min-h-16 text-sm leading-6 ${
          plan.popular ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {plan.description}
      </p>
      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6">
            <Check
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                plan.popular ? 'text-orange-400' : 'text-blue-600'
              }`}
              aria-hidden="true"
            />
            <span className={plan.popular ? 'text-slate-100' : 'text-slate-700'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <a
        href={`/api/leads-checkout?plan=${plan.id}`}
        className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-center text-sm font-black transition duration-300 focus:outline-none focus:ring-4 ${
          plan.popular
            ? 'bg-orange-400 text-slate-950 hover:bg-orange-300 focus:ring-orange-400/35'
            : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-600/35'
        }`}
      >
        {plan.button}
      </a>
    </article>
  )
}
