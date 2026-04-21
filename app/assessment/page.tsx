'use client'

// /assessment — live Claude chat that runs the 8-industry business assessment.
// Links from the homepage "Get My Free Assessment" CTA. On completion, posts
// structured answers to /api/assessment-submit which emails alex@ + appends
// to the Google Sheet. The user is told to expect a human follow-up within
// 24 hours — no automated report is emailed.

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Msg = { role: 'user' | 'assistant'; content: string; typing?: boolean }

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Hey! I'm the Zyph AI consultant. This takes about 8 minutes — just a casual chat about your business so we can find where AI can save you hours and make you money. To kick off, what's the name of your business and what do you do?",
}

export default function AssessmentPage() {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [completed, setCompleted] = useState<{
    submitted: boolean
    reportUrl?: string
    error?: string
  } | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll when new content arrives
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isThinking])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function send() {
    const text = input.trim()
    if (!text || isThinking || completed) return
    setInput('')

    const nextMessages: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setIsThinking(true)

    try {
      const resp = await fetch('/api/assessment-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || `HTTP ${resp.status}`)

      const assistantText = (data.text || '').trim()

      // Typewriter-animate the assistant reply
      await animateAssistantMessage(assistantText, setMessages)
      setIsThinking(false)

      if (data.done && data.answers) {
        // All answers collected — submit to the pipeline
        await submitCompletedAssessment(data.answers, data.ownerEmail, setCompleted)
      }
    } catch (err) {
      setIsThinking(false)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Sorry — I hit a snag on my end. Try that again? If it keeps happening, shoot us a note at alex@zyphlabs.com.",
        },
      ])
      console.error(err)
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between bg-[#0a0a0f]/90 backdrop-blur-sm sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">
            Z
          </div>
          <span className="font-semibold text-white group-hover:text-[#a29bfe] transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Zyph Labs
          </span>
        </Link>
        <div className="text-xs text-[#8888aa] hidden sm:block">
          Free AI assessment · ~8 min
        </div>
      </header>

      {/* Chat area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-10 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}

          {isThinking && <TypingIndicator />}

          {completed && <CompletionCard completed={completed} />}
        </div>
      </main>

      {/* Input bar — hidden once completed */}
      {!completed && (
        <div className="border-t border-white/10 px-4 sm:px-6 py-4 bg-[#0a0a0f]/95 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={isThinking ? 'Zyph is thinking…' : 'Type your reply…'}
              disabled={isThinking}
              rows={1}
              className="flex-1 resize-none bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-[15px] leading-snug text-white placeholder-[#666688] focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7]/40 transition-colors disabled:opacity-60 max-h-40"
              style={{ fontFamily: 'inherit' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || isThinking}
              className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-[11px] text-[#555577] text-center mt-3 max-w-2xl mx-auto">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isUser && (
        <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-xs">
          Z
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed max-w-[85%] sm:max-w-[75%] whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] text-white rounded-br-md'
            : 'bg-white/8 border border-white/10 text-[#eaeaef] rounded-bl-md'
        }`}
      >
        {msg.content}
        {msg.typing && <span className="ml-1 animate-pulse">▍</span>}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-xs">
        Z
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/8 border border-white/10">
        <div className="flex items-center gap-1.5">
          <Dot delay="0s" />
          <Dot delay="0.15s" />
          <Dot delay="0.3s" />
        </div>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]"
      style={{
        animation: 'zyph-pulse 1.2s infinite ease-in-out',
        animationDelay: delay,
      }}
    />
  )
}

function CompletionCard({
  completed,
}: {
  completed: { submitted: boolean; reportUrl?: string; error?: string }
}) {
  if (completed.error) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/30 bg-red-500/5 mt-8">
        <h3 className="text-base font-semibold text-red-200 mb-2">Submission hiccup</h3>
        <p className="text-sm text-[#ccccdd] mb-3">
          Your answers were collected but we couldn't file them. Email{' '}
          <a href="mailto:alex@zyphlabs.com" className="text-[#a29bfe] underline">
            alex@zyphlabs.com
          </a>{' '}
          and mention this and we'll sort it out.
        </p>
        <p className="text-xs text-[#666688] font-mono">{completed.error}</p>
      </div>
    )
  }
  return (
    <div className="rounded-2xl p-6 sm:p-7 border border-white/10 bg-gradient-to-br from-[#6c5ce7]/15 to-[#00cec9]/10 mt-8 backdrop-blur-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-lg shrink-0">
          ✓
        </div>
        <div>
          <h3
            className="text-lg font-semibold text-white mb-1"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            You're all set.
          </h3>
          <p className="text-sm text-[#ccccdd] leading-relaxed">
            We got everything we need. Someone from our team will review your answers and reach out
            within 24 hours with a personalized breakdown of where we can save you time and make you
            money. No generic templates — we actually read it.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <Link
          href="/"
          className="btn-primary inline-block text-center text-sm px-5 py-3 flex-1"
        >
          Back to homepage
        </Link>
        <a
          href="mailto:alex@zyphlabs.com"
          className="btn-secondary inline-block text-center text-sm px-5 py-3 flex-1"
        >
          Email us a follow-up
        </a>
      </div>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

async function animateAssistantMessage(
  fullText: string,
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>,
) {
  // Start with an empty assistant bubble
  setMessages((m) => [...m, { role: 'assistant', content: '', typing: true }])

  // Reveal word by word
  const words = fullText.split(/(\s+)/) // keep separators
  let accum = ''
  for (const w of words) {
    accum += w
    setMessages((m) => {
      const next = [...m]
      next[next.length - 1] = { role: 'assistant', content: accum, typing: true }
      return next
    })
    await sleep(w.trim() ? 28 + Math.random() * 40 : 20)
  }

  // Finalize — drop the typing cursor
  setMessages((m) => {
    const next = [...m]
    next[next.length - 1] = { role: 'assistant', content: fullText }
    return next
  })
}

async function submitCompletedAssessment(
  answers: any,
  ownerEmail: string | null,
  setCompleted: React.Dispatch<
    React.SetStateAction<{ submitted: boolean; reportUrl?: string; error?: string } | null>
  >,
) {
  try {
    const resp = await fetch('/api/assessment-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, email: ownerEmail }),
    })
    const data = await resp.json()
    if (!resp.ok) throw new Error(data?.error || `HTTP ${resp.status}`)
    setCompleted({ submitted: true, reportUrl: data.reportUrl })
  } catch (err) {
    setCompleted({ submitted: false, error: String(err) })
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
