'use client'

import { useEffect, useRef, useState } from 'react'
import { useContactModal } from './ContactModalProvider'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  website: string
}

const EMPTY: FormState = { name: '', email: '', subject: '', message: '', website: '' }

export default function ContactModal() {
  const { open, closeModal } = useContactModal()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => {
      handleClose()
    }, 3000)
    return () => clearTimeout(t)
  })

  function handleClose() {
    closeModal()
    setTimeout(() => {
      setStatus('idle')
      setForm(EMPTY)
      setErrorMsg('')
    }, 300)
  }

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-warm)',
    border: '1.5px solid var(--border)',
    color: 'var(--text-body)',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 200, background: 'rgba(26,26,26,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card-hover)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-warm)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          aria-label="Close"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(87,161,72,0.12)', border: '1.5px solid rgba(87,161,72,0.3)' }}
            >
              <span style={{ color: '#57A148', fontSize: '28px', lineHeight: 1 }}>✓</span>
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)' }}
            >
              Message sent
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Thanks — we&apos;ll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <h2
              className="text-xl font-semibold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)' }}
            >
              Get in touch
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              We&apos;ll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot — hidden from humans */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
              />

              {/* Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}
                >
                  Name<span style={{ color: 'var(--accent)' }}> *</span>
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}
                >
                  Email<span style={{ color: 'var(--accent)' }}> *</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}
                >
                  Message<span style={{ color: 'var(--accent)' }}> *</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  minLength={10}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {errorMsg && (
                <p
                  className="text-sm px-3 py-2 rounded-lg"
                  style={{ color: '#c0392b', background: 'rgba(192,57,43,0.08)' }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full"
                style={status === 'loading' ? { opacity: 0.7, cursor: 'not-allowed', transform: 'none' } : {}}
              >
                {status === 'loading' ? 'Sending…' : 'Send'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
