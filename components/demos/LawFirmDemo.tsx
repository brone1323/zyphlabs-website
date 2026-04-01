'use client'
import { useEffect, useRef, useState } from 'react'

type Role = 'ai' | 'user'

interface Message {
  role: Role
  text: string
  delayMs: number
}

const CONVERSATION: Message[] = [
  {
    role: 'ai',
    text: 'Hello! I\'m the Vega Law Group intake assistant. How can I help you today?',
    delayMs: 600,
  },
  {
    role: 'user',
    text: 'I was in a car accident last week and I\'m not sure what my rights are.',
    delayMs: 2200,
  },
  {
    role: 'ai',
    text: 'I\'m sorry to hear that. A few quick questions to connect you with the right attorney — were you injured in the accident?',
    delayMs: 4000,
  },
  {
    role: 'user',
    text: 'Yes. I hurt my neck and back. The other driver ran a red light.',
    delayMs: 6000,
  },
  {
    role: 'ai',
    text: 'That\'s important. Since liability appears clear and you have documented injuries, you may have a strong case. Our attorneys handle personal injury cases on a contingency basis — no fees unless you win.',
    delayMs: 8000,
  },
  {
    role: 'ai',
    text: 'Would you like to schedule a free 30-minute consultation with one of our attorneys?',
    delayMs: 11000,
  },
  {
    role: 'user',
    text: 'Yes, that would be great.',
    delayMs: 13000,
  },
  {
    role: 'ai',
    text: '✓ Appointment confirmed. Attorney Sarah Vega will contact you within 2 hours. You\'ll also receive a case intake form at your email shortly.',
    delayMs: 14800,
  },
]

export default function LawFirmDemo() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showReplay, setShowReplay] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const startedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  function runConversation() {
    // Clear previous timers
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    setVisibleCount(0)
    setIsTyping(false)
    setShowReplay(false)

    CONVERSATION.forEach((msg, i) => {
      // Show typing indicator before each AI message
      if (msg.role === 'ai') {
        const t = setTimeout(() => setIsTyping(true), Math.max(0, msg.delayMs - 900))
        timersRef.current.push(t)
      }
      const t = setTimeout(() => {
        setIsTyping(false)
        setVisibleCount(i + 1)
      }, msg.delayMs)
      timersRef.current.push(t)
    })

    const last = CONVERSATION[CONVERSATION.length - 1].delayMs
    const t = setTimeout(() => setShowReplay(true), last + 2500)
    timersRef.current.push(t)
  }

  // Auto-start on intersection
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true
        runConversation()
      }
    }, { threshold: 0.35 })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Re-run on replay
  useEffect(() => {
    if (replayKey > 0) runConversation()
  }, [replayKey])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleCount, isTyping])

  // Cleanup on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  const messages = CONVERSATION.slice(0, visibleCount)

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#0984e3] border border-[#0984e3]/30 rounded-full px-4 py-1.5 mb-5">
            AI Intake Interface — Live Demo
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            24/7 AI intake — never miss a client
          </h2>
          <p className="text-[#8888aa] mt-3 max-w-2xl mx-auto leading-relaxed">
            Every law firm site we build can include an AI-powered intake assistant that
            qualifies leads around the clock and books consultations automatically.
          </p>
        </div>

        <div ref={containerRef} className="rounded-2xl border border-[#0984e3]/20 bg-[#0a0a0f] overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#0984e3]/10 bg-[#0f0f1a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0984e3] to-[#6c5ce7] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                VL
              </div>
              <div>
                <div
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Vega Law AI Assistant
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <span className="text-xs text-[#8888aa]">Online · vegalaw.com</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-[#444466] hidden sm:block">Powered by Zyph Labs AI</span>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="p-5 space-y-4 overflow-y-auto"
            style={{ height: '420px' }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeInUp 0.35s ease-out' }}
              >
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0984e3] to-[#6c5ce7] flex-shrink-0 mr-2.5 mt-1 text-xs flex items-center justify-center text-white font-bold">
                    V
                  </div>
                )}
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0984e3] text-white rounded-br-sm'
                      : 'bg-[#14142a] text-[#e8e8ff] border border-[#0984e3]/20 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                className="flex items-center gap-2.5"
                style={{ animation: 'fadeInUp 0.3s ease-out' }}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0984e3] to-[#6c5ce7] flex-shrink-0 text-xs flex items-center justify-center text-white font-bold">
                  V
                </div>
                <div className="bg-[#14142a] border border-[#0984e3]/20 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0984e3] inline-block animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#0984e3] inline-block animate-bounce" style={{ animationDelay: '160ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#0984e3] inline-block animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            )}

            {/* Replay button */}
            {showReplay && (
              <div className="text-center pt-2" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                <button
                  onClick={() => setReplayKey(k => k + 1)}
                  className="text-xs text-[#0984e3] border border-[#0984e3]/30 rounded-full px-4 py-2 hover:bg-[#0984e3]/10 transition-colors"
                >
                  ↺ Replay demo
                </button>
              </div>
            )}
          </div>

          {/* Input bar (decorative) */}
          <div className="border-t border-[#0984e3]/10 px-5 py-4 flex items-center gap-3 bg-[#0f0f1a]">
            <div className="flex-1 bg-[#14142a] border border-[#0984e3]/10 rounded-xl px-4 py-2.5 text-sm text-[#444466] select-none">
              Type your message...
            </div>
            <button className="w-9 h-9 rounded-xl bg-[#0984e3] flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
