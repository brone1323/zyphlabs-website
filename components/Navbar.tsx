'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || ''

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Hide global nav on assessment + report pages — they own their own chrome.
  if (pathname.startsWith('/assessment') || pathname.startsWith('/report')) return null

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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center shadow-[0_0_15px_rgba(108,92,231,0.4)]">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Z</span>
            </div>
            <span className="font-bold text-lg tracking-wide text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ZYPH <span className="gradient-text">LABS</span>
            </span>
          </Link>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white font-semibold rounded-lg px-5 py-2.5 text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <span className="text-[#ffd166]">⚡</span>
            Free Assessment
          </Link>
        </div>
      </div>
    </nav>
  )
}
