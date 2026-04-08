import { Metadata } from 'next'
import { kvPipeline, kvConfigured } from '@/lib/kv'

export const metadata: Metadata = {
  title: 'Analytics — Zyph Labs Admin',
  robots: 'noindex, nofollow',
}

export const revalidate = 300

// ─── Types ───────────────────────────────────────────────────────────────────

interface DayData {
  date: string
  views: number
  visitors: number
}

interface PageData {
  path: string
  views: number
  avgDuration: number // seconds
}

interface RefData {
  referrer: string
  count: number
}

interface SessionEvent {
  type: 'enter' | 'leave'
  path: string
  referrer?: string
  timestamp: number
  fingerprint?: string
  ua?: string
  duration?: number
}

interface VisitorSession {
  sessionId: string
  fingerprint: string
  ua: string
  firstSeen: number
  pages: { path: string; enteredAt: number; duration: number | null }[]
}

interface AnalyticsData {
  days: DayData[]
  topPages: PageData[]
  topRefs: RefData[]
  totalViews: number
  totalVisitors30d: number
  todayViews: number
  todayVisitors: number
  recentSessions: VisitorSession[]
}

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getAnalyticsData(): Promise<AnalyticsData | null> {
  if (!kvConfigured()) return null

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  try {
    // Round 1 — get index sets + recent session IDs (last 3 days)
    const recentDays = days.slice(-3)
    const round1 = await kvPipeline([
      ['SMEMBERS', 'analytics:pages'],
      ['SMEMBERS', 'analytics:refs'],
      ...recentDays.map(d => ['SMEMBERS', `analytics:sessions:${d}`]),
    ])
    const pages: string[] = round1[0] || []
    const refs: string[] = round1[1] || []
    const sessionIds: string[] = []
    for (let i = 2; i < 2 + recentDays.length; i++) {
      const ids = round1[i] || []
      sessionIds.push(...ids)
    }

    // Deduplicate and take most recent 50 session IDs
    const uniqueSessionIds = Array.from(new Set(sessionIds)).slice(-50)

    // Round 2 — batch everything
    const pipeline: (string | number)[][] = [
      ...days.map(d => ['GET', `analytics:daily:${d}`]),
      ...days.map(d => ['SCARD', `analytics:visitors:${d}`]),
      ...pages.map(p => ['GET', `analytics:pv:total:${p}`]),
      ...refs.map(r => ['GET', `analytics:ref:${r}`]),
      // Per-page durations
      ...pages.map(p => ['GET', `analytics:dur:total:${p}`]),
      ...pages.map(p => ['GET', `analytics:dur:count:${p}`]),
      // Session data
      ...uniqueSessionIds.map(sid => ['LRANGE', `analytics:session:${sid}`, 0, -1]),
    ]

    const results = await kvPipeline(pipeline)

    let idx = 0
    const dailyViews = results.slice(idx, idx + 30).map(v => Number(v) || 0); idx += 30
    const dailyVisitors = results.slice(idx, idx + 30).map(v => Number(v) || 0); idx += 30
    const pageCounts = results.slice(idx, idx + pages.length).map(v => Number(v) || 0); idx += pages.length
    const refCounts = results.slice(idx, idx + refs.length).map(v => Number(v) || 0); idx += refs.length
    const durTotals = results.slice(idx, idx + pages.length).map(v => Number(v) || 0); idx += pages.length
    const durCounts = results.slice(idx, idx + pages.length).map(v => Number(v) || 0); idx += pages.length
    const sessionDataRaw = results.slice(idx, idx + uniqueSessionIds.length); idx += uniqueSessionIds.length

    // Build top pages with avg duration
    const topPages: PageData[] = pages
      .map((path, i) => ({
        path,
        views: pageCounts[i],
        avgDuration: durCounts[i] > 0 ? Math.round(durTotals[i] / durCounts[i]) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20)

    const topRefs: RefData[] = refs
      .map((referrer, i) => ({ referrer, count: refCounts[i] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)

    // Parse sessions into visitor journeys
    const recentSessions: VisitorSession[] = []
    for (let s = 0; s < uniqueSessionIds.length; s++) {
      const raw: string[] = sessionDataRaw[s] || []
      if (raw.length === 0) continue

      const events: SessionEvent[] = raw.map(r => {
        try { return JSON.parse(r) } catch { return null }
      }).filter(Boolean)

      if (events.length === 0) continue

      const firstEnter = events.find(e => e.type === 'enter')
      if (!firstEnter) continue

      // Build page visit list
      const pageVisits: { path: string; enteredAt: number; duration: number | null }[] = []
      for (const evt of events) {
        if (evt.type === 'enter') {
          pageVisits.push({ path: evt.path, enteredAt: evt.timestamp, duration: null })
        }
        if (evt.type === 'leave' && evt.duration != null) {
          // Find the matching enter for this path (last one without duration)
          const match = [...pageVisits].reverse().find(
            p => p.path === evt.path && p.duration === null,
          )
          if (match) match.duration = evt.duration
        }
      }

      recentSessions.push({
        sessionId: uniqueSessionIds[s],
        fingerprint: firstEnter.fingerprint || '',
        ua: firstEnter.ua || '',
        firstSeen: firstEnter.timestamp,
        pages: pageVisits,
      })
    }

    // Sort by most recent first
    recentSessions.sort((a, b) => b.firstSeen - a.firstSeen)

    return {
      days: days.map((date, i) => ({ date, views: dailyViews[i], visitors: dailyVisitors[i] })),
      topPages,
      topRefs,
      totalViews: dailyViews.reduce((a, b) => a + b, 0),
      totalVisitors30d: dailyVisitors.reduce((a, b) => a + b, 0),
      todayViews: dailyViews[29],
      todayVisitors: dailyVisitors[29],
      recentSessions: recentSessions.slice(0, 30),
    }
  } catch {
    return null
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return '—'
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`

  // Show date + time
  const month = d.toLocaleString('en', { month: 'short' })
  const day = d.getDate()
  const hours = d.getHours()
  const mins = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${month} ${day}, ${h12}:${mins} ${ampm}`
}

function parseUA(ua: string): string {
  if (!ua) return 'Unknown'
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Mac OS/.test(ua)) return 'Mac'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Linux/.test(ua)) return 'Linux'
  if (/bot|crawl|spider/i.test(ua)) return 'Bot'
  return 'Other'
}

function parseBrowser(ua: string): string {
  if (!ua) return ''
  if (/Edg\//.test(ua)) return 'Edge'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari'
  return ''
}

function shortPath(path: string): string {
  if (path === '/') return 'Home'
  if (path === '/index-v2.html') return 'Home'
  // Remove .html extension and leading /
  return path.replace(/^\//, '').replace(/\.html$/, '')
}

// ─── Components ──────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
    </div>
  )
}

function BarChart({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map(d => d.views), 1)
  return (
    <div className="space-y-1">
      {data.map(day => (
        <div key={day.date} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-right text-xs text-gray-500">
            {day.date.slice(5)}
          </span>
          <div className="relative h-5 flex-1 overflow-hidden rounded bg-white/5">
            <div
              className="h-full rounded bg-violet-500/70"
              style={{ width: `${(day.views / max) * 100}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-xs tabular-nums text-gray-400">
            {day.views} / {day.visitors}
          </span>
        </div>
      ))}
    </div>
  )
}

function PageTable({ rows }: { rows: PageData[] }) {
  if (rows.length === 0) return <p className="text-sm text-gray-600">No data yet.</p>
  const max = rows[0].views || 1
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm text-gray-300" title={row.path}>
            {shortPath(row.path)}
          </span>
          <div className="w-20 shrink-0">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-violet-500/60"
                style={{ width: `${(row.views / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400">
            {row.views}
          </span>
          <span className="w-14 shrink-0 text-right text-xs tabular-nums text-gray-500">
            {row.avgDuration > 0 ? formatDuration(row.avgDuration) : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

function RefTable({ rows }: { rows: RefData[] }) {
  if (rows.length === 0) return <p className="text-sm text-gray-600">No data yet.</p>
  const max = rows[0].count || 1
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm text-gray-300" title={row.referrer}>
            {row.referrer}
          </span>
          <div className="w-24 shrink-0">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-violet-500/60"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400">
            {row.count}
          </span>
        </div>
      ))}
    </div>
  )
}

function VisitorJourney({ session }: { session: VisitorSession }) {
  const device = parseUA(session.ua)
  const browser = parseBrowser(session.ua)
  const totalTime = session.pages.reduce((sum, p) => sum + (p.duration || 0), 0)

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {/* Header: when + device */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-full bg-violet-500/20 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
            {device}{browser ? ` · ${browser}` : ''}
          </span>
          <span className="text-xs text-gray-500">{formatTime(session.firstSeen)}</span>
        </div>
        <span className="text-xs tabular-nums text-gray-500">
          {session.pages.length} page{session.pages.length !== 1 ? 's' : ''} · {formatDuration(Math.round(totalTime))}
        </span>
      </div>

      {/* Page journey */}
      <div className="flex flex-wrap items-center gap-1.5">
        {session.pages.map((page, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="h-3 w-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-gray-300">
              <span className="max-w-[160px] truncate">{shortPath(page.path)}</span>
              {page.duration !== null && page.duration > 0 && (
                <span className="text-[10px] tabular-nums text-gray-500">
                  {formatDuration(Math.round(page.duration))}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoginGate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <form method="GET" className="space-y-3">
          <input
            name="key"
            type="password"
            placeholder="Admin key"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
          >
            View dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  const secret = process.env.ANALYTICS_SECRET
  const provided = searchParams.key
  const authorized = !secret || provided === secret

  if (!authorized) return <LoginGate />

  const data = await getAnalyticsData()

  if (!kvConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-8">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold text-white">Analytics not configured</h1>
          <p className="text-sm text-gray-500">
            Add <code className="rounded bg-white/10 px-1">KV_REST_API_URL</code> and{' '}
            <code className="rounded bg-white/10 px-1">KV_REST_API_TOKEN</code> to your environment
            variables, then connect a Vercel KV store (or any Upstash Redis instance) in the Vercel
            dashboard.
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-8">
        <p className="text-gray-500">Failed to load analytics data.</p>
      </div>
    )
  }

  const keyParam = provided ? `?key=${encodeURIComponent(provided)}` : ''

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Last 30 days · session tracking · privacy-friendly · no cookies
            </p>
          </div>
          <a
            href={`/admin/analytics${keyParam}`}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
          >
            Refresh
          </a>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Page views (30d)" value={data.totalViews} />
          <StatCard label="Unique visitors (30d)" value={data.totalVisitors30d} />
          <StatCard label="Views today" value={data.todayViews} />
          <StatCard label="Visitors today" value={data.todayVisitors} />
        </div>

        {/* Recent visitors — the main new feature */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Recent visitors
          </h2>
          {data.recentSessions.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-gray-500">
                No sessions recorded yet. Visitor journeys will appear here once people start
                visiting the site.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentSessions.map(session => (
                <VisitorJourney key={session.sessionId} session={session} />
              ))}
            </div>
          )}
        </section>

        {/* Daily trend */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Daily page views
            </h2>
            <span className="text-xs text-gray-600">views / unique</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <BarChart data={data.days} />
          </div>
        </section>

        {/* Top pages + referrers */}
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Top pages
              </h2>
              <span className="text-xs text-gray-600">views · avg time</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <PageTable rows={data.topPages} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Top referrers
            </h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <RefTable rows={data.topRefs} />
            </div>
          </section>
        </div>

        <p className="text-center text-xs text-gray-700">
          Visitors identified by hashed IP + user-agent · no cookies · no third-party scripts ·
          session data auto-expires after 90 days
        </p>
      </div>
    </div>
  )
}
