'use client'
import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const sessionId = useRef<string>('')
  const lastPath = useRef<string | null>(null)
  const enterTime = useRef<number>(0)

  // Initialize session ID once per page load (tab open)
  useEffect(() => {
    sessionId.current = generateSessionId()
  }, [])

  const sendEvent = useCallback(
    (type: 'enter' | 'leave', path: string, duration?: number) => {
      if (path.startsWith('/admin')) return
      let referrer = 'direct'
      try {
        if (document.referrer) referrer = new URL(document.referrer).hostname
      } catch {}

      const payload: Record<string, any> = {
        type,
        sessionId: sessionId.current,
        path,
        referrer,
        timestamp: Date.now(),
      }
      if (typeof duration === 'number') payload.duration = Math.round(duration)

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    },
    [],
  )

  // Track page changes — send leave for old page, enter for new page
  useEffect(() => {
    const now = Date.now()

    // If we had a previous page, send a leave event with duration
    if (lastPath.current && lastPath.current !== pathname) {
      const duration = (now - enterTime.current) / 1000 // seconds
      sendEvent('leave', lastPath.current, duration)
    }

    // Record this page as entered
    lastPath.current = pathname
    enterTime.current = now
    sendEvent('enter', pathname)
  }, [pathname, sendEvent])

  // On tab close / navigate away, send leave event for current page
  useEffect(() => {
    const handleUnload = () => {
      if (lastPath.current) {
        const duration = (Date.now() - enterTime.current) / 1000
        sendEvent('leave', lastPath.current, duration)
      }
    }

    // visibilitychange fires more reliably than beforeunload on mobile
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && lastPath.current) {
        const duration = (Date.now() - enterTime.current) / 1000
        sendEvent('leave', lastPath.current, duration)
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [sendEvent])

  return null
}
