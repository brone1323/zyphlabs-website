/**
 * Shared Neon Postgres client.
 * Uses DATABASE_URL or POSTGRES_URL (Vercel auto-injects either).
 */

import { neon, NeonQueryFunction } from '@neondatabase/serverless'

let _sql: NeonQueryFunction<false, false> | null = null

export function getDb(): NeonQueryFunction<false, false> {
  if (_sql) return _sql
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL (or POSTGRES_URL) is not set. ' +
        'Provision a Neon Postgres DB in the Vercel dashboard and attach it to this project.'
    )
  }
  _sql = neon(url)
  return _sql
}
