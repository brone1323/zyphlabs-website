'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type BookingType = 'setup' | 'strategy' | 'questions'

interface Cfg {
  label: string
  duration: number
  price: string
  invoice: boolean
  blurb: string
}

// Return an array of hourly slot labels between 08:00 and 20:00 MST (last start = 19:00 for 60-min slots).
function slotsFor(duration: number): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = []
  const start = 8   // 8am
  const end = 20    // 8pm
  const stepHours = duration >= 60 ? 1 : duration >= 30 ? 0.5 : 0.25
  for (let h = start; h + duration / 60 <= end + 0.0001; h += stepHours) {
    const hour = Math.floor(h)
    const min = Math.round((h - hour) * 60)
    const hh = hour.toString().padStart(2, '0')
    const mm = min.toString().padStart(2, '0')
    const ampm = hour < 12 ? 'AM' : 'PM'
    const h12 = ((hour + 11) % 12) + 1
    const label = `${h12}:${mm} ${ampm}`
    out.push({ value: `${hh}:${mm}`, label })
  }
  return out
}

function nextDays(n: number): { value: string; label: string; dow: string }[] {
  const out: { value: string; label: string; dow: string }[] = []
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const today = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = (d.getMonth() + 1).toString().padStart(2, '0')
    const dd = d.getDate().toString().padStart(2, '0')
    out.push({ value: `${yyyy}-${mm}-${dd}`, label: `${months[d.getMonth()]} ${d.getDate()}`, dow: days[d.getDay()] })
  }
  return out
}

export default function BookingClient({ type, cfg }: { type: BookingType; cfg: Cfg }) {
  const [step, setStep] = useState<'pick' | 'form' | 'done'>('pick')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const days = useMemo(() => nextDays(14), [])
  const slots = useMemo(() => slotsFor(cfg.duration), [cfg.duration])

  async function submit() {
    setErr(null)
    if (!date || !time || !name || !email) {
      setErr('Please fill in name, email, date, and time.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type, date, time,
          durationMin: cfg.duration,
          name, email, phone, notes,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErr(data.error || 'Could not book your call. Please email alex@zyphlabs.com.')
        setSubmitting(false)
        return
      }
      setStep('done')
    } catch (e: any) {
      setErr('Network error. Please email alex@zyphlabs.com to book manually.')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zyph Labs</span>
          </Link>
          <span className="text-xs text-slate-500">All times Mountain (MST/MDT)</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-2">{cfg.label}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Pick a time that works for you
        </h1>
        <p className="text-slate-700 text-base mb-6">{cfg.blurb}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-slate-500 uppercase tracking-wide text-[10px] mb-1">Duration</p>
            <p className="font-semibold text-slate-900 text-sm">{cfg.duration} minutes</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-slate-500 uppercase tracking-wide text-[10px] mb-1">Price</p>
            <p className="font-semibold text-slate-900 text-sm">{cfg.price}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-slate-500 uppercase tracking-wide text-[10px] mb-1">How to pay</p>
            <p className="font-semibold text-slate-900 text-sm">{cfg.invoice ? 'Invoice after call' : 'No payment'}</p>
          </div>
        </div>

        {step === 'done' ? (
          <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 sm:p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl mb-3">&#10003;</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>You&apos;re booked.</h2>
            <p className="text-slate-700">
              {date} at {time} MST \u2014 {cfg.duration} min with Alex.
              Calendar invite is on its way to <strong>{email}</strong>.
            </p>
            <Link href="/" className="inline-block mt-5 bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Back to homepage</Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6">
              <p className="text-sm font-semibold text-slate-900 mb-3">Pick a day</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-5">
                {days.map((d) => (
                  <button key={d.value} onClick={() => setDate(d.value)} className={`flex-shrink-0 rounded-xl px-3 py-2 text-center border ${date === d.value ? 'border-[#6c5ce7] bg-[#6c5ce7]/10 text-[#6c5ce7]' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                    <div className="text-[10px] uppercase tracking-wider">{d.dow}</div>
                    <div className="text-sm font-semibold">{d.label}</div>
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold text-slate-900 mb-3">Pick a time <span className="text-slate-500 font-normal">(8 AM \u2013 8 PM MST)</span></p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {slots.map((s) => (
                  <button key={s.value} onClick={() => setTime(s.value)} className={`rounded-xl px-2 py-2 text-sm border ${time === s.value ? 'border-[#6c5ce7] bg-[#6c5ce7]/10 text-[#6c5ce7] font-semibold' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Your name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First + last" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Your email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Phone <span className="text-slate-500 font-normal">(optional)</span></label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="for SMS reminder" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Anything we should know?</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context, links, specific questions\u2026" rows={3} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] resize-none" />
              </div>
            </div>

            {err && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4 text-sm text-red-800">{err}</div>
            )}

            <button onClick={submit} disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold py-4 text-base hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Booking\u2026' : `Book my ${cfg.label.toLowerCase()}`}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Alex runs Zyph Labs and will be on the call. All times Mountain. If you need to reschedule, email <a href="mailto:alex@zyphlabs.com" className="underline">alex@zyphlabs.com</a>.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
