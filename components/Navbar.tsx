'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/services/contractors', label: 'Contractors' },
  { href: '/services/ecommerce', label: 'E-Commerce' },
  { href: '/services/real-estate', label: 'Real Estate' },
  { href: '/services/law-firms', label: 'Law Firms' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/hosting', label: 'Hosting' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(10,10,15,0.92)] backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center shadow-[0_0_15px_rgba(108,92,231,0.4)] group-hover:shadow-[0_0_25px_rgba(108,92,231,0.6)] transition-all">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Z</span>
            </div>
            <span className="font-bold text-lg tracking-wide text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ZYPH <span className="gradient-text">LABS</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#8888aa] hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link href="/services/contractors" className="hidden lg:inline-block btn-primary text-sm px-5 py-2.5">
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#8888aa] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <div className="w-5 space-y-1">
              <span
                className="block h-0.5 bg-current transition-all duration-300"
                style={{ transform: mobileOpen ? 'rotate(45deg) translate(2px, 5px)' : '' }}
              />
              <span
                className="block h-0.5 bg-current transition-all duration-300"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-0.5 bg-current transition-all duration-300"
                style={{ transform: mobileOpen ? 'rotate(-45deg) translate(2px, -5px)' : '' }}
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
        <div className="bg-[rgba(10,10,15,0.98)] backdrop-blur-xl border-b border-white/5 px-4 pb-6 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[#8888aa] hover:text-white border-b border-white/5 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/services/contractors"
            onClick={() => setMobileOpen(false)}
            className="btn-primary text-sm block mt-4 text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
