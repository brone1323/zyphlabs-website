import { Metadata } from 'next'
import { kvPipeline, kvConfigured } from '@/lib/kv'

export const metadata: Metadata = {
  title: 'Analytics — Zyph Labs Admin',
  robots: 'noindex, nofollow',
}

// Revalidate every 5 minutes so the dashboard feels live without hammering KV
export const revalidate = 300

// ─── Data fetching ────────────────────────────────────────────────────────────

interface DayData {
  date: string
  views: number
  visitors: number
}

interface PageData {
  path: string
  views: number
}

interface RefData {
  referrer: string
  count: number
}

interface AnalyticsData {
  days: DayData[]
  topPages: PageData[]
  topRefs: RefData[]
  totalViews: number
  totalVisitors30d: number
  todayViews: number
  todayVisitors: number
}

async function getAnalyticsData(): Promise<AnalyticsData | null> {
  if (!kvConfigured()) return null

  // Last 30 days, oldest first
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  try {
    // Round 1 — get the index sets
    const round1 = await kvPipeline([
      ['SMEMBERS', 'analytics:pages'],
      ['SMEMBERS', 'analytics:refs'],
    ])
    const pages: string[] = round1[0] || []
    const refs: string[] = round1[1] || []

    const pageList = pages
    const refList = refs

    // Round 2 — batch everything
    const pipeline = [
      ...days.map(d => ['GET', `analytics:daily:${d}`]),           // 0-29
      ...days.map(d => ['SCARD', `analytics:visitors:${d}`]),      // 30-59
      ...pageList.map(p => ['GET', `analytics:pv:total:${p}`]),    // 60…
      ...refList.map(r => ['GET', `analytics:ref:${r}`]),          // 60+N…
    ]

    const results = await kvPipeline(pipeline)

    const dailyViews = results.slice(0, 30).map(v => Number(v) || 0)
    const dailyVisitors = results.slice(30, 60).map(v => Number(v) || 0)
    const pageCounts = results
      .slice(60, 60 + pageList.length)
      .map(v => Number(v) || 0)
    const refCounts = results
      .slice(60 + pageList.length)
      .map(v => Number(v) || 0)

    const topPages: PageData[] = pageList
      .map((path, i) => ({ path, views: pageCounts[i] }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 15)

    const topRefs: RefData[] = refList
      .map((referrer, i) => ({ referrer, count: refCounts[i] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)

    return {
      days: days.map((date, i) => ({ date, views: dailyViews[i], visitors: dailyVisitors[i] })),
      topPages,
      topRefs,
      totalViews: dailyViews.reduce((a, b) => a + b, 0),
      totalVisitors30d: dailyVisitors.reduce((a, b) => a + b, 0),
      todayViews: dailyViews[29],
      todayVisitors: dailyVisitors[29],
    }
  } catch {
    return null
  }
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-white">{value.toLocaleString()}</p>
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
            {day.date.slice(5)} {/* MM-DD */}
          </span>
          <div className="relative h-5 flex-1 overflow-hidden rounded bg-white/5">
            <div
              className="h-full rounded bg-violet-500/70"
              style={{ width: `${(day.views / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400">
            {day.views}
          </span>
        </div>
      ))}
    </div>
  )
}

function Table({
  rows,
  labelKey,
  valueKey,
  valueLabel,
}: {
  rows: Record<string, any>[]
  labelKey: string
  valueKey: string
  valueLabel: string
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-600">No data yet.</p>
  }
  const max = rows[0][valueKey] || 1
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="min-w-0 flex-1 truncate text-sm text-gray-300"
            title={row[labelKey]}
          >
            {row[labelKey]}
          </span>
          <div className="w-24 shrink-0">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-violet-500/60"
                style={{ width: `${(row[valueKey] / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400">
            {row[valueKey]}
          </span>
        </div>
      ))}
    </div>
  )
}

function LoginGate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <form
          method="GET"
          className="space-y-3"
        >
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  const secret = process.env.ANALYTICS_SECRET
  const provided = searchParams.key

  // No secret set → development mode, allow access
  // Secret set → require it
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
              Last 30 days · privacy-friendly · no cookies
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

        {/* Daily trend */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Daily page views
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <BarChart data={data.days} />
          </div>
        </section>

        {/* Top pages + referrers */}
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Top pages
            </h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Table
                rows={data.topPages}
                labelKey="path"
                valueKey="views"
                valueLabel="Views"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Top referrers
            </h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Table
                rows={data.topRefs}
                labelKey="referrer"
                valueKey="count"
                valueLabel="Visits"
              />
            </div>
          </section>
        </div>

        <p className="text-center text-xs text-gray-700">
          Visitors identified by hashed IP + user-agent · no cookies · no third-party scripts
        </p>
      </div>
    </div>
  )
}
