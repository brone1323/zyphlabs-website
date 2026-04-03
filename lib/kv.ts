/**
 * Minimal Vercel KV REST client — no SDK, just fetch.
 * Uses the pipeline endpoint to batch multiple commands in one round trip.
 * Env vars set automatically by Vercel when you connect a KV store,
 * or manually for an Upstash Redis instance.
 */

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

type Command = (string | number)[]

export async function kvPipeline(commands: Command[]): Promise<any[]> {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV not configured')
  const res = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`KV error: ${res.status}`)
  const data: { result: any }[] = await res.json()
  return data.map(d => d.result)
}

export function kvConfigured(): boolean {
  return Boolean(KV_URL && KV_TOKEN)
}
