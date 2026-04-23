'use client'

import { useState, useEffect, useRef } from 'react'
import type { Question } from './questions'

export default function QuestionPane({
  q, index, total, onSubmit, onBack, canGoBack,
}: {
  q: Question
  index: number
  total: number
  onSubmit: (values: Record<string, any>) => void
  onBack: () => void
  canGoBack: boolean
}) {
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setText('')
    setTag('')
    setChecked(new Set())
    inputRef.current?.focus()
  }, [q.id])

  function submit(overrides?: Record<string, any>) {
    const payload: Record<string, any> = { ...overrides }
    if (q.kind === 'text') payload[q.field] = text.trim()
    if (q.kind === 'email') payload[q.field] = text.trim()
    if (q.kind === 'text+tags') {
      payload[q.field] = text.trim()
      if (tag) payload[(q as any).tagField] = tag
    }
    if (q.kind === 'checkboxes') {
      payload[q.field] = Array.from(checked)
    }
    onSubmit(payload)
  }

  function toggleCheck(value: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-12">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6c5ce7] mb-3">Question {index + 1} of {total}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{q.label}</h2>
          {q.sublabel && <p className="text-[#8888aa] text-sm mb-6">{q.sublabel}</p>}
          <div className="mt-6">
            {(q.kind === 'text' || q.kind === 'email') && (
              <>
                <input
                  ref={inputRef as any}
                  type={q.kind === 'email' ? 'email' : 'text'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) submit() }}
                  placeholder={(q as any).placeholder || ''}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-[#555577] rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/30 transition-colors"
                />
                <button
                  onClick={() => submit()}
                  disabled={!text.trim()}
                  className="mt-4 bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold rounded-2xl px-6 py-3 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >Continue &rarr;</button>
              </>
            )}

            {q.kind === 'buttons' && (
              <div className="space-y-2.5">
                {q.options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => submit({ [q.field]: o.value })}
                    className="w-full text-left bg-white/5 border border-white/15 text-white rounded-2xl px-5 py-3.5 text-[15px] font-medium hover:bg-white/10 hover:border-[#6c5ce7]/60 transition-colors flex items-center gap-3"
                  >
                    {o.emoji && <span className="text-lg">{o.emoji}</span>}
                    <span className="flex-1">{o.label}</span>
                    <span className="text-[#6c5ce7] opacity-0 group-hover:opacity-100">&rarr;</span>
                  </button>
                ))}
              </div>
            )}

            {q.kind === 'checkboxes' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((o) => {
                    const isOn = checked.has(o.value)
                    return (
                      <button
                        key={o.value}
                        onClick={() => toggleCheck(o.value)}
                        className={`text-left border rounded-2xl px-4 py-3 text-[14px] font-medium transition-colors flex items-center gap-2.5 ${
                          isOn
                            ? 'bg-[#6c5ce7]/15 border-[#6c5ce7] text-white'
                            : 'bg-white/5 border-white/15 text-[#ccccdd] hover:bg-white/10 hover:border-[#6c5ce7]/40'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[11px] transition-colors ${
                          isOn ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white' : 'border-white/30'
                        }`}>{isOn && '\u2713'}</span>
                        {o.emoji && <span className="text-base">{o.emoji}</span>}
                        <span className="flex-1">{o.label}</span>
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => submit()}
                  disabled={checked.size === 0}
                  className="mt-5 bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold rounded-2xl px-6 py-3 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >Continue &rarr;</button>
                {checked.size > 0 && (
                  <p className="mt-2 text-[11px] text-[#8888aa]">{checked.size} selected</p>
                )}
              </>
            )}

            {q.kind === 'text+tags' && (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                        tag === t
                          ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white'
                          : 'bg-white/5 border-white/20 text-[#ccccdd] hover:bg-white/10'
                      }`}
                    >{t}</button>
                  ))}
                </div>
                <textarea
                  ref={inputRef as any}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder={(q as any).placeholder || ''}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-[#555577] rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/30 transition-colors resize-none"
                />
                <button
                  onClick={() => submit()}
                  disabled={!text.trim() && !tag}
                  className="mt-4 bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold rounded-2xl px-6 py-3 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >Continue &rarr;</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-4 border-t border-white/8 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="text-sm text-[#666688] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#a29bfe] transition-colors"
        >&larr; Back</button>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i <= index ? 'bg-[#6c5ce7]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
