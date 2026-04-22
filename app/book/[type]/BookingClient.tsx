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

// Common timezone options — user can pick any of these. We also try to detect their browser TZ as the default.
const TZ_OPTIONS: { value: string; label: string }[] = [
  { value: 'America/St_Johns',     label: 'Newfoundland (NT)' },
  { value: 'America/Halifax',      label: 'Atlantic (AT)' },
  { value: 'America/New_York',     label: 'Eastern (ET)' },
  { value: 'America/Chicago',      label: 'Central (CT)' },
  { value: 'America/Denver',       label: 'Mountain (MT)' },
  { value: 'America/Edmonton',     label: 'Mountain - Edmonton/Calgary' },
  { value: 'America/Phoenix',      label: 'Arizona (no DST)' },
  { value: 'America/Los_Angeles',  label: 'Pacific (PT)' },
  { value: 'America/Vancouver',    label: 'Pacific - Vancouver' },
  { value: 'America/Anchorage',    label: 'Alaska (AKT)' },
  { value: 'Pacific/Honolulu',     label: 'Hawaii (HT)' },
  { value: 'Europe/London',        label: 'UK (GMT/BST)' },
  { value: 'Europe/Paris',         label: 'Central Europe' },
  { value: 'Asia/Dubai',           label: 'Gulf (GST)' },
  { value: 'Asia/Kolkata',         label: 'India (IST)' },
  { value: 'Asia/Singapore',       label: 'Singapore/Hong Kong' },
  { value: 'Asia/Tokyo',           label: 'Japan (JST)' },
  { value: 'Australia/Sydney',     label: 'Sydney (AET)' },
]

function detectTZ(): string {
  if (typeof Intl === 'undefined') return 'America/Denver'
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Denver' } catch { return 'America/Denver' }
}

// Find the Mountain Time UTC offset for a given YYYY-MM-DD (handles DST).
// Uses Intl.DateTimeFormat to sample what noon local looks like and compute the offset.
function mtOffsetMinutes(dateISO: string): number {
  try {
    const utcNoon = new Date(dateISO + 'T12:00:00Z')
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', hour: '2-digit', hour12: false })
    const parts = dtf.formatToParts(utcNoon)
    const hh = Number(parts.find(p => p.type === 'hour')?.value || '12')
    // Denver hour @ UTC noon: MDT => 06, MST => 05. offset = hh - 12
    return (hh - 12) * 60
  } catch { return -360 }
}

function tzOffsetMinutesForLocal(tz: string, dateISO: string): number {
  try {
    const utcNoon = new Date(dateISO + 'T12:00:00Z')
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false })
    const parts = dtf.formatToParts(utcNoon)
    const hh = Number(parts.find(p => p.type === 'hour')?.value || '12')
    return (hh - 12) * 60
  } catch { return 0 }
}

