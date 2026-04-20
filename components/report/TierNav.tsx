'use client'

import { useEffect, useState } from 'react'

const links = [
  { id: 'tier-1', label: 'Quick Wins', sub: 'DIY this week', color: 'text-emerald-600' },
  { id: 'tier-2', label: 'Medium Lifts', sub: 'We set it up', color: 'text-blue-600' },
  { id: 'tier-3', label: 'Big Builds', sub: 'Custom, we build', color: 'text-[#6c5ce7]' },
  { id: 'starting-point', label: 'Your Starting Point', sub: 'Top 3 ranked', color: 'text-slate-900' },
]

export default function TierNav() {
  const [active, setActive] = useState('tier-1')

  useEffect(() => {
    const onScroll = () => {
      for (const link of links) {
        const el = document.getElementById(link.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(link.id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200 print:hidden">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 md:gap-4 overflow-x-auto">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${
              active === link.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="font-medium">{link.label}</span>
            <span className={`hidden md:inline ml-2 text-xs opacity-70`}>· {link.sub}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
