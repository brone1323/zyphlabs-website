'use client'

import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function RevenueCalculator() {
  const [averageRevenue, setAverageRevenue] = useState(500)
  const [customers, setCustomers] = useState(2)

  const potentialRevenue = useMemo(
    () => Math.max(0, averageRevenue) * Math.max(0, customers),
    [averageRevenue, customers]
  )

  return (
    <section className="bg-white px-5 py-16 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
            Simple ROI Check
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            How Many New Customers Would Pay For This?
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Even one or two additional customers per month can pay for your
            entire marketing system.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Calculator className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-black">
              One New Customer Can Change The Math
            </h3>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-900">
              Average Revenue Per Customer
              <div className="flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/15">
                <span className="font-black text-slate-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={averageRevenue}
                  onChange={(event) =>
                    setAverageRevenue(Number(event.target.value))
                  }
                  className="w-full border-0 bg-transparent px-2 text-base font-bold text-slate-950 outline-none"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-900">
              Additional Customers Per Month
              <input
                type="number"
                min="0"
                step="1"
                value={customers}
                onChange={(event) => setCustomers(Number(event.target.value))}
                className="min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-base font-bold text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
              />
            </label>
          </div>

          <div className="mt-7 rounded-lg bg-slate-950 p-6 text-white">
            <p className="text-sm font-bold text-slate-300">
              Potential Monthly Revenue
            </p>
            <p className="mt-2 text-5xl font-black tracking-tight text-orange-400">
              {formatCurrency(potentialRevenue)}
            </p>
          </div>

          <a
            href="#plans"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-6 text-base font-black text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/30 sm:w-auto"
          >
            See Pricing
          </a>
        </div>
      </div>
    </section>
  )
}
