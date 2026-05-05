'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useContactModal } from './ContactModalProvider'
import { useChatWidget } from './ChatWidgetProvider'

const navLinks = [
  { href: '/project-runner', label: 'Project Runner' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How It Works' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openModal } = useContactModal()
  const { openWidget } = useChatWidget()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
      style={
        scrolled
          ? {
              background: 'rgba(250,248,244,0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(75,60,40,0.10)',
            }
          : { background: 'transparent' }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--accent)' }}
            >
              <span
                className="text-white font-bold text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Z
              </span>
            </div>
            <span
              className="font-bold text-lg tracking-wide"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-heading)' }}
            >
              ZYPH{' '}
              <span style={{ color: 'var(--accent)' }}>LABS</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-200 whitespace-nowrap"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-heading)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={openModal}
              className="text-sm px-4 py-2.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', border: '1.5px solid var(--border)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => openWidget()}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Chat with Zyph
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <div className="w-5 space-y-1">
              <span
                className="block h-0.5 transition-all duration-300"
                style={{
                  background: 'var(--text-body)',
                  transform: mobileOpen ? 'rotate(45deg) translate(2px, 5px)' : '',
                }}
              />
              <span
                className="block h-0.5 transition-all duration-300"
                style={{ background: 'var(--text-body)', opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-0.5 transition-all duration-300"
                style={{
                  background: 'var(--text-body)',
                  transform: mobileOpen ? 'rotate(-45deg) translate(2px, -5px)' : '',
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="px-4 pb-6 pt-2"
          style={{
            background: 'rgba(250,248,244,0.98)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm transition-colors"
              style={{
                color: 'var(--text-muted)',
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-heading)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => { openModal(); setMobileOpen(false) }}
            className="btn-secondary text-sm block w-full mt-4 text-center"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => { openWidget(); setMobileOpen(false) }}
            className="btn-primary text-sm block w-full mt-3 text-center"
          >
            Chat with Zyph
          </button>
        </div>
      </div>
    </nav>
  )
}
