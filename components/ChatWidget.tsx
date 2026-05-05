'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatWidget } from './ChatWidgetProvider'
import { useContactModal } from './ContactModalProvider'

interface Message {
  role: 'user' | 'assistant'
  content: string
  showContact?: boolean
}

const TIER_GREETINGS: Record<string, string> = {
  starter: "Looks like you're checking out Project Runner Starter ($129/mo). Happy to walk you through what's included — runs in your own Claude Desktop, no hosting required. What's your business type?",
  pro: "Looks like you're considering Project Runner Pro ($449/mo) — the hosted option where we run it and you use it. Happy to walk you through what's included. What's your business type?",
  operator: "Looks like you're considering OpenClaw Operator ($1,799/mo). Happy to walk you through what's included for your business. What industry are you in?",
  command: "Looks like you're considering OpenClaw Command ($5,500/mo) — our full AI Company package. Happy to walk you through what that looks like. What's your business type?",
}

const DEFAULT_GREETING = "Hi 👋 I'm here to help you figure out which Zyph setup fits your business. What are you trying to make easier?"

export default function ChatWidget() {
  const { open, tier, openWidget, closeWidget } = useChatWidget()
  const { openModal } = useContactModal()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !initialized) {
      const greeting = tier ? (TIER_GREETINGS[tier] ?? DEFAULT_GREETING) : DEFAULT_GREETING
      setMessages([{ role: 'assistant', content: greeting }])
      setInitialized(true)
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open, tier, initialized])

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setMessages([])
        setInitialized(false)
        setInput('')
        setLoading(false)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          tier,
        }),
      })
      const data = await res.json()
      if (res.ok && data.content) {
        setMessages([...updatedMessages, {
          role: 'assistant',
          content: data.content,
          showContact: data.showContact ?? false,
        }])
      } else {
        setMessages([...updatedMessages, {
          role: 'assistant',
          content: data.error || 'Something went wrong. Please try the contact form.',
          showContact: true,
        }])
      }
    } catch {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Chat is unavailable right now. Please use the contact form.',
        showContact: true,
      }])
    }
    setLoading(false)
  }, [input, loading, messages, tier])

  return (
    <div className="fixed bottom-6 right-6" style={{ zIndex: 300 }}>
      {/* Floating button — visible when closed */}
      {!open && (
        <button
          type="button"
          onClick={() => openWidget()}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full font-semibold text-sm shadow-lg transition-all"
          style={{
            background: 'var(--accent)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 20px rgba(199,101,72,0.35)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(199,101,72,0.45)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(199,101,72,0.35)'
          }}
          aria-label="Open chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat with Zyph
        </button>
      )}

      {/* Chat panel — visible when open */}
      {open && (
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: 'min(400px, calc(100vw - 24px))',
            height: 'min(560px, calc(100vh - 96px))',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
            animation: 'chatSlideUp 0.22s ease',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ background: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>Z</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                  Chat with Zyph
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  AI assistant · typically instant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeWidget}
              className="w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.12)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[84%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'var(--accent)',
                          color: 'white',
                          borderBottomRightRadius: '4px',
                          fontFamily: 'var(--font-body)',
                        }
                      : {
                          background: 'var(--bg-warm)',
                          color: 'var(--text-body)',
                          border: '1px solid var(--border)',
                          borderBottomLeftRadius: '4px',
                          fontFamily: 'var(--font-body)',
                        }
                  }
                >
                  {msg.content}
                  {msg.role === 'assistant' && msg.showContact && (
                    <button
                      type="button"
                      onClick={() => { closeWidget(); openModal() }}
                      className="block mt-2.5 text-xs px-3 py-1.5 rounded-lg transition-all w-full text-center"
                      style={{
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Open Contact Form →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    background: 'var(--bg-warm)',
                    border: '1px solid var(--border)',
                    borderBottomLeftRadius: '4px',
                  }}
                >
                  <span className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{
                          background: 'var(--accent)',
                          animation: `chatDotPulse 1.2s ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 px-4 py-3 flex gap-2 items-center"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-warm)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask about Zyph..."
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'var(--bg)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-body)',
                fontFamily: 'var(--font-body)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              disabled={loading}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-all text-base"
              style={{
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg)',
                border: '1.5px solid var(--border)',
                color: input.trim() && !loading ? 'white' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}
              aria-label="Send"
            >
              →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes chatDotPulse {
          0%, 60%, 100% { opacity: 0.25; transform: scale(0.8); }
          30%            { opacity: 1;    transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
