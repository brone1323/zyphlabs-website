'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname() || ''

  // Hide global footer on assessment + report pages
  if (pathname.startsWith('/assessment') || pathname.startsWith('/report')) return null

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0f]">
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Z</span>
            </div>
            <span className="font-bold text-lg tracking-wide text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ZYPH <span className="gradient-text">LABS</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-sm text-[#8888aa]">
            <Link href="/assessment" className="hover:text-white transition-colors">Free Assessment</Link>
            <a href="mailto:alex@zyphlabs.com" className="hover:text-white transition-colors">alex@zyphlabs.com</a>
            <span className="text-[#555577] text-xs">© {new Date().getFullYear()} Zyph Labs</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
