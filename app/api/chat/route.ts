import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

const rateMap = new Map<string, { count: number; windowStart: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 5

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const now = Date.now()
    const entry = rateMap.get(ip)

    if (entry && now - entry.windowStart < RATE_WINDOW_MS) {
      if (entry.count >= RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Too many messages. Please slow down and try again in a minute.' },
          { status: 429 }
        )
      }
      entry.count++
    } else {
      rateMap.set(ip, { count: 1, windowStart: now })
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Honeypot — widget never sets _h; bots often do
    if (body._h) {
      return NextResponse.json({ content: "Thanks for reaching out! I'll pass this along to the team." })
    }

    const { messages, tier } = body as {
      messages?: { role: string; content: string }[]
      tier?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        content: 'Chat is being set up — please use the contact form below for now.',
        showContact: true,
      })
    }

    let systemPrompt = ''
    try {
      const promptPath = join(process.cwd(), 'app/api/chat/system-prompt.md')
      systemPrompt = await readFile(promptPath, 'utf-8')
    } catch {
      systemPrompt =
        'You are a helpful assistant for Zyph Labs, an AI company that builds executive AI teams for small businesses.'
    }

    if (tier) {
      systemPrompt += `\n\nContext: This user clicked through from the "${tier}" tier card.`
    }

    const filteredMessages = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-20)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content).slice(0, 2000),
      }))

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: systemPrompt,
        messages: filteredMessages,
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('[chat] Anthropic API error:', errText)
      return NextResponse.json(
        { error: 'AI is temporarily unavailable. Please try the contact form.' },
        { status: 502 }
      )
    }

    const data = await anthropicRes.json()
    const content: string = data.content?.[0]?.text ?? ''

    const showContact =
      content.toLowerCase().includes('contact form') ||
      content.toLowerCase().includes('get in touch') ||
      content.toLowerCase().includes('brian directly')

    return NextResponse.json({ content, showContact })
  } catch (err) {
    console.error('[chat] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error. Please try again.' }, { status: 500 })
  }
}
