import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, ...rest } = body as {
      email?: string
      name?: string
      [key: string]: unknown
    }

    if (!email || !/.+@.+\..+/.test(email.trim())) {
      return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
    }

    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const ipHash = createHash('sha256').update(rawIp).digest('hex')

    const metadata = Object.keys(rest).length > 0 ? rest : null

    const sql = getDb()
    const rows = await sql`
      INSERT INTO signups (source, email, name, metadata, user_agent, referer, ip_hash)
      VALUES (
        'level-assessment',
        ${email.trim().toLowerCase()},
        ${name?.trim() ?? null},
        ${metadata ? JSON.stringify(metadata) : null},
        ${req.headers.get('user-agent') ?? null},
        ${req.headers.get('referer') ?? null},
        ${ipHash}
      )
      RETURNING id
    `

    const id: number = (rows[0] as { id: number }).id
    console.log('[level-assessment-signup] inserted row', { id, email: email.trim() })

    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error('[level-assessment-signup] error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error.' }, { status: 500 })
  }
}
