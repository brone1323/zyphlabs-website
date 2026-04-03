import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { kvPipeline, kvConfigured } from '@/lib/kv'

export async function POST(req: NextRequest) {
  // Silently succeed if KV isn't wired up yet
  if (!kvConfigured()) return NextResponse.json({ ok: true })

  try {
    const body = await req.json()
    const path: string = String(body.path || '/').slice(0, 200)
    const referrer: string = String(body.referrer || 'direct').slice(0, 200)

    // Skip admin pages
    if (path.startsWith('/admin')) return NextResponse.json({ ok: true })

    // Privacy-friendly fingerprint: hash of IP + UA — no cookies, no storage on client
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const ua = req.headers.get('user-agent') || ''
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${ip}:${ua}`)
      .digest('hex')
      .slice(0, 16)

    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const ttl = 90 * 24 * 3600 // 90 days

    await kvPipeline([
      // Per-page totals
      ['INCR', `analytics:pv:total:${path}`],
      ['INCR', `analytics:pv:daily:${today}:${path}`],
      // Daily rollups
      ['INCR', `analytics:daily:${today}`],
      // Referrers
      ['INCR', `analytics:ref:${referrer}`],
      // Unique visitors (set of fingerprints per day)
      ['SADD', `analytics:visitors:${today}`, fingerprint],
      // Index sets so the dashboard can enumerate all pages/refs
      ['SADD', 'analytics:pages', path],
      ['SADD', 'analytics:refs', referrer],
      // TTL so data auto-expires after 90 days
      ['EXPIRE', `analytics:pv:daily:${today}:${path}`, ttl],
      ['EXPIRE', `analytics:daily:${today}`, ttl],
      ['EXPIRE', `analytics:visitors:${today}`, ttl],
    ])

    return NextResponse.json({ ok: true })
  } catch {
    // Never let analytics break the site
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
