/**
 * One-shot idempotent migration — creates the signups table and indexes.
 * Run with:  npx tsx scripts/migrate-signups.ts
 * Safe to re-run; all DDL uses IF NOT EXISTS / IF NOT EXISTS guards.
 */

import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
if (!url) {
  console.error(
    '[migrate-signups] ERROR: DATABASE_URL (or POSTGRES_URL) is not set.\n' +
      'Provision a Neon Postgres DB via the Vercel dashboard, then set the env var and re-run.'
  )
  process.exit(1)
}

const sql = neon(url)

async function migrate() {
  console.log('[migrate-signups] Running migration…')

  await sql`
    CREATE TABLE IF NOT EXISTS signups (
      id          SERIAL PRIMARY KEY,
      source      TEXT        NOT NULL,
      email       TEXT        NOT NULL,
      name        TEXT,
      metadata    JSONB,
      user_agent  TEXT,
      referer     TEXT,
      ip_hash     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE INDEX IF NOT EXISTS signups_source_created_idx
      ON signups (source, created_at DESC)
  `

  await sql`
    CREATE INDEX IF NOT EXISTS signups_email_idx
      ON signups (email)
  `

  console.log('[migrate-signups] Done — table + indexes are ready.')
}

migrate().catch((err) => {
  console.error('[migrate-signups] Migration failed:', err)
  process.exit(1)
})
