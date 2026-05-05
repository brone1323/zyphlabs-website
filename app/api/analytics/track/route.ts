import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/lib/analytics-track'
import { kvConfigured } from '@/lib/kv'

export async function POST(req: NextRequest) {
  if (!kvConfigured()) return NextResponse.json({ ok: true })

  try {
    const body = await req.json()
    const path: string = String(body.path || '/').slice(0, 200)
    const referrer: string = String(body.referrer || 'direct').slice(0, 200)

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const ua = req.headers.get('user-agent') || ''

    await trackPageView({ path, referrer, ip, userAgent: ua })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
