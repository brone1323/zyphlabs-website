import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { kvPipeline, kvConfigured } from '@/lib/kv'

export async function POST(req: NextRequest) {
  if (!kvConfigured()) return NextResponse.json({ ok: true })

  try {
    const body = await req.json()
    const type: string = body.type || 'enter' // 'enter' | 'leave'
    const path: string = String(body.path || '/').slice(0, 200)
    const referrer: string = String(body.referrer || 'direct').slice(0, 200)
    const sessionId: string = String(body.sessionId || '').slice(0, 32)
    const timestamp: number = Number(body.timestamp) || Date.now()
    const duration: number | null = typeof body.duration === 'number' ? Math.round(body.duration) : null

    if (path.startsWith('/admin')) return NextResponse.json({ ok: true })

    // Privacy-friendly fingerprint
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

    const today = new Date().toISOString().slice(0, 10)
    const ttl = 90 * 24 * 3600

    const pipeline: (string | number)[][] = []

    if (type === 'enter') {
      // ── Existing aggregate tracking ──
      pipeline.push(
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
      )

      // ── Session-level tracking: record page entry ──
      // Store as JSON in a list per session
      const event = JSON.stringify({
        type: 'enter',
        path,
        referrer,
        timestamp,
        fingerprint,
        ua: ua.slice(0, 120),
      })
      pipeline.push(
        ['RPUSH', `analytics:session:${sessionId}`, event],
        ['EXPIRE', `analytics:session:${sessionId}`, ttl],
        // Index this session in today's session list
        ['SADD', `analytics:sessions:${today}`, sessionId],
        ['EXPIRE', `analytics:sessions:${today}`, ttl],
      )
    }

    if (type === 'leave' && duration !== null) {
      // ── Session-level: record page leave with duration ──
      const event = JSON.stringify({
        type: 'leave',
        path,
        timestamp,
        duration,
      })
      pipeline.push(
        ['RPUSH', `analytics:session:${sessionId}`, event],
        ['EXPIRE', `analytics:session:${sessionId}`, ttl],
      )

      // ── Per-page duration aggregates ──
      // Store total seconds and count so dashboard can compute averages
      pipeline.push(
        ['INCRBYFLOAT', `analytics:dur:total:${path}`, duration],
        ['INCR', `analytics:dur:count:${path}`],
        // TTL on duration keys
        ['EXPIRE', `analytics:dur:total:${path}`, ttl],
        ['EXPIRE', `analytics:dur:count:${path}`, ttl],
      )
    }

    if (pipeline.length > 0) {
      await kvPipeline(pipeline)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