// Generate slots within Brian's 8am-8pm Mountain window for the picked date.
// For each MT slot, also compute what that is in the user's chosen TZ for display.
function slotsFor(duration: number, date: string, userTZ: string): { mtValue: string; mtLabel: string; userLabel: string }[] {
  const out: { mtValue: string; mtLabel: string; userLabel: string }[] = []
  if (!date) return out
  const start = 8
  const end = 20
  const stepHours = duration >= 60 ? 1 : duration >= 30 ? 0.5 : 0.25

  const mtOff = mtOffsetMinutes(date)    // MT offset, e.g. -360 for MDT
  const userOff = tzOffsetMinutesForLocal(userTZ, date)

  for (let h = start; h + duration / 60 <= end + 0.0001; h += stepHours) {
    const hour = Math.floor(h)
    const min = Math.round((h - hour) * 60)
    const hh = hour.toString().padStart(2, '0')
    const mm = min.toString().padStart(2, '0')
    // MT label e.g. "10:00 AM"
    const mtH12 = ((hour + 11) % 12) + 1
    const mtAmPm = hour < 12 ? 'AM' : 'PM'
    const mtLabel = `${mtH12}:${mm} ${mtAmPm}`
    // Compute the user-TZ wall clock for this MT slot on this date
    const utcMinutes = hour * 60 + min - mtOff
    const userTotal = ((utcMinutes + userOff) % 1440 + 1440) % 1440
    const uHour = Math.floor(userTotal / 60)
    const uMin = userTotal % 60
    const uH12 = ((uHour + 11) % 12) + 1
    const uAmPm = uHour < 12 ? 'AM' : 'PM'
    const userLabel = `${uH12}:${String(uMin).padStart(2, '0')} ${uAmPm}`

    out.push({ mtValue: `${hh}:${mm}`, mtLabel, userLabel })
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
  const [step, setStep] = useState<'pick' | 'done'>('pick')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [tz, setTz] = useState<string>(detectTZ())
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const days = useMemo(() => nextDays(14), [])
  const slots = useMemo(() => slotsFor(cfg.duration, date || new Date().toISOString().slice(0, 10), tz), [cfg.duration, date, tz])

  // If the user's TZ isn't already in our dropdown, add it at the top
  const tzOptions = useMemo(() => {
    if (TZ_OPTIONS.find((o) => o.value === tz)) return TZ_OPTIONS
    return [{ value: tz, label: `${tz} (detected)` }, ...TZ_OPTIONS]
  }, [tz])

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
          userTimezone: tz,
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

  const currentSlot = slots.find((s) => s.mtValue === time)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zyph Labs</span>
          </Link>
          <span className="text-xs text-slate-500">Host time: Mountain (MDT/MST)</span>
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
              {date} at {currentSlot ? currentSlot.userLabel : time} ({tz})
              {currentSlot && <span className="text-slate-500"> &middot; {currentSlot.mtLabel} Mountain</span>} &mdash; {cfg.duration} min with Alex.
            </p>
            <p className="text-slate-700 mt-2">Calendar invite is on its way to <strong>{email}</strong>.</p>
            <Link href="/" className="inline-block mt-5 bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-medium">Back to homepage</Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Your timezone</label>
                <select
                  value={tz}
                  onChange={(e) => setTz(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] bg-white"
                >
                  {tzOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label} &mdash; {opt.value}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1.5">Slot labels below are in <strong>your</strong> timezone. Mountain time is shown in the smaller text next to each slot.</p>
              </div>

              <p className="text-sm font-semibold text-slate-900 mb-3">Pick a day</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-5">
                {days.map((d) => (
                  <button key={d.value} onClick={() => setDate(d.value)} className={`flex-shrink-0 rounded-xl px-3 py-2 text-center border ${date === d.value ? 'border-[#6c5ce7] bg-[#6c5ce7]/10 text-[#6c5ce7]' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                    <div className="text-[10px] uppercase tracking-wider">{d.dow}</div>
                    <div className="text-sm font-semibold">{d.label}</div>
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold text-slate-900 mb-1">Pick a time</p>
              <p className="text-xs text-slate-500 mb-3">Host availability is 8 AM &ndash; 8 PM Mountain. Shown in your timezone below.</p>
              {date ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.mtValue}
                      onClick={() => setTime(s.mtValue)}
                      className={`rounded-xl px-3 py-2.5 text-left border ${time === s.mtValue ? 'border-[#6c5ce7] bg-[#6c5ce7]/10' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className={`text-sm font-semibold ${time === s.mtValue ? 'text-[#6c5ce7]' : 'text-slate-900'}`}>{s.userLabel}</div>
                      <div className="text-[11px] text-slate-500">{s.mtLabel} MT</div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Pick a day above to see available times.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Your name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First + last" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Your email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Phone <span className="text-slate-500 font-normal">(optional)</span></label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="for SMS reminder" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Anything we should know?</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context, links, specific questions..." rows={3} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] resize-none placeholder:text-slate-400" />
              </div>
            </div>

            {err && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4 text-sm text-red-800">{err}</div>
            )}

            <button onClick={submit} disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold py-4 text-base hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Booking\u2026' : `Book my ${cfg.label.toLowerCase()}`}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Alex runs Zyph Labs and will be on the call. If you need to reschedule, email <a href="mailto:alex@zyphlabs.com" className="underline">alex@zyphlabs.com</a>.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
