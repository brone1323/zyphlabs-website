import { kvPipeline, kvConfigured } from '@/lib/kv'

const BOT_UA = /(googlebot|bingbot|yandexbot|baiduspider|duckduckbot|facebookexternalhit|twitterbot)/i

interface TrackArgs {
  path: string
  referrer: string
  ip: string
  userAgent: string
}

export async function trackPageView({ path, referrer, ip, userAgent }: TrackArgs): Promise<void> {
  if (!kvConfigured()) return
  if (path.startsWith('/admin')) return
  if (BOT_UA.test(userAgent)) return

  try {
    const encoder = new TextEncoder()
    const raw = encoder.encode(`${ip}:${userAgent}`)
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', raw)
    const fingerprint = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16)

    const today = new Date().toISOString().slice(0, 10)
    const ttl = 90 * 24 * 3600

    await kvPipeline([
      ['INCR', `analytics:pv:total:${path}`],
      ['INCR', `analytics:pv:daily:${today}:${path}`],
      ['INCR', `analytics:daily:${today}`],
      ['INCR', `analytics:ref:${referrer}`],
      ['SADD', `analytics:visitors:${today}`, fingerprint],
      ['SADD', 'analytics:pages', path],
      ['SADD', 'analytics:refs', referrer],
      ['EXPIRE', `analytics:pv:daily:${today}:${path}`, ttl],
      ['EXPIRE', `analytics:daily:${today}`, ttl],
      ['EXPIRE', `analytics:visitors:${today}`, ttl],
    ])
  } catch {
    // never let analytics errors surface
  }
}
