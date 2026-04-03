'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (pathname === lastPath.current) return
    lastPath.current = pathname

    // Skip admin pages
    if (pathname.startsWith('/admin')) return

    let referrer = 'direct'
    try {
      if (document.referrer) referrer = new URL(document.referrer).hostname
    } catch {}

    // keepalive ensures the request completes even if the page navigates away
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
